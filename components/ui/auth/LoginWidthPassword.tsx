"use client";

import React, { useState } from "react";

export default function LoginWidthPassword() {
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <form id="passwordLoginForm" className=" space-y-5">
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
        >
          رمز عبور
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            id="password"
            autoComplete="password"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="رمز عبور خود را وارد کنید"
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute password-toggle top-1/2 left-2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
          >
            <i
              className={`${
                showNewPassword
                  ? "fa-regular fa-eye-slash"
                  : "fa-regular fa-eye"
              }`}
            ></i>
          </button>
        </div>
        <p
          className="error-message text-sm text-red-600 mt-2 hidden"
          id="password-error"
        ></p>
      </div>

      <div className="text-right">
        <button
          type="button"
          id="showForgotPasswordStep2"
          className="text-sm text-primary hover:text-primary/90 transition-colors"
        >
          رمز عبور خود را فراموش کرده‌اید؟
        </button>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          id="backToMethod"
          className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-custom-dark hover:bg-gray-50 dark:hover:bg-[#1f242c] transition-colors"
        >
          بازگشت
        </button>
        <button
          type="button"
          id="loginWithPassword"
          className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          ورود
        </button>
      </div>
    </form>
  );
}
