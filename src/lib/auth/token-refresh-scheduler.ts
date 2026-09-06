"use client";

import {
  AUTH_COOKIE_NAMES,
  TOKEN_REFRESH_LEAD_SECONDS,
} from "@/src/lib/auth/constants";
import { hasLikelySession } from "@/src/lib/auth/session-client";
import {
  enqueueRefreshSubscriber,
  getIsRefreshing,
  processRefreshQueue,
  setIsRefreshing,
} from "@/src/lib/http/refresh-queue";
import { refreshSession } from "@/src/services/auth/auth.client";

const LEAD_MS = TOKEN_REFRESH_LEAD_SECONDS * 1000;
const MIN_REFRESH_GAP_MS = 30_000;
const MAX_TIMEOUT_MS = 2_147_483_647;

let refreshTimer: ReturnType<typeof setTimeout> | null = null;
let visibilityBound = false;
let lastRefreshAt = 0;
let refreshInFlight: Promise<void> | null = null;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const prefix = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }

  return null;
}

function getErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;

  if ("status" in error && typeof error.status === "number") {
    return error.status;
  }

  if ("response" in error) {
    const response = (error as { response?: { status?: number } }).response;
    return response?.status;
  }

  return undefined;
}

export function markAccessTokenRefreshed(): void {
  lastRefreshAt = Date.now();
  syncProactiveTokenRefresh();
}

export function getAccessExpiresAtMs(): number | null {
  const raw = readCookie(AUTH_COOKIE_NAMES.ACCESS_EXPIRES_AT);
  if (!raw) return null;

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function clearRefreshTimer(): void {
  if (refreshTimer !== null) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

export function stopProactiveTokenRefresh(): void {
  clearRefreshTimer();
}

async function runProactiveRefresh(): Promise<void> {
  if (!hasLikelySession()) {
    stopProactiveTokenRefresh();
    return;
  }

  if (refreshInFlight) {
    await refreshInFlight;
    return;
  }

  refreshInFlight = (async () => {
    if (getIsRefreshing()) {
      try {
        await enqueueRefreshSubscriber();
      } catch {
        return;
      }
      lastRefreshAt = Date.now();
      syncProactiveTokenRefresh();
      return;
    }

    const elapsed = Date.now() - lastRefreshAt;
    if (lastRefreshAt > 0 && elapsed < MIN_REFRESH_GAP_MS) {
      refreshTimer = setTimeout(
        () => void runProactiveRefresh(),
        MIN_REFRESH_GAP_MS - elapsed,
      );
      return;
    }

    setIsRefreshing(true);
    try {
      await refreshSession();
      lastRefreshAt = Date.now();
      processRefreshQueue(true);
    } catch (error) {
      processRefreshQueue(false, error);
      const status = getErrorStatus(error);

      if (status === 401) {
        stopProactiveTokenRefresh();
        return;
      }

      refreshTimer = setTimeout(
        () => void runProactiveRefresh(),
        MIN_REFRESH_GAP_MS,
      );
      return;
    } finally {
      setIsRefreshing(false);
    }

    syncProactiveTokenRefresh();
  })();

  try {
    await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

export function syncProactiveTokenRefresh(): void {
  if (typeof window === "undefined") return;

  bindVisibilityListener();
  clearRefreshTimer();

  if (!hasLikelySession()) return;

  const expiresAt = getAccessExpiresAtMs();
  if (!expiresAt) {
    void runProactiveRefresh();
    return;
  }

  const delay = expiresAt - Date.now() - LEAD_MS;
  if (delay <= 0) {
    void runProactiveRefresh();
    return;
  }

  refreshTimer = setTimeout(
    () => void runProactiveRefresh(),
    Math.min(delay, MAX_TIMEOUT_MS),
  );
}

function bindVisibilityListener(): void {
  if (visibilityBound || typeof document === "undefined") return;
  visibilityBound = true;

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      syncProactiveTokenRefresh();
    }
  });

  window.addEventListener("focus", () => {
    syncProactiveTokenRefresh();
  });
}
