// components/ui/UserProfile/ActivityHistory/ActivityHistoryRecentActivities.tsx

import React from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";
import type {
  ActivityFeedItem,
  ActivityStats,
} from "@/src/lib/types/userpanel/activity-history";

type StatCard = {
  key: keyof ActivityStats;
  title: string;
  icon: string;
  wrapperClass: string;
  iconClass: string;
  valueClass: string;
};

type ActivityTone = {
  icon: string;
  bg: string;
  color: string;
  badge: string;
};

interface Props {
  items: ActivityFeedItem[];
  stats: ActivityStats;
  totalCount: number;
  currentPage?: number;
  loading: boolean;
  error: string;
  pageSize?: number;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onRetry: () => void;
}

const STAT_CARDS: StatCard[] = [
  {
    key: "productVisits",
    title: "بازدید محصولات",
    icon: "fa-eye",
    wrapperClass:
      "from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700",
    iconClass: "bg-blue-500",
    valueClass: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "purchases",
    title: "خریدها",
    icon: "fa-cart-shopping",
    wrapperClass:
      "from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700",
    iconClass: "bg-green-500",
    valueClass: "text-green-600 dark:text-green-400",
  },
  {
    key: "comments",
    title: "نظرات",
    icon: "fa-star",
    wrapperClass:
      "from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:border-yellow-700",
    iconClass: "bg-yellow-500",
    valueClass: "text-yellow-600 dark:text-yellow-400",
  },
  {
    key: "tickets",
    title: "تیکت‌ها",
    icon: "fa-question-circle",
    wrapperClass:
      "from-orange-50 to-orange-100 border-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-700",
    iconClass: "bg-orange-500",
    valueClass: "text-orange-600 dark:text-orange-400",
  },
];

function formatDateTime(value: string) {
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

function formatMoney(value: number) {
  const amount = Number(value) || 0;
  if (amount <= 0) return "";

  return `${new Intl.NumberFormat("fa-IR").format(amount)} تومان`;
}

function formatDuration(seconds: number) {
  const totalSeconds = Math.max(0, Math.round(Number(seconds) || 0));
  if (totalSeconds <= 0) return "";

  const minutes = Math.floor(totalSeconds / 60);
  if (minutes <= 0) {
    return `${new Intl.NumberFormat("fa-IR").format(totalSeconds)} ثانیه`;
  }

  return `${new Intl.NumberFormat("fa-IR").format(minutes)} دقیقه`;
}

function getActivityTone(item: ActivityFeedItem): ActivityTone {
  const key = `${item.iconKey || ""} ${item.kind || ""}`.toLowerCase();

  if (
    key.includes("purchase") ||
    key.includes("order") ||
    key.includes("cart")
  ) {
    return {
      icon: "fa-check",
      bg: "bg-green-100 dark:bg-green-900",
      color: "text-green-600 dark:text-green-400",
      badge:
        "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    };
  }

  if (
    key.includes("comment") ||
    key.includes("review") ||
    key.includes("star")
  ) {
    return {
      icon: "fa-star",
      bg: "bg-blue-100 dark:bg-blue-900",
      color: "text-blue-600 dark:text-blue-400",
      badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    };
  }

  if (key.includes("ticket") || key.includes("question")) {
    return {
      icon: "fa-question-circle",
      bg: "bg-orange-100 dark:bg-orange-900",
      color: "text-orange-600 dark:text-orange-400",
      badge:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    };
  }

  if (key.includes("visit") || key.includes("view") || key.includes("eye")) {
    return {
      icon: "fa-eye",
      bg: "bg-violet-100 dark:bg-violet-900",
      color: "text-violet-600 dark:text-violet-400",
      badge:
        "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
    };
  }

  return {
    icon: "fa-clock",
    bg: "bg-gray-100 dark:bg-zinc-800",
    color: "text-gray-600 dark:text-gray-400",
    badge: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300",
  };
}

function getActivityDescription(item: ActivityFeedItem) {
  const parts = [];
  const money = formatMoney(item.amount);
  const duration = formatDuration(item.durationSeconds);

  if (item.referenceCode) parts.push(`#${item.referenceCode}`);
  if (item.productTitle) parts.push(item.productTitle);
  if (item.subject) parts.push(item.subject);
  if (money) parts.push(money);
  if (duration) parts.push(`مدت بازدید: ${duration}`);

  return parts.join(" - ") || item.kindTitleFa || "فعالیت ثبت‌شده";
}

function ActivitiesSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={`activity-feed-skeleton-${index}`} className="flex gap-4">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-100 dark:bg-zinc-800" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-40 animate-pulse rounded bg-gray-100 dark:bg-zinc-800" />
            <div className="h-3 w-full animate-pulse rounded bg-gray-100 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ActivityHistoryRecentActivities({
  items = [],
  stats,
  totalCount = 0,
  currentPage = 1,
  loading = false,
  error = "",
  pageSize = 10,
  onPreviousPage,
  onNextPage,
  onRetry,
}: Props) {
  const numberFormatter = new Intl.NumberFormat("fa-IR");
  const safePageSize = Math.max(pageSize, 1);
  const safeCurrentPage = Math.max(currentPage, 1);
  const totalRecords = Math.max(totalCount, items.length);
  const totalPages = Math.max(Math.ceil(totalRecords / safePageSize), 1);
  const shouldUseClientPaging = items.length > safePageSize;
  const pageOffset = (safeCurrentPage - 1) * safePageSize;
  const visibleItems = shouldUseClientPaging
    ? items.slice(pageOffset, pageOffset + safePageSize)
    : items.slice(0, safePageSize);
  const canPrevious = safeCurrentPage > 1;
  const canNext = safeCurrentPage < totalPages;
  const shouldShowPagination = totalPages > 1;
  const startIndex = totalRecords > 0 ? pageOffset + 1 : 0;
  const endIndex = Math.min(pageOffset + visibleItems.length, totalRecords);

  return (
    <div id="recent-activities" className="tab-content space-y-2">
      <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <div className="flex items-start justify-between gap-4">
          <TitleAfter title="آمار فعالیت‌ها" tag={false} />
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {new Intl.NumberFormat("fa-IR").format(totalCount)} رویداد
          </span>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map((card) => (
            <div
              key={card.key}
              className={[
                "rounded-2xl border bg-gradient-to-br p-6 text-center",
                card.wrapperClass,
              ].join(" ")}
            >
              <div
                className={[
                  "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full",
                  card.iconClass,
                ].join(" ")}
              >
                <i className={["far", card.icon, "text-white"].join(" ")}></i>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                {card.title}
              </h3>
              <p className={["text-3xl font-bold", card.valueClass].join(" ")}>
                {loading
                  ? "..."
                  : new Intl.NumberFormat("fa-IR").format(
                      Number(stats?.[card.key]) || 0,
                    )}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <TitleAfter title="فعالیت‌های اخیر شما" tag={false} />

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={onRetry}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
              >
                تلاش دوباره
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <ActivitiesSkeleton />
        ) : visibleItems.length > 0 ? (
          <div className="relative">
            <div className="space-y-8">
              {visibleItems.map((item) => {
                const tone = getActivityTone(item);

                return (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div
                      className={[
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                        tone.bg,
                      ].join(" ")}
                    >
                      <i
                        className={["far", tone.icon, tone.color].join(" ")}
                      ></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">
                          {item.kindTitleFa || "فعالیت"}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDateTime(item.occurredAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {getActivityDescription(item)}
                      </p>
                      {item.statusTitleFa && (
                        <div className="mt-2 flex items-center space-x-2">
                          <span
                            className={[
                              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                              tone.badge,
                            ].join(" ")}
                          >
                            {item.statusTitleFa}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {shouldShowPagination && (
              <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  نمایش {numberFormatter.format(startIndex)} تا{" "}
                  {numberFormatter.format(endIndex)} از{" "}
                  {numberFormatter.format(totalRecords)} رویداد
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onPreviousPage}
                    disabled={!canPrevious}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                  >
                    <i className="far fa-angle-right me-1" />
                    قبلی
                  </button>
                  <button
                    type="button"
                    onClick={onNextPage}
                    disabled={!canNext}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                  >
                    بعدی
                    <i className="far fa-angle-left ms-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400">
              <i className="far fa-clock text-xl"></i>
            </div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              فعالیتی ثبت نشده است
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              خریدها، نظرات، تیکت‌ها و بازدیدهای شما در این بخش نمایش داده
              می‌شوند.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
