"use client";

import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";

export default function UserOrdersTop({ activeCount = 0 }) {
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
              تعداد سفارش‌ها
            </p>
            <p className="font-bold text-lg text-gray-800 dark:text-gray-200">
              {new Intl.NumberFormat("fa-IR").format(activeCount)} سفارش
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <i className="far fa-shopping-bag text-xl text-blue-600 dark:text-blue-400"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
