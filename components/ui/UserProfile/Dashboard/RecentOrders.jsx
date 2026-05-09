import Link from "next/link";
import React from "react";

export default function RecentOrders() {
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
          {/* <!-- Row --> */}
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
              #ORD-7842
            </td>
            <td className="px-5 py-4">۱۴۰۲/۱۰/۱۵</td>
            <td className="px-5 py-4">۱,۲۵۰,۰۰۰ تومان</td>
            <td className="px-5 py-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs text-nowrap font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                تحویل شده
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

          {/* <!-- Row --> */}
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
              #ORD-7839
            </td>
            <td className="px-5 py-4">۱۴۰۲/۱۰/۱۲</td>
            <td className="px-5 py-4">۸۵۰,۰۰۰ تومان</td>
            <td className="px-5 py-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs text-nowrap font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                در حال ارسال
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

          {/* <!-- Row --> */}
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
              #ORD-7835
            </td>
            <td className="px-5 py-4">۱۴۰۲/۱۰/۰۸</td>
            <td className="px-5 py-4">۲,۳۵۰,۰۰۰ تومان</td>
            <td className="px-5 py-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs text-nowrap font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                در حال پردازش
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
        </tbody>
      </table>
    </div>
  );
}
