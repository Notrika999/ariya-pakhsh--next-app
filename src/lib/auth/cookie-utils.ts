// src/lib/auth/cookie-utils.ts
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAMES,
  AUTH_INDICATOR_BUFFER,
  AUTH_INDICATOR_DEFAULT_MAX_AGE,
  LEGACY_AUTH_COOKIE_NAMES,
} from "./constants";

export function setAuthIndicator(
  response: NextResponse,
  expiresIn?: number,
): void {
  const maxAge = expiresIn
    ? expiresIn + AUTH_INDICATOR_BUFFER
    : AUTH_INDICATOR_DEFAULT_MAX_AGE;

  response.cookies.set(AUTH_COOKIE_NAMES.AUTH_INDICATOR, "1", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export function clearAuthIndicator(response: NextResponse): void {
  response.cookies.delete(AUTH_COOKIE_NAMES.AUTH_INDICATOR);
}

function parseCookieAttributes(attributes: string[]): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const attr of attributes) {
    const [key, val] = attr.trim().split("=");
    attrs[key.toLowerCase()] = val ?? "true";
  }
  return attrs;
}

/** Re-host backend Set-Cookie on the frontend domain (strip Domain=aryapakhsh.shop). */
export function rehostBackendCookies(
  response: NextResponse,
  setCookieHeaders: string[],
): void {
  for (const raw of setCookieHeaders) {
    const [cookiePart, ...attributes] = raw.split(";");
    const eqIdx = cookiePart.indexOf("=");
    if (eqIdx === -1) continue;

    const name = cookiePart.slice(0, eqIdx).trim();
    const value = cookiePart.slice(eqIdx + 1).trim();
    if (!name) continue;

    const attrs = parseCookieAttributes(attributes);

    response.cookies.set(name, value, {
      httpOnly: attrs.httponly === "true",
      secure:
        process.env.NODE_ENV === "production"
          ? attrs.secure !== "false"
          : false,
      sameSite: (attrs.samesite as "strict" | "lax" | "none") ?? "lax",
      path: attrs.path ?? "/",
      maxAge: attrs["max-age"] ? parseInt(attrs["max-age"], 10) : undefined,
      expires: attrs.expires ? new Date(attrs.expires) : undefined,
    });
  }
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as Record<
      string,
      unknown
    >;
  } catch {
    return null;
  }
}

function pickDeviceId(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;

  const root = data as Record<string, unknown>;
  const nested =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : undefined;

  const directCandidates = [
    root.deviceId,
    root.DeviceId,
    nested?.deviceId,
    nested?.DeviceId,
  ];

  for (const value of directCandidates) {
    if (typeof value === "string" && value.length > 0) return value;
  }

  const twoFactorToken =
    (typeof root.twoFactorToken === "string" && root.twoFactorToken) ||
    (typeof nested?.twoFactorToken === "string" && nested.twoFactorToken) ||
    (typeof root.token === "string" && root.token) ||
    (typeof nested?.token === "string" && nested.token) ||
    undefined;

  if (!twoFactorToken) return undefined;

  const payload = decodeJwtPayload(twoFactorToken);
  const fromJwt = payload?.device_id ?? payload?.deviceId;
  return typeof fromJwt === "string" && fromJwt.length > 0 ? fromJwt : undefined;
}

/** شناسه دستگاه را از body یا JWT دو مرحله‌ای استخراج و در کوکی ذخیره می‌کند. */
export function setDeviceIdFromBody(
  response: NextResponse,
  data: unknown,
): boolean {
  const deviceId = pickDeviceId(data);
  if (!deviceId) return false;

  response.cookies.set(AUTH_COOKIE_NAMES.DEVICE_ID, deviceId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
  });

  return true;
}

/**
 * بکندهای Bearer-based توکن را در body پاسخ برمی‌گردانند (نه Set-Cookie).
 * این تابع access/refresh/device را از body خوانده و به‌صورت HttpOnly cookie ست می‌کند.
 */
export function setAuthCookiesFromBody(
  response: NextResponse,
  data: unknown,
): boolean {
  if (!data || typeof data !== "object") return false;

  const root = data as Record<string, unknown>;
  const nested =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : undefined;

  const pick = (key: string): string | undefined => {
    const value = root[key] ?? nested?.[key];
    return typeof value === "string" && value.length > 0 ? value : undefined;
  };

  const accessToken = pick("accessToken") ?? pick("AccessToken");
  const refreshToken = pick("refreshToken") ?? pick("RefreshToken");
  const deviceId = pickDeviceId(data);

  if (!accessToken && !refreshToken && !deviceId) return false;

  const secure = process.env.NODE_ENV === "production";
  const expiresIn = extractExpiresIn(data);
  let didSet = false;

  if (accessToken) {
    response.cookies.set(AUTH_COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn ?? undefined,
    });
    didSet = true;
  }

  if (refreshToken) {
    response.cookies.set(AUTH_COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
    didSet = true;
  }

  if (deviceId) {
    response.cookies.set(AUTH_COOKIE_NAMES.DEVICE_ID, deviceId, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
    });
    didSet = true;
  }

  return didSet;
}

export function clearAllAuthCookies(response: NextResponse): void {
  const names = new Set<string>([
    AUTH_COOKIE_NAMES.ACCESS_TOKEN,
    AUTH_COOKIE_NAMES.REFRESH_TOKEN,
    AUTH_COOKIE_NAMES.DEVICE_ID,
    AUTH_COOKIE_NAMES.AUTH_INDICATOR,
    AUTH_COOKIE_NAMES.ACCESS_EXPIRES_AT,
    LEGACY_AUTH_COOKIE_NAMES.ACCESS_TOKEN,
    LEGACY_AUTH_COOKIE_NAMES.REFRESH_TOKEN,
    LEGACY_AUTH_COOKIE_NAMES.DEVICE_ID,
    LEGACY_AUTH_COOKIE_NAMES.AUTH_INDICATOR,
  ]);

  for (const name of names) {
    response.cookies.set(name, "", {
      httpOnly:
        name !== AUTH_COOKIE_NAMES.AUTH_INDICATOR &&
        name !== AUTH_COOKIE_NAMES.ACCESS_EXPIRES_AT &&
        name !== LEGACY_AUTH_COOKIE_NAMES.AUTH_INDICATOR,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }
}

function toPositiveSeconds(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return Math.floor(parsed);
    }

    const fromDate = Date.parse(value);
    if (!Number.isNaN(fromDate)) {
      const seconds = Math.floor((fromDate - Date.now()) / 1000);
      return seconds > 0 ? seconds : undefined;
    }
  }

  return undefined;
}

export function extractExpiresIn(data: unknown): number | undefined {
  if (!data || typeof data !== "object") return undefined;
  const record = data as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : undefined;

  const sources = [record, nested];
  for (const source of sources) {
    if (!source) continue;
    const fromExpiresIn = toPositiveSeconds(
      source.expiresIn ?? source.ExpiresIn,
    );
    if (fromExpiresIn) return fromExpiresIn;

    const fromExpiresAt = toPositiveSeconds(
      source.accessTokenExpiresAt ?? source.AccessTokenExpiresAt,
    );
    if (fromExpiresAt) return fromExpiresAt;
  }

  return undefined;
}

function isAccessTokenCookieName(name: string): boolean {
  return (
    name === AUTH_COOKIE_NAMES.ACCESS_TOKEN ||
    name === LEGACY_AUTH_COOKIE_NAMES.ACCESS_TOKEN
  );
}

export function extractAccessMaxAgeFromSetCookies(
  setCookieHeaders: string[],
): number | undefined {
  for (const raw of setCookieHeaders) {
    const [cookiePart, ...attributes] = raw.split(";");
    const name = cookiePart.slice(0, cookiePart.indexOf("=")).trim();
    if (!isAccessTokenCookieName(name)) continue;

    const attrs = parseCookieAttributes(attributes);
    const fromMaxAge = toPositiveSeconds(attrs["max-age"]);
    if (fromMaxAge) return fromMaxAge;

    const fromExpires = toPositiveSeconds(attrs.expires);
    if (fromExpires) return fromExpires;
  }

  return undefined;
}

export function resolveAccessExpiresInSeconds(
  data: unknown,
  setCookieHeaders: string[] = [],
): number | undefined {
  return (
    extractExpiresIn(data) ?? extractAccessMaxAgeFromSetCookies(setCookieHeaders)
  );
}

/** کوکی قابل‌خواندن در مرورگر تا کلاینت بداند access token کی منقضی می‌شود. */
export function setAccessExpiryCookie(
  response: NextResponse,
  data: unknown,
  setCookieHeaders: string[] = [],
): void {
  const expiresIn = resolveAccessExpiresInSeconds(data, setCookieHeaders);
  if (!expiresIn) return;

  response.cookies.set(
    AUTH_COOKIE_NAMES.ACCESS_EXPIRES_AT,
    String(Date.now() + expiresIn * 1000),
    {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn,
    },
  );
}
