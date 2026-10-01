"use client";
// components/modules/auth/StepMobile.tsx
import React, { useState } from "react";
import { validateMobile } from "@/src/utils/auth.validation";
import {
  getAuthErrorMessage,
  startPhoneAuth,
} from "@/src/services/auth/auth.client";
import { getBrowserFingerprint } from "@/src/lib/helper/fingerprint";
import { ApiError } from "@/src/lib/http/api-client";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";
import { notify } from "@/src/utils/toast";
<<<<<<< HEAD
import {
  readCachedPhoneAuthFlow,
  writeCachedPhoneAuthFlow,
} from "@/src/lib/auth/phone-auth-flow-cache";
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

interface StepMobileProps {
  mobile: string;
  setMobile: (value: string) => void;
  onNext: () => void;
}

type CachedPhoneAuthFlow = {
  flowToken: string;
  phone: string;
  maskedPhone: string;
  deviceFingerPrint: string;
  resendCooldownSeconds: number;
};

const PHONE_AUTH_FLOW_CACHE_KEY = "phone_auth_flow";

function readCachedPhoneAuthFlow(): CachedPhoneAuthFlow | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(PHONE_AUTH_FLOW_CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as Partial<CachedPhoneAuthFlow>;

    if (!cached.flowToken || !cached.phone) return null;

    return {
      flowToken: cached.flowToken,
      phone: cached.phone,
      maskedPhone: cached.maskedPhone ?? cached.phone,
      deviceFingerPrint: cached.deviceFingerPrint ?? "device-id",
      resendCooldownSeconds: cached.resendCooldownSeconds ?? 120,
    };
  } catch {
    return null;
  }
}

function writeCachedPhoneAuthFlow(flow: CachedPhoneAuthFlow): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PHONE_AUTH_FLOW_CACHE_KEY, JSON.stringify(flow));
}

export default function StepMobile({ mobile, setMobile, onNext }: StepMobileProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
<<<<<<< HEAD
    deviceFingerPrint: storedDeviceFingerPrint,
=======
    flowToken: storedFlowToken,
    maskedPhone: storedMaskedPhone,
    deviceFingerPrint: storedDeviceFingerPrint,
    resendCooldownSeconds: storedResendCooldownSeconds,
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    setAuthFlow,
  } = useAuthStore();

  const handleNext = async () => {
    if (!validateMobile(mobile)) {
      setError("شماره موبایل معتبر نیست");
      return;
    }

    setLoading(true);
    setError(null);

<<<<<<< HEAD
    let deviceFingerPrint = storedDeviceFingerPrint;
=======
    let deviceFingerPrint = storedDeviceFingerPrint ?? "device-id";
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

    try {
      const fingerprint = await getBrowserFingerprint();
      deviceFingerPrint = fingerprint?.visitorId ?? deviceFingerPrint;

<<<<<<< HEAD
      const response = await startPhoneAuth({
        phoneNumber: mobile,
        deviceFingerPrint: deviceFingerPrint ?? undefined,
=======


      const response = await startPhoneAuth({
        phoneNumber: mobile,
        deviceFingerPrint,
        
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      });

  

      if (!response.success) {
        setError(response.errorMessage ?? "خطایی رخ داد");
        return;
      }

      const flowToken = response.flowToken ?? response.token;

      if (!flowToken) {
        setError("توکن احراز هویت از سرور دریافت نشد");
        return;
      }

      setAuthFlow(
        flowToken,
        mobile,
        response.maskedPhone,
        deviceFingerPrint,
        response.resendCooldownSeconds,
      );
      writeCachedPhoneAuthFlow({
        flowToken,
        phone: mobile,
        maskedPhone: response.maskedPhone,
        deviceFingerPrint,
        resendCooldownSeconds: response.resendCooldownSeconds,
<<<<<<< HEAD
        expiresAt:
          Date.now() +
          Math.max(
            response.otpExpiresInSeconds ?? 0,
            response.resendCooldownSeconds ?? 0,
            120,
          ) *
            1000,
      });
      onNext();
    } catch (err) {
      // console.error("[StepMobile] start failed =>", err);
=======
      });
      onNext();
    } catch (err) {
      console.error("[StepMobile] start failed =>", err);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      const message = getAuthErrorMessage(err);

      if (err instanceof ApiError && err.status === 429) {
        notify.warning(message);

        const authState = useAuthStore.getState();
        const cachedFlow = readCachedPhoneAuthFlow();
<<<<<<< HEAD
        const activeFlow = cachedFlow?.phone === mobile ? cachedFlow : null;

        if (activeFlow) {
          setAuthFlow(
            activeFlow.flowToken,
            mobile,
            activeFlow.maskedPhone,
            authState.deviceFingerPrint ?? activeFlow.deviceFingerPrint,
            activeFlow.resendCooldownSeconds,
=======
        const activeFlowToken =
          authState.flowToken ??
          storedFlowToken ??
          (cachedFlow?.phone === mobile ? cachedFlow.flowToken : null);

        if (activeFlowToken) {
          setAuthFlow(
            activeFlowToken,
            mobile,
            authState.maskedPhone ??
              storedMaskedPhone ??
              cachedFlow?.maskedPhone ??
              mobile,
            authState.deviceFingerPrint ??
              cachedFlow?.deviceFingerPrint ??
              deviceFingerPrint,
            authState.resendCooldownSeconds ??
              storedResendCooldownSeconds ??
              cachedFlow?.resendCooldownSeconds ??
              120,
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
          );
          onNext();
        }

        return;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isReady = validateMobile(mobile);

  return (
    <>
      <input
        type="tel"
        value={mobile}
        onChange={(e) => {
          setMobile(e.target.value);
          setError(null);
        }}
        placeholder="09xxxxxxxxx"
        className="w-full border rounded-xl p-3"
        dir="ltr"
      />
      {error && (
        <p className="text-red-500 text-sm mt-2 text-right">{error}</p>
      )}
      <button
        onClick={handleNext}
        disabled={!isReady || loading}
        className={[
          "w-full py-3 rounded-xl text-white transition mt-4",
          isReady && !loading
            ? "bg-primary hover:opacity-90"
            : "bg-slate-300 cursor-not-allowed",
        ].join(" ")}
      >
        {loading ? "در حال ارسال..." : "ادامه"}
      </button>
    </>
  );
}
