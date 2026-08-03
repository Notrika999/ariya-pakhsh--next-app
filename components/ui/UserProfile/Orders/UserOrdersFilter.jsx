"use client";

import CustomSelect from "@/components/modules/UserProfile/CustomSelect";

const STATUS_OPTIONS = [
  { value: "", label: "همه وضعیت‌ها" },
  { value: "pending", label: "در انتظار پرداخت" },
  { value: "order.payment_review_required", label: "نیاز به بررسی پرداخت" },
  { value: "order.paid", label: "پرداخت شده" },
  { value: "order.payment_failed", label: "پرداخت ناموفق" },
  { value: "order.processing", label: "در حال پردازش" },
  { value: "order.confirmed", label: "تأیید شده" },
  { value: "order.shipped", label: "در حال ارسال" },
  { value: "order.delivered", label: "تحویل شده" },
  { value: "order.cancelled", label: "لغو شده" },
  { value: "order.expired", label: "منقضی" },
];

const DATE_RANGE_OPTIONS = [
  { value: "", label: "همه زمان‌ها" },
  { value: "7", label: "۷ روز گذشته" },
  { value: "30", label: "۳۰ روز گذشته" },
  { value: "90", label: "۳ ماه گذشته" },
  { value: "365", label: "یک سال گذشته" },
];

export default function UserOrdersFilter({
  status = "",
  dateRange = "",
  search = "",
  onStatusChange,
  onDateRangeChange,
  onSearchChange,
  onSearchSubmit,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row">
      
        <CustomSelect
          className="sm:w-48"
          options={STATUS_OPTIONS}
          value={status}
          onChange={onStatusChange}
        />

        {/* <CustomSelect
          className="sm:w-48"
          options={DATE_RANGE_OPTIONS}
          value={dateRange}
          onChange={onDateRangeChange}
        /> */}
      </div>

      <form
        className="relative w-full md:w-64"
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit?.();
        }}
      >
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
          <i className="far fa-search text-gray-500 dark:text-gray-400"></i>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-zinc-800 dark:text-white dark:focus:ring-primary"
          placeholder="جستجوی شماره سفارش..."
        />
      </form>
    </div>
  );
}
