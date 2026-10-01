"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import BrandLogo from "@/components/modules/BrandLogo/BrandLogo";
import LoginWithPass from "@/components/modules/auth/LoginWithPass";
import StepMethod from "@/components/modules/auth/StepMethod";
import StepMobile from "@/components/modules/auth/StepMobile";
import StepOtp from "@/components/modules/auth/StepOtp";
import StepRegister from "@/components/modules/auth/StepRegister";
import StepReset from "@/components/modules/auth/StepReset";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");

  const authOtpMode = useAuthStore((s) => s.authOtpMode);
  const passwordResetMaskedDestination = useAuthStore(
    (s) => s.passwordResetMaskedDestination,
  );
  const clearLoginTwoFactorFlow = useAuthStore((s) => s.clearLoginTwoFactorFlow);
  const clearPasswordResetFlow = useAuthStore((s) => s.clearPasswordResetFlow);

  const returnTo = useMemo(() => {
    const value = searchParams.get("returnTo");
    return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
  }, [searchParams]);

  const handleSuccess = () => {
    router.replace(returnTo);
  };

  const title =
    step === 4
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
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-custom-dark">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-lg items-center">
        <div className="w-full rounded-2xl border border-gray-100 bg-white p-8 shadow-soft dark:border-gray-700 dark:bg-custom-dark">
          <div className="mb-5 flex items-center justify-center">
            <BrandLogo
              logoClassName="h-12 w-12"
              textClassName="h-9"
              priority
            />
          </div>

          <div className="mb-6 flex justify-center">
            {[1, 2, 3, 4].map((s) => (
              <span
                key={s}
                className={`step-indicator${step === s ? " active" : ""}`}
                data-step={s}
              />
            ))}
          </div>

          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>

          {step === 1 && (
            <StepMethod
              onOtp={() => setStep(2)}
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
                  return;
                }

                handleSuccess();
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

          {step === 4 && <StepRegister onSuccess={handleSuccess} />}

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
              onSuccess={handleSuccess}
              onRequiresTwoFactor={() => setStep(3)}
              onForgotSuccess={() => setStep(6)}
            />
          )}
        </div>
      </section>
    </main>
  );
}
