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
            <i className="far fa-angle-down"></i>
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
            <i className="far fa-angle-down"></i>
            
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMarkAllRead}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition duration-200 text-sm font-medium flex items-center"
        >
          <i className="far fa-check me-2"></i>
           همه خوانده شد
        </button>

        <button
          onClick={onClearAll}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium flex items-center"
        >
          <i className="far fa-trash-can me-2"></i>
          پاک کردن همه
        </button>
      </div>
    </div>
  );
}
