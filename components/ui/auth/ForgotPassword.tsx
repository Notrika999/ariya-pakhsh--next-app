import React from "react";

export default function ForgotPassword() {
  return (
    <div className="form-step" id="step-5">
      <form className="space-y-5">
        <div className="text-center mb-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            برای بازیابی رمز عبور، کد تایید به شماره{" "}
            <strong id="forgotPasswordMobile">09******123</strong> ارسال خواهد
            شد.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            id="backFromForgotPassword"
            className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-custom-dark hover:bg-gray-50 dark:hover:bg-[#1f242c] transition-colors"
          >
            بازگشت
          </button>
          <button
            type="button"
            id="requestPasswordReset"
            className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            دریافت کد تایید
          </button>
        </div>
      </form>
    </div>
  );
}
