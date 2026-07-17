// components/modules/auth/UserProfileAuthGuard.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { resolveSession } from "@/src/services/auth/auth.client";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";
import {
  handleSessionExpired,
  hasLikelySession,
} from "@/src/lib/auth/session-client";

/**
 * روی هر ناوبری داخل /user-profile احراز هویت را دوباره چک می‌کند.
 * اگر access و refresh هر دو نامعتبر باشند → لاگ‌اوت کامل (پاک کردن user + هدر).
 */
export default function UserProfileAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const setUser = useAuthStore((s) => s.setUser);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    let cancelled = false;

    async function verifySession() {
      try {
        if (!hasLikelySession()) {
          if (!cancelled && requestId === requestIdRef.current) {
            await handleSessionExpired();
          }
          return;
        }

        const freshUser = await resolveSession();
        if (cancelled || requestId !== requestIdRef.current) return;

        if (!freshUser) {
          await handleSessionExpired();
          return;
        }

        setUser(freshUser);
      } catch {
        if (cancelled || requestId !== requestIdRef.current) return;
        await handleSessionExpired();
      }
    }

    void verifySession();

    return () => {
      cancelled = true;
    };
  }, [pathname, setUser]);

  return <>{children}</>;
}
