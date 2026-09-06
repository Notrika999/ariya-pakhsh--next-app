// src/lib/auth/auth-route-utils.ts

import "server-only";

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  buildBackendUrl,
  extractSetCookieHeaders,
  ProxyError,
  proxyToBackend,
} from "@/src/lib/http/server-http";
import { AUTH_COOKIE_NAME_ALIASES, AUTH_COOKIE_NAMES } from "./constants";
import {
  clearAllAuthCookies,
  rehostBackendCookies,
  resolveAccessExpiresInSeconds,
  setAccessExpiryCookie,
  setAuthCookiesFromBody,
  setAuthIndicator,
  setDeviceIdFromBody,
} from "./cookie-utils";

type CookieReader = {
  get(name: string): { value: string } | undefined;
};

function getFirstCookieValue(
  cookieStore: CookieReader,
  names: readonly string[],
): string | undefined {
  for (const name of names) {
    const value = cookieStore.get(name)?.value;
    if (value) return value;
  }
  return undefined;
}

async function buildDeviceCookieHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const deviceId = getFirstCookieValue(
    cookieStore,
    AUTH_COOKIE_NAME_ALIASES.DEVICE_ID,
  );
  if (!deviceId) return {};
  return {
    Cookie: `${AUTH_COOKIE_NAMES.DEVICE_ID}=${deviceId}`,
  };
}

export async function handleCustomerAuthPost(
  request: NextRequest,
  backendPath: string,
  options?: {
    withAuth?: boolean;
    setAuthIndicator?: boolean;
  },
): Promise<NextResponse> {
  
  try {
    const body = await request.json();
    const extraHeaders = await buildDeviceCookieHeader();

    const response = await proxyToBackend({
      method: "POST",
      path: backendPath,
      body,
      headers: extraHeaders,
      withAuth: options?.withAuth ?? false,
      retries: 0,
    });

    if (!response.ok) {
      return NextResponse.json(response.data, { status: response.status });
    }

    const nextResponse = NextResponse.json(response.data, {
      status: response.status,
    });

    // 1) بکندهای cookie-based: Set-Cookie را rehost کن
    const setCookies = extractSetCookieHeaders(response.headers);
    rehostBackendCookies(nextResponse, setCookies);

    // 2) بکندهای Bearer-based: توکن‌ها را از body بخوان و کوکی کن
    setAuthCookiesFromBody(nextResponse, response.data);
    setDeviceIdFromBody(nextResponse, response.data);
    setAccessExpiryCookie(nextResponse, response.data, setCookies);

    if (options?.setAuthIndicator) {
      const expiresIn = resolveAccessExpiresInSeconds(
        response.data,
        setCookies,
      );
      setAuthIndicator(nextResponse, expiresIn);
    }

    return nextResponse;
  } catch (error) {
    if (error instanceof ProxyError) {
      return NextResponse.json(
        {
          error:
            error.code === "TIMEOUT"
              ? "زمان درخواست به پایان رسید."
              : "سرویس در دسترس نیست.",
        },
        { status: error.code === "TIMEOUT" ? 504 : 502 },
      );
    }

    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

export async function handleCustomerAuthGet(
  backendPath: string,
  withAuth = true,
): Promise<NextResponse> {
  try {
    const response = await proxyToBackend({
      method: "GET",
      path: backendPath,
      withAuth,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error instanceof ProxyError) {
      return NextResponse.json(
        {
          error:
            error.code === "TIMEOUT"
              ? "زمان درخواست به پایان رسید."
              : "سرویس در دسترس نیست.",
        },
        { status: error.code === "TIMEOUT" ? 504 : 502 },
      );
    }

    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

export async function handleCustomerAuthLogout(
  backendPath: string,
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const refreshToken = getFirstCookieValue(
      cookieStore,
      AUTH_COOKIE_NAME_ALIASES.REFRESH_TOKEN,
    );
    const extraHeaders: Record<string, string> = {};

    if (refreshToken) {
      extraHeaders.Cookie = `${AUTH_COOKIE_NAMES.REFRESH_TOKEN}=${refreshToken}`;
    }

    await proxyToBackend({
      method: "POST",
      path: backendPath,
      withAuth: true,
      timeout: 5_000,
      retries: 0,
      headers: extraHeaders,
    });
  } catch {
    // always clear local cookies even if backend logout fails
  }

  const nextResponse = NextResponse.json({
    success: true,
    message: "خروج با موفقیت انجام شد.",
  });

  clearAllAuthCookies(nextResponse);
  return nextResponse;
}

export async function handleCustomerAuthRefresh(
  backendPath: string,
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = getFirstCookieValue(
      cookieStore,
      AUTH_COOKIE_NAME_ALIASES.ACCESS_TOKEN,
    );
    const refreshToken = getFirstCookieValue(
      cookieStore,
      AUTH_COOKIE_NAME_ALIASES.REFRESH_TOKEN,
    );
    const deviceId = getFirstCookieValue(
      cookieStore,
      AUTH_COOKIE_NAME_ALIASES.DEVICE_ID,
    );

    if (!refreshToken) {
      const res = NextResponse.json(
        { error: "هیچ رفرش توکنی پیدا نشد.", success: false },
        { status: 401 },
      );
      clearAllAuthCookies(res);
      return res;
    }

    const cookieParts: string[] = [];
    if (accessToken) {
      cookieParts.push(`${AUTH_COOKIE_NAMES.ACCESS_TOKEN}=${accessToken}`);
    }
    cookieParts.push(`${AUTH_COOKIE_NAMES.REFRESH_TOKEN}=${refreshToken}`);
    if (deviceId) {
      cookieParts.push(`${AUTH_COOKIE_NAMES.DEVICE_ID}=${deviceId}`);
    }

    const backendUrl = buildBackendUrl(backendPath);
    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieParts.join("; "),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      // بکند Bearer-based ممکن است refreshToken را در body بخواهد
      body: JSON.stringify({ refreshToken, deviceId }),
      signal: AbortSignal.timeout(15_000),
    });

    const setCookies = backendResponse.headers.getSetCookie?.() ?? [];

    if (!backendResponse.ok) {
      const res = NextResponse.json(
        { error: "عملیات نوسازی توکن با شکست مواجه شد.", success: false },
        { status: 401 },
      );
      rehostBackendCookies(res, setCookies);
      clearAllAuthCookies(res);
      return res;
    }

    const responseData = await backendResponse.json().catch(() => ({}));
    const nextResponse = NextResponse.json(
      { success: true, ...responseData },
      { status: 200 },
    );

    rehostBackendCookies(nextResponse, setCookies);
    setAuthCookiesFromBody(nextResponse, responseData);
    setAccessExpiryCookie(nextResponse, responseData, setCookies);
    setAuthIndicator(
      nextResponse,
      resolveAccessExpiresInSeconds(responseData, setCookies),
    );

    return nextResponse;
  } catch {
    const res = NextResponse.json(
      { error: "عملیات نوسازی رفرش توکن با شکست مواجه شد.", success: false },
      { status: 500 },
    );
    clearAllAuthCookies(res);
    return res;
  }
}
