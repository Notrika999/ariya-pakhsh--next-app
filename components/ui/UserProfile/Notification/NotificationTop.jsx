import React from "react";

export default function NotificationTop({notificationsLength}) {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="font-black text-2xl with-highlight dark:text-gray-200">
              اعلانات سایت
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              پیگیری آخرین اطلاعیه‌ها و اخبار
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                اعلانات خوانده نشده
              </p>
              <span
                className="text-2xl font-bold text-primary"
                id="unread-count"
              >
                {notificationsLength}
              </span>
            </div>
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
