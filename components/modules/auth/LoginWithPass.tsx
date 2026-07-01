"use client";
// components/modules/auth/LoginWithPass.tsx
import React, { useState } from "react";
import {
  attachSessionToUser,
  completeUserFromMe,
  getAuthErrorMessage,
  loginWithPassword,
} from "@/src/services/auth/auth.client";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";
import { getBrowserFingerprint } from "@/src/lib/helper/fingerprint";

interface LoginWithPassProps {
  onSuccess: () => void;
  onRequiresTwoFactor: () => void;
}

export default function LoginWithPass({
  onSuccess,
  onRequiresTwoFactor,
}: LoginWithPassProps) {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoginTwoFactorFlow = useAuthStore((s) => s.setLoginTwoFactorFlow);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [deviceFingerPrint, setDeviceFingerPrint] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
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
      console.log("[LoginWithPass] login =>", {
        username: username.trim(),
        rememberMe,
      });

      const result = await loginWithPassword({
        username: username.trim(),
        password,
        rememberMe,
        deviceFingerPrint: fingerprint,
      });

      console.log("[LoginWithPass] login result =>", {
        success: result.success,
        requiresTwoFactor: result.requiresTwoFactor,
        hasTwoFactorToken: Boolean(result.twoFactorToken),
        otpSentTo: result.otpSentTo,
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
        console.log("[LoginWithPass] redirecting to OTP step for 2FA");
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

  return (
    <div className="space-y-3" dir="rtl">
      <input
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setError(null);
        }}
        placeholder="نام کاربری یا شماره موبایل"
        disabled={loading}
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
          disabled={loading}
          className="w-full border rounded-xl p-3 pl-11"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          disabled={loading}
          aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 select-none">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          disabled={loading}
          className="size-4 accent-primary"
        />
        <span>مرا به خاطر بسپار</span>
      </label>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        onClick={handleLogin}
        disabled={loading}
        className={[
          "w-full py-3 rounded-xl text-white transition",
          !loading ? "bg-primary hover:opacity-90" : "bg-slate-300",
        ].join(" ")}
      >
        {loading ? "در حال ورود..." : "ورود"}
      </button>
    </div>
  );
}
