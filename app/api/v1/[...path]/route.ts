import { NextRequest, NextResponse } from "next/server";
import {
  handleCustomerAuthGet,
  handleCustomerAuthLogout,
  handleCustomerAuthPost,
  handleCustomerAuthRefresh,
} from "@/src/lib/auth/auth-route-utils";
import { ProxyError, proxyToBackend } from "@/src/lib/http/server-http";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const CUSTOMER_AUTH_V1_POST: Record<
  string,
  { setAuthIndicator?: boolean } | "logout" | "refresh"
> = {
  "CustomerAuth/phone/start": {},
  "CustomerAuth/phone/verify": { setAuthIndicator: true },
  "CustomerAuth/login": { setAuthIndicator: true },
  "CustomerAuth/login/verify-2fa": { setAuthIndicator: true },
  "CustomerAuth/register": { setAuthIndicator: true },
  "CustomerAuth/logout": "logout",
  "CustomerAuth/refresh-token": "refresh",
};

function buildBackendPath(pathSegments: string[]): string {
  return `/api/v1/${pathSegments.map(encodeURIComponent).join("/")}`;
}

function getQueryParams(request: NextRequest): Record<string, string> {
  const params: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

type ProxyBodyPayload = {
  body?: unknown;
  rawBody?: BodyInit;
  headers?: Record<string, string>;
};

async function getRequestBodyPayload(
  request: NextRequest,
): Promise<ProxyBodyPayload> {
  if (
    request.method === "GET" ||
    request.method === "HEAD" ||
    request.method === "DELETE"
  ) {
    return {};
  }

  const contentType = request.headers.get("content-type") ?? "";

  // فایل / multipart باید با همان Content-Type (شامل boundary) فوروارد شود
  if (contentType.includes("multipart/form-data")) {
    const buffer = await request.arrayBuffer();
    return {
      rawBody: buffer,
      headers: { "Content-Type": contentType },
    };
  }

  if (contentType.includes("application/json")) {
    return {
      body: await request.json().catch(() => undefined),
    };
  }

  return {};
}

async function handleProxy(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const { path } = await context.params;
    const pathKey = path.join("/");
    const backendPath = buildBackendPath(path);

    if (request.method === "POST") {
      const authHandler = CUSTOMER_AUTH_V1_POST[pathKey];
      if (authHandler === "logout") {
        return handleCustomerAuthLogout(backendPath);
      }
      if (authHandler === "refresh") {
        return handleCustomerAuthRefresh(backendPath);
      }
      if (authHandler && typeof authHandler === "object") {
        return handleCustomerAuthPost(request, backendPath, authHandler);
      }
    }

    if (request.method === "GET" && pathKey === "CustomerAuth/me") {
      return handleCustomerAuthGet(backendPath);
    }

    const payload = await getRequestBodyPayload(request);
    const guestSessionId =
      request.headers.get("x-guest-session-id") ??
      request.headers.get("X-Guest-Session-Id");
    const forwardHeaders: Record<string, string> = {
      ...(payload.headers ?? {}),
    };
    if (guestSessionId?.trim()) {
      forwardHeaders["X-Guest-Session-Id"] = guestSessionId.trim();
    }

    const response = await proxyToBackend({
      method: request.method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
      path: backendPath,
      params: getQueryParams(request),
      body: payload.body,
      rawBody: payload.rawBody,
      headers: forwardHeaders,
      withAuth: true,
      cache: "no-store",
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("[api/v1 proxy error]", error);

    if (error instanceof ProxyError) {
      return NextResponse.json(
        {
          success: false,
          message:
            error.code === "TIMEOUT"
              ? "زمان پاسخ‌گویی سرویس به پایان رسید."
              : "ارتباط با سرویس برقرار نشد.",
          code: error.code,
        },
        { status: error.code === "TIMEOUT" ? 504 : 502 },
      );
    }

    return NextResponse.json(
      { success: false, message: "خطای داخلی سرور" },
      { status: 500 },
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
