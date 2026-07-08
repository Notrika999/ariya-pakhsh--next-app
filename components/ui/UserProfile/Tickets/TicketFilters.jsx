"use client";

import { TICKET_CATEGORIES } from "@/src/lib/tickets/ticket-labels";

export default function TicketFilters({ filters, onFilterChange }) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full appearance-none rounded-lg border px-4 py-2 pe-10 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-200"
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="open">باز</option>
            <option value="pending">در حال بررسی</option>
            <option value="answered">پاسخ داده شده</option>
            <option value="closed">بسته شده</option>
          </select>
        </div>

        <div className="relative">
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value })}
            className="w-full appearance-none rounded-lg border px-4 py-2 pe-10 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-200"
          >
            <option value="">همه اولویت‌ها</option>
            <option value="low">کم</option>
            <option value="medium">متوسط</option>
            <option value="high">بالا</option>
            <option value="urgent">فوری</option>
          </select>
        </div>

        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="w-full appearance-none rounded-lg border px-4 py-2 pe-10 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-200"
          >
            <option value="">همه دسته‌ها</option>
            {TICKET_CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative w-full md:w-64">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full rounded-lg border bg-gray-50 px-4 py-2 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-200"
          placeholder="جستجوی تیکت..."
        />
      </div>
    </div>
  );
}
