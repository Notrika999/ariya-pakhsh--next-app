import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function UserOrdersList() {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <TitleAfter title={"لیست سفارش‌ها"} />

      <div className="space-y-6">
        {/* <!-- Order 1 --> */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          {/* <!-- Order Header --> */}
          <div className="bg-custom-light dark:bg-zinc-800 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4  mb-3 md:mb-0">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  شماره سفارش
                </p>
                <p className="font-bold text-gray-800 dark:text-gray-200">
                  #ORD-7842
                </p>
              </div>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  تاریخ سفارش
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  ۱۴۰۲/۱۰/۱۵
                </p>
              </div>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  مبلغ کل
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  ۱,۲۵۰,۰۰۰ تومان
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 ">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                تحویل شده
              </span>
              <Link
                href={`/user-profile/orders/${"1"}`}
                className="text-primary hover:text-primary/80 font-medium text-sm dark:text-primary-200"
              >
                مشاهده جزئیات
              </Link>
            </div>
          </div>

          {/* <!-- Order Items --> */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 md: border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              <div className="shrink-0">
                <Image
                  width={100}
                  height={100}
                  src="/images/product/television-2.png"
                  // src=?? "/images/default.png"
                  className="size-20"
                  alt=""
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  گوشی موبایل سامسونگ گلکسی A73
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  رنگ: مشکی • تعداد: ۱ عدد
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  ۱,۱۰۰,۰۰۰ تومان
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 md:">
              <div className="shrink-0">
                <Image
                  width={100}
                  height={100}
                  src="/images/product/wach-1.png"
                  // src=?? "/images/default.png"
                  className="size-20"
                  alt=""
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  قاب محافظ گوشی سامسونگ گلکسی A73
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  رنگ: شفاف • تعداد: ۱ عدد
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  ۱۵۰,۰۰۰ تومان
                </p>
              </div>
            </div>

            {/* <!-- Order Actions --> */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3 ">
                <button className="text-primary hover:text-primary/80 font-medium text-sm dark:text-primary-200 flex items-center">
                  <i className="far fa-arrow-down-to-bracket me-1"></i>
                  دانلود فاکتور
                </button>
                <button className="text-primary hover:text-primary/80 font-medium text-sm dark:text-primary-200 flex items-center">
                  <i className="far fa-square-arrow-up-left me-1"></i>
                  ثبت بازخورد
                </button>
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 text-sm font-medium w-full sm:w-auto text-center">
                خرید مجدد
              </button>
            </div>
          </div>
        </div>

        {/* <!-- Order 2 --> */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          {/* <!-- Order Header --> */}
          <div className="bg-custom-light dark:bg-zinc-800 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4  mb-3 md:mb-0">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  شماره سفارش
                </p>
                <p className="font-bold text-gray-800 dark:text-gray-200">
                  #ORD-7839
                </p>
              </div>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  تاریخ سفارش
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  ۱۴۰۲/۱۰/۱۲
                </p>
              </div>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  مبلغ کل
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  ۸۵۰,۰۰۰ تومان
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 ">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                در حال ارسال
              </span>
              <Link
                href={`/user-profile/orders/${"1"}`}
                className="text-primary hover:text-primary/80 font-medium text-sm dark:text-primary-200"
              >
                مشاهده جزئیات
              </Link>
            </div>
          </div>

          {/* <!-- Order Items --> */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 md:">
              <div className="flex-shrink-0">
                <Image
                  width={100}
                  height={100}
                  src="/images/product/laptop-4.png"
                  // src=?? "/images/default.png"
                  className="size-20"
                  alt=""
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  هدفون بلوتوثی سونی WH-CH510
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  رنگ: آبی • تعداد: ۱ عدد
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  ۸۵۰,۰۰۰ تومان
                </p>
              </div>
            </div>

            {/* <!-- Tracking Info --> */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                پیگیری مرسوله
              </h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center me-3">
                      <i className="far fa-check text-blue-600 dark:text-blue-400"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        مرسوله تحویل پست شده
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        کد رهگیری: 1234567890123456
                      </p>
                    </div>
                  </div>
                  <button className="text-primary hover:text-primary/80 font-medium text-sm dark:text-primary-200">
                    رهگیری
                  </button>
                </div>
              </div>
            </div>

            {/* <!-- Order Actions --> */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3 ">
                <button className="text-primary hover:text-primary/80 font-medium text-sm dark:text-primary-200 flex items-center">
                  <i className="far fa-comment-dots me-1"></i>
                  پشتیبانی
                </button>
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 text-sm font-medium w-full sm:w-auto text-center">
                رهگیری سفارش
              </button>
            </div>
          </div>
        </div>

        {/* <!-- Order 3 --> */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          {/* <!-- Order Header --> */}
          <div className="bg-custom-light dark:bg-zinc-800 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4  mb-3 md:mb-0">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  شماره سفارش
                </p>
                <p className="font-bold text-gray-800 dark:text-gray-200">
                  #ORD-7835
                </p>
              </div>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  تاریخ سفارش
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  ۱۴۰۲/۱۰/۰۸
                </p>
              </div>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  مبلغ کل
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  ۲,۳۵۰,۰۰۰ تومان
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 ">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                در حال پردازش
              </span>
              <Link
                href={`/user-profile/orders/${"1"}`}
                className="text-primary hover:text-primary/80 font-medium text-sm dark:text-primary-200"
              >
                مشاهده جزئیات
              </Link>
            </div>
          </div>

          {/* <!-- Order Items --> */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 md: border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              <div className="flex-shrink-0">
                <Image
                  width={100}
                  height={100}
                  src="/images/product/laptop-1.png"
                  // src=?? "/images/default.png"
                  className="size-20"
                  alt=""
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  لپ تاپ ایسوس ویووبوک ۱۵
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  رنگ: نقره‌ای • تعداد: ۱ عدد
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  ۲,۱۰۰,۰۰۰ تومان
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 md:">
              <div className="flex-shrink-0">
                <Image
                  width={100}
                  height={100}
                  src="/images/product/laptop-2.png"
                  // src=?? "/images/default.png"
                  className="size-20"
                  alt=""
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  ماوس بی‌سیم لاجیتک
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  رنگ: مشکی • تعداد: ۱ عدد
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  ۲۵۰,۰۰۰ تومان
                </p>
              </div>
            </div>

            {/* <!-- Order Actions --> */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3 ">
                <button className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center">
                  <i className="far fa-trash-can me-1"></i>
                  لغو سفارش
                </button>
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 text-sm font-medium w-full sm:w-auto text-center">
                پیگیری سفارش
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Pagination --> */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">
          نمایش ۱ تا ۳ از ۱۲ سفارش
        </p>
        <div className="flex items-center space-x-2 ">
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            قبلی
          </button>
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-lg hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/60">
            ۱
          </button>
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            ۲
          </button>
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            ۳
          </button>
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
}
