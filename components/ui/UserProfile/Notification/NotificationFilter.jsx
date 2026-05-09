import React from "react";

export default function NotificationFilter({
  typeFilter,
  statusFilter,
  onTypeChange,
  onStatusChange,
  onMarkAllRead,
  onClearAll,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        
        {/* Filter by Type */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">همه نوع اعلان</option>
            <option value="system">سیستمی</option>
            <option value="promotion">تخفیف و پیشنهاد</option>
            <option value="update">بروزرسانی</option>
            <option value="security">امنیتی</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>

        {/* Filter by Status */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="unread">خوانده نشده</option>
            <option value="read">خوانده شده</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMarkAllRead}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition duration-200 text-sm font-medium flex items-center"
        >
          <svg className="w-5 h-5 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          علامت‌گذاری همه به عنوان خوانده شده
        </button>

        <button
          onClick={onClearAll}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium flex items-center"
        >
          <svg className="w-5 h-5 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          پاک کردن همه
        </button>
      </div>
    </div>
  );
}
