export type CachedPhoneAuthFlow = {
  flowToken: string;
  phone: string;
  maskedPhone: string;
  deviceFingerPrint: string | null;
  resendCooldownSeconds: number;
  expiresAt: number;
};

const PHONE_AUTH_FLOW_CACHE_KEY = "phone_auth_flow";

export function readCachedPhoneAuthFlow(): CachedPhoneAuthFlow | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(PHONE_AUTH_FLOW_CACHE_KEY);
    if (!raw) return null;

    const cached = JSON.parse(raw) as Partial<CachedPhoneAuthFlow>;
    if (
      !cached.flowToken ||
      !cached.phone ||
      typeof cached.expiresAt !== "number" ||
      cached.expiresAt <= Date.now()
    ) {
      clearCachedPhoneAuthFlow();
      return null;
    }

    return {
      flowToken: cached.flowToken,
      phone: cached.phone,
      maskedPhone: cached.maskedPhone ?? cached.phone,
      deviceFingerPrint: cached.deviceFingerPrint ?? null,
      resendCooldownSeconds: cached.resendCooldownSeconds ?? 120,
      expiresAt: cached.expiresAt,
    };
  } catch {
    clearCachedPhoneAuthFlow();
    return null;
  }
}

export function writeCachedPhoneAuthFlow(flow: CachedPhoneAuthFlow): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PHONE_AUTH_FLOW_CACHE_KEY, JSON.stringify(flow));
}

export function clearCachedPhoneAuthFlow(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(PHONE_AUTH_FLOW_CACHE_KEY);
}

