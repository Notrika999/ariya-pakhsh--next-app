import React from "react";
import SidebarResponsive from "../SidebarResponsive";
import UserSidebar from "../UserSidebar";
import OrderDetailsTop from "./OrderDetailsTop";
import OrderTimeline from "./OrderTimeline";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import Image from "next/image";

export default function OrderDetails() {
  return (
    <div className="lg:col-span-3 space-y-8">
      {/* <!--Dashboard header with back button--> */}
      <OrderDetailsTop />

      {/* <!--Order Timeline--> */}
      <OrderTimeline />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* <!-- Order Items & Summary --> */}
        <div className="lg:col-span-2 space-y-8">
          {/* <!-- Order Items --> */}
          <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
            <TitleAfter title={"محصولات سفارش"} />

            <div className="space-y-6">
              {/* <!-- Product 1 --> */}
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 md: border-b border-gray-200 dark:border-gray-700 pb-6">
                <div className="flex-shrink-0">
                  <Image
                    width={80}
                    height={80}
                    src="/images/product/television-2.png"
                    className="size-20 rounded-lg"
                    alt="گوشی موبایل سامسونگ گلکسی A73"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    گوشی موبایل سامسونگ گلکسی A73
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    رنگ: مشکی • حافظه: 128GB • تعداد: ۱ عدد
                  </p>
                  <div className="flex items-center space-x-4  mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      کد محصول: PRD-001
                    </span>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    ۱,۱۰۰,۰۰۰ تومان
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    ۱ × ۱,۱۰۰,۰۰۰
                  </p>
                </div>
              </div>

              {/* <!-- Product 2 --> */}
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 md:">
                <div className="flex-shrink-0">
                  <Image
                    width={80}
                    height={80}
                    src="/images/product/wach-1.png"
                    className="size-20 rounded-lg"
                    alt="قاب محافظ گوشی سامسونگ گلکسی A73"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    قاب محافظ گوشی سامسونگ گلکسی A73
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    رنگ: شفاف • جنس: سیلیکونی • تعداد: ۱ عدد
                  </p>
                  <div className="flex items-center space-x-4  mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      کد محصول: PRD-002
                    </span>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    ۱۵۰,۰۰۰ تومان
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    ۱ × ۱۵۰,۰۰۰
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Shipping Information --> */}
          <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
            <TitleAfter title={"اطلاعات ارسال"} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                  آدرس تحویل
                </h3>
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    امیر رضایی
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    تهران، خیابان ولیعصر، کوچه شهید فلانی، پلاک ۱۲۳
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    کد پستی: ۱۲۳۴۵۶۷۸۹۰
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    تلفن: ۰۹۰۰۱۲۳۴۵۶۷
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                  روش ارسال
                </h3>
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    پست پیشتاز
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    زمان تحویل: ۲-۳ روز کاری
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    هزینه: رایگان
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Order Summary & Actions --> */}
        <div className="space-y-8">
          {/* <!-- Order Summary --> */}
          <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
            <TitleAfter title={"خلاصه سفارش"} />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  قیمت کالاها
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  ۱,۲۵۰,۰۰۰ تومان
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  هزینه ارسال
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  رایگان
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">تخفیف</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  -۵۰,۰۰۰ تومان
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    مبلغ قابل پرداخت
                  </span>
                  <span className="text-lg font-bold text-primary">
                    ۱,۲۰۰,۰۰۰ تومان
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Payment Information --> */}
          <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
            <TitleAfter title={"اطلاعات پرداخت"} />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  روش پرداخت
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  درگاه بانکی
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  تاریخ پرداخت
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  ۱۴۰۲/۱۰/۱۵ - ۱۴:۳۵
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  کد رهگیری پرداخت
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  TRK-784215963
                </span>
              </div>
            </div>
          </div>

          {/* <!-- Order Actions --> */}
          <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
            <TitleAfter title={"عملیات سفارش"} />

            <div className="space-y-3">
              <button className="w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 text-sm font-medium flex items-center justify-center">
              <i className="far fa-arrow-down-to-bracket me-2"></i>
       
                دانلود فاکتور
              </button>

              <button className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 active:scale-95 transition duration-200 text-sm font-medium flex items-center justify-center">
                <i className="far fa-plus me-2"></i>
                خرید مجدد
              </button>

              <button className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 active:scale-95 transition duration-200 text-sm font-medium flex items-center justify-center dark:border-gray-600 dark:text-gray-300 dark:hover:bg-zinc-800">
                <i className="far fa-square-arrow-up-left text-xl me-2"></i>
               
                ثبت بازخورد
              </button>

              <button className="w-full border border-red-300 text-red-600 px-4 py-3 rounded-lg hover:bg-red-50 active:scale-95 transition duration-200 text-sm font-medium flex items-center justify-center dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
                <i className="far fa-trash-can me-2"></i>
                درخواست مرجوعی
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
