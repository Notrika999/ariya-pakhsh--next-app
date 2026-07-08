import Link from "next/link";
import React from "react";
import UserProfileEmptyState from "../UserProfileEmptyState";

const RECENT_ORDERS = [
  {
    id: "ORD-7842",
    date: "۱۴۰۲/۱۰/۱۵",
    amount: "۱,۲۵۰,۰۰۰ تومان",
    status: "تحویل شده",
    statusClass:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  },
  {
    id: "ORD-7839",
    date: "۱۴۰۲/۱۰/۱۲",
    amount: "۸۵۰,۰۰۰ تومان",
    status: "در حال ارسال",
    statusClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  {
    id: "ORD-7835",
    date: "۱۴۰۲/۱۰/۰۸",
    amount: "۲,۳۵۰,۰۰۰ تومان",
    status: "در حال پردازش",
    statusClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  },
];

export default function RecentOrders() {
  if (RECENT_ORDERS.length === 0) {
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
          {RECENT_ORDERS.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                #{order.id}
              </td>
              <td className="px-5 py-4">{order.date}</td>
              <td className="px-5 py-4">{order.amount}</td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs text-nowrap font-semibold ${order.statusClass}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-5 py-4">
                <Link
                  href="#"
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
