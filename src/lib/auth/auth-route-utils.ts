// src/lib/auth/auth-route-utils.ts

import "server-only";

import { cookies } from "next/headers";
import { after, NextRequest, NextResponse } from "next/server";
import {
  ATTRIBUTION_IDENTITY_RETRIES,
  ATTRIBUTION_IDENTITY_TIMEOUT_MS,
  ATTRIBUTION_VISITOR_COOKIE_NAME,
  isValidVisitorId,
  sendAttributionIdentity,
} from "@/src/lib/attribution/attribution";
import {
  buildBackendUrl,
  extractSetCookieHeaders,
  ProxyError,
  proxyToBackend,
} from "@/src/lib/http/server-http";
import {
  AUTH_COOKIE_NAME_ALIASES,
  AUTH_COOKIE_NAMES,
  SESSION_INVALID_HEADER,
} from "./constants";
import {
  clearAllAuthCookies,
  rehostBackendCookies,
  resolveAccessExpiresInSeconds,
  setAccessExpiryCookie,
  setAuthCookiesFromBody,
  setAuthIndicator,
  setDeviceIdFromAccessToken,
  setDeviceIdFromBody,
} from "./cookie-utils";

type CookieReader = {
  get(name: string): { value: string } | undefined;
};

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function getNestedData(value: unknown): Record<string, unknown> {
  const record = getRecord(value);
  return getRecord(record.data);
}

function pickString(data: unknown, keys: string[]): string | undefined {
  const root = getRecord(data);
  const nested = getNestedData(data);

  for (const source of [root, nested]) {
    for (const key of keys) {
      const value = source[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }

  return undefined;
}

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

function getCookieName(rawSetCookie: string): string | null {
  const cookiePart = rawSetCookie.split(";")[0] ?? "";
  const eqIdx = cookiePart.indexOf("=");
  if (eqIdx <= 0) return null;
  return cookiePart.slice(0, eqIdx).trim();
}

function getCookieValue(rawSetCookie: string): string | null {
  const cookiePart = rawSetCookie.split(";")[0] ?? "";
  const eqIdx = cookiePart.indexOf("=");
  if (eqIdx <= 0) return null;
  return cookiePart.slice(eqIdx + 1).trim() || null;
}

function isCookieNameIn(name: string, aliases: readonly string[]): boolean {
  return aliases.includes(name);
}

function forwardSessionInvalidHeader(
  nextResponse: NextResponse,
  backendHeaders: Headers,
): void {
  const value = backendHeaders.get(SESSION_INVALID_HEADER);
  if (value?.trim().toLowerCase() === "true") {
    nextResponse.headers.set(SESSION_INVALID_HEADER, "true");
  }
}

export function buildAttributionIdentityHeaders(
  data: unknown,
  setCookieHeaders: string[],
): Record<string, string> {
  const headers: Record<string, string> = {};
  let accessTokenFromSetCookie: string | undefined;

  for (const rawCookie of setCookieHeaders) {
    const name = getCookieName(rawCookie);
    if (!name || !isCookieNameIn(name, AUTH_COOKIE_NAME_ALIASES.ACCESS_TOKEN)) {
      continue;
    }
    accessTokenFromSetCookie = getCookieValue(rawCookie) ?? undefined;
  }

  const accessToken =
    pickString(data, ["accessToken", "AccessToken"]) ?? accessTokenFromSetCookie;

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

function pickAccessToken(
  data: unknown,
  setCookieHeaders: string[],
): string | undefined {
  let accessTokenFromSetCookie: string | undefined;

  for (const rawCookie of setCookieHeaders) {
    const name = getCookieName(rawCookie);
    if (!name || !isCookieNameIn(name, AUTH_COOKIE_NAME_ALIASES.ACCESS_TOKEN)) {
      continue;
    }
    accessTokenFromSetCookie = getCookieValue(rawCookie) ?? undefined;
  }

  return (
    pickString(data, ["accessToken", "AccessToken"]) ?? accessTokenFromSetCookie
  );
}

type ScheduleAttributionIdentityOptions = {
  schedule?: typeof after;
  sendIdentity?: typeof sendAttributionIdentity;
  timeoutMs?: number;
  retries?: number;
};

export function scheduleAttributionIdentity(
  visitorId: string | undefined,
  data: unknown,
  setCookieHeaders: string[],
  options: ScheduleAttributionIdentityOptions = {},
): boolean {
  if (!isValidVisitorId(visitorId)) return false;

  const headers = buildAttributionIdentityHeaders(data, setCookieHeaders);
  if (!headers.Authorization) return false;

  const schedule = options.schedule ?? after;
  const sendIdentity = options.sendIdentity ?? sendAttributionIdentity;

  schedule(async () => {
    await sendIdentity(visitorId, {
      headers,
      timeoutMs: options.timeoutMs ?? ATTRIBUTION_IDENTITY_TIMEOUT_MS,
      retries: options.retries ?? ATTRIBUTION_IDENTITY_RETRIES,
    });
  });

  return true;
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
    const cookieStore = await cookies();
    const visitorId = cookieStore.get(ATTRIBUTION_VISITOR_COOKIE_NAME)?.value;
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
      const nextResponse = NextResponse.json(response.data, {
        status: response.status,
      });
      forwardSessionInvalidHeader(nextResponse, response.headers);
      return nextResponse;
    }

    const nextResponse = NextResponse.json(response.data, {
      status: response.status,
    });
    forwardSessionInvalidHeader(nextResponse, response.headers);

    // 1) بکندهای cookie-based: Set-Cookie را rehost کن
    const setCookies = extractSetCookieHeaders(response.headers);
    rehostBackendCookies(nextResponse, setCookies);

    // 2) بکندهای Bearer-based: توکن‌ها را از body بخوان و کوکی کن
    setAuthCookiesFromBody(nextResponse, response.data);
    setDeviceIdFromBody(nextResponse, response.data);
    setDeviceIdFromAccessToken(
      nextResponse,
      pickAccessToken(response.data, setCookies),
    );
    setAccessExpiryCookie(nextResponse, response.data, setCookies);

    if (options?.setAuthIndicator) {
      const expiresIn = resolveAccessExpiresInSeconds(
        response.data,
        setCookies,
      );
      setAuthIndicator(nextResponse, expiresIn);
      scheduleAttributionIdentity(visitorId, response.data, setCookies);
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

    const nextResponse = NextResponse.json(response.data, {
      status: response.status,
    });
    forwardSessionInvalidHeader(nextResponse, response.headers);
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

  clearAllAuthCookies(nextResponse, { preserveDeviceId: true });
  return nextResponse;
}

export async function handleCustomerAuthRefresh(
  backendPath: string,
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const visitorId = cookieStore.get(ATTRIBUTION_VISITOR_COOKIE_NAME)?.value;
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
      clearAllAuthCookies(res, { preserveDeviceId: true });
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
    const refreshBody: { refreshToken: string; deviceId?: string } = {
      refreshToken,
    };

    if (deviceId) {
      refreshBody.deviceId = deviceId;
    }

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieParts.join("; "),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      // بکند Bearer-based ممکن است refreshToken را در body بخواهد
      body: JSON.stringify(refreshBody),
      signal: AbortSignal.timeout(15_000),
    });

    const setCookies = backendResponse.headers.getSetCookie?.() ?? [];

    if (!backendResponse.ok) {
      const res = NextResponse.json(
        { error: "عملیات نوسازی توکن با شکست مواجه شد.", success: false },
        { status: 401 },
      );
      forwardSessionInvalidHeader(res, backendResponse.headers);
      rehostBackendCookies(res, setCookies);
      clearAllAuthCookies(res, { preserveDeviceId: true });
      return res;
    }

    const responseData = await backendResponse.json().catch(() => ({}));
    const nextResponse = NextResponse.json(
      { success: true, ...responseData },
      { status: 200 },
    );
    forwardSessionInvalidHeader(nextResponse, backendResponse.headers);

    rehostBackendCookies(nextResponse, setCookies);
    setAuthCookiesFromBody(nextResponse, responseData);
    setDeviceIdFromAccessToken(
      nextResponse,
      pickAccessToken(responseData, setCookies),
    );
    setAccessExpiryCookie(nextResponse, responseData, setCookies);
    setAuthIndicator(
      nextResponse,
      resolveAccessExpiresInSeconds(responseData, setCookies),
    );
    scheduleAttributionIdentity(visitorId, responseData, setCookies);

    return nextResponse;
  } catch {
    const res = NextResponse.json(
      { error: "عملیات نوسازی رفرش توکن با شکست مواجه شد.", success: false },
      { status: 500 },
    );
    clearAllAuthCookies(res, { preserveDeviceId: true });
    return res;
  }
}
