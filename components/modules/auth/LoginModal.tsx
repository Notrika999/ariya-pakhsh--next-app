"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import StepMobile from "./StepMobile";
import StepMethod from "./StepMethod";
import StepOtp from "./StepOtp";
import StepRegister from "./StepRegister";
import StepReset from "./StepReset";
import LoginWithPass from "./LoginWithPass";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");

  const user = useAuthStore((s) => s.user);
  const authOtpMode = useAuthStore((s) => s.authOtpMode);
  const passwordResetMaskedDestination = useAuthStore(
    (s) => s.passwordResetMaskedDestination,
  );
  const clearLoginTwoFactorFlow = useAuthStore((s) => s.clearLoginTwoFactorFlow);
  const clearPasswordResetFlow = useAuthStore((s) => s.clearPasswordResetFlow);
  const { clearAuthFlow } = useAuthStore();

  useEffect(() => {
    if (open) {
      queueMicrotask(() => {
        setStep(1);
        setMobile("");
        clearAuthFlow();
      });
    }
  }, [open, clearAuthFlow]);

  if (!open) return null;

  const title = user
    ? `سلام ${user.displayName || [user.firstName, user.lastName].filter(Boolean).join(" ")}`
    : step === 4
      ? "تکمیل ثبت‌نام"
      : step === 6
        ? "بازیابی رمز عبور"
        : step === 7
          ? "ورود با رمز عبور"
          : "ورود / ثبت‌نام";

  const subtitle =
    step === 1
      ? "روش ورود را انتخاب کنید"
      : step === 2
        ? "شماره موبایل خود را وارد کنید"
        : step === 3
          ? authOtpMode === "login-2fa"
            ? "کد احراز دومرحله‌ای ارسال‌شده را وارد کنید"
            : "کد تأیید ارسال‌شده را وارد کنید"
          : step === 4
            ? "اطلاعات خود را تکمیل کنید"
            : step === 6
              ? passwordResetMaskedDestination
                ? `کد ارسال‌شده به ${passwordResetMaskedDestination} و رمز جدید را وارد کنید`
                : "کد تأیید و رمز عبور جدید را وارد کنید"
              : step === 7
                ? "نام کاربری و رمز عبور خود را وارد کنید"
                : "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="LoginModalTitle"
      className="modal fixed inset-0 z-50 overflow-auto backdrop-blur bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-lg m-auto flex items-center min-h-screen">
        <div className="bg-white relative w-full dark:bg-custom-dark rounded-2xl shadow-soft p-8 border border-gray-100 dark:border-gray-700 fade-in">
          <button onClick={onClose} className="absolute p-4 top-0 inset-e-0">
            <i className="far fa-x"></i>
          </button>

          <div className="flex items-center mb-5 justify-center">
            <Image
              width={80}
              height={80}
              className="h-12 dark:invert dark:hue-rotate-180"
              src="/images/logo/carup24-logo.png"
              loading="lazy"
              alt="کارآپ ۲۴"
            />
          </div>

          <div className="flex justify-center mb-6">
            {[1, 2, 3, 4].map((s) => (
              <span
                key={s}
                className={`step-indicator${step === s ? " active" : ""}`}
                data-step={s}
              />
            ))}
          </div>

          <div className="text-center mb-8">
            <h2
              className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2"
              id="LoginModalTitle"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {subtitle}
              </p>
            )}
          </div>

          {step === 1 && (
            <StepMethod
              onOtp={() => {
                setStep(2);
              }}
              onPassword={() => setStep(7)}
              onForgot={() => setStep(7)}
            />
          )}

          {step === 2 && (
            <StepMobile
              mobile={mobile}
              setMobile={setMobile}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <StepOtp
              onSuccess={(isNewUser: boolean) => {
                if (isNewUser) {
                  setStep(4);
                } else {
                  onClose();
                }
              }}
              onBack={() => {
                if (authOtpMode === "login-2fa") {
                  clearLoginTwoFactorFlow();
                  setStep(7);
                  return;
                }
                setStep(2);
              }}
            />
          )}

          {step === 4 && <StepRegister onSuccess={onClose} />}

          {step === 6 && (
            <StepReset
              onSuccess={() => {
                clearPasswordResetFlow();
                setStep(7);
              }}
              onBack={() => {
                clearPasswordResetFlow();
                setStep(7);
              }}
            />
          )}

          {step === 7 && (
            <LoginWithPass
              onSuccess={onClose}
              onRequiresTwoFactor={() => setStep(3)}
              onForgotSuccess={() => setStep(6)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
