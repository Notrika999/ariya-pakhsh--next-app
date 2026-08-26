"use client";

import {
  AUTH_COOKIE_NAME_ALIASES,
  AUTH_USER_STORAGE_KEY,
} from "./constants";

export const PROTECTED_ROUTE_PREFIXES = [
  "/user-profile",
  "/checkout",
] as const;

let logoutInFlight: Promise<void> | null = null;

export function hasAuthIndicator(): boolean {
  if (typeof document === "undefined") return false;
  const indicatorNames = new Set<string>(AUTH_COOKIE_NAME_ALIASES.AUTH_INDICATOR);
  return document.cookie
    .split(";")
    .some((c) => indicatorNames.has(c.trim().split("=")[0]));
}

export function hasStoredUser(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return false;
    const user = JSON.parse(raw) as { userId?: string };
    return Boolean(user?.userId);
  } catch {
    return false;
  }
}

/** نشانه‌ای از session در کلاینت (کوکی indicator یا کاربر ذخیره‌شده) */
export function hasLikelySession(): boolean {
  return hasAuthIndicator() || hasStoredUser();
}

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function redirectToHome(): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname === "/") {
    window.location.reload();
    return;
  }
  window.location.replace("/");
}

/** @deprecated از redirectToHome استفاده کنید — همیشه به صفحه اصلی هدایت می‌شود */
export function redirectToHomeIfProtected(): void {
  redirectToHome();
}

/**
 * خروج یکپارچه از همه نقاط سایت:
 * - پاک کردن توکن‌ها (از طریق BFF logout)
 * - پاک کردن state کاربر و نشانه‌های کلاینت
 * - هدایت به صفحه اصلی
 */
export async function performLogout(
  options?: { skipServerLogout?: boolean },
): Promise<void> {
  if (logoutInFlight) return logoutInFlight;

  logoutInFlight = (async () => {
    const { useAuthStore } = await import("@/src/lib/stores/auth/auth.store");
    const { logout } = await import("@/src/services/auth/auth.client");
    const { clearFingerprint } = await import("@/src/lib/helper/fingerprint");

    if (!options?.skipServerLogout) {
      try {
        await logout();
      } catch {
        // حتی اگر logout سرور خطا داد، پاکسازی محلی ادامه می‌یابد
      }
    }

    try {
      clearFingerprint();
    } catch {
      // نادیده بگیر
    }

    useAuthStore.getState().clearUser();
    useAuthStore.getState().clearAuthFlow();
    redirectToHome();
  })();

  try {
    await logoutInFlight;
  } finally {
    logoutInFlight = null;
  }
}

/** وقتی access و refresh منقضی شدند / session معتبر نیست */
export async function handleSessionExpired(): Promise<void> {
  await performLogout();
}
