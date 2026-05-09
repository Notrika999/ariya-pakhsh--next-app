import Link from "next/link";
import React from "react";

export default function StatisticsAndFigures() {
  const statisticsAndFigures =[
    {id: 1, title: "", subTitle: "", icon: ""},
    {id: 2, title: "", subTitle: "", icon: ""},
    {id: 3, title: "", subTitle: "", icon: ""},
    {id: 4, title: "", subTitle: "", icon: ""},
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className=" bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              سفارشات فعال
            </p>
            <p className="font-bold text-2xl text-gray-800 dark:text-gray-200 mt-1">
              ۳
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-bag-shopping text-blue-600 dark:text-blue-400"></i>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            2 سفارش در حال ارسال
          </span>
          <Link
            href="#"
            className="text-xs text-primary hover:text-primary/80 dark:text-primary-dark dark:hover:text-primary/70"
          >
            مشاهده همه
          </Link>
        </div>
      </div>

      <div className=" bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              موجودی کیف پول
            </p>
            <p className="font-bold text-2xl text-gray-800 dark:text-gray-200 mt-1">
              ۲.۴۵M
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-circle-dollar-to-slot text-green-600 dark:text-green-400"></i>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-green-600 dark:text-green-400 text-sm flex items-center">
            <i className="fa-solid fa-arrow-trend-up me-1"></i>

            ۱۵٪ افزایش نسبت به ماه گذشته
          </p>
        </div>
      </div>

      <div className=" bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              تعداد علاقه‌مندی‌ها
            </p>
            <p className="font-bold text-2xl text-gray-800 dark:text-gray-200 mt-1">
              ۱۲
            </p>
          </div>
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <i className="fa-regular fa-heart text-red-600 dark:text-red-400"></i>

          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-green-600 dark:text-green-400 text-sm flex items-center">
            <i className="fa-solid fa-arrow-trend-up me-1"></i>

            ۸٪ افزایش نسبت به ماه گذشته
          </p>
        </div>
      </div>

      <div className=" bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              امتیاز وفاداری
            </p>
            <p className="font-bold text-2xl text-gray-800 dark:text-gray-200 mt-1">
              ۴۵۰
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <i className="fa-regular fa-star text-red-600 dark:text-red-400"></i>

          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-green-600 dark:text-green-400 text-sm flex items-center">
            <i className="fa-solid fa-arrow-trend-up me-1"></i>

            ۲۵ امتیاز تا سطح طلایی
          </p>
        </div>
      </div>
    </div>
  );
}
