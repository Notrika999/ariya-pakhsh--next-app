import React from "react";
import UserProfileEmptyState from "../UserProfileEmptyState";

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatMoney(value) {
  const amount = Number(value) || 0;
  if (amount <= 0) return "";

  return `${new Intl.NumberFormat("fa-IR").format(amount)} تومان`;
}

function formatDuration(seconds) {
  const totalSeconds = Math.max(0, Math.round(Number(seconds) || 0));
  if (totalSeconds <= 0) return "";

  const minutes = Math.floor(totalSeconds / 60);
  if (minutes <= 0) {
    return `${new Intl.NumberFormat("fa-IR").format(totalSeconds)} ثانیه`;
  }

  return `${new Intl.NumberFormat("fa-IR").format(minutes)} دقیقه`;
}

function getActivityTone(activity) {
  const key = `${activity?.iconKey || ""} ${activity?.kind || ""}`.toLowerCase();

  if (key.includes("purchase") || key.includes("order") || key.includes("cart")) {
    return {
      icon: "fa-check",
      iconBg: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-400",
    };
  }

  if (key.includes("favorite") || key.includes("heart")) {
    return {
      icon: "fa-heart",
      iconBg: "bg-red-100 dark:bg-red-900",
      iconColor: "text-red-600 dark:text-red-400",
    };
  }

  if (key.includes("comment") || key.includes("review") || key.includes("star")) {
    return {
      icon: "fa-star",
      iconBg: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
    };
  }

  if (key.includes("ticket") || key.includes("question")) {
    return {
      icon: "fa-question-circle",
      iconBg: "bg-orange-100 dark:bg-orange-900",
      iconColor: "text-orange-600 dark:text-orange-400",
    };
  }

  if (key.includes("visit") || key.includes("view") || key.includes("eye")) {
    return {
      icon: "fa-eye",
      iconBg: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
    };
  }

  return {
    icon: "fa-clock",
    iconBg: "bg-gray-100 dark:bg-zinc-800",
    iconColor: "text-gray-600 dark:text-gray-400",
  };
}

function getActivityDescription(activity) {
  const parts = [];
  const money = formatMoney(activity.amount);
  const duration = formatDuration(activity.durationSeconds);

  if (activity.referenceCode) parts.push(`#${activity.referenceCode}`);
  if (activity.productTitle) parts.push(activity.productTitle);
  if (activity.subject) parts.push(activity.subject);
  if (money) parts.push(money);
  if (duration) parts.push(`مدت بازدید: ${duration}`);

  return parts.join(" - ") || activity.kindTitleFa || "فعالیت ثبت‌شده";
}

function ActivitiesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={`dashboard-activity-skeleton-${index}`} className="flex gap-3">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-100 dark:bg-zinc-800" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-36 animate-pulse rounded bg-gray-100 dark:bg-zinc-800" />
            <div className="h-3 w-full animate-pulse rounded bg-gray-100 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RecentActivities({ activities = [], loading = false }) {
  if (loading) return <ActivitiesSkeleton />;

  if (activities.length === 0) {
    return (
      <UserProfileEmptyState
        title="فعالیتی ثبت نشده است"
        description="فعالیت‌های اخیر حساب کاربری شما بعد از انجام عملیات در اینجا نمایش داده می‌شود."
      />
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const tone = getActivityTone(activity);

        return (
          <div key={activity.id} className="flex items-start space-x-3 ">
            <div
              className={`w-10 h-10 ${tone.iconBg} rounded-full flex items-center justify-center shrink-0`}
            >
              <i className={["far", tone.icon, tone.iconColor].join(" ")}></i>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {activity.kindTitleFa || "فعالیت"}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {getActivityDescription(activity)}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                {formatDateTime(activity.occurredAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
