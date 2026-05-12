"use client";


import React, { useState } from "react";
import Image from "next/image";
import MobileLogin from "@/components/ui/auth/MobileLogin";
import OTPVerification from "@/components/ui/auth/OTPVerification";

function LoginPage() {
  const [step, setStep] = useState(1);
  return (
    <div className="relative bg-gray-100 dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen flex flex-col">
      |
      <main className="grow container mx-auto px-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="max-w-md mx-auto min-h-screen justify-center flex items-center">
          <div className="bg-white relative w-full dark:bg-custom-dark rounded-2xl shadow-soft p-8 border border-gray-100 dark:border-gray-700 fade-in">
            {/* <!-- logo --> */}
            <div className="flex items-center mb-5 justify-center">
              <Image
                width={124}
                height={48}
                className="h-12 dark:invert"
                src="/images/logo.png"
                loading="lazy"
                alt=""
              />
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

            {step === 1 && <MobileLogin onContinue={() => setStep(2)} />}

            {step === 2 && <OTPVerification />}

            {/* <!-- Step 2: Login Method Selection --> */}
            {/* <div className="form-step" id="step-2 ">
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setLoginWidthPassword(true)}
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white dark:bg-custom-dark dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1f242c] transition-colors"
                >
                  ورود با رمز عبور
                </button>

                {loginWidthPassword && <LoginWidthPassword />}
              </div>
            </div> */}

            {/* <!-- Step 4: New User Registration --> */}
            {/* <UserRegistration /> */}

            {/* <!-- Step 5: Forgot Password --> */}
            {/* <ForgotPassword /> */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
