// src/lib/http/server-http.ts
import "server-only";

import { cookies } from "next/headers";
import { getBackendBaseUrl } from "@/src/lib/api/backend-base";
import { AUTH_COOKIE_NAMES } from "@/src/lib/auth/constants";
import {
  assertSafeInput,
  UnsafeInputError,
} from "@/src/utils/input-security";

/* -------------------------------------------------------------------------- */
/*                                 Constants                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_TIMEOUT = 20_000; // 20s
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY = 300; // ms
const MAX_ABSOLUTE_RETRIES = 10; // حفاظ در برابر infinite loop

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

interface ProxyRequestOptions {
  method: HttpMethod;
  path: string;
  body?: unknown;
  rawBody?: BodyInit;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  /** فقط access token را forward می‌کند (پیش‌فرض: false) */
  withAuth?: boolean;
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
  timeout?: number;
  /**
   * تعداد retry — فقط برای متدهای idempotent اعمال می‌شود
   * مگر اینکه `forceRetry` فعال باشد.
   */
  retries?: number;
  /** حتی برای POST/PATCH هم retry انجام بده */
  forceRetry?: boolean;
}

interface ProxyResponse<T = unknown> {
  status: number;
  data: T;
  headers: Headers;
  ok: boolean;
  isJson: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                   Error                                    */
/* -------------------------------------------------------------------------- */

export class ProxyError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ProxyError";
  }
}

/* -------------------------------------------------------------------------- */
/*                                 Utilities                                  */
/* -------------------------------------------------------------------------- */

/** Lazy validation — فقط هنگام اولین درخواست اجرا می‌شود */
let _cachedApiUrl: URL | null = null;

function resolveBackendBaseUrl(): string {
  const apiUrl = process.env.API_URL?.trim();

  if (process.env.BACKEND_ORIGIN?.trim()) {
    return getBackendBaseUrl();
  }

  if (!apiUrl) {
    throw new ProxyError(
      "BACKEND_ORIGIN is not defined. Set BACKEND_ORIGIN=https://aryapakhsh.shop/swagger-api in .env.local",
      undefined,
      "CONFIG_ERROR",
    );
  }

  if (apiUrl.startsWith("http://") || apiUrl.startsWith("https://")) {
    return apiUrl.replace(/\/$/, "");
  }

  if (apiUrl.startsWith("/")) {
    console.warn(
      `[server-http] API_URL="${apiUrl}" is a relative path, not a backend base. ` +
        `Using BACKEND_ORIGIN fallback: ${getBackendBaseUrl()}.`,
    );
    return getBackendBaseUrl();
  }

  throw new ProxyError(
    `API_URL must be an absolute backend URL, got: "${apiUrl}"`,
    undefined,
    "CONFIG_ERROR",
  );
}

function joinBackendUrl(base: URL, path: string): URL {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const basePath = base.pathname.replace(/\/$/, "");
  return new URL(`${base.origin}${basePath}${normalizedPath}`);
}

function getApiBaseUrl(): URL {
  if (_cachedApiUrl) return _cachedApiUrl;

  try {
    const base = resolveBackendBaseUrl();
    _cachedApiUrl = new URL(`${base}/`);
  } catch {
    throw new ProxyError(
      `BACKEND_ORIGIN is not a valid URL: "${process.env.BACKEND_ORIGIN ?? process.env.API_URL}"`,
      undefined,
      "CONFIG_ERROR",
    );
  }

  return _cachedApiUrl;
}

/** Build absolute backend URL for route handlers (refresh-token, etc.). */
export function buildBackendUrl(path: string): string {
  return joinBackendUrl(getApiBaseUrl(), path).toString();
}

function buildUrl(
  basePath: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  if (!basePath.startsWith("/")) {
    throw new ProxyError('Path must start with "/"');
  }
  if (basePath.includes("://")) {
    throw new ProxyError("Path must not contain a protocol");
  }

  const url = joinBackendUrl(getApiBaseUrl(), basePath);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const IDEMPOTENT_METHODS: ReadonlySet<HttpMethod> = new Set([
  "GET",
  "HEAD",
  "OPTIONS",
  "PUT",
  "DELETE",
]);

function isIdempotent(method: HttpMethod): boolean {
  return IDEMPOTENT_METHODS.has(method);
}

function computeBackoff(attempt: number): number {
  // attempt 0 → ~300ms, attempt 1 → ~700ms, attempt 2 → ~1300ms
  const jitter = Math.random() * 100;
  return RETRY_BASE_DELAY * 2 ** attempt + jitter;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError;
}

/**
 * مقدار cookie-safe است یا نه.
 * از کاراکترهای غیرمجاز در مقدار کوکی جلوگیری می‌کند.
 */
function sanitizeCookieValue(value: string): string {
  if (/^[\w\-._~+/]+=*$/.test(value)) {
    return value;
  }
  return encodeURIComponent(value);
}

/**
 * مصرف و رها کردن body برای آزادسازی connection.
 */
async function drainResponse(response: Response): Promise<void> {
  try {
    await response.text();
  } catch {
    // ignore — فقط برای آزادسازی منابع
  }
}

/* -------------------------------------------------------------------------- */
/*                              Response Parsing                              */
/* -------------------------------------------------------------------------- */

async function parseResponse<T>(response: Response): Promise<ProxyResponse<T>> {
  let data: T;
  let isJson = false;

  const contentType = response.headers.get("content-type");
  const text = await response.text();

  if (contentType?.includes("application/json")) {
    try {
      data = JSON.parse(text) as T;
      isJson = true;
    } catch {
      // Content-Type ادعای JSON دارد ولی body معتبر نیست
      data = text as unknown as T;
    }
  } else {
    data = text as unknown as T;
  }

  return {
    status: response.status,
    data,
    headers: response.headers,
    ok: response.ok,
    isJson,
  };
}

/* -------------------------------------------------------------------------- */
/*                               Main Function                                */
/* -------------------------------------------------------------------------- */

export async function proxyToBackend<T = unknown>(
  options: ProxyRequestOptions,
): Promise<ProxyResponse<T>> {
  const {
    method,
    path,
    body,
    rawBody,
    params,
    headers: extraHeaders = {},
    withAuth = false,
    cache = "no-store",
    next: nextConfig,
    timeout = DEFAULT_TIMEOUT,
    retries = MAX_RETRIES,
    forceRetry = false,
  } = options;

  /* ------------------------------ Build URL ------------------------------- */

  try {
    if (params) assertSafeInput(params);
    if (body && method !== "GET" && method !== "HEAD") assertSafeInput(body);
  } catch (error) {
    if (error instanceof UnsafeInputError) {
      throw new ProxyError(
        "ورودی شامل محتوای غیرمجاز یا کد مخرب است.",
        400,
        "UNSAFE_INPUT",
      );
    }

    throw error;
  }

  const url = buildUrl(path, params);

  /* ----------------------------- Build Headers ----------------------------- */

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...extraHeaders,
  };

  const hasJsonBody =
    body !== undefined && body !== null && method !== "GET" && method !== "HEAD";

  // فقط وقتی rawBody نداریم Content-Type ست می‌شود
  if (!rawBody && hasJsonBody && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (!headers["User-Agent"]) {
    try {
      const { headers: reqHeaders } = await import("next/headers");
      const headersList = await reqHeaders();
      const ua = headersList.get("user-agent");

      if (ua) {
        headers["User-Agent"] = ua;
      }
    } catch {
      // خارج از request context — مشکلی نیست
    }
  }

  /* ----------------------- Access-Token Forwarding ------------------------ */

  if (withAuth) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(AUTH_COOKIE_NAMES.ACCESS_TOKEN)?.value;
    const refreshToken = cookieStore.get(
      AUTH_COOKIE_NAMES.REFRESH_TOKEN,
    )?.value;
    const deviceId = cookieStore.get(AUTH_COOKIE_NAMES.DEVICE_ID)?.value;

    const cookieParts: string[] = [];

    if (headers["Cookie"]) {
      cookieParts.push(headers["Cookie"]);
    }

    if (accessToken) {
      const safeName = AUTH_COOKIE_NAMES.ACCESS_TOKEN;
      const safeValue = sanitizeCookieValue(accessToken);
      cookieParts.push(`${safeName}=${safeValue}`);

      // بکند Bearer-based است → Authorization header هم لازم است
      if (!headers["Authorization"]) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    if (deviceId) {
      const safeName = AUTH_COOKIE_NAMES.DEVICE_ID;
      const safeValue = sanitizeCookieValue(deviceId);
      cookieParts.push(`${safeName}=${safeValue}`);
    }

    if (refreshToken) {
      const safeName = AUTH_COOKIE_NAMES.REFRESH_TOKEN;
      const safeValue = sanitizeCookieValue(refreshToken);
      cookieParts.push(`${safeName}=${safeValue}`);
    }

    if (cookieParts.length > 0) {
      headers["Cookie"] = cookieParts.join("; ");
    }
  }

  /* ------------------------------- Build Body ------------------------------ */

  function buildBody(): BodyInit | undefined {
    if (rawBody) return rawBody;
    if (hasJsonBody) {
      return JSON.stringify(body);
    }
    return undefined;
  }

  /* ------------------------------ Retry Logic ------------------------------ */
  const isStreamBody =
    rawBody instanceof ReadableStream || rawBody instanceof FormData;
  const shouldRetry =
    (isIdempotent(method) || forceRetry) && retries > 0 && !isStreamBody;
  const maxAttempts = Math.min(retries, MAX_ABSOLUTE_RETRIES);
  let attempt = 0;

  while (true) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        cache,
        signal: controller.signal,
        body: buildBody(),
        ...(nextConfig && { next: nextConfig }),
      });

      /* -------------------- Retry on 5xx (idempotent only) ------------------- */

      if (shouldRetry && attempt < maxAttempts && response.status >= 500) {
        // آزادسازی connection قبل از retry
        await drainResponse(response);
        clearTimeout(timeoutId);

        await sleep(computeBackoff(attempt));
        attempt++;
        continue;
      }

      /* ---------------------- Parse & Return Response ----------------------- */

      // timeout همچنان فعال است تا body کامل خوانده شود
      const result = await parseResponse<T>(response);
      clearTimeout(timeoutId);

      if (!result.ok) {
        console.warn(`[proxyToBackend] ${method} ${path} → ${result.status}`);
      }

      return result;
    } catch (error) {
      clearTimeout(timeoutId);

      /* ------------------- Retry on Network/Timeout Error ------------------- */

      const timeout_error = isAbortError(error);
      const network_error = isNetworkError(error);

      if (
        shouldRetry &&
        attempt < maxAttempts &&
        (timeout_error || network_error)
      ) {
        console.warn(
          `[proxyToBackend] ${method} ${path} → ` +
            `${timeout_error ? "TIMEOUT" : "NETWORK_ERROR"} ` +
            `(retry ${attempt + 1}/${maxAttempts})`,
        );

        await sleep(computeBackoff(attempt));
        attempt++;
        continue;
      }

      /* ----------------------- Final Error — No Retry ----------------------- */

      throw new ProxyError(
        timeout_error
          ? `Request timeout after ${timeout}ms: ${method} ${path}`
          : `Network failure: ${method} ${path} — ${(error as Error).message}`,
        undefined,
        timeout_error ? "TIMEOUT" : "NETWORK_ERROR",
      );
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                            Cookie Extraction                               */
/* -------------------------------------------------------------------------- */

/**
 * استخراج `Set-Cookie` headers از پاسخ بکند.
 *
 * باید در **Route Handler** یا **Server Action** فراخوانی شود
 * تا کوکی‌ها به مرورگر کاربر forward شوند.
 *
 * @example
 * ```ts
 * const res = await proxyToBackend({ method: 'POST', path: '/auth/login', body });
 * const setCookies = extractSetCookieHeaders(res.headers);
 *
 * return new Response(JSON.stringify(res.data), {
 *   status: res.status,
 *   headers: setCookies.map(c => ['Set-Cookie', c]),
 * });
 * ```
 */
export function extractSetCookieHeaders(headers: Headers): string[] {
  return headers.getSetCookie?.() ?? [];
}

export async function getAuthCookies(): Promise<{
  accessToken?: string;
  refreshToken?: string;
  deviceId?: string;
}> {
  const cookieStore = await cookies();

  return {
    accessToken: cookieStore.get(AUTH_COOKIE_NAMES.ACCESS_TOKEN)?.value,
    refreshToken: cookieStore.get(AUTH_COOKIE_NAMES.REFRESH_TOKEN)?.value,
  };
}
