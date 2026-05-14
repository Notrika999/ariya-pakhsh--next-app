"use client";

import React, { useState } from "react";

export default function UserOrdersFilter() {
  const [status, setStatus] = useState("");
  const [dateTime, setDateTime] = useState("");
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <select
            className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="pending">در انتظار پرداخت</option>
            <option value="processing">در حال پردازش</option>
            <option value="shipped">در حال ارسال</option>
            <option value="delivered">تحویل شده</option>
            <option value="cancelled">لغو شده</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <i className="far fa-angle-down"></i>
          </div>
        </div>

        <div className="relative">
          <select
            className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          >
            <option value="">همه زمان‌ها</option>
            <option value="7">۷ روز گذشته</option>
            <option value="30">۳۰ روز گذشته</option>
            <option value="90">۳ ماه گذشته</option>
            <option value="365">یک سال گذشته</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <i className="far fa-angle-down"></i>
          </div>
        </div>
      </div>

      <div className="relative w-full md:w-64">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <i className="far fa-search text-gray-500 dark:text-gray-400"></i>
        </div>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full ps-10 p-2.5 dark:bg-zinc-800 dark:border-gray-600 dark:text-white dark:focus:ring-primary"
          placeholder="جستجوی شماره سفارش..."
        />
      </div>
    </div>
  );
}
