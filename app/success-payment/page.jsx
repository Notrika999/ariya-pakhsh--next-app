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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                ></path>
              </svg>
            </div>
            <div className="timeline-title">سبد خرید</div>
          </div>

          {/* <!--Step 2 - Completed--> */}
          <div className="timeline-step completed flex flex-col items-center text-center">
            <div className="timeline-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                ></path>
              </svg>
            </div>
            <div className="timeline-title">جزئیات سفارش</div>
          </div>

          {/* <!--Step 3 - Completed --> */}
          <div className="timeline-step completed flex flex-col items-center text-center">
            <div className="timeline-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                ></path>
              </svg>
            </div>
            <div className="timeline-title">تایید</div>
          </div>

          {/* <!--Step 3 - Completed --> */}
          <div className="timeline-step completed flex flex-col items-center text-center">
            <div className="timeline-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                ></path>
              </svg>
            </div>
            <div className="timeline-title">تکمیل</div>
          </div>
        </div>

        {/* <!-- Content --> */}
        <div className="max-w-md w-full mx-auto">
          {/* <!--Original card--> */}
          <div className="bg-white dark:bg-custom-dark rounded-2xl shadow-xl overflow-hidden border border-green-200 dark:border-green-800">
            {/* <!-- Header --> */}
            <div className="bg-gradient-to-l from-green-500 to-emerald-600 p-6 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-10 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 me-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                    />
                  </svg>
                  مشاهده سفارش
                </a>
                <a
                  href="/tracking"
                  className="w-full bg-primary hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 me-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                    />
                  </svg>
                  پیگیری ارسال
                </a>
                <Link
                  href="/"
                  className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 me-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
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
