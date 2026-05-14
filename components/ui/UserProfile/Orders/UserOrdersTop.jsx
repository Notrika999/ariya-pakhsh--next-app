import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import React from "react";

export default function UserOrdersTop() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <TitleAfter title={"سفارش‌های من"} />
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          مدیریت و پیگیری سفارش‌های خود
        </p>
      </div>
      <div className="mt-4 md:mt-0">
        <div className="flex items-center space-x-3 ">
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              تعداد سفارشات فعال
            </p>
            <p className="font-bold text-lg text-gray-800 dark:text-gray-200">
              ۳ سفارش
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <i className="far fa-shopping-bag text-xl text-blue-600 dark:text-blue-400"></i>
            
          </div>
        </div>
      </div>
    </div>
  );
}
