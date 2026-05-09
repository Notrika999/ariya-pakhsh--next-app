import React from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";

export default function SecurityTips() {
  return (
    <div className="bg-blue-50 drop-shadow-lg dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <div>
          <TitleAfter title={"نکات امنیتی رمز عبور"} />
          <ul className="mt-2 text-blue-700 dark:text-blue-400 text-sm space-y-1">
            <li className="flex items-center">
              <svg
                className="w-4 h-4 me-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              از ترکیب حروف، اعداد و نمادها استفاده کنید
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 me-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              رمز عبور باید حداقل ۸ کاراکتر باشد
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 me-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              از اطلاعات شخصی قابل حدس زدن استفاده نکنید
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 me-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              رمز عبور را در جای امن نگهداری کنید
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
