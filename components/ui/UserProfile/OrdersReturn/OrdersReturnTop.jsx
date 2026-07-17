"use client";

import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";

export default function OrdersReturnTop({
  orderNumber,
  orderOptions = [],
  selectedOrderId = "",
  onSelectOrder,
  loading = false,
}) {
  const title = orderNumber
    ? `درخواست مرجوعی سفارش #${orderNumber}`
    : "درخواست مرجوعی سفارش";

  return (
    <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <TitleAfter title={title} />
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              ثبت درخواست بازگشت کالا و استرداد وجه
            </p>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-3">
            <div className="space-y-1 text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                انتخاب سفارش
              </p>
              <select
                value={selectedOrderId}
                disabled={loading || orderOptions.length === 0}
                onChange={(e) => onSelectOrder?.(e.target.value)}
                className="min-w-48 appearance-none rounded-lg border px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
              >
                <option value="">
                  {loading ? "در حال بارگذاری..." : "سفارش را انتخاب کنید"}
                </option>
                {orderOptions.map((order) => (
                  <option key={order.orderId} value={order.orderId}>
                    #{order.publicOrderNumber || order.orderId}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <i className="far fa-square-arrow-up-left text-xl text-orange-600 dark:text-orange-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
