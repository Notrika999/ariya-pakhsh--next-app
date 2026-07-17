// components/modules/auth/StepRegister.tsx
"use client";
import React, { useState } from "react";

import { useAuthStore } from "@/src/lib/stores/auth/auth.store";
import {
  attachSessionToUser,
  completeUserFromMe,
  getAuthErrorMessage,
  register,
} from "@/src/services/auth/auth.client";
import { ApiError } from "@/src/lib/http/api-client";

interface StepRegisterProps {
  onSuccess: () => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface FieldProps {
  label: string;
  field: keyof FormState;
  type?: string;
  value: string;
  error?: string;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suffix?: React.ReactNode;
  autoComplete?: string;
  required?: boolean;
  optional?: boolean;
  preventAutofill?: boolean;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function StepRegister({ onSuccess }: StepRegisterProps) {
  const { registrationToken, deviceFingerPrint, setUser, clearAuthFlow } =
    useAuthStore();

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
        general: undefined,
      }));
    };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.firstName.trim()) newErrors.firstName = "نام الزامی است";
    if (!form.lastName.trim()) newErrors.lastName = "نام خانوادگی الزامی است";
    if (form.email.trim() && !emailRegex.test(form.email.trim())) {
      newErrors.email = "فرمت ایمیل صحیح نیست";
    }
    if (!form.password) {
      newErrors.password = "رمز عبور الزامی است";
    } else if (form.password.length < 8) {
      newErrors.password = "رمز عبور باید حداقل ۸ کاراکتر باشد";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "تکرار رمز عبور الزامی است";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "رمز عبور و تکرار آن یکسان نیستند";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!registrationToken) {
      console.error("[StepRegister] missing registrationToken", {
        hasDeviceFingerPrint: Boolean(deviceFingerPrint),
      });
      setErrors({ general: "توکن ثبت‌نام معتبر نیست. لطفاً دوباره تلاش کنید" });
      return;
    }

    setLoading(true);
    setErrors({});

    console.log("[StepRegister] submit start", {
      hasRegistrationToken: Boolean(registrationToken),
      registrationTokenPreview: `${registrationToken.slice(0, 8)}…`,
      deviceFingerPrint: deviceFingerPrint
        ? `${deviceFingerPrint.slice(0, 12)}…`
        : null,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim() || null,
      passwordLength: form.password.length,
    });

    try {
      const result = await register({
        registrationToken,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        deviceFingerPrint: deviceFingerPrint ?? "device-id",
      });

      console.log("[StepRegister] register result", {
        success: result.success,
        errorMessage: result.errorMessage,
        errorCode: result.errorCode,
        hasUserInfo: Boolean(result.userInfoDto),
        hasSessionInfo: Boolean(result.sessionInfoDto),
        userId: result.userInfoDto?.userId ?? result.userInfoDto?.id ?? null,
      });

      if (!result.success) {
        setErrors({ general: result.errorMessage ?? "خطایی رخ داد" });
        return;
      }

      if (!result.userInfoDto) {
        console.error("[StepRegister] missing userInfoDto in register result", result);
        setErrors({ general: "اطلاعات کاربر از سرور دریافت نشد" });
        return;
      }

      const freshUser = await completeUserFromMe(result.userInfoDto);
      console.log("[StepRegister] completeUserFromMe done", {
        userId: freshUser.userId ?? freshUser.id ?? null,
        hasBirthDate: Boolean(freshUser.birthDate),
      });

      setUser(attachSessionToUser(freshUser, result.sessionInfoDto));
      clearAuthFlow();
      onSuccess();
    } catch (err: unknown) {
      console.error("[StepRegister] submit failed", {
        isApiError: err instanceof ApiError,
        name: err instanceof Error ? err.name : typeof err,
        message: err instanceof Error ? err.message : String(err),
        ...(err instanceof ApiError
          ? {
              status: err.status,
              code: err.code,
              data: err.data,
              original:
                err.original && typeof err.original === "object"
                  ? {
                      name: (err.original as Error).name,
                      message: (err.original as Error).message,
                      code: (err.original as { code?: string }).code,
                    }
                  : err.original,
            }
          : { raw: err }),
      });

      if (err instanceof ApiError) {
        const data = err.data as
          | {
              errors?: { field?: string; message?: string }[];
              data?: { errors?: { field?: string; message?: string }[] };
            }
          | undefined;
        const serverErrors = data?.errors ?? data?.data?.errors;
        if (Array.isArray(serverErrors) && serverErrors.length > 0) {
          const mapped: FormErrors = {};
          serverErrors.forEach(({ field, message }) => {
            if (!field || !message) return;
            const key = field.charAt(0).toLowerCase() + field.slice(1);
            if (key in form) mapped[key as keyof FormState] = message;
          });
          if (Object.keys(mapped).length > 0) {
            setErrors(mapped);
            return;
          }
        }
      }

      setErrors({ general: getAuthErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="space-y-3"
      dir="rtl"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
      noValidate
    >
      <Field
        label="نام"
        field="firstName"
        value={form.firstName}
        error={errors.firstName}
        loading={loading}
        onChange={handleChange("firstName")}
        autoComplete="given-name"
        required
      />
      <Field
        label="نام خانوادگی"
        field="lastName"
        value={form.lastName}
        error={errors.lastName}
        loading={loading}
        onChange={handleChange("lastName")}
        autoComplete="family-name"
        required
      />
      <Field
        label="ایمیل"
        field="email"
        type="email"
        value={form.email}
        error={errors.email}
        loading={loading}
        onChange={handleChange("email")}
        autoComplete="off"
        optional
        preventAutofill
      />
      <Field
        label="رمز عبور"
        field="password"
        type={showPass ? "text" : "password"}
        value={form.password}
        error={errors.password}
        loading={loading}
        onChange={handleChange("password")}
        autoComplete="new-password"
        required
        suffix={
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            tabIndex={-1}
          >
            <i
              className={`far ${showPass ? "fa-eye-slash" : "fa-eye"} text-sm`}
            />
          </button>
        }
      />
      <Field
        label="تکرار رمز عبور"
        field="confirmPassword"
        type={showConfirm ? "text" : "password"}
        value={form.confirmPassword}
        error={errors.confirmPassword}
        loading={loading}
        onChange={handleChange("confirmPassword")}
        autoComplete="new-password"
        required
        suffix={
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            tabIndex={-1}
          >
            <i
              className={`far ${showConfirm ? "fa-eye-slash" : "fa-eye"} text-sm`}
            />
          </button>
        }
      />

      {errors.general && (
        <p className="text-red-500 text-sm text-center">{errors.general}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={[
          "w-full py-3 rounded-xl text-white transition",
          !loading
            ? "bg-primary hover:opacity-90"
            : "bg-slate-300 cursor-not-allowed",
        ].join(" ")}
      >
        {loading ? "در حال ثبت‌نام..." : "ثبت‌نام و ورود"}
      </button>
    </form>
  );
}

function Field({
  label,
  field,
  type = "text",
  value,
  error,
  loading,
  onChange,
  suffix,
  autoComplete = "off",
  required = false,
  optional = false,
  preventAutofill = false,
}: FieldProps) {
  const inputId = `register-${field}`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm text-gray-500">
        {label}
        {optional ? (
          <span className="text-gray-400"> (اختیاری)</span>
        ) : (
          <span className="text-red-500"> *</span>
        )}
      </label>
      <div className="relative">
        <input
          id={inputId}
          name={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={optional ? `${label} (اختیاری)` : label}
          disabled={loading}
          autoComplete={autoComplete}
          required={required}
          readOnly={preventAutofill}
          onFocus={
            preventAutofill
              ? (e) => e.currentTarget.removeAttribute("readonly")
              : undefined
          }
          aria-required={required}
          className={[
            "w-full border rounded-xl p-3 outline-none transition pr-3",
            suffix ? "pl-10" : "",
            error
              ? "border-red-400 bg-red-50"
              : "border-gray-300 focus:border-primary dark:bg-custom-dark dark:border-gray-700",
            loading ? "opacity-50 cursor-not-allowed" : "",
          ].join(" ")}
          dir={field === "email" ? "ltr" : "rtl"}
        />
        {suffix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-red-500 text-xs text-right">{error}</p>}
    </div>
  );
}
