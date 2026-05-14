import React from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";

export default function SecuritySettings() {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <TitleAfter title={"تنظیمات امنیتی"} />

      <div className="space-y-4">
        {/* <!-- Two-Factor Authentication --> */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <i className="far fa-shield text-blue-600 dark:text-blue-400"></i>
           
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                احراز هویت دو مرحله‌ای
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                افزایش امنیت حساب با کد یکبار مصرف
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked="" />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all duration-300"></div>
            <span className="absolute end-0.5 top-0.5 w-5 h-5 bg-white dark:bg-gray-200 rounded-full transition-transform duration-300 peer-checked:translate-x-full"></span>
          </label>
        </div>

        {/* <!-- Session Management --> */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <i className="far fa-lock text-green-600 dark:text-green-400"></i>
              
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                مدیریت نشست‌ها
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                مشاهده و مدیریت دستگاه‌های متصل
              </p>
            </div>
          </div>
          <button className="text-primary hover:text-primary/80 font-medium text-sm dark:text-primary-200">
            مشاهده
          </button>
        </div>

        {/* <!-- Login Alerts --> */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <i className="far fa-exclamation-triangle text-yellow-600 dark:text-yellow-400"></i>
             
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                هشدارهای ورود
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                دریافت اطلاعیه برای ورودهای جدید
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked="" />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all duration-300"></div>
            <span className="absolute end-0.5 top-0.5 w-5 h-5 bg-white dark:bg-gray-200 rounded-full transition-transform duration-300 peer-checked:translate-x-full"></span>
          </label>
        </div>
      </div>
    </div>
  );
}
