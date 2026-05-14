import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import React from "react";

export default function OrderTimeline() {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <TitleAfter title={"روند سفارش"} />
      <div className="relative">
        {/* <!-- Timeline --> */}
        <div className="space-y-8">
          {/* <!-- Step 1 - Completed --> */}
          <div className="flex items-start space-x-4 ">
            <div className="shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <i className="far fa-check text-sm text-white"></i>
             
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  سفارش ثبت شد
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ۱۴۰۲/۱۰/۱۵ - ۱۴:۳۰
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                سفارش شما با موفقیت ثبت و تأیید شد
              </p>
            </div>
          </div>

          {/* <!-- Step 2 - Completed --> */}
          <div className="flex items-start space-x-4 ">
            <div className="shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
               <i className="far fa-check text-sm text-white"></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  پرداخت موفق
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ۱۴۰۲/۱۰/۱۵ - ۱۴:۳۵
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                پرداخت شما با موفقیت انجام شد
              </p>
            </div>
          </div>

          {/* <!-- Step 3 - Completed --> */}
          <div className="flex items-start space-x-4 ">
            <div className="shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
               <i className="far fa-check text-sm text-white"></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  آماده‌سازی سفارش
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ۱۴۰۲/۱۰/۱۶ - ۰۹:۱۵
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                سفارش شما در انبار آماده شد
              </p>
            </div>
          </div>

          {/* <!-- Step 4 - Completed --> */}
          <div className="flex items-start space-x-4 ">
            <div className="shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <i className="far fa-check text-sm text-white"></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  تحویل به پست
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ۱۴۰۲/۱۰/۱۷ - ۱۱:۲۰
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                سفارش شما تحویل پست داده شد
              </p>
              <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  کد رهگیری: 1234567890123456
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  شرکت پست جمهوری اسلامی ایران
                </p>
              </div>
            </div>
          </div>

          {/* <!-- Step 5 - Completed --> */}
          <div className="flex items-start space-x-4 ">
            <div className="shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <i className="far fa-check text-sm text-white"></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  تحویل به مشتری
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ۱۴۰۲/۱۰/۱۹ - ۱۶:۴۵
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                سفارش با موفقیت تحویل داده شد
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
