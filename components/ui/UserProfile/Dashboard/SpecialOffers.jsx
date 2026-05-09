import React from "react";

export default function SpecialOffers() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3  p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs text-center">
            تخفیف ویژه
          </span>
        </div>
        <div className="flex-1">
          <p className="text-gray-800 dark:text-gray-200 font-medium">
            کد تخفیف ۲۰٪
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            برای خریدهای بالای ۱ میلیون تومان
          </p>
        </div>
        <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
          استفاده
        </button>
      </div>

      <div className="flex items-center space-x-3  p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs text-center">
            ارسال رایگان
          </span>
        </div>
        <div className="flex-1">
          <p className="text-gray-800 dark:text-gray-200 font-medium">
            ارسال رایگان
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            برای تمام سفارش‌های امروز
          </p>
        </div>
        <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
          استفاده
        </button>
      </div>

      <div className="flex items-center space-x-3  p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs text-center">
            هدیه ویژه
          </span>
        </div>
        <div className="flex-1">
          <p className="text-gray-800 dark:text-gray-200 font-medium">
            هدیه خرید اول
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            یک هدیه رایگان با اولین خرید این ماه
          </p>
        </div>
        <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
          استفاده
        </button>
      </div>
    </div>
  );
}
