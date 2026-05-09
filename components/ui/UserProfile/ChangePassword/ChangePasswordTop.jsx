import React from "react";

import TitleAfter from "../../../modules/TitleAfter/TitleAfter";

export default function ChangePasswordTop() {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <TitleAfter title={"تغییر رمز عبور"} />
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            به روزرسانی رمز عبور حساب کاربری شما
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-3 ">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                آخرین تغییر
              </p>
              <p className="font-bold text-lg text-gray-800 dark:text-gray-200">
                ۳ ماه پیش
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
