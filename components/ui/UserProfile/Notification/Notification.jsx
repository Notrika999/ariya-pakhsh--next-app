"use client";

import React, { useState } from "react";
import NotificationTop from "./NotificationTop";
import NotificationFilter from "./NotificationFilter";
import NotificationCard from "../../../modules/NotificationCard/NotificationCard";

// ----------------------
// Initial Notifications
// ----------------------
const initialNotifications = [
  {
    id: 1,
    type: "system",
    status: "unread",
    title: "بروزرسانی سیستم پرداخت",
    message: "سیستم پرداخت جدید راه‌اندازی شد.",
    badgeLabel: "سیستمی",
    date: "۱۴۰۲/۱۱/۰۶ - ۱۰:۳۰",
    borderColor: "border-blue-500",
    iconBgColor: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-500",
    iconClass: "fas fa-rotate",
  },
  {
    id: 2,
    type: "promotion",
    status: "unread",
    title: "تخفیف ویژه نوروزی",
    message: "تا ۴۰٪ تخفیف برای خرید بالای ۵۰۰ هزار تومان",
    badgeLabel: "تخفیف و پیشنهاد",
    date: "۱۴۰۲/۱۱/۰۵ - ۱۵:۲۰",
    borderColor: "border-green-500",
    iconBgColor: "bg-green-100 dark:bg-green-900",
    iconColor: "text-green-600 dark:text-green-500",
    iconClass: "fa-solid fa-tags",
  },
  {
    id: 3,
    type: "update",
    status: "unread",
    title: "بروزرسانی اپلیکیشن",
    message: "نسخه جدید اپلیکیشن موبایل منتشر شد.",
    badgeLabel: "بروزرسانی",
    date: "۱۴۰۲/۱۱/۰۴ - ۰۹:۱۵",
    borderColor: "border-purple-500",
    iconBgColor: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-500",
    iconClass: "fas fa-rotate",
  },
];

export default function Notification() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markRead = (id) => {
    setNotifications((notifs) =>
      notifs.map((n) => (n.id === id ? { ...n, status: "read" } : n)),
    );
  };

  const markUnread = (id) => {
    setNotifications((notifs) =>
      notifs.map((n) => (n.id === id ? { ...n, status: "unread" } : n)),
    );
  };

  const deleteNotif = (id) => {
    setNotifications((notifs) => notifs.filter((n) => n.id !== id));
  };

  // Filter
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredNotifications = notifications.filter((n) => {
    const matchType = typeFilter === "all" ? true : n.type === typeFilter;

    const matchStatus =
      statusFilter === "all" ? true : n.status === statusFilter;

    return matchType && matchStatus;
  });

  return (
    <div className="lg:col-span-3 space-y-8">
      {/* <!-- Dashboard header --> */}
      <NotificationTop notificationsLength={initialNotifications.length} />

      {/* <!-- Filters and Actions -->/ */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <NotificationFilter
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          onTypeChange={setTypeFilter}
          onStatusChange={setStatusFilter}
          onMarkAllRead={() =>
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, status: "read" })),
            )
          }
          onClearAll={() => setNotifications([])}
        />
      </div>

      {/* <!-- Notifications List --> */}
      {
        filteredNotifications.length ? (<div className="space-y-4" id="notifications-container">
        {filteredNotifications.map((notif) => (
          <NotificationCard
            key={notif.id}
            {...notif}
            onMarkRead={() => markRead(notif.id)}
            onMarkUnread={() => markUnread(notif.id)}
            onDelete={() => deleteNotif(notif.id)}
          />
        ))}
      </div>) : (<div
        className="bg-white rounded-2xl drop-shadow-lg p-12 text-center dark:bg-custom-dark dark:border dark:border-gray-700"
      >
       <i className="far fa-bell text-gray-400 mx-auto mb-6 text-8xl"></i>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          هیچ اعلانی یافت نشد
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          در حال حاضر هیچ اعلانی برای نمایش وجود ندارد. وقتی اعلان جدیدی داشته
          باشید، اینجا نمایش داده می‌شود.
        </p>
      </div>)
      }

      {/* <!-- Pagination --> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            نمایش ۱ تا ۵ از ۱۵ اعلان
          </div>
          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-white">
              <i className="far fa-angle-right me-1"></i>
              قبلی
            </button>
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-white">
              بعدی
              <i className="far fa-angle-left ms-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
