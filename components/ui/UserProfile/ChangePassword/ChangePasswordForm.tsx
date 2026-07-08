"use client";
// components/ui/UserProfile/ChangePassword/ChangePasswordForm.tsx
import React, { useState } from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";
import {
  changePassword,
  getAuthErrorMessage,
  startChangePasswordOtp,
} from "@/src/services/auth/auth.client";
import { notify } from "@/src/utils/toast";
import { FieldError } from "@/src/utils/form.validation";

type FormStep = "credentials" | "otp";

type FieldErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  otpCode?: string;
};

export default function ChangePasswordForm() {
  const [step, setStep] = useState<FormStep>("credentials");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [verificationToken, setVerificationToken] = useState<string | null>(
    null,
  );
  const [otpSentTo, setOtpSentTo] = useState<string | null>(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [rulesState, setRulesState] = useState<Record<string, boolean>>({});
  const [progressColor, setProgressColor] = useState("bg-red-500");
  const [progressPercent, setProgressPercent] = useState("0%");
  const [matchMessage, setMatchMessage] = useState("");
  const [passwordMatchColor, setPasswordMatchColor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const passwordRules = {
    minLength: {
      label: "حداقل ۸ کاراکتر",
      test: (v: string) => v.length >= 8,
    },
    upperLower: {
      label: "شامل حروف بزرگ و کوچک",
      test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v),
    },
    number: {
      label: "شامل حداقل یک عدد",
      test: (v: string) => /\d/.test(v),
    },
    symbol: {
      label: "شامل حداقل یک نماد",
      test: (v: string) => /[^A-Za-z0-9]/.test(v),
    },
  };

  function evaluatePassword(password: string) {
    const resultObject = {} as Record<string, boolean>;

    Object.keys(passwordRules).forEach((key) => {
      const rule = passwordRules[key as keyof typeof passwordRules];
      resultObject[key] = rule.test(password);
    });

    const count = Object.values(resultObject).filter(Boolean).length;
    const percentage = (count / 4) * 100;

    let color = "bg-red-500";
    if (count === 2) color = "bg-orange-400";
    if (count === 3) color = "bg-yellow-400";
    if (count === 4) color = "bg-green-500";

    return { resultObject, percentage, color };
  }

  const updateMatchMessage = (confirmValue: string, newValue: string) => {
    if (!confirmValue) {
      setMatchMessage("");
      setPasswordMatchColor("");
      return;
    }

    if (confirmValue === newValue) {
      setMatchMessage("رمز عبور مطابقت دارد");
      setPasswordMatchColor("text-green-500");
    } else {
      setMatchMessage("رمز عبور مطابقت ندارد");
      setPasswordMatchColor("text-red-500");
    }
  };

  const handleNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setError(null);

    const { resultObject, percentage, color } = evaluatePassword(value);
    setRulesState(resultObject);
    setProgressPercent(`${percentage}%`);
    setProgressColor(color);
    updateMatchMessage(confirmPassword, value);
  };

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setError(null);
    updateMatchMessage(value, newPassword);
  };

  const validateCredentials = () => {
    const nextErrors: FieldErrors = {};

    if (!currentPassword) {
      nextErrors.currentPassword = "رمز عبور فعلی الزامی است";
    }

    if (!newPassword) {
      nextErrors.newPassword = "رمز عبور جدید الزامی است";
    } else {
      const { resultObject } = evaluatePassword(newPassword);
      if (!Object.values(resultObject).every(Boolean)) {
        setRulesState(resultObject);
        nextErrors.newPassword = "رمز عبور جدید شرایط لازم را ندارد";
      } else if (currentPassword && currentPassword === newPassword) {
        nextErrors.newPassword = "رمز عبور جدید نباید با رمز فعلی یکسان باشد";
      }
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "تکرار رمز عبور الزامی است";
    } else if (confirmPassword !== newPassword) {
      setMatchMessage("رمز عبور مطابقت ندارد");
      setPasswordMatchColor("text-red-500");
      nextErrors.confirmPassword = "تکرار رمز عبور مطابقت ندارد";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setStep("credentials");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOtpCode("");
    setVerificationToken(null);
    setOtpSentTo(null);
    setRulesState({});
    setProgressPercent("0%");
    setProgressColor("bg-red-500");
    setMatchMessage("");
    setPasswordMatchColor("");
    setError(null);
    setFieldErrors({});
  };

  const handleStartOtp = async () => {
    if (!validateCredentials()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await startChangePasswordOtp({ currentPassword });

      if (result.success === false) {
        setError(
          result.errorMessage ?? result.message ?? "ارسال کد تأیید ناموفق بود",
        );
        return;
      }

      if (!result.verificationToken) {
        setError("توکن تأیید از سرور دریافت نشد");
        return;
      }

      setVerificationToken(result.verificationToken);
      setOtpSentTo(result.otpSentTo ?? null);
      setStep("otp");
      notify.success(
        result.otpSentTo
          ? `کد تأیید به ${result.otpSentTo} ارسال شد`
          : "کد تأیید ارسال شد",
      );
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmChange = async () => {
    if (!verificationToken) {
      setError("جلسه تأیید معتبر نیست. لطفاً دوباره تلاش کنید");
      setStep("credentials");
      return;
    }

    const code = otpCode.trim();
    if (!code) {
      setFieldErrors({ otpCode: "کد تأیید الزامی است" });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await changePassword({
        verificationToken,
        otpCode: code,
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (result.success === false) {
        setError(
          result.errorMessage ?? result.message ?? "تغییر رمز عبور ناموفق بود",
        );
        return;
      }

      notify.success(result.message ?? "رمز عبور با موفقیت تغییر کرد");
      resetForm();
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "credentials") {
      await handleStartOtp();
      return;
    }
    await handleConfirmChange();
  };

  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <TitleAfter title="فرم تغییر رمز عبور" tag={false} />

      <form
        id="change-password-form"
        className="space-y-6"
        onSubmit={handleSubmit}
        noValidate
      >
        {step === "credentials" ? (
          <>
            <div>
              <label
                htmlFor="current-password"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                رمز عبور فعلی <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setError(null);
                    clearFieldError("currentPassword");
                  }}
                  disabled={loading}
                  className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 dark:bg-zinc-800 dark:text-white ${
                    fieldErrors.currentPassword
                      ? "border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-950/20"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="رمز عبور فعلی خود را وارد کنید"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((v) => !v)}
                  disabled={loading}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label={
                    showCurrentPassword
                      ? "مخفی کردن رمز عبور فعلی"
                      : "نمایش رمز عبور فعلی"
                  }
                >
                  <i
                    className={`${
                      showCurrentPassword
                        ? "fa-regular fa-eye-slash"
                        : "fa-regular fa-eye"
                    } text-lg text-[#BCC1C8]`}
                  />
                </button>
              </div>
              <FieldError message={fieldErrors.currentPassword} />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                رمز عبور جدید <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    handleNewPassword(e);
                    clearFieldError("newPassword");
                  }}
                  disabled={loading}
                  className={`w-full rounded-lg border px-4 py-3 dark:bg-zinc-800 dark:text-white ${
                    fieldErrors.newPassword
                      ? "border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-950/20"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="رمز عبور جدید"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  disabled={loading}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label={
                    showNewPassword
                      ? "مخفی کردن رمز عبور جدید"
                      : "نمایش رمز عبور جدید"
                  }
                >
                  <i
                    className={`${
                      showNewPassword
                        ? "fa-regular fa-eye-slash"
                        : "fa-regular fa-eye"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-3">
                <div className="mb-1 flex justify-between">
                  <span className="text-xs text-gray-500">
                    سطح امنیت رمز عبور
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`${progressColor} h-2 rounded-full transition-all`}
                    style={{ width: progressPercent }}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-1 text-xs">
                {Object.keys(passwordRules).map((key) => {
                  const rule = passwordRules[key as keyof typeof passwordRules];
                  const passed = rulesState[key];
                  return (
                    <div key={key} className="flex items-center">
                      {passed ? (
                        <i className="fa-solid fa-check ml-1 text-green-500" />
                      ) : (
                        <i className="fa-solid fa-xmark ml-1 text-red-500" />
                      )}
                      {rule.label}
                    </div>
                  );
                })}
              </div>

              <FieldError message={fieldErrors.newPassword} />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                تکرار رمز عبور جدید <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    handleConfirmPassword(e);
                    clearFieldError("confirmPassword");
                  }}
                  disabled={loading}
                  className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 dark:bg-zinc-800 dark:text-white ${
                    fieldErrors.confirmPassword
                      ? "border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-950/20"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="رمز عبور جدید خود را مجدداً وارد کنید"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  disabled={loading}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label={
                    showConfirmPassword
                      ? "مخفی کردن تکرار رمز عبور"
                      : "نمایش تکرار رمز عبور"
                  }
                >
                  <i
                    className={`${
                      showConfirmPassword
                        ? "fa-regular fa-eye-slash"
                        : "fa-regular fa-eye"
                    } text-lg`}
                  />
                </button>
              </div>
              <FieldError message={fieldErrors.confirmPassword} />
              {!fieldErrors.confirmPassword && matchMessage && (
                <div className={`mt-2 text-xs ${passwordMatchColor}`}>
                  {matchMessage}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-primary/5 p-4 text-sm text-gray-700 dark:text-gray-300">
              {otpSentTo
                ? `کد تأیید به ${otpSentTo} ارسال شد. لطفاً کد را وارد کنید.`
                : "کد تأیید ارسال شد. لطفاً کد را وارد کنید."}
            </div>

            <div>
              <label
                htmlFor="otp-code"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                کد تأیید <span className="text-red-500">*</span>
              </label>
              <input
                id="otp-code"
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 8));
                  setError(null);
                  clearFieldError("otpCode");
                }}
                disabled={loading}
                inputMode="numeric"
                autoComplete="one-time-code"
                className={`w-full rounded-lg border px-4 py-3 text-center tracking-widest focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 dark:bg-zinc-800 dark:text-white ${
                  fieldErrors.otpCode
                    ? "border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-950/20"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="کد ارسال‌شده"
                dir="ltr"
              />
              <FieldError message={fieldErrors.otpCode} />
            </div>
          </div>
        )}

        {error && (
          <p className="text-center text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-col border-t border-gray-200 pt-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-800 transition hover:bg-gray-300 active:scale-95 disabled:opacity-60 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              انصراف
            </button>

            {step === "otp" && (
              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setOtpCode("");
                  setVerificationToken(null);
                  setError(null);
                }}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-zinc-800"
              >
                بازگشت
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary/90 active:scale-95 disabled:opacity-60"
            >
              <i className="fa-solid fa-check ml-2 text-base" />
              {loading
                ? step === "credentials"
                  ? "در حال ارسال کد..."
                  : "در حال تغییر رمز..."
                : step === "credentials"
                  ? "ارسال کد تأیید"
                  : "تأیید و تغییر رمز"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
