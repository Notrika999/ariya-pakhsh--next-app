// components/modules/auth/StepOtp.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  attachSessionToUser,
  completeUserFromMe,
  getAuthErrorMessage,
  resendLoginTwoFactorOtp,
  resendOtp,
  verifyLoginTwoFactor,
  verifyOtp,
} from "@/src/services/auth/auth.client";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";
import OtpResendCountdown from "./OtpResendCountdown";

const OTP_LENGTH = 6;

interface StepOtpProps {
  onSuccess: (isNewUser: boolean) => void;
  onBack: () => void;
}

export default function StepOtp({ onSuccess, onBack }: StepOtpProps) {
  const {
    flowToken,
    phone,
    maskedPhone,
    deviceFingerPrint,
    resendCooldownSeconds,
    authOtpMode,
    loginTwoFactorToken,
    loginTwoFactorOtpSentTo,
    clearLoginTwoFactorFlow,
    setAuthFlow,
    setLoginTwoFactorFlow,
    setVerifyResult,
    setUser,
  } = useAuthStore();

  const isLoginTwoFactor =
    authOtpMode === "login-2fa" && Boolean(loginTwoFactorToken);

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // مدت اعتبار شمارش معکوس (ثانیه). تیک هر ثانیه دیگه داخل خود StepOtp
  // اتفاق نمی‌افته، بلکه داخل کامپوننت مجزای OtpResendCountdown هست
  // تا فرم OTP هر ثانیه ری‌رندر نشه.
  const [cooldownSeconds, setCooldownSeconds] = useState(
    resendCooldownSeconds ?? 0,
  );
  const [resendAvailable, setResendAvailable] = useState(
    (resendCooldownSeconds ?? 0) <= 0,
  );

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleVerify = async (code: string) => {
    if (loading) return;

    if (isLoginTwoFactor) {
      if (!loginTwoFactorToken) {
        setError("توکن احراز دومرحله‌ای معتبر نیست. لطفاً دوباره وارد شوید");
        return;
      }

      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const verifyBody = {
          twoFactorToken: loginTwoFactorToken,
          code,
          deviceFingerPrint: deviceFingerPrint ?? "device-id",
        };

        const result = await verifyLoginTwoFactor(verifyBody);

        if (!result.success) {
          setError(result.errorMessage ?? result.message ?? "کد تایید نامعتبر است");
          setDigits(Array(OTP_LENGTH).fill(""));
          setTimeout(() => inputRefs.current[0]?.focus(), 0);
          return;
        }

        if (!result.userInfoDto) {
          throw new Error("اطلاعات کاربر از سرور دریافت نشد");
        }

        const fallbackUser = result.userInfoDto;
        const freshUser = await completeUserFromMe(fallbackUser);
        setUser(attachSessionToUser(freshUser, result.sessionInfoDto));
        clearLoginTwoFactorFlow();
        onSuccess(false);
      } catch (err) {
        console.error("[StepOtp] login 2FA verify failed:", err);
        setError(getAuthErrorMessage(err));
        setDigits(Array(OTP_LENGTH).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 0);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!flowToken) {
      setError("توکن معتبر نیست. لطفاً دوباره شماره را وارد کنید");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await verifyOtp({
        flowToken,
        code,
        deviceFingerPrint: deviceFingerPrint ?? "device-id",
      });

      setVerifyResult(result.isNewUser, result.registrationToken);

      // بکند /me ندارد یا برای این مسیر 404 می‌دهد؛ اطلاعات کاربر باید از پاسخ verify بیاید.
      if (!result.isNewUser) {
        if (result.userInfoDto) {
          const fallbackUser = result.userInfoDto;
          const freshUser = await completeUserFromMe(fallbackUser);
          setUser(attachSessionToUser(freshUser, result.sessionInfoDto));
        } else {
          throw new Error("اطلاعات کاربر از سرور دریافت نشد");
        }
      }

      onSuccess(result.isNewUser);
    } catch (err) {
      console.error("verify error:", err);
      setError(getAuthErrorMessage(err));
      setDigits(Array(OTP_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError(null);
    setSuccessMessage(null);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (digit && index === OTP_LENGTH - 1 && newDigits.every((d) => d !== "")) {
      handleVerify(newDigits.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newDigits = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      newDigits[i] = char;
    });
    setDigits(newDigits);
    const nextEmpty = newDigits.findIndex((d) => !d);
    inputRefs.current[nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty]?.focus();
    if (newDigits.every((d) => d !== "")) handleVerify(newDigits.join(""));
  };

  const handleResend = async () => {
    if (resendLoading) return;

    if (isLoginTwoFactor) {
      if (!loginTwoFactorToken) return;

      setResendLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const result = await resendLoginTwoFactorOtp(loginTwoFactorToken);

        if (!result.success) {
          setError(result.errorMessage ?? result.message ?? "ارسال مجدد کد انجام نشد");
          return;
        }

        const nextToken = result.flowToken ?? result.token ?? loginTwoFactorToken;
        const nextCooldown =
          result.resendCooldownSeconds ?? result.otpExpiresInSeconds ?? 120;

        setLoginTwoFactorFlow(
          nextToken,
          result.maskedPhone ??
            result.maskedDestination ??
            loginTwoFactorOtpSentTo,
          deviceFingerPrint ?? "device-id",
          nextCooldown,
        );
        setCooldownSeconds(nextCooldown);
        setResendAvailable(false);
        setDigits(Array(OTP_LENGTH).fill(""));
        setSuccessMessage(result.message ?? "کد تایید جدید ارسال شد.");
        setTimeout(() => inputRefs.current[0]?.focus(), 0);
      } catch (err) {
        console.error("[StepOtp] login 2FA resend failed:", err);
        setError(getAuthErrorMessage(err));
      } finally {
        setResendLoading(false);
      }
      return;
    }

    if (!flowToken || resendLoading) return;

    setResendLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await resendOtp({ token: flowToken });

      if (!result.success) {
        setError(result.errorMessage ?? result.message ?? "ارسال مجدد کد انجام نشد");
        return;
      }

      const nextToken = result.flowToken ?? result.token ?? flowToken;
      const nextCooldown =
        result.resendCooldownSeconds ?? result.otpExpiresInSeconds ?? 120;

      setAuthFlow(
        nextToken,
        phone ?? "",
        result.maskedPhone ?? maskedPhone ?? phone ?? "",
        deviceFingerPrint ?? "device-id",
        nextCooldown,
      );
      setCooldownSeconds(nextCooldown);
      setResendAvailable(false);
      setDigits(Array(OTP_LENGTH).fill(""));
      setSuccessMessage(result.message ?? "کد تایید جدید ارسال شد.");
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    } catch (err) {
      console.error("[StepOtp] resend failed:", err);
      setError(getAuthErrorMessage(err));
    } finally {
      setResendLoading(false);
    }
  };

  const isComplete = digits.every((d) => d !== "");

  return (
    <div className="flex flex-col items-center gap-4" dir="rtl">
      <p className="text-sm text-gray-500 text-center">
        {isLoginTwoFactor ? (
          <>
            کد تایید
            {loginTwoFactorOtpSentTo ? (
              <>
                {" "}
                ارسال‌شده به{" "}
                <span className="font-semibold text-gray-800" dir="ltr">
                  {loginTwoFactorOtpSentTo}
                </span>
              </>
            ) : (
              " احراز دومرحله‌ای"
            )}{" "}
            را وارد کنید
          </>
        ) : (
          <>
            کد تأیید به شماره{" "}
            <span className="font-semibold text-gray-800" dir="ltr">
              {maskedPhone ?? phone}
            </span>{" "}
            ارسال شد
          </>
        )}
      </p>

      <div className="flex gap-2 flex-row-reverse">
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={loading}
            className={[
              "w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition",
              digits[index] ? "border-primary bg-primary/5" : "border-gray-300",
              error ? "border-red-400!" : "focus:border-primary",
              loading ? "opacity-50 cursor-not-allowed" : "",
            ].join(" ")}
            dir="ltr"
          />
        ))}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {successMessage && (
        <p className="text-green-600 dark:text-green-400 text-sm text-center">
          {successMessage}
        </p>
      )}

      <button
        onClick={() => handleVerify(digits.join(""))}
        disabled={!isComplete || loading}
        className={[
          "w-full py-3 rounded-xl text-white transition",
          isComplete && !loading
            ? "bg-primary hover:opacity-90"
            : "bg-slate-300 cursor-not-allowed",
        ].join(" ")}
      >
        {loading ? "در حال تأیید..." : "تأیید کد"}
      </button>

      <button
        onClick={onBack}
        className="text-sm text-gray-400 hover:text-gray-600 transition"
      >
        ویرایش شماره موبایل
      </button>

      {!resendAvailable ? (
        <OtpResendCountdown
          seconds={cooldownSeconds}
          onExpire={() => setResendAvailable(true)}
        />
      ) : (
        <button onClick={handleResend} disabled={resendLoading}>
          {resendLoading ? "در حال ارسال..." : "ارسال مجدد کد"}
        </button>
      )}
    </div>
  );
}
