import Image from "next/image";
import Link from "next/link";
import React from "react";

function SuccessPayment() {
  return (
    // <!-- START CONTENT -->
    <section className="py-5">
      <div className="container mx-auto">
        {/* <!--Horizontal timeline--> */}
        <div className="timeline-horizontal mb-8 flex items-center justify-between relative">
          {/* <!--Step 1 - Completed--> */}
          <div className="timeline-step completed flex flex-col items-center text-center">
            <div className="timeline-icon">
              <i className="fa fa-check"></i>
            </div>
            <div className="timeline-title">سبد خرید</div>
          </div>

          {/* <!--Step 2 - Completed--> */}
          <div className="timeline-step completed flex flex-col items-center text-center">
            <div className="timeline-icon">
              <i className="fa fa-check"></i>
            </div>
            <div className="timeline-title">جزئیات سفارش</div>
          </div>

          {/* <!--Step 3 - Completed --> */}
          <div className="timeline-step completed flex flex-col items-center text-center">
            <div className="timeline-icon">
              <i className="fa fa-check"></i>
            </div>
            <div className="timeline-title">تایید</div>
          </div>

          {/* <!--Step 3 - Completed --> */}
          <div className="timeline-step completed flex flex-col items-center text-center">
            <div className="timeline-icon">
              <i className="fa fa-check"></i>
            </div>
            <div className="timeline-title">تکمیل</div>
          </div>
        </div>

        {/* <!-- Content --> */}
        <div className="max-w-md w-full mx-auto">
          {/* <!--Original card--> */}
          <div className="bg-white dark:bg-custom-dark rounded-2xl shadow-xl overflow-hidden border border-green-200 dark:border-green-800">
            {/* <!-- Header --> */}
            <div className="bg-linear-to-l from-green-500 to-emerald-600 p-6 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <i className="fa fa-check text-2xl text-white"></i>
              </div>
              <h1 className="text-2xl font-black text-white">پرداخت موفق</h1>
              <p className="text-green-100 mt-2">
                پرداخت شما با موفقیت انجام شد
              </p>
            </div>

            {/* <!-- Content --> */}
            <div className="p-6">
              {/* <!--Payment information--> */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600 dark:text-gray-300">
                    شماره تراکنش:
                  </span>
                  <span className="text-gray-800 dark:text-white font-bold text-sm">
                    TX-85967423
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600 dark:text-gray-300">
                    مبلغ پرداختی:
                  </span>
                  <span className="text-gray-800 dark:text-white font-bold text-sm">
                    ۲,۵۴۰,۰۰۰ تومان
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    تاریخ پرداخت:
                  </span>
                  <span className="text-gray-800 dark:text-white font-bold text-sm">
                    ۱۴۰۲/۰۸/۲۵ - ۱۵:۴۷
                  </span>
                </div>
              </div>

              {/* <!--Purchased product--> */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3">
                  محصول خریداری شده
                </h3>
                <div className="flex items-center space-x-3 ">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Image
                      width={100}
                      height={100}
                      src="/images/product/wach-1.png"
                      // src=?? "/images/default.png"
                      alt=""
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      گوشی موبایل اپل مدل iPhone 16 Pro
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      رنگ: مشکی - ظرفیت: 256GB
                    </p>
                  </div>
                </div>
              </div>

              {/* <!--Order status--> */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-2  mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>

                  <span className="font-medium text-gray-800 dark:text-white">
                    وضعیت سفارش:
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  سفارش شما ثبت شد و در حال آماده‌سازی است. به زودی اطلاعات
                  ارسال برای شما پیامک خواهد شد.
                </p>
              </div>

              {/* <!--Action buttons--> */}
              <div className="space-y-3">
                <a
                  href="/orders"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <i className="fab fa-wpforms me-2"></i>
                  مشاهده سفارش
                </a>
                <a
                  href="/tracking"
                  className="w-full bg-primary hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <i className="far fa-truck me-2"></i>
                  پیگیری ارسال
                </a>
                <Link
                  href="/"
                  className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <i className="far fa-home me-2 mb-1"></i>
                  بازگشت به صفحه اصلی
                </Link>
              </div>
            </div>
          </div>

          {/* <!--Additional information--> */}
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>در صورت وجود هرگونه سوال، با پشتیبانی تماس بگیرید:</p>
            <p className="font-medium mt-1">۰۲۱-۸۸۵۶۱۲۴۵</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SuccessPayment;

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};