import Link from "next/link";
import React from "react";
import UserProfileEmptyState from "../UserProfileEmptyState";

function formatMoney(value) {
  return `${new Intl.NumberFormat("fa-IR").format(
    Math.max(0, Math.round(Number(value) || 0)),
  )} تومان`;
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function statusBadgeClass(statusKey = "") {
  const key = String(statusKey).toLowerCase();
  if (key.includes("deliver") || key.includes("paid") || key.includes("success")) {
    return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
  }
  if (key.includes("ship") || key.includes("fulfill")) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
  }
  if (key.includes("cancel") || key.includes("fail") || key.includes("expire")) {
    return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
  }
  if (key.includes("pending") || key.includes("wait")) {
    return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300";
  }
  return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
}

function OrdersSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`recent-order-skeleton-${index}`}
          className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-zinc-800"
        />
      ))}
    </div>
  );
}

export default function RecentOrders({ orders = [], loading = false }) {
  if (loading) return <OrdersSkeleton />;

  if (orders.length === 0) {
    return (
      <UserProfileEmptyState
        title="سفارشی ثبت نشده است"
        description="بعد از اولین خرید، آخرین سفارش‌ها در این بخش نمایش داده می‌شود."
        actionLabel="مشاهده محصولات"
        actionHref="/products"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-700">
      <table className="w-full text-sm text-right">
        <thead className="text-xs bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 sticky top-0">
          <tr>
            <th className="px-5 py-4">شماره سفارش</th>
            <th className="px-5 py-4">تاریخ</th>
            <th className="px-5 py-4">مبلغ</th>
            <th className="px-5 py-4">وضعیت</th>
            <th className="px-5 py-4">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {orders.map((order) => (
            <tr
              key={order.orderId}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                #{order.publicOrderNumber || order.orderId}
              </td>
              <td className="px-5 py-4">{formatDate(order.createdAt)}</td>
              <td className="px-5 py-4">{formatMoney(order.payableAmount)}</td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs text-nowrap font-semibold ${statusBadgeClass(
                    order.statusKey,
                  )}`}
                >
                  {order.statusTitleFa || order.statusKey || "-"}
                </span>
              </td>
              <td className="px-5 py-4">
                <Link
                  href={`/user-profile/orders/${order.orderId}`}
                  className="text-xs font-medium bg-primary text-white py-1.5 px-4 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white"
                >
                  مشاهده
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
