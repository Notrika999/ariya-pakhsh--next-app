"use client";
import React, { useState } from "react";

import { useAuthStore } from "@/src/lib/stores/auth/auth.store";
import { register } from "@/src/services/auth/auth.service";

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

// 👇 کامپوننت Field بیرون از StepRegister
interface FieldProps {
  label: string;
  field: keyof FormState;
  type?: string;
  value: string;
  error?: string;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suffix?: React.ReactNode;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function StepRegister({ onSuccess }: StepRegisterProps) {
  const { registrationToken, setSession, clearAuthFlow } = useAuthStore();

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
    if (!form.email.trim()) {
      newErrors.email = "ایمیل الزامی است";
    } else if (!emailRegex.test(form.email)) {
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
      setErrors({ general: "توکن ثبت‌نام معتبر نیست. لطفاً دوباره تلاش کنید" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await register({
        registrationToken,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        deviceFingerPrint: "device-id",
      });

      if (!result.success) {
        setErrors({ general: result.errorMessage ?? "خطایی رخ داد" });
        return;
      }

      // ذخیره session در store
      setSession(result.accessToken, result.refreshToken, result.userInfoDto);
      clearAuthFlow();
      onSuccess();
    } catch (err: any) {
      // خطاهای field-level از server
      const serverErrors = err?.response?.data?.errors as
        | { field: string; message: string }[]
        | undefined;
      if (serverErrors?.length) {
        const mapped: FormErrors = {};
        serverErrors.forEach(({ field, message }) => {
          const key = field.charAt(0).toLowerCase() + field.slice(1);
          if (key in form) mapped[key as keyof FormState] = message;
        });
        setErrors(mapped);
      } else {
        const msg =
          err?.response?.data?.data?.errorMessage ??
          err?.response?.data?.message ??
          "ارتباط با سرور برقرار نشد";
        setErrors({ general: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3" dir="rtl">
      <Field
        label="نام"
        field="firstName"
        value={form.firstName}
        error={errors.firstName}
        loading={loading}
        onChange={handleChange("firstName")}
      />
      <Field
        label="نام خانوادگی"
        field="lastName"
        value={form.lastName}
        error={errors.lastName}
        loading={loading}
        onChange={handleChange("lastName")}
      />
      <Field
        label="ایمیل"
        field="email"
        type="email"
        value={form.email}
        error={errors.email}
        loading={loading}
        onChange={handleChange("email")}
      />
      <Field
        label="رمز عبور"
        field="password"
        type={showPass ? "text" : "password"}
        value={form.password}
        error={errors.password}
        loading={loading}
        onChange={handleChange("password")}
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
        onClick={handleSubmit}
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
    </div>
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
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={label}
          disabled={loading}
          className={[
            "w-full border rounded-xl p-3 outline-none transition pr-3",
            suffix ? "pl-10" : "",
            error
              ? "border-red-400 bg-red-50"
              : "border-gray-300 focus:border-primary",
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
