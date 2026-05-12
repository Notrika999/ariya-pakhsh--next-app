import Image from "next/image";
import React from "react";

export default function AcceptPay() {
  return (
    <section className="py-5">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-800 dark:text-gray-300 mb-4">
            تایید سفارش
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            لطفاً اطلاعات سفارش خود را بررسی کرده و در صورت صحیح بودن، پرداخت را
            انجام دهید.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* <!--Right column - Order details--> */}
          <div className="lg:col-span-2 space-y-6">
            {/* <!--Order Summary--> */}
            <div className="bg-white dark:bg-custom-dark rounded-xl shadow-md p-6 ">
              {/* <!--Horizontal timeline--> */}
              <div className="timeline-horizontal mb-8 flex items-center justify-between">
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

                {/* <!--Step 3 Active--> */}
                <div className="timeline-step active flex flex-col items-center text-center">
                  <div className="timeline-icon dark:bg-gray-700 dark:text-gray-200">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="timeline-title dark:text-white">تأیید</div>
                </div>

                {/* <!--Step 4--> */}
                <div className="timeline-step flex flex-col items-center text-center">
                  <div className="timeline-icon dark:bg-gray-700 dark:text-gray-200">
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
                      />
                    </svg>
                  </div>
                  <div className="timeline-title dark:text-white">تکمیل</div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-300 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                خلاصه سفارش
              </h2>

              <div className="space-y-4">
                {/* <!--Product item--> */}
                <div className="flex justify-between items-center rounded-lg border border-gray-200 dark:border-gray-700 p-3 border-b bg-custom-light dark:bg-zinc-800">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center me-4">
                      <Image
                        width={64}
                        height={64}
                        src="/images/product/television-2.png"
                        alt=""
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-300">
                        تلویزیون lg
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        اندازه: 42 اینج | رنگ: مشکی
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800 dark:text-gray-300">
                      1,250,000 تومان
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      تعداد: 1
                    </p>
                  </div>
                </div>

                {/* <!--Product item--> */}
                <div className="flex justify-between items-center rounded-lg border border-gray-200 dark:border-gray-700 p-3 border-b bg-custom-light dark:bg-zinc-800">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center me-4">
                      <Image
                        width={64}
                        height={64}
                        src="/images/product/television-1.png"
                        alt=""
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-300">
                        تلویزیون snowa
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        سایز: 60 اینج | رنگ: آبی
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800 dark:text-gray-300">
                      320,000 تومان
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      تعداد: 2
                    </p>
                  </div>
                </div>

                {/* <!--Price calculations--> */}
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      جمع کل:
                    </span>
                    <span className="font-medium">1,890,000 تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      هزینه ارسال:
                    </span>
                    <span className="font-medium">45,000 تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      تخفیف:
                    </span>
                    <span className="font-medium text-green-600">
                      -75,000 تومان
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-base font-bold text-gray-800 dark:text-gray-300">
                      مبلغ قابل پرداخت:
                    </span>
                    <span className="text-base font-bold text-primary-500">
                      1,860,000 تومان
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* <!--Shipping information--> */}
            <div className="bg-white dark:bg-custom-dark rounded-xl shadow-md p-6 ">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-300 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                اطلاعات ارسال
              </h2>

              <div className="space-y-4">
                {/* <!--Selected address--> */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-custom-light dark:bg-zinc-800">
                  <div className="flex items-start">
                    <div className="me-3 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-800 dark:text-gray-300">
                          آدرس منزل
                        </h3>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          پیش‌فرض
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        تهران، خیابان ولیعصر، کوچه فلان، پلاک ۱۲، واحد ۵
                      </p>
                      <div className="mt-3 flex text-sm text-gray-500 dark:text-gray-400">
                        <span className="me-4">محمد احمدی</span>
                        <span>۰۹۱۲۱۲۳۴۵۶۷</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!--Selected shipping method--> */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-custom-light dark:bg-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-gray-300">
                        پست پیشتاز
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        تحویل ۲ تا ۴ روز کاری
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800 dark:text-gray-300">
                        45,000 تومان
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!--Left column - Summary and actions--> */}
          <div className="space-y-6">
            {/* <!--Final summary--> */}
            <div className="bg-white dark:bg-custom-dark rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-300 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                خلاصه نهایی
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    جمع اقلام (۳ قلم)
                  </span>
                  <span className="font-medium">1,890,000 تومان</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    هزینه ارسال
                  </span>
                  <span className="font-medium">45,000 تومان</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    تخفیف
                  </span>
                  <span className="font-medium text-green-600">
                    -75,000 تومان
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-base font-bold text-gray-800 dark:text-gray-300">
                    مبلغ نهایی
                  </span>
                  <span className="text-base font-bold text-primary-500">
                    1,860,000 تومان
                  </span>
                </div>
              </div>
            </div>

            {/* <!-- Actions --> */}
            <div className="bg-white dark:bg-custom-dark rounded-xl shadow-md p-6 ">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-300 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                اقدامات
              </h2>

              <div className="space-y-4">
                <button
                 
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  پرداخت و تکمیل سفارش
                </button>

                <a
                  href="/shipping"
                  className="w-full dark:text-white dark:hover:text-gray-800 border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  بازگشت به اطلاعات ارسال
                </a>

                <a
                  href="/cart"
                  className="w-full dark:text-white dark:hover:text-gray-800 border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  بازگشت به سبد خرید
                </a>
              </div>
            </div>

            {/* <!--Additional information--> */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 ">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ms-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    توجه
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                    <p>
                      پس از کلیک بر روی دکمه پرداخت و تکمیل سفارش، به درگاه
                      پرداخت هدایت خواهید شد.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
