// components/modules/auth/StepMobile.tsx
"use client";
import React, { useRef, useState } from "react";
import Captcha from "../Captcha";
import type { CaptchaHandle } from "../Captcha";
import { validateMobile } from "@/src/utils/auth.validation";
import {
  getAuthErrorMessage,
  startPhoneAuth,
} from "@/src/services/auth/auth.client";
import { getBrowserFingerprint } from "@/src/lib/helper/fingerprint";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";

interface StepMobileProps {
  mobile: string;
  setMobile: (value: string) => void;
  onNext: () => void;
}

export default function StepMobile({ mobile, setMobile, onNext }: StepMobileProps) {
  const captchaRef = useRef<CaptchaHandle | null>(null);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setAuthFlow } = useAuthStore();

  const handleNext = async () => {
    if (!captchaRef.current) return;

    const isValid = captchaRef.current.validate(captchaInput);
    if (!isValid) {
      setError("کد امنیتی صحیح نیست");
      return;
    }

    if (!validateMobile(mobile)) {
      setError("شماره موبایل معتبر نیست");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fingerprint = await getBrowserFingerprint();
      const deviceFingerPrint = fingerprint?.visitorId ?? "device-id";

      console.log("Finger Print => ", fingerprint)
      console.log("Device Finger Print => ", deviceFingerPrint)

      const response = await startPhoneAuth({
        phoneNumber: mobile,
        deviceFingerPrint,
        
      });

      console.log(response)

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
      onNext();
    } catch (err) {
      console.error("[StepMobile] start failed =>", err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const isReady = captchaValid && validateMobile(mobile);

  return (
    <>
      <input
        type="tel"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        placeholder="09xxxxxxxxx"
        className="w-full border rounded-xl p-3 mb-4"
        dir="ltr"
      />
      <Captcha
        ref={captchaRef}
        length={6}
        width={220}
        height={45}
        caseSensitive={false}
        charset={{ uppercase: true, lowercase: false, numbers: true }}
        controlledValidation={false}
        onValidate={(isValid, value) => {
          setCaptchaValid(isValid);
          setCaptchaInput(value);
        }}
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
