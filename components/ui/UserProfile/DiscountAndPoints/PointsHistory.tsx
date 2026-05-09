import React from "react";

export default function PointsHistory() {
  return (
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
          {/* <!-- Point Earning 1 --> */}
          <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition duration-150">
            <td className="py-4 px-4">
              <div className="text-sm text-gray-800 dark:text-gray-200">
                <p>۱۴۰۲/۱۱/۰۵</p>
                <p className="text-xs text-gray-500">۱۶:۳۰</p>
              </div>
            </td>
            <td className="py-4 px-4">
              <div className="flex items-center">
                <div className="me-3">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    خرید محصول
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    سفارش #ORD-7842
                  </p>
                </div>
              </div>
            </td>
            <td className="py-4 px-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                +۱۵۰ امتیاز
              </span>
            </td>
            <td className="py-4 px-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                کسب شده
              </span>
            </td>
          </tr>

          {/* <!-- Point Usage 1 --> */}
          <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition duration-150">
            <td className="py-4 px-4">
              <div className="text-sm text-gray-800 dark:text-gray-200">
                <p>۱۴۰۲/۱۰/۲۰</p>
                <p className="text-xs text-gray-500">۱۴:۱۵</p>
              </div>
            </td>
            <td className="py-4 px-4">
              <div className="flex items-center">
                <div className="me-3">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    تبدیل به تخفیف
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    ۱۰۰ امتیاز = ۱۰,۰۰۰ تومان
                  </p>
                </div>
              </div>
            </td>
            <td className="py-4 px-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                -۱۰۰ امتیاز
              </span>
            </td>
            <td className="py-4 px-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                استفاده شده
              </span>
            </td>
          </tr>

          {/* <!-- Point Earning 2 --> */}
          <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition duration-150">
            <td className="py-4 px-4">
              <div className="text-sm text-gray-800 dark:text-gray-200">
                <p>۱۴۰۲/۱۰/۱۵</p>
                <p className="text-xs text-gray-500">۱۱:۲۰</p>
              </div>
            </td>
            <td className="py-4 px-4">
              <div className="flex items-center">
                <div className="me-3">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    ثبت نظر
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    گوشی سامسونگ A73
                  </p>
                </div>
              </div>
            </td>
            <td className="py-4 px-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                +۵۰ امتیاز
              </span>
            </td>
            <td className="py-4 px-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                کسب شده
              </span>
            </td>
          </tr>

          {/* <!-- Point Earning 3 --> */}
          <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition duration-150">
            <td className="py-4 px-4">
              <div className="text-sm text-gray-800 dark:text-gray-200">
                <p>۱۴۰۲/۱۰/۱۰</p>
                <p className="text-xs text-gray-500">۰۹:۴۵</p>
              </div>
            </td>
            <td className="py-4 px-4">
              <div className="flex items-center">
                <div className="me-3">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    تکمیل پروفایل
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    اطلاعات کاربری
                  </p>
                </div>
              </div>
            </td>
            <td className="py-4 px-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                +۳۰ امتیاز
              </span>
            </td>
            <td className="py-4 px-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                کسب شده
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
