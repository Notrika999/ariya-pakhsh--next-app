import React from "react";

export default function PointsRules() {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <h2 className="font-bold text-xl with-highlight dark:text-gray-200 mb-6">
        قوانین امتیازات
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
            روش‌های کسب امتیاز
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <i className="far fa-check text-green-500 mt-0.5 shrink-0"></i>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                هر ۱۰,۰۰۰ تومان خرید = ۱۰ امتیاز
              </span>
            </li>
            <li className="flex items-start space-x-3">
             <i className="far fa-check text-green-500 mt-0.5 shrink-0"></i>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ثبت نظر تأیید شده = ۵۰ امتیاز
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="far fa-check text-green-500 mt-0.5 shrink-0"></i>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                تکمیل پروفایل = ۳۰ امتیاز
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="far fa-check text-green-500 mt-0.5 shrink-0"></i>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                اشتراک گذاری محصول = ۲۰ امتیاز
              </span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
            روش‌های استفاده
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
             <i className="far fa-dollar text-blue-500 mt-0.5 shrink-0 text-xs"></i>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ۱۰۰ امتیاز = ۱۰,۰۰۰ تومان تخفیف
              </span>
            </li>
            <li className="flex items-start space-x-3">
               <i className="far fa-dollar text-blue-500 mt-0.5 shrink-0 text-xs"></i>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ارتقاء سطح کاربری
              </span>
            </li>
            <li className="flex items-start space-x-3">
               <i className="far fa-dollar text-blue-500 mt-0.5 shrink-0 text-xs"></i>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                شرکت در قرعه‌کشی‌های ویژه
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
