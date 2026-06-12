import Image from "next/image";
import React, { useEffect, useState } from "react";
import StepMobile from "./StepMobile";
import StepMethod from "./StepMethod";
import StepOtp from "./StepOtp";
import StepRegister from "./StepRegister";
import StepForgot from "./StepForgot";
import StepReset from "./StepReset";
import LoginWithPass from "./LoginWithPass";

export default function LoginModal({ open, onClose }) {
  const [step, setStep] = useState(2);
  const [mobile, setMobile] = useState("");
  const [flow, setFlow] = useState(""); // 'otp-login', 'password-login', 'forgot-password
  const [otpCode, setOtpCode] = useState("");

  const handleOtpVerify = async (code) => {
    if (!code || code.length !== 4) {
      return;
    }

    setOtpCode(code);

    if (flow === "forgot-password") {
      setStep(6);
      return;
    }

    if (flow === "otp-login") {
      // اینجا باید پاسخ واقعی API باشد
      const isRegistered = false;

      if (isRegistered) {
        onClose();
      } else {
        setStep(4);
      }
    }
  };

  // هر بار که prop 'open' تغییر کرد، این کد اجرا می‌شود
  useEffect(() => {
    if (open) {
      setStep(1); // بازگشت به مرحله اول
      setMobile(""); // پاک کردن شماره موبایل قبلی
    }
  }, [open]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="LoginModalTitle"
      className="modal  fixed inset-0 z-50 overflow-auto backdrop-blur bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-lg m-auto flex items-center min-h-screen">
        <div className="bg-white relative w-full dark:bg-custom-dark rounded-2xl shadow-soft p-8 border border-gray-100 dark:border-gray-700 fade-in">
          {/* <!--close button--> */}
          <button onClick={onClose} className="absolute p-4 top-0 end-0">
            <i className="far fa-x"></i>
          </button>

          {/* <!-- logo --> */}
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

          {/* <!-- Step Indicators --> */}
          <div className="flex justify-center mb-6">
            <span className="step-indicator active" data-step="1"></span>
            <span className="step-indicator" data-step="2"></span>
            <span className="step-indicator" data-step="3"></span>
            <span className="step-indicator" data-step="4"></span>
          </div>

          {/* <!-- Title --> */}
          <div className="text-center mb-8">
            <h2
              className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2"
              id="step-title"
            >
              ورود / ثبت نام
            </h2>
            <p
              className="text-gray-500 dark:text-gray-400 text-sm"
              id="step-description"
            >
              برای ثبت نام یا ورود، شماره موبایل خود را وارد کنید
            </p>
          </div>

          {/* <!-- Step 1: Login Method Selection --> */}
          {step === 1 && (
            <StepMethod
              onOtp={() => {
                setFlow("otp-login");
                setStep(2);
              }}
              onPassword={() => setStep(7)}
              onForgot={() => {
                setFlow("forgot-password");
                setStep(2);
              }}
            />
          )}

          {/* <!-- Step 2: Mobile Number Input --> */}
          {step === 2 && (
            <StepMobile
              mobile={mobile}
              setMobile={setMobile}
              onNext={() => setStep(3)}
            />
          )}

          {/* <!-- Step 3: OTP Verification --> */}
          {step === 3 && (
            <StepOtp
              mobile={mobile}
              onVerify={handleOtpVerify}
              onBack={() => setStep(2)}
            />
          )}

          {/* <!-- Step 4: New User Registration --> */}
          {step === 4 && <StepRegister />}

          {/* <!-- Step 5: Forgot Password --> */}
          {step === 5 && (
            <StepForgot
              mobile={mobile}
              onNext={() => setStep(6)}
              onBack={() => setStep(2)}
            />
          )}

          {/* <!-- Step 6: Set New Password --> */}
          {step === 6 && <StepReset />}

          {/* <!-- Step 7: Login With User Pass --> */}
          {step === 7 && <LoginWithPass />}
        </div>
      </div>
    </div>
  );
}
