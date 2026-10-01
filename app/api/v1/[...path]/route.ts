import { NextRequest, NextResponse } from "next/server";
import {
<<<<<<< HEAD
  ATTRIBUTION_VISITOR_COOKIE_NAME,
  withCheckoutAttributionCookie,
} from "@/src/lib/attribution/attribution";
import { SESSION_INVALID_HEADER } from "@/src/lib/auth/constants";
import {
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
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

<<<<<<< HEAD
type ProxyToBackend = typeof proxyToBackend;

type ProxyDependencies = {
  handleCustomerAuthGet: typeof handleCustomerAuthGet;
  handleCustomerAuthLogout: typeof handleCustomerAuthLogout;
  handleCustomerAuthPost: typeof handleCustomerAuthPost;
  handleCustomerAuthRefresh: typeof handleCustomerAuthRefresh;
  proxyToBackend: ProxyToBackend;
};

const defaultProxyDependencies: ProxyDependencies = {
  handleCustomerAuthGet,
  handleCustomerAuthLogout,
  handleCustomerAuthPost,
  handleCustomerAuthRefresh,
  proxyToBackend,
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

function proxyErrorStatus(error: ProxyError): number {
  if (error.status) return error.status;
  return error.code === "TIMEOUT" ? 504 : 502;
}

function proxyErrorMessage(error: ProxyError): string {
  if (error.code === "UNSAFE_INPUT") return error.message;
  if (error.code === "TIMEOUT") {
    return "زمان پاسخ‌گویی سرویس به پایان رسید.";
  }
  return "ارتباط با سرویس برقرار نشد.";
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

export function createHandleProxy(
  dependencies: Partial<ProxyDependencies> = {},
) {
  const deps = {
    ...defaultProxyDependencies,
    ...dependencies,
  };

  return async function handleProxy(
    request: NextRequest,
    context: RouteContext,
  ): Promise<NextResponse> {
=======
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

function proxyErrorStatus(error: ProxyError): number {
  if (error.status) return error.status;
  return error.code === "TIMEOUT" ? 504 : 502;
}

function proxyErrorMessage(error: ProxyError): string {
  if (error.code === "UNSAFE_INPUT") return error.message;
  if (error.code === "TIMEOUT") {
    return "زمان پاسخ‌گویی سرویس به پایان رسید.";
  }
  return "ارتباط با سرویس برقرار نشد.";
}

async function handleProxy(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  try {
    const { path } = await context.params;
    const pathKey = path.join("/");
    const backendPath = buildBackendPath(path);

    if (backendPath === "/api/v1/Payments/mellat/callback") {
    }

    if (request.method === "POST") {
      const authHandler = CUSTOMER_AUTH_V1_POST[pathKey];
      if (authHandler === "logout") {
<<<<<<< HEAD
        return deps.handleCustomerAuthLogout(backendPath);
      }
      if (authHandler === "refresh") {
        return deps.handleCustomerAuthRefresh(backendPath);
      }
      if (authHandler && typeof authHandler === "object") {
        return deps.handleCustomerAuthPost(request, backendPath, authHandler);
=======
        return handleCustomerAuthLogout(backendPath);
      }
      if (authHandler === "refresh") {
        return handleCustomerAuthRefresh(backendPath);
      }
      if (authHandler && typeof authHandler === "object") {
        return handleCustomerAuthPost(request, backendPath, authHandler);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      }
    }

    if (request.method === "GET" && pathKey === "CustomerAuth/me") {
<<<<<<< HEAD
      return deps.handleCustomerAuthGet(backendPath);
    }

    const payload = await getRequestBodyPayload(request);
    const guestSessionId =
      request.headers.get("x-guest-session-id") ??
      request.headers.get("X-Guest-Session-Id");
    const forwardHeaders: Record<string, string> = {
      ...(payload.headers ?? {}),
    };
    const accept = request.headers.get("accept");

    if (accept?.trim()) {
      forwardHeaders.Accept = accept.trim();
    }

    if (guestSessionId?.trim()) {
      forwardHeaders["X-Guest-Session-Id"] = guestSessionId.trim();
    }

    const backendHeaders = withCheckoutAttributionCookie({
      method: request.method,
      pathKey,
      visitorId: request.cookies.get(ATTRIBUTION_VISITOR_COOKIE_NAME)?.value,
      headers: forwardHeaders,
    });

    const response = await deps.proxyToBackend({
      method: request.method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
      path: backendPath,
      params: getQueryParams(request),
      body: payload.body,
      rawBody: payload.rawBody,
      headers: backendHeaders,
      withAuth: true,
      cache: "no-store",
    });

    let nextResponse: NextResponse;

    if (response.data instanceof ArrayBuffer) {
      const responseHeaders = new Headers();
      const contentType = response.headers.get("content-type");
      const contentDisposition = response.headers.get("content-disposition");

      responseHeaders.set(
        "Content-Type",
        contentType || "application/octet-stream",
      );
      responseHeaders.set("Content-Length", String(response.data.byteLength));
      responseHeaders.set("Cache-Control", "private, no-store");

      if (contentDisposition) {
        responseHeaders.set("Content-Disposition", contentDisposition);
      }

      nextResponse = new NextResponse(response.data, {
        status: response.status,
        headers: responseHeaders,
      });
    } else {
      nextResponse = NextResponse.json(response.data, {
        status: response.status,
      });
    }

    forwardSessionInvalidHeader(nextResponse, response.headers);
    return nextResponse;
  } catch (error) {
    // console.error("[api/v1 proxy error]", error);
=======
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
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

    if (error instanceof ProxyError) {
      return NextResponse.json(
        {
          success: false,
          message: proxyErrorMessage(error),
          code: error.code,
        },
        { status: proxyErrorStatus(error) },
      );
    }

    return NextResponse.json(
      { success: false, message: "خطای داخلی سرور" },
      { status: 500 },
    );
  }
  };
}

const handleProxy = createHandleProxy();

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
