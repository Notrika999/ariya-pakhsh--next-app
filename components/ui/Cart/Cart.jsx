import Image from "next/image";
import React from "react";

export default function Cart() {
  return (
    // <!-- START CONTENT -->
    <section className="py-5">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* <!--Right section - Shopping cart products--> */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-custom-dark rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {/* <!--Shopping cart header--> */}
              <div className="flex items-baseline justify-between mb-6">
                <h1
                  className="font-black text-lg mb-4 relative pb-4 text-gray-900 dark:text-gray-200
                            before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary
                            after:absolute after:w-40 after:h-2 after:bottom-0 after:inset-s-4 after:bg-primary after:rounded-lg"
                >
                  سبد خرید
                </h1>
                <span className="text-gray-600 dark:text-gray-400">3 کالا</span>
              </div>

              {/* <!-- Horizontal Timeline --> */}
              <div className="timeline-horizontal mb-8 flex items-center justify-between">
                {/* <!-- Step 1 - Active --> */}
                <div className="timeline-step active flex flex-col items-center text-center">
                  <div className="timeline-icon bg-primary text-white dark:bg-primary-500">
                    {/* <!-- Heroicon: Shopping Cart --> */}
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
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0L6.75 12.75m-1.644-7.478h13.052c.883 0 1.542.83 1.349 1.69l-1.2 5.25a1.35 1.35 0 01-1.312 1.06H6.75m0 0L5.25 6.75m1.5 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm10.5 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                      />
                    </svg>
                  </div>
                  <div className="timeline-title dark:text-white">سبد خرید</div>
                </div>

                {/* <!-- Step 2 --> */}
                <div className="timeline-step flex flex-col items-center text-center">
                  <div className="timeline-icon dark:bg-gray-700 dark:text-gray-200">
                    {/* <!-- Heroicon: Credit Card --> */}
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
                        d="M2.25 8.25h19.5m-16.5 6h3m3 0h3m-9 5.25h12a2.25 2.25 0 002.25-2.25V7.5A2.25 2.25 0 0021.75 5.25H5.25A2.25 2.25 0 003 7.5v9.75A2.25 2.25 0 005.25 18.75z"
                      />
                    </svg>
                  </div>
                  <div className="timeline-title dark:text-white">
                    جزییات سفارش
                  </div>
                </div>

                {/* <!-- Step 3 --> */}
                <div className="timeline-step flex flex-col items-center text-center">
                  <div className="timeline-icon dark:bg-gray-700 dark:text-gray-200">
                    {/* <!-- Heroicon: Badge Check --> */}
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

                {/* <!-- Step 4 --> */}
                <div className="timeline-step flex flex-col items-center text-center">
                  <div className="timeline-icon dark:bg-gray-700 dark:text-gray-200">
                    {/* <!-- Heroicon: Check --> */}
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

              {/* <!--Product List--> */}
              <div className="space-y-4">
                {/* <!--Product 1--> */}
                <div className="flex flex-wrap sm:space-y-0 space-y-5 dark:bg-zinc-800 bg-custom-light cart-item items-start space-x-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <img src="/images/product/mobile-2.png" alt="" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="font-bold text-gray-800 dark:text-white">
                      گوشی موبایل اپل مدل iPhone 16 Pro
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      رنگ: مشکی - ظرفیت: 256GB
                    </p>
                    {/* <!--Counter--> */}
                    <div className="flex items-center space-x-4">
                      <div className="flex bg-white dark:bg-zinc-700 items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                        <button className="cart-btn-minus w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="px-3 py-1 text-gray-800 dark:text-white">
                          1
                        </span>
                        <button className="cart-btn-plus w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                      <button className="cart-btn-trash text-red-500 hover:text-red-700 transition-colors flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 me-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        حذف
                      </button>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-gray-700 dark:text-gray-300 flex flex-col items-center">
                      <div className="flex justify-between items-center">
                        <del className="text-zinc-400 dark:text-zinc-500">
                          <span>100000000</span>
                        </del>
                        <div className="bg-secondary-500 text-white text-xs ms-2 font-bold px-2 py-1 rounded-xl rounded-bl-md shadow shadow-red-500/50 z-10">
                          35%
                        </div>
                      </div>
                      <span className="text-xl inline-block mt-2 font-bold dark:text-white">
                        90,000,000
                        <span className="text-xs font-bold -rotate-90 dark:text-zinc-300">
                          تومان
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                {/* <!--Product 2--> */}
                <div className="flex flex-wrap sm:space-y-0 space-y-5 dark:bg-zinc-800 bg-custom-light cart-item items-start space-x-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Image width={80} height={80} src="/images/product/mobile-2.png" alt="" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="font-bold text-gray-800 dark:text-white">
                      گوشی موبایل اپل مدل iPhone 16 Pro
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      رنگ: مشکی - ظرفیت: 256GB
                    </p>
                    {/* <!--Counter--> */}
                    <div className="flex items-center space-x-4">
                      <div className="flex bg-white dark:bg-zinc-700 items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                        <button className="cart-btn-minus w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="px-3 py-1 text-gray-800 dark:text-white">
                          1
                        </span>
                        <button className="cart-btn-plus w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                      <button className="cart-btn-trash text-red-500 hover:text-red-700 transition-colors flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 me-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        حذف
                      </button>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-gray-700 dark:text-gray-300 flex flex-col items-center">
                      <span className="text-xl inline-block mt-2 font-bold dark:text-white">
                        90,000,000
                        <span className="text-xs font-bold -rotate-90 dark:text-zinc-300">
                          تومان
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Left Section - Shopping Cart Summary --> */}
          <div className="space-y-6">
            {/* <!--Shopping Cart Summary--> */}
            <div className="bg-white sticky top-0 dark:bg-custom-dark rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2
                className="font-black text-lg mb-4 relative pb-4 text-gray-900 dark:text-gray-200
                            before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary
                            after:absolute after:w-40 after:h-2 after:bottom-0 after:inset-s-4 after:bg-primary after:rounded-lg"
              >
                خلاصه سفارش
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    جمع کل:
                  </span>
                  <span className="text-gray-800 dark:text-white">
                    ۱۱۹,۳۰۰,۰۰۰ تومان
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    تخفیف:
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    ۱۰,۴۰۰,۰۰۰ تومان
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    هزینه ارسال:
                  </span>
                  <span className="text-gray-800 dark:text-white">رایگان</span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-800 dark:text-white font-bold">
                      مبلغ قابل پرداخت:
                    </span>
                    <span className="text-gray-800 dark:text-white font-bold text-lg">
                      ۱۰۸,۹۰۰,۰۰۰ تومان
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-primary hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 me-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                ادامه فرآیند پرداخت
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
