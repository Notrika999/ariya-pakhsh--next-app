"use client";
// components/modules/auth/StepReset.tsx
import React, { useEffect, useState } from "react";
import {
  forgotPassword,
  getAuthErrorMessage,
  resetPassword,
} from "@/src/services/auth/auth.client";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";

interface StepResetProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function StepReset({ onSuccess, onBack }: StepResetProps) {
  const passwordResetToken = useAuthStore((s) => s.passwordResetToken);
  const passwordResetUsername = useAuthStore((s) => s.passwordResetUsername);
  const passwordResetMaskedDestination = useAuthStore(
    (s) => s.passwordResetMaskedDestination,
  );
  const passwordResetResendCooldownSeconds = useAuthStore(
    (s) => s.passwordResetResendCooldownSeconds,
  );
  const setPasswordResetFlow = useAuthStore((s) => s.setPasswordResetFlow);
  const clearPasswordResetFlow = useAuthStore((s) => s.clearPasswordResetFlow);

  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepetPassword, setShowRepetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(
    passwordResetResendCooldownSeconds ?? 0,
  );

  useEffect(() => {
    setCooldown(passwordResetResendCooldownSeconds ?? 0);
  }, [passwordResetResendCooldownSeconds]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleReset = async () => {
    if (!passwordResetToken) {
      setError("جلسه بازیابی معتبر نیست. لطفاً دوباره تلاش کنید");
      return;
    }

    const code = otpCode.trim();
    if (!code) {
      setError("کد تأیید الزامی است");
      return;
    }
    if (!newPassword) {
      setError("رمز عبور جدید الزامی است");
      return;
    }
    if (newPassword.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("تکرار رمز عبور مطابقت ندارد");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await resetPassword({
        resetToken: passwordResetToken,
        otpCode: code,
        newPassword,
        confirmPassword,
      });

      if (!result.success) {
        setError(
          result.errorMessage ?? result.message ?? "تغییر رمز عبور ناموفق بود",
        );
        return;
      }

      clearPasswordResetFlow();
      setSuccessMessage(result.message ?? "رمز عبور با موفقیت تغییر کرد");
      window.setTimeout(() => onSuccess(), 800);
    } catch (err) {
      console.error("[StepReset] reset password failed:", err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!passwordResetUsername || cooldown > 0 || resendLoading) return;

    setResendLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await forgotPassword({
        username: passwordResetUsername,
      });

      if (!result.success) {
        setError(
          result.errorMessage ?? result.message ?? "ارسال مجدد کد ناموفق بود",
        );
        return;
      }

      if (!result.resetToken) {
        setError("توکن بازیابی از سرور دریافت نشد");
        return;
      }

      setPasswordResetFlow(
        result.resetToken,
        passwordResetUsername,
        result.maskedDestination ?? passwordResetMaskedDestination,
        result.resendCooldownSeconds,
      );
      setSuccessMessage("کد بازیابی مجدداً ارسال شد");
    } catch (err) {
      console.error("[StepReset] resend failed:", err);
      setError(getAuthErrorMessage(err));
    } finally {
      setResendLoading(false);
    }
  };

  const busy = loading || resendLoading;

  return (
    <div className="space-y-3" dir="rtl">
      <p className="text-sm text-center text-gray-500 dark:text-gray-400">
        {passwordResetMaskedDestination
          ? `کد بازیابی به ${passwordResetMaskedDestination} ارسال شد`
          : "کد بازیابی ارسال‌شده را وارد کنید"}
      </p>

      <input
        type="text"
        value={otpCode}
        placeholder="کد تأیید"
        onChange={(e) => {
          setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 8));
          setError(null);
        }}
        inputMode="numeric"
        autoComplete="one-time-code"
        name="reset-otp-code"
        aria-label="کد تأیید"
        disabled={busy}
        className="w-full border rounded-xl p-3 text-center tracking-widest"
        dir="ltr"
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setError(null);
          }}
          placeholder="رمز عبور جدید"
          autoComplete="new-password"
          disabled={busy}
          className="w-full border rounded-xl p-3 pl-11"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          disabled={busy}
          aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <i
            className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
          ></i>
        </button>
      </div>

      <div className="relative">
        <input
          type={showRepetPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError(null);
          }}
          placeholder="تکرار رمز عبور جدید"
          autoComplete="new-password"
          disabled={busy}
          className="w-full border rounded-xl p-3"
        />
        <button
          type="button"
          onClick={() => setShowRepetPassword((v) => !v)}
          disabled={busy}
          aria-label={
            showRepetPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"
          }
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <i
            className={`fa-regular ${showRepetPassword ? "fa-eye-slash" : "fa-eye"}`}
          ></i>
        </button>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {successMessage && (
        <p className="text-green-600 text-sm text-center">{successMessage}</p>
      )}

      <button
        type="button"
        onClick={handleReset}
        disabled={busy}
        className={[
          "w-full py-3 rounded-xl text-white transition",
          !busy ? "bg-primary hover:opacity-90" : "bg-slate-300",
        ].join(" ")}
      >
        {loading ? "در حال تغییر رمز..." : "تغییر رمز عبور"}
      </button>

      <button
        type="button"
        onClick={handleResend}
        disabled={busy || cooldown > 0}
        className="w-full text-sm text-primary disabled:text-gray-400"
      >
        {resendLoading
          ? "در حال ارسال مجدد..."
          : cooldown > 0
            ? `ارسال مجدد تا ${cooldown} ثانیه`
            : "ارسال مجدد کد"}
      </button>

      <button
        type="button"
        onClick={() => {
          clearPasswordResetFlow();
          onBack();
        }}
        disabled={busy}
        className="w-full text-sm text-gray-500"
      >
        بازگشت به ورود
      </button>
    </div>
  );
}
