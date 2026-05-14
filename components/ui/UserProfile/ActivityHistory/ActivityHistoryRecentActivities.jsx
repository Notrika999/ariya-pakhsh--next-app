import React from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";

export default function ActivityHistoryRecentActivities() {
  return (
    <div id="recent-activities" className="tab-content space-y-6">
      {/* <!-- Activities Timeline --> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"فعالیت‌های اخیر شما"} />
        <div className="relative">
          {/* <!-- Timeline --> */}
          <div className="space-y-8">
            {/* <!-- Activity 1 - Purchase --> */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <i className="far fa-check text-green-600 dark:text-green-400"></i>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    خرید موفق
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ۱۴۰۲/۱۱/۰۵ - ۱۴:۳۰
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  سفارش #ORD-7842 با مبلغ ۱,۲۰۰,۰۰۰ تومان ثبت شد
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                    تحویل شده
                  </span>
                </div>
              </div>
            </div>

            {/* <!-- Activity 2 - Comment --> */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <i className="far fa-star text-blue-600 dark:text-blue-400"></i>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    ثبت نظر
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ۱۴۰۲/۱۱/۰۵ - ۱۱:۱۵
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  شما برای محصول گوشی موبایل سامسونگ گلکسی A73 نظر ثبت کردید
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                    در انتظار تأیید
                  </span>
                </div>
              </div>
            </div>

            {/* <!-- Activity 3 - Product View --> */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <i className="far fa-eye text-purple-600 dark:text-purple-400"></i>
                
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    مشاهده محصول
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ۱۴۰۲/۱۱/۰۴ - ۱۶:۴۵
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  محصول قاب محافظ گوشی سامسونگ گلکسی A73 را مشاهده کردید
                </p>
                <div className="mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    مدت زمان بازدید: ۳ دقیقه
                  </span>
                </div>
              </div>
            </div>

            {/* <!-- Activity 4 - Ticket --> */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <i className="far fa-question-circle text-orange-600 dark:text-orange-400"></i>
                
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    ثبت تیکت پشتیبانی
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ۱۴۰۲/۱۱/۰۳ - ۱۰:۲۰
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  تیکت پشتیبانی #TKT-4591 با موضوع مشکل در صفحه نمایش ثبت شد
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                    در حال بررسی
                  </span>
                </div>
              </div>
            </div>

            {/* <!-- Activity 5 - Wishlist --> */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                <i className="far fa-heart text-pink-600 dark:text-pink-400"></i>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    افزودن به علاقه‌مندی‌ها
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ۱۴۰۲/۱۱/۰۲ - ۱۴:۱۵
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  محصول هدفون بلوتوث سونی به لیست علاقه‌مندی‌ها اضافه شد
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Activity Statistics --> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"آمار فعالیت‌ها"} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* <!-- Total Views --> */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="far fa-eye text-white"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              بازدید محصولات
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              ۴۷
            </p>
          </div>

          {/* <!-- Purchases --> */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="far fa-cart-shopping text-white"></i>
              
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              خریدها
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              ۱۲
            </p>
          </div>

          {/* <!-- Comments --> */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="far fa-star text-white"></i>
             
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              نظرات
            </h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              ۸
            </p>
          </div>

          {/* <!-- Tickets --> */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="far fa-question-circle text-white"></i>
              
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              تیکت‌ها
            </h3>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              ۵
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
