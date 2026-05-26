import Image from "next/image";
import React from "react";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";

export default function Cart() {
  return (
    <SectionContainer>
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
                  <i className="far fa-cart-shopping"></i>
                </div>
                <div className="timeline-title dark:text-white">سبد خرید</div>
              </div>

              {/* <!-- Step 2 --> */}
              <div className="timeline-step flex flex-col items-center text-center">
                <div className="timeline-icon dark:bg-gray-700 dark:text-gray-200">
                  {/* <!-- Heroicon: Credit Card --> */}
                  <i className="far fa-credit-card"></i>
                </div>
                <div className="timeline-title dark:text-white">
                  جزییات سفارش
                </div>
              </div>

              {/* <!-- Step 3 --> */}
              <div className="timeline-step flex flex-col items-center text-center">
                <div className="timeline-icon dark:bg-gray-700 dark:text-gray-200">
                  {/* <!-- Heroicon: Badge Check --> */}
                  <i className="far fa-circle-check"></i>
                </div>
                <div className="timeline-title dark:text-white">تأیید</div>
              </div>

              {/* <!-- Step 4 --> */}
              <div className="timeline-step flex flex-col items-center text-center">
                <div className="timeline-icon dark:bg-gray-700 dark:text-gray-200">
                  {/* <!-- Heroicon: Check --> */}
                  <i className="far fa-check"></i>
                </div>
                <div className="timeline-title dark:text-white">تکمیل</div>
              </div>
            </div>

            {/* <!--Product List--> */}
            <div className="space-y-4">
              {/* <!--Product 1--> */}
              <div className="flex flex-wrap sm:space-y-0 space-y-5 dark:bg-zinc-800 bg-custom-light cart-item items-start space-x-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Image
                    width={80}
                    height={80}
                    src="/images/product/mobile-2.png"
                    // src=?? "/images/default.png"

                    alt=""
                  />
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
                        -
                      </button>
                      <span className="px-3 py-1 text-gray-800 dark:text-white">
                        1
                      </span>
                      <button className="cart-btn-plus w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400">
                        +
                      </button>
                    </div>
                    <button className="cart-btn-trash text-red-500 hover:text-red-700 transition-colors flex items-center">
                      <i className="far fa-trash-can text-sm"></i>
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
                  <Image
                    width={80}
                    height={80}
                    src="/images/product/mobile-2.png"
                    // src=?? "/images/default.png"
                    alt=""
                  />
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
                        -
                      </button>
                      <span className="px-3 py-1 text-gray-800 dark:text-white">
                        1
                      </span>
                      <button className="cart-btn-plus w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400">
                        +
                      </button>
                    </div>
                    <button className="cart-btn-trash text-red-500 hover:text-red-700 transition-colors flex items-center">
                      <i className="far fa-trash-can text-sm"></i>
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
                <span className="text-gray-600 dark:text-gray-400">تخفیف:</span>
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
              <i className="far fa-credit-card me-1"></i>
              ادامه فرآیند پرداخت
            </button>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
