"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import StepMobile from "./StepMobile";
import StepMethod from "./StepMethod";
import StepOtp from "./StepOtp";
import StepRegister from "./StepRegister";
import StepForgot from "./StepForgot";
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
  const clearLoginTwoFactorFlow = useAuthStore((s) => s.clearLoginTwoFactorFlow);

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="LoginModalTitle"
      className="modal fixed inset-0 z-50 overflow-auto backdrop-blur bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-lg m-auto flex items-center min-h-screen">
        <div className="bg-white relative w-full dark:bg-custom-dark rounded-2xl shadow-soft p-8 border border-gray-100 dark:border-gray-700 fade-in">
          {/* close button */}
          <button onClick={onClose} className="absolute p-4 top-0 inset-e-0">
            <i className="far fa-x"></i>
          </button>

          {/* logo */}
          <div className="flex items-center mb-5 justify-center">
            <Image
              width={125}
              height={125}
              className="h-12 dark:invert"
              src="/images/logo.png"
              loading="lazy"
              alt=""
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center mb-6">
            {[1, 2, 3, 4].map((s) => (
              <span
                key={s}
                className={`step-indicator${step === s ? " active" : ""}`}
                data-step={s}
              />
            ))}
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2
              className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2"
              id="LoginModalTitle"
            >
              {user
                ? `سلام ${user.displayName || [user.firstName, user.lastName].filter(Boolean).join(" ")}`
                : step === 4
                  ? "تکمیل ثبت‌نام"
                  : "ورود / ثبت‌نام"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {step === 1 && "روش ورود را انتخاب کنید"}
              {step === 2 && "شماره موبایل خود را وارد کنید"}
              {step === 3 &&
                (authOtpMode === "login-2fa"
                  ? "کد احراز دومرحله‌ای ارسال‌شده را وارد کنید"
                  : "کد تأیید ارسال‌شده را وارد کنید")}
              {step === 4 && "اطلاعات خود را تکمیل کنید"}
            </p>
          </div>

          {/* Step 1: روش ورود */}
          {step === 1 && (
            <StepMethod
              onOtp={() => {
                setStep(2);
              }}
              onPassword={() => setStep(7)}
              onForgot={() => {
                setStep(2);
              }}
            />
          )}

          {/* Step 2: شماره موبایل */}
          {step === 2 && (
            <StepMobile
              mobile={mobile}
              setMobile={setMobile}
              onNext={() => setStep(3)}
            />
          )}

          {/* Step 3: OTP */}
          {step === 3 && (
            <StepOtp
              onSuccess={(isNewUser: boolean) => {
                if (isNewUser) {
                  // کاربر جدید → ثبت‌نام
                  setStep(4);
                } else {
                  // کاربر قدیمی → لاگین شد
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

          {/* Step 4: ثبت‌نام کاربر جدید */}
          {step === 4 && <StepRegister onSuccess={onClose} />}

          {/* Step 5: Forgot Password */}
          {step === 5 && (
            <StepForgot
              mobile={mobile}
              onNext={() => setStep(6)}
              onBack={() => setStep(2)}
            />
          )}

          {/* Step 6: Set New Password */}
          {step === 6 && <StepReset />}

          {/* Step 7: Login With Pass */}
          {step === 7 && (
            <LoginWithPass
              onSuccess={onClose}
              onRequiresTwoFactor={() => setStep(3)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
