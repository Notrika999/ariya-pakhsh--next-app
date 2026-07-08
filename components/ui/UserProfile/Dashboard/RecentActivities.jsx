import React from "react";
import UserProfileEmptyState from "../UserProfileEmptyState";

const RECENT_ACTIVITIES = [
  {
    id: 1,
    title: "سفارش شما تحویل داده شد",
    description: "سفارش #ORD-7842 در تاریخ ۱۴۰۲/۱۰/۱۵ تحویل داده شد.",
    time: "۲ روز پیش",
    iconBg: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    iconPath: "M5 13l4 4L19 7",
  },
  {
    id: 2,
    title: "شارژ کیف پول",
    description: "مبلغ ۵۰۰,۰۰۰ تومان به کیف پول شما اضافه شد.",
    time: "۳ روز پیش",
    iconBg: "bg-green-100 dark:bg-green-900",
    iconColor: "text-green-600 dark:text-green-400",
    iconPath:
      "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: 3,
    title: "افزودن به علاقه‌مندی‌ها",
    description: "محصول گوشی موبایل سامسونگ به لیست علاقه‌مندی‌ها اضافه شد.",
    time: "۵ روز پیش",
    iconBg: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-400",
    iconPath:
      "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
];

export default function RecentActivities() {
  if (RECENT_ACTIVITIES.length === 0) {
    return (
      <UserProfileEmptyState
        title="فعالیتی ثبت نشده است"
        description="فعالیت‌های اخیر حساب کاربری شما بعد از انجام عملیات در اینجا نمایش داده می‌شود."
      />
    );
  }

  return (
    <div className="space-y-4">
      {RECENT_ACTIVITIES.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3 ">
          <div
            className={`w-10 h-10 ${activity.iconBg} rounded-full flex items-center justify-center shrink-0`}
          >
            <svg
              className={`w-5 h-5 ${activity.iconColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={activity.iconPath}
              ></path>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-gray-800 dark:text-gray-200 font-medium">
              {activity.title}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {activity.description}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              {activity.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
