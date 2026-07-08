// components/modules/AuthInitializer/AuthInitializer.tsx
"use client";

import { useEffect } from "react";
import { resolveSession } from "@/src/services/auth/auth.client";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";
import { setupApiInterceptors } from "@/src/lib/http/interceptors";
import {
  handleSessionExpired,
  hasLikelySession,
  isProtectedRoute,
  redirectToHome,
} from "@/src/lib/auth/session-client";

let interceptorsReady = false;

export default function AuthInitializer() {
  const hydrateUserFromStorage = useAuthStore((s) => s.hydrateUserFromStorage);
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);
  const setAuthBootstrapping = useAuthStore((s) => s.setAuthBootstrapping);

  useEffect(() => {
    if (!interceptorsReady) {
      setupApiInterceptors();
      interceptorsReady = true;
    }

    let cancelled = false;

    async function bootstrapSession() {
      const storedUser = hydrateUserFromStorage();

      if (!hasLikelySession()) {
        clearUser();
        if (
          typeof window !== "undefined" &&
          isProtectedRoute(window.location.pathname)
        ) {
          redirectToHome();
        }
        return;
      }

      setAuthBootstrapping(true);

      try {
        const freshUser = await resolveSession();
        if (cancelled) return;

        if (!freshUser) {
          await handleSessionExpired();
          return;
        }

        setUser(
          storedUser
            ? {
                ...storedUser,
                ...freshUser,
                birthDate: freshUser.birthDate ?? storedUser.birthDate,
                currentSession:
                  freshUser.currentSession ?? storedUser.currentSession,
                lastLoginDevice:
                  freshUser.lastLoginDevice ?? storedUser.lastLoginDevice,
              }
            : freshUser,
        );
      } catch {
        if (cancelled) return;
        await handleSessionExpired();
      } finally {
        if (!cancelled) {
          setAuthBootstrapping(false);
        }
      }
    }

    void bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, [hydrateUserFromStorage, setUser, clearUser, setAuthBootstrapping]);

  return null;
}
