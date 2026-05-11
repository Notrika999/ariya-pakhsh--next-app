"use client";

import React, { useState } from "react";

export default function UserRegistration() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <div className="form-step" id="step-4">
      <form className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              نام
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="نام"
              required
            />
            <p
              className="error-message text-sm text-red-600 mt-2 hidden"
              id="name-error"
            ></p>
          </div>

          <div>
            <label
              htmlFor="family"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              نام خانوادگی
            </label>
            <input
              type="text"
              id="family"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="نام خانوادگی"
              required
            />
            <p
              className="error-message text-sm text-red-600 mt-2 hidden"
              id="family-error"
            ></p>
          </div>
        </div>

        <div>
          <label
            htmlFor="regPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
          >
            رمز عبور
          </label>
          <div className="relative">
            <input
              type="password"
              autoComplete="regPassword"
              id="regPassword"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="رمز عبور دلخواه خود را وارد کنید"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute password-toggle top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
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

          <div className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center" id="lengthCondition">
              <span className="w-4 h-4 ms-2">○</span>حداقل 8 کاراکتر
            </div>
            <div className="flex items-center" id="uppercaseCondition">
              <span className="w-4 h-4 ms-2">○</span>حرف بزرگ (A-Z)
            </div>
            <div className="flex items-center" id="lowercaseCondition">
              <span className="w-4 h-4 ms-2">○</span>حرف کوچک (a-z)
            </div>
            <div className="flex items-center" id="numberCondition">
              <span className="w-4 h-4 ms-2">○</span>عدد (0-9)
            </div>
          </div>

          <p
            className="error-message text-sm text-red-600 mt-2 hidden"
            id="regPassword-error"
          ></p>
        </div>

        <button
          type="button"
          id="registerAndLogin"
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          تکمیل ثبت نام و ورود
        </button>
      </form>
    </div>
  );
}
