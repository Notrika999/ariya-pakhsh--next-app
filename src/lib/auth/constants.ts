// src/lib/auth/constants.ts

import { ROLES } from "../types/auth";

export const AUTH_COOKIE_NAMES = {
  ACCESS_TOKEN: "CUP_Access_Token",
  REFRESH_TOKEN: "CUP_Refresh_Token",
  AUTH_INDICATOR: "CUP_Auth_Indicator",
  DEVICE_ID: "CUP_Device_Id",
} as const;

/** Admin panel — used only by management BFF routes under app/api/v1/auth/* */
// note for me
export const BACKEND_AUTH_PATHS = {
  LOGIN: "/api/v1/management/ManagementAuth/login",
  VERIFY_2FA: "/api/v1/management/ManagementAuth/verify-2fa",
  REFRESH: "/api/v1/management/ManagementAuth/refresh-token",
  LOGOUT: "/api/v1/management/ManagementAuth/logout",
  ME: "/api/v1/management/ManagementAuth/me",
  SECURITY_STAMP: "/api/v1/management/ManagementAuth/security-stamp",
  RESEND_OTP: "/api/v1/management/ManagementAuth/resend-otp",
} as const;
// note for me

/** Browser → Next.js BFF (same-origin cookies on localhost) */
export const FRONT_AUTH_PATHS = {
  ME: "/api/auth/me",
  LOGOUT: "/api/auth/logout",
  REFRESH: "/api/auth/refresh-token",
  LOGIN: "/api/auth/login",
  LOGIN_VERIFY_2FA: "/api/auth/login/verify-2fa",
  REGISTER: "/api/auth/register",
  PHONE_VERIFY: "/api/auth/phone/verify",
  PHONE_START: "/api/auth/phone/start",
  /** @deprecated use PHONE_VERIFY */
  VERIFY_2FA: "/api/auth/phone/verify",
  SECURITY_STAMP: "/api/auth/security-stamp",
  RESEND_OTP: "/api/auth/resend-otp",
} as const;

/** BFF → Backend CustomerAuth */
export const CUSTOMER_BACKEND_AUTH_PATHS = {
  ME: "/api/v1/CustomerAuth/me",
  LOGOUT: "/api/v1/CustomerAuth/logout",
  REFRESH: "/api/v1/CustomerAuth/refresh-token",
  LOGIN: "/api/v1/CustomerAuth/login",
  LOGIN_VERIFY_2FA: "/api/v1/CustomerAuth/login/verify-2fa",
  REGISTER: "/api/v1/CustomerAuth/register",
  PHONE_VERIFY: "/api/v1/CustomerAuth/phone/verify",
  PHONE_START: "/api/v1/CustomerAuth/phone/start",
  RESEND_OTP: "/api/v1/CustomerAuth/otp/resend",
} as const;

/** Browser → api/v1 proxy → Backend CustomerAuth */
export const CUSTOMER_AUTH_CLIENT_PATHS = {
  LOGIN_VERIFY_2FA: "/CustomerAuth/login/verify-2fa",
  OTP_RESEND: "/CustomerAuth/otp/resend",
} as const;

/** Browser → Next.js data proxy */
export const FRONT_API_PREFIX = "/api/v1" as const;

export const AUTH_INDICATOR_BUFFER = 24 * 60 * 60; // 1 day

/** Fallback اگه بک‌اند expiresIn نفرسته */
export const AUTH_INDICATOR_DEFAULT_MAX_AGE = 8 * 24 * 60 * 60; // 8 days

export const AUTH_ROUTES = {
  LOGIN: "/login",
  VERIFY_2FA: "/verify-2fa",
  DASHBOARD: "/management/dashboards/ecommerce",
} as const;

export const PUBLIC_ROUTES = [
  "/login",
  "/verify-2fa",
  "/forgot-password",
  "/reset-password",
] as const;

export const AUTH_ONLY_ROUTES = ["/login"] as const;

export const CSRF_HEADER = "x-csrf-protection" as const;

export const SUPER_ADMIN_ROLE = ROLES.SUPER_ADMIN;

export const STAMP_SYNC = {
  POLL_INTERVAL_MS: 30_000,
  MAX_BACKOFF_MS: 300_000,
  FAILURE_THRESHOLD: 3,
} as const;
