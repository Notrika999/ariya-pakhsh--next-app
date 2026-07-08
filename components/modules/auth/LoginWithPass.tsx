"use client";
// components/modules/auth/LoginWithPass.tsx
import React, { useState } from "react";
import {
  attachSessionToUser,
  completeUserFromMe,
  forgotPassword,
  getAuthErrorMessage,
  loginWithPassword,
} from "@/src/services/auth/auth.client";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";
import { getBrowserFingerprint } from "@/src/lib/helper/fingerprint";

interface LoginWithPassProps {
  onSuccess: () => void;
  onRequiresTwoFactor: () => void;
  onForgotSuccess: () => void;
}

export default function LoginWithPass({
  onSuccess,
  onRequiresTwoFactor,
  onForgotSuccess,
}: LoginWithPassProps) {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoginTwoFactorFlow = useAuthStore((s) => s.setLoginTwoFactorFlow);
  const setPasswordResetFlow = useAuthStore((s) => s.setPasswordResetFlow);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [deviceFingerPrint, setDeviceFingerPrint] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDeviceFingerPrint = async () => {
    if (deviceFingerPrint) return deviceFingerPrint;
    const fingerprint = await getBrowserFingerprint();
    const value = fingerprint?.visitorId ?? "device-id";
    setDeviceFingerPrint(value);
    return value;
  };

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError("نام کاربری و رمز عبور الزامی است");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fingerprint = await getDeviceFingerPrint();

      const result = await loginWithPassword({
        username: username.trim(),
        password,
        rememberMe,
        deviceFingerPrint: fingerprint,
      });

      if (!result.success) {
        setError(result.errorMessage ?? result.message ?? "ورود ناموفق بود");
        return;
      }

      if (result.requiresTwoFactor) {
        if (!result.twoFactorToken) {
          setError("توکن احراز دومرحله‌ای از سرور دریافت نشد");
          return;
        }

        setLoginTwoFactorFlow(
          result.twoFactorToken,
          result.otpSentTo ?? null,
          fingerprint,
        );
        onRequiresTwoFactor();
        return;
      }

      if (!result.userInfoDto) {
        setError("اطلاعات کاربر از سرور دریافت نشد");
        return;
      }

      const fallbackUser = result.userInfoDto;
      const freshUser = await completeUserFromMe(fallbackUser);
      setUser(attachSessionToUser(freshUser, result.sessionInfoDto));
      onSuccess();
    } catch (err) {
      console.error("[LoginWithPass] login failed:", err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError("برای بازیابی رمز، نام کاربری را وارد کنید");
      return;
    }

    setForgotLoading(true);
    setError(null);

    try {
      const result = await forgotPassword({ username: trimmedUsername });

      if (!result.success) {
        setError(
          result.errorMessage ?? result.message ?? "ارسال کد بازیابی ناموفق بود",
        );
        return;
      }

      if (!result.resetToken) {
        setError("توکن بازیابی از سرور دریافت نشد");
        return;
      }

      setPasswordResetFlow(
        result.resetToken,
        trimmedUsername,
        result.maskedDestination ?? null,
        result.resendCooldownSeconds,
      );
      onForgotSuccess();
    } catch (err) {
      console.error("[LoginWithPass] forgot password failed:", err);
      setError(getAuthErrorMessage(err));
    } finally {
      setForgotLoading(false);
    }
  };

  const busy = loading || forgotLoading;

  return (
    <div className="space-y-3" dir="rtl">
      <input
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setError(null);
        }}
        placeholder="نام کاربری یا شماره موبایل"
        disabled={busy}
        className="w-full border rounded-xl p-3"
        dir="ltr"
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          placeholder="رمز عبور"
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
          <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={busy}
            className="size-4 accent-primary"
          />
          <span>مرا به خاطر بسپار</span>
        </label>

        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={busy}
          className="text-sm text-primary hover:opacity-80 disabled:opacity-50"
        >
          {forgotLoading ? "در حال ارسال..." : "فراموشی رمز عبور"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        onClick={handleLogin}
        disabled={busy}
        className={[
          "w-full py-3 rounded-xl text-white transition",
          !busy ? "bg-primary hover:opacity-90" : "bg-slate-300",
        ].join(" ")}
      >
        {loading ? "در حال ورود..." : "ورود"}
      </button>
    </div>
  );
}
