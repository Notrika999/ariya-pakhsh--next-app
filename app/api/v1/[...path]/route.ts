// app/api/v1/proxy/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend, ProxyError } from "@/src/lib/http/server-http";

type RouteParams = { params: Promise<{ path: string[] }> };

// ✅ این خط مهم‌ترین تغییر — cache کاملاً disable میشه
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// ✅ Uploads اضافه شده
const ALLOWED_PREFIXES = [
  "Users",
  "Products",
  "Orders",
  "Categories",
  "Brands",
  "Uploads",
] as const;

const LONG_TIMEOUT_PATTERNS = [
  "uploads/product-images",
  "uploads/user-avatar",
  "products/add",
] as const;

const PATH_OVERRIDES: Record<string, string> = {
  // Products
  "products/add": "/api/v1/management/Products/create-product",
  "products/list": "/api/v1/management/Products/list",
  "products/product-options": "/api/v1/management/Products/product-options",
  "products/delete-multiple": "/api/v1/management/Products/delete-multiple",

  // ✅ Uploads - همه را اینجا تعریف کن
  "uploads/product-images": "/api/v1/management/uploads/product-images",
  "uploads/upload-settings": "/api/v1/management/uploads/upload-settings",
  "uploads/delete-product-image":
    "/api/v1/management/uploads/delete-product-image",
} as const;

function isAllowedPath(segments: string[]): boolean {
  if (segments.length === 0) return false;
  const resource = segments[0];
  return ALLOWED_PREFIXES.some(
    (prefix) => resource.toLowerCase() === prefix.toLowerCase(),
  );
}

function isFileUploadPath(segments: string[]): boolean {
  const path = segments.join("/").toLowerCase();
  return LONG_TIMEOUT_PATTERNS.some((p) => path.startsWith(p));
}

function resolveBackendPath(segments: string[]): string {
  const pathKey = segments.join("/").toLowerCase();

  if (pathKey in PATH_OVERRIDES) {
    return PATH_OVERRIDES[pathKey];
  }

  // ✅ products/edit/[id]
  if (
    segments.length >= 3 &&
    segments[0].toLowerCase() === "products" &&
    segments[1].toLowerCase() === "edit"
  ) {
    return `/api/v1/management/Products/update-product/${segments[2]}`;
  }

  // ✅ products/get/[id]
  if (
    segments.length >= 3 &&
    segments[0].toLowerCase() === "products" &&
    segments[1].toLowerCase() === "get"
  ) {
    return `/api/v1/management/Products/get-product/${segments[2]}`;
  }

  // ✅ products/delete/[id]
  if (
    segments.length >= 2 &&
    segments[0].toLowerCase() === "products" &&
    segments[1].toLowerCase() === "delete"
  ) {
    const id = segments[2] || "";
    return `/api/v1/management/Products/delete${id ? "/" + id : ""}`;
  }

  // ✅ products/toggle-status/[id]
  if (
    segments.length >= 2 &&
    segments[0].toLowerCase() === "products" &&
    segments[1].toLowerCase() === "toggle-status"
  ) {
    const id = segments[2] || "";
    return `/api/v1/management/Products/toggle-status${id ? "/" + id : ""}`;
  }

  // ✅ products/toggle-featured/[id]
  if (
    segments.length >= 2 &&
    segments[0].toLowerCase() === "products" &&
    segments[1].toLowerCase() === "toggle-featured"
  ) {
    const id = segments[2] || "";
    return `/api/v1/management/Products/toggle-featured${id ? "/" + id : ""}`;
  }

  // ✅ products/update-price/[id]
  if (
    segments.length >= 2 &&
    segments[0].toLowerCase() === "products" &&
    segments[1].toLowerCase() === "update-price"
  ) {
    const id = segments[2] || "";
    return `/api/v1/management/Products/update-price${id ? "/" + id : ""}`;
  }

  // ✅ products/update-stock/[id]
  if (
    segments.length >= 2 &&
    segments[0].toLowerCase() === "products" &&
    segments[1].toLowerCase() === "update-stock"
  ) {
    const id = segments[2] || "";
    return `/api/v1/management/Products/update-stock${id ? "/" + id : ""}`;
  }

  // ✅ products/product-details/[id]
  if (
    segments.length >= 2 &&
    segments[0].toLowerCase() === "products" &&
    segments[1].toLowerCase() === "details"
  ) {
    const id = segments[2] || "";
    return `/api/v1/management/Products/product-details${id ? "/" + id : ""}`;
  }

  // پیش‌فرض
  const resource = segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
  const restPath = segments.slice(1).join("/");

  return `/api/v1/${resource}${restPath ? "/" + restPath : ""}`;
}

async function handleProxy(
  request: NextRequest,
  context: RouteParams,
): Promise<NextResponse> {
  try {
    const { path } = await context.params;
    const cleanPath = path[0] === "proxy" ? path.slice(1) : path;

    if (!isAllowedPath(cleanPath)) {
      console.warn("[Proxy] Blocked:", cleanPath.join("/"));
      return NextResponse.json(
        { success: false, message: "مسیر درخواستی مجاز نیست." },
        { status: 403 },
      );
    }

    const backendPath = resolveBackendPath(cleanPath);
    const isUpload = isFileUploadPath(cleanPath);

    // Query params
    const params: Record<string, string> = {};
    request.nextUrl.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Body
    let body: unknown = undefined;
    let rawBody: BodyInit | undefined = undefined;

    if (request.method !== "GET" && request.method !== "HEAD") {
      const contentType = request.headers.get("content-type") || "";

      if (contentType.includes("multipart/form-data")) {
        rawBody = await request.formData();
      } else if (contentType.includes("application/json")) {
        body = await request.json();
      }
    }

    const extraHeaders: Record<string, string> = {};
    const userAgent = request.headers.get("user-agent");
    if (userAgent) extraHeaders["User-Agent"] = userAgent;

    const response = await proxyToBackend({
      method: request.method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
      path: backendPath,
      body,
      rawBody,
      headers: extraHeaders,
      params: Object.keys(params).length > 0 ? params : undefined,
      withAuth: true,
      timeout: isUpload ? 120_000 : undefined,
      retries: isUpload ? 0 : undefined,
    });

    if (response.isJson) {
      return NextResponse.json(response.data, {
        status: response.status,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          "Surrogate-Control": "no-store",
        },
      });
    }

    return new NextResponse(response.data as string, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "text/plain",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error("[Proxy Error]", {
      method: request.method,
      url: request.url,
      error: error instanceof Error ? error.message : error,
    });

    if (error instanceof ProxyError) {
      const status = error.code === "TIMEOUT" ? 504 : 502;
      return NextResponse.json(
        {
          success: false,
          message:
            error.code === "TIMEOUT"
              ? "زمان درخواست به پایان رسید."
              : "سرویس در دسترس نیست.",
        },
        { status },
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;

export const maxDuration = 120;
