// components/modules/AuthInitializer/AuthInitializer.tsx
"use client";

import { useEffect } from "react";
import { getMe, refreshSession } from "@/src/services/auth/auth.client";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";
import { setupApiInterceptors } from "@/src/lib/http/interceptors";
import { AUTH_COOKIE_NAMES } from "@/src/lib/auth/constants";

let interceptorsReady = false;

function hasAuthIndicator(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${AUTH_COOKIE_NAMES.AUTH_INDICATOR}=`));
}

export default function AuthInitializer() {
  const hydrateUserFromStorage = useAuthStore((s) => s.hydrateUserFromStorage);
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    if (!interceptorsReady) {
      setupApiInterceptors();
      interceptorsReady = true;
    }

    // کاربر ناشناس (هیچ نشانه‌ای از session نیست) → بدون درخواست به سرور
    if (!hasAuthIndicator()) {
      clearUser();
      return;
    }

    const storedUser = hydrateUserFromStorage();
    if (!storedUser) {
      clearUser();
      return;
    }

    refreshSession()
      .then(async () => {
        const freshUser = await getMe();
        setUser({
          ...storedUser,
          ...freshUser,
          birthDate: freshUser.birthDate ?? storedUser.birthDate,
          currentSession: freshUser.currentSession ?? storedUser.currentSession,
          lastLoginDevice:
            freshUser.lastLoginDevice ?? storedUser.lastLoginDevice,
        });
      })
      .catch(() => {
        // اگر /me موقتاً خطا داد، کاربر ذخیره‌شده را نگه می‌داریم
        // تا UI پنل در refresh خالی نشود؛ نبود session واقعی در layout سرور چک می‌شود.
        hydrateUserFromStorage();
      });
  }, [hydrateUserFromStorage, setUser, clearUser]);

  return null;
}
