// src/utils/guestSession.ts

const GUEST_SESSION_KEY = "guest_session_id";

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const guestSession = {
  get(): string {
    if (typeof window === "undefined") return "";
    try {
      const existing = window.localStorage.getItem(GUEST_SESSION_KEY)?.trim();
      if (existing) return existing;
      const next = createId();
      window.localStorage.setItem(GUEST_SESSION_KEY, next);
      return next;
    } catch {
      return createId();
    }
  },

  peek(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(GUEST_SESSION_KEY)?.trim() || null;
    } catch {
      return null;
    }
  },

  rotate(): string {
    if (typeof window === "undefined") return createId();
    const next = createId();
    try {
      window.localStorage.setItem(GUEST_SESSION_KEY, next);
    } catch {
      // ignore
    }
    return next;
  },

  set(sessionId: string): void {
    if (typeof window === "undefined") return;
    const value = sessionId.trim();
    if (!value) return;
    try {
      window.localStorage.setItem(GUEST_SESSION_KEY, value);
    } catch {
      // ignore
    }
  },

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(GUEST_SESSION_KEY);
    } catch {
      // ignore
    }
  },
};
