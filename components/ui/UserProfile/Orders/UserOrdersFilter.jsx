"use client";
// components/ui/UserProfile/Orders/UserOrdersFilter.jsx
import CustomSelect from "@/components/modules/UserProfile/CustomSelect";

export const ORDER_STATUS_TABS = [
  { value: "order.delivered", label: "تحویل شده" },
  { value: "order.returned", label: "مرجوع شده" },
  { value: "order.cancelled", label: "لغو شده" },
];

const STATUS_OPTIONS = [
  { value: "", label: "سایر وضعیت‌ها" },
  { value: "pending", label: "در انتظار پرداخت" },
  { value: "order.payment_review_required", label: "نیاز به بررسی پرداخت" },
  { value: "order.paid", label: "پرداخت شده" },
  { value: "order.payment_failed", label: "پرداخت ناموفق" },
  { value: "order.processing", label: "در حال پردازش" },
  { value: "order.confirmed", label: "تأیید شده" },
  { value: "order.shipped", label: "در حال ارسال" },
  { value: "order.expired", label: "منقضی" },
];

export default function UserOrdersFilter({
  status = "",
  search = "",
  onStatusChange,
  onSearchChange,
  onSearchSubmit,
  statusCounts = {},
}) {
  const dropdownValue = STATUS_OPTIONS.some((option) => option.value === status)
    ? status
    : "";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
          تاریخچه سفارشات
        </h2>

        <form
          className="relative hidden w-64 md:block"
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

      <div className="-mx-3 flex items-end justify-between gap-4 overflow-x-auto border-b border-gray-200 px-3 dark:border-gray-700">
        <div className="flex min-w-max items-end gap-6">
          {ORDER_STATUS_TABS.map((tab) => {
            const active = status === tab.value;
            const count = statusCounts[tab.value];

            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => onStatusChange?.(tab.value)}
                className={`relative inline-flex items-center gap-2 whitespace-nowrap pb-3 text-sm font-semibold transition ${
                  active
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                {tab.value && Number.isFinite(count) ? (
                  <span
                    className={`rounded px-1.5 py-0.5 text-xs font-bold ${
                      active
                        ? "bg-rose-500 text-white"
                        : "bg-gray-400 text-white dark:bg-gray-600"
                    }`}
                  >
                    {new Intl.NumberFormat("fa-IR").format(count)}
                  </span>
                ) : null}
                {active ? (
                  <span className="absolute inset-x-0 -bottom-px h-1 rounded-t-full bg-rose-500" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="min-w-48 pb-2">
          <CustomSelect
            className="sm:w-48"
            options={STATUS_OPTIONS}
            value={dropdownValue}
            onChange={onStatusChange}
          />
        </div>

      </div>

      <form
        className="relative w-full md:hidden"
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
