import React from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";
import ActivityHistoryCard from "../../../modules/ActivityHistoryCard/ActivityHistoryCard";
import type {
  ActivityVisitGroup,
  ActivityVisitItem,
  RecentViewItem,
} from "@/src/lib/types/userpanel/activity-history";
import { getProductImage } from "@/src/utils/product-image";

interface Props {
  groups: ActivityVisitGroup[];
  totalProducts: number;
  loading: boolean;
  error: string;
  clearingHistory: boolean;
  deletingProductId: string;
  onClearHistory: () => void;
  onDeleteVisit: (productId: string) => void;
  onRetry: () => void;
}

function formatMoney(value: number) {
  const amount = Number(value) || 0;
  if (amount <= 0) return "قیمت نامشخص";

  return `${new Intl.NumberFormat("fa-IR").format(amount)} تومان`;
}

function formatDateTime(value: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDuration(seconds: number) {
  const totalSeconds = Math.max(0, Math.round(Number(seconds) || 0));
  if (totalSeconds <= 0) return "";

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  if (minutes <= 0) {
    return `${new Intl.NumberFormat("fa-IR").format(remainingSeconds)} ثانیه`;
  }

  return `${new Intl.NumberFormat("fa-IR").format(minutes)} دقیقه`;
}

function productHref(item: ActivityVisitItem) {
  const slug = item.slug?.trim();
  const productCode = item.productCode?.trim();

  if (productCode && slug) {
    return `/product/${encodeURIComponent(productCode)}/${encodeURIComponent(slug)}`;
  }

  return `/product/${encodeURIComponent(slug || item.productId)}`;
}

function toRecentViewItem(item: ActivityVisitItem): RecentViewItem {
  return {
    ...item,
    id: item.visitId || item.productId,
    imgSrc: getProductImage(item.imageUrl),
    productHref: productHref(item),
    formattedPrice: formatMoney(item.price),
    formattedVisitCount: `${new Intl.NumberFormat("fa-IR").format(
      item.visitCount || 1,
    )} بار بازدید`,
    formattedLastViewedAt: formatDateTime(item.lastViewedAt),
    formattedDuration: formatDuration(item.lastDurationSeconds),
  };
}

function RecentViewsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`activity-visit-skeleton-${index}`}
          className="h-48 animate-pulse rounded-2xl bg-gray-100 dark:bg-zinc-800"
        />
      ))}
    </div>
  );
}

export default function ActivityHistoryRecentViews({
  groups = [],
  totalProducts,
  loading,
  error,
  clearingHistory,
  deletingProductId,
  onClearHistory,
  onDeleteVisit,
  onRetry,
}: Props) {
  const hasItems = groups.some((group) => group.items.length > 0);

  return (
    <div id="recent-views" className="tab-content space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
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
        <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
          <RecentViewsSkeleton />
        </div>
      ) : hasItems ? (
        groups.map((group) => (
          <div
            key={group.date || group.dateLabel}
            className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark"
          >
            <TitleAfter title={group.dateLabel || group.date} tag={false} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => {
                const product = toRecentViewItem(item);

                return (
                  <ActivityHistoryCard
                    key={product.id}
                    product={product}
                    deleting={deletingProductId === item.productId}
                    onDelete={onDeleteVisit}
                  />
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400">
            <i className="far fa-eye-slash text-xl"></i>
          </div>
          <h3 className="font-medium text-gray-800 dark:text-gray-200">
            بازدیدی ثبت نشده است
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            محصولاتی که مشاهده کنید در این بخش نمایش داده می‌شوند.
          </p>
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              پاک کردن تاریخچه بازدیدها
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              با پاک کردن تاریخچه، تمام بازدیدهای ثبت‌شده شما حذف می‌شوند.
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              تعداد محصولات در تاریخچه:{" "}
              {new Intl.NumberFormat("fa-IR").format(totalProducts)}
            </p>
          </div>
          <button
            type="button"
            disabled={!hasItems || loading || clearingHistory}
            onClick={onClearHistory}
            className="mt-4 flex items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white transition duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-0"
          >
            <i
              className={[
                "far me-2",
                clearingHistory ? "fa-spinner fa-spin" : "fa-trash-can",
              ].join(" ")}
            ></i>
            {clearingHistory ? "در حال پاک کردن..." : "پاک کردن تاریخچه"}
          </button>
        </div>
      </div>
    </div>
  );
}
