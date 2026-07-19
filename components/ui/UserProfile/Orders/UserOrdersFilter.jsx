"use client";

import CustomSelect from "@/components/modules/UserProfile/CustomSelect";

const STATUS_OPTIONS = [
  { value: "", label: "همه وضعیت‌ها" },
  { value: "pending", label: "در انتظار پرداخت" },
  { value: "order.payment_review_required", label: "نیاز به بررسی پرداخت" },
  { value: "order.processing", label: "در حال پردازش" },
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
        {/* <div className="relative">
          <select
            className="w-full appearance-none rounded-lg border px-4 py-2 pe-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-zinc-800 dark:text-white "
            value={status}
            onChange={(e) => onStatusChange?.(e.target.value)}
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="pending">در انتظار پرداخت</option>
            <option value="processing">در حال پردازش</option>
            <option value="shipped">در حال ارسال</option>
            <option value="delivered">تحویل شده</option>
            <option value="cancelled">لغو شده</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <i className="far fa-angle-down"></i>
          </div>
        </div>

        <div className="relative">
          <select
            className="w-full appearance-none rounded-lg border px-4 py-2 pe-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
            value={dateRange}
            onChange={(e) => onDateRangeChange?.(e.target.value)}
          >
            <option value="">همه زمان‌ها</option>
            <option value="7">۷ روز گذشته</option>
            <option value="30">۳۰ روز گذشته</option>
            <option value="90">۳ ماه گذشته</option>
            <option value="365">یک سال گذشته</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <i className="far fa-angle-down"></i>
          </div>
        </div> */}

        <CustomSelect
          className="sm:w-48"
          options={STATUS_OPTIONS}
          value={status}
          onChange={onStatusChange}
        />

        <CustomSelect
          className="sm:w-48"
          options={DATE_RANGE_OPTIONS}
          value={dateRange}
          onChange={onDateRangeChange}
        />
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
