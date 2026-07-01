import { NextRequest, NextResponse } from "next/server";
import { ProxyError, proxyToBackend } from "@/src/lib/http/server-http";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

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

async function getRequestBody(request: NextRequest): Promise<unknown> {
  if (request.method === "GET" || request.method === "HEAD") return undefined;

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return undefined;

  return request.json().catch(() => undefined);
}

async function handleProxy(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const { path } = await context.params;
    const response = await proxyToBackend({
      method: request.method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
      path: buildBackendPath(path),
      params: getQueryParams(request),
      body: await getRequestBody(request),
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
