import React from "react";
import type { LoyaltyPointsHistoryPage } from "@/src/lib/types/userpanel/loyalty";

type PointsHistoryProps = {
  page: LoyaltyPointsHistoryPage;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

function formatDate(value: string) {
  if (!value) return { date: "-", time: "" };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: value, time: "" };

  return {
    date: new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date),
    time: new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date),
  };
}

function amountTone(amount: number) {
  return amount >= 0
    ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
    : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
}

function statusTone(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
    case "earned":
    case "active":
    case "success":
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
    case "used":
    case "spent":
    case "redeemed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
    case "failed":
    case "cancelled":
    case "expired":
      return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300";
  }
}

function statusLabel(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
    case "success":
      return "تکمیل شده";
    case "earned":
      return "کسب شده";
    case "active":
      return "فعال";
    case "used":
    case "spent":
    case "redeemed":
      return "استفاده شده";
    case "failed":
      return "ناموفق";
    case "cancelled":
      return "لغو شده";
    case "expired":
      return "منقضی شده";
    case "pending":
      return "در انتظار";
    case "adjusted":
      return "توسط پشتیبان";
    default:
      return status || "-";
  }
}

function pageStart(page: LoyaltyPointsHistoryPage) {
  if (page.totalCount <= 0) return 0;
  return (Math.max(page.pageNumber, 1) - 1) * Math.max(page.pageSize, 1) + 1;
}

function pageEnd(page: LoyaltyPointsHistoryPage) {
  if (page.totalCount <= 0) return 0;
  return Math.min(pageStart(page) + page.pageSize - 1, page.totalCount);
}

export default function PointsHistory({
  page,
  loading,
  onPrevious,
  onNext,
}: PointsHistoryProps) {
  const numberFormatter = new Intl.NumberFormat("fa-IR");
  const shouldShowPagination = page.totalCount > page.pageSize;

  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        در حال دریافت تاریخچه امتیازات...
      </div>
    );
  }

  if (page.items.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        هنوز تراکنشی برای امتیازات ثبت نشده است.
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">
                تاریخ
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">
                شرح
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">
                مقدار
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">
                وضعیت
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {page.items.map((item) => {
              const createdAt = formatDate(item.createdAt);
              const amountPrefix = item.amount > 0 ? "+" : "";

              return (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition duration-150"
                >
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-800 dark:text-gray-200">
                      <p>{createdAt.date}</p>
                      <p className="text-xs text-gray-500">{createdAt.time}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="me-3">
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {item.reason || item.type || "-"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          موجودی پس از تراکنش:{" "}
                          {numberFormatter.format(item.balanceAfter)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${amountTone(item.amount)}`}
                    >
                    
                      {numberFormatter.format(item.amount)}   {amountPrefix} امتیاز
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusTone(item.status)}`}
                    >
                      {statusLabel(item.status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {shouldShowPagination ? (
        <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            نمایش {numberFormatter.format(pageStart(page))} تا{" "}
            {numberFormatter.format(pageEnd(page))} از{" "}
            {numberFormatter.format(page.totalCount)} تراکنش
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrevious}
              disabled={!page.hasPreviousPage}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-white"
            >
              <i className="far fa-angle-right me-1" />
              قبلی
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!page.hasNextPage}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-white"
            >
              بعدی
              <i className="far fa-angle-left ms-1" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
