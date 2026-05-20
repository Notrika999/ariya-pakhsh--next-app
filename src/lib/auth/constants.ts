// src/lib/auth/constants.ts

import { ROLES } from "@/src/lib/types/auth";

export const AUTH_COOKIE_NAMES = {
  ACCESS_TOKEN: "CUP_Access_Token",
  REFRESH_TOKEN: "CUP_Refresh_Token",
  AUTH_INDICATOR: "CUP_Auth_Indicator",
  DEVICE_ID: "CUP_Device_Id",
} as const;

export const BACKEND_AUTH_PATHS = {
  LOGIN: "/api/v1/management/ManagementAuth/login",
  VERIFY_2FA: "/api/v1/management/ManagementAuth/verify-2fa",
  REFRESH: "/api/v1/management/ManagementAuth/refresh-token",
  LOGOUT: "/api/v1/management/ManagementAuth/logout",
  ME: "/api/v1/management/ManagementAuth/me",
  SECURITY_STAMP: "/api/v1/management/ManagementAuth/security-stamp",
  RESEND_OTP: "/api/v1/management/ManagementAuth/resend-otp",
} as const;

export const FRONT_AUTH_PATHS = {
  LOGIN: "/auth/login",
  VERIFY_2FA: "/auth/verify-2fa",
  REFRESH: "/auth/refresh-token",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
  SECURITY_STAMP: "/auth/security-stamp",
  RESEND_OTP: "/auth/resend-otp",
} as const;

export const AUTH_INDICATOR_BUFFER = 24 * 60 * 60; // 1 day

/** Fallback اگه بک‌اند expiresIn نفرسته */
export const AUTH_INDICATOR_DEFAULT_MAX_AGE = 8 * 24 * 60 * 60; // 8 days

export const AUTH_ROUTES = {
  LOGIN: "/login",
  VERIFY_2FA: "/verify-2fa",
  DASHBOARD: "/management/dashboards/ecommerce",
} as const;

/**
 * مسیرهای عمومی — بدون نیاز به لاگین
 * verify-2fa هم عمومیه چون کاربر هنوز لاگین کامل نکرده
 */
export const PUBLIC_ROUTES = [
  "/login",
  "/verify-2fa",
  "/forgot-password",
  "/reset-password",
] as const;

/**
 * مسیرهایی که کاربر لاگین‌شده نباید ببینه
 * verify-2fa اینجا نیست چون ممکنه هنوز 2FA رو نزده باشه
 */
export const AUTH_ONLY_ROUTES = ["/login"] as const;

export const CSRF_HEADER = "x-csrf-protection" as const;

export const SUPER_ADMIN_ROLE = ROLES.SUPER_ADMIN;

export const STAMP_SYNC = {
  POLL_INTERVAL_MS: 30_000,
  MAX_BACKOFF_MS: 300_000,
  FAILURE_THRESHOLD: 3,
} as const;
