"use client";
// components/ui/UserProfile/Tickets/TicketList.jsx
import React, { useState } from "react";
import UserProfileTop from "../UserProfileTop";
import TicketFilters from "./TicketFilters";
import TicketStatCard from "../../../modules/TicketStatCard/TicketStatCard";
import TicketCreateForm from "./TicketCreateForm";
import {
  formatTicketDate,
  getCategoryLabel,
  getPriorityMeta,
  getStatusMeta,
} from "@/src/lib/tickets/ticket-labels";

export default function TicketList({
  tickets,
  totalCount = 0,
  loading = false,
  loadingMore = false,
  hasNextPage = false,
  error = null,
  creating = false,
  onView,
  onLoadMore,
  onCreate,
  filters,
  onFilterChange,
}) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const open = tickets.filter((t) => t.status === "open").length;
  const pending = tickets.filter(
    (t) => t.status === "pending" || t.status === "answered",
  ).length;
  const closed = tickets.filter((t) => t.status === "closed").length;

  const handleCreate = async (payload) => {
    const ok = await onCreate?.(payload);
    if (ok) setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <TicketCreateForm
        loading={creating}
        onBack={() => setShowCreateForm(false)}
        onSubmit={handleCreate}
      />
    );
  }

  return (
    <div className="space-y-4 lg:col-span-3">
      <UserProfileTop
        title="تیکت‌های پشتیبانی"
        description="مدیریت و پیگیری تیکت‌های پشتیبانی"
        aside={
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition duration-200 hover:bg-primary/90 active:scale-95"
          >
            <i className="far fa-plus me-2"></i>
            ایجاد تیکت جدید
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        <TicketStatCard
          title="کل تیکت‌ها"
          count={totalCount}
          bg="bg-blue-100 dark:bg-blue-900"
          icon={
            <i className="far fa-file-lines text-xl text-blue-600 dark:text-blue-400"></i>
          }
        />
        <TicketStatCard
          title="تیکت‌های باز"
          count={open}
          bg="bg-orange-100 dark:bg-orange-900"
          icon={
            <i className="far fa-exclamation-triangle text-xl text-orange-600 dark:text-orange-400"></i>
          }
        />
        <TicketStatCard
          title="در حال بررسی"
          count={pending}
          bg="bg-yellow-100 dark:bg-yellow-900"
          icon={
            <i className="far fa-clock text-xl text-yellow-600 dark:text-yellow-400"></i>
          }
        />
        <TicketStatCard
          title="بسته شده"
          count={closed}
          bg="bg-green-100 dark:bg-green-900"
          icon={
            <i className="far fa-circle-check text-xl text-green-600 dark:text-green-400"></i>
          }
        />
      </div>

      <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <TicketFilters filters={filters} onFilterChange={onFilterChange} />
      </div>

      <div className="rounded-3xl bg-white px-3 py-2 shadow-xl dark:border dark:border-gray-700 dark:bg-custom-dark">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black dark:text-gray-200">
            تیکت‌های اخیر
          </h2>
        </div>

        {loading && (
          <p className="py-8 text-center text-sm text-gray-500">
            در حال بارگذاری تیکت‌ها...
          </p>
        )}

        {!loading && error && (
          <p className="py-8 text-center text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-700">
            <table className="w-full text-right text-sm">
              <thead className="sticky top-0 bg-gray-100 text-xs text-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                <tr>
                  <th className="px-5 py-4">شماره تیکت</th>
                  <th className="px-5 py-4">موضوع</th>
                  <th className="px-5 py-4">دسته‌بندی</th>
                  <th className="px-5 py-4">اولویت</th>
                  <th className="px-5 py-4">وضعیت</th>
                  <th className="px-5 py-4">آخرین بروزرسانی</th>
                  <th className="px-5 py-4">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {tickets.map((item) => {
                  const priority = getPriorityMeta(item.priority);
                  const status = getStatusMeta(item.status);

                  return (
                    <tr
                      key={item.id}
                      className="transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                        #{item.ticketNumber || item.id.slice(0, 8)}
                      </td>
                      <td className="px-5 py-4">{item.subject}</td>
                      <td className="px-5 py-4">
                        {getCategoryLabel(item.category)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-nowrap ${priority.color}`}
                        >
                          {priority.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-nowrap ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {formatTicketDate(item.lastMessageAt || item.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => onView(item.id)}
                          className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-white transition duration-200 hover:bg-primary/90 active:scale-95"
                        >
                          مشاهده
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {tickets.length === 0 && (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                تیکتی با این فیلترها پیدا نشد.
              </div>
            )}
          </div>
        )}

        {!loading && hasNextPage && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onLoadMore}
              disabled={loadingMore}
              className="rounded-lg border border-primary px-6 py-2 text-primary transition hover:bg-primary hover:text-white disabled:opacity-60"
            >
              {loadingMore ? "در حال بارگذاری..." : "مشاهده بیشتر"}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
