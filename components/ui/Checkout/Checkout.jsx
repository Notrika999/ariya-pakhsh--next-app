import Image from "next/image";
import React from "react";

export default function Checkout() {
  return (
    // <!-- START CONTENT /-->
    <section className="py-5">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* <!--Right section - Shopping cart products--> */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-custom-dark rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-0">
              {/* <!--Shopping cart header--> */}
              <div className="flex items-baseline justify-between mb-6">
                <h1
                  className="font-black text-lg mb-4 relative pb-4 text-gray-900 dark:text-gray-200
                                    before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary
                                    after:absolute after:w-40 after:h-2 after:bottom-0 after:inset-s-4 after:bg-primary after:rounded-lg"
                >
                  جزئیات سفارش
                </h1>
                <span className="text-gray-600 dark:text-gray-400">3 کالا</span>
              </div>

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

                {/* <!--Step 2 - Active--> */}
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
                        d="M2.25 8.25h19.5m-16.5 6h3m3 0h3m-9 5.25h12a2.25 2.25 0 002.25-2.25V7.5A2.25 2.25 0 0021.75 5.25H5.25A2.25 2.25 0 003 7.5v9.75A2.25 2.25 0 005.25 18.75z"
                      />
                    </svg>
                  </div>
                  <div className="timeline-title dark:text-white">
                    جزئیات سفارش
                  </div>
                </div>

                {/* <!--Step 3--> */}
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

              {/* <!--Personal information--> */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 me-2 text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  اطلاعات شخصی
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        نام
                      </label>
                      <input
                        type="text"
                        id="first-name"
                        className="w-full px-3 py-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
                        placeholder="نام خود را وارد کنید"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        نام خانوادگی
                      </label>
                      <input
                        type="text"
                        id="last-name"
                        className="w-full px-3 py-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
                        placeholder="نام خانوادگی خود را وارد کنید"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      شماره موبایل
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-3 py-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
                      placeholder="09xxxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      آدرس ایمیل (اختیاری)
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* <!--Delivery address--> */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 me-2 text-primary-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    آدرس تحویل
                  </h2>
                  <button className="text-primary-500 hover:text-primary-700 text-sm dark:text-gray-400 flex items-center">
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    افزودن آدرس جدید
                  </button>
                </div>

                {/* <!--Saved addresses--> */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                    آدرس‌های ذخیره شده
                  </h3>
                  <div className="space-y-3" id="saved-addresses">
                    <div
                      className="address-item border border-gray-300 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-primary-500 transition-all"
                      data-address-id="1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 me-2 text-primary-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-white">
                              آدرس منزل
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              علیرضا محمدی - ۰۹۱۲۱۲۳۴۵۶۷
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              تهران، خیابان ولیعصر، پلاک ۱۲۳، واحد ۴
                            </p>
                          </div>
                        </div>
                        <button className="text-primary-500 hover:text-primary-700 text-sm dark:text-gray-400">
                          انتخاب
                        </button>
                      </div>
                    </div>

                    <div
                      className="address-item border border-primary-500 rounded-lg p-4 cursor-pointer bg-blue-50 dark:bg-zinc-800 selected"
                      data-address-id="2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 me-2 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-white">
                              آدرس محل کار
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              علیرضا محمدی - ۰۹۳۵۵۵۵۶۷۸۹
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              تهران، میدان ونک، خیابان ملاصدرا، پلاک ۸۰
                            </p>
                          </div>
                        </div>
                        <button className="text-primary-500 hover:text-primary-700 text-sm dark:text-gray-400">
                          انتخاب
                        </button>
                      </div>
                    </div>

                    <div
                      className="address-item border border-gray-300 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-primary-500 transition-all"
                      data-address-id="3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 me-2 text-purple-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-white">
                              آدرس فروشگاه
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              رضا کریمی - ۰۹۱۹۸۷۶۵۴۳۲
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              کرج، عظیمیه، بلوار موذن، پلاک ۴۵
                            </p>
                          </div>
                        </div>
                        <button className="text-primary-500 hover:text-primary-700 text-sm dark:text-gray-400">
                          انتخاب
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!--New address form--> */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      آدرس کامل
                    </label>
                    <textarea
                      id="address"
                      className="w-full px-3 py-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
                      rows="3"
                      placeholder="آدرس کامل خود را وارد کنید"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        استان
                      </label>
                      <select
                        id="province"
                        className="w-full px-3 py-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
                      >
                        <option value="">انتخاب استان</option>
                        <option value="tehran">تهران</option>
                        <option value="alborz">البرز</option>
                        <option value="isfahan">اصفهان</option>
                        <option value="fars">فارس</option>
                        <option value="khorasan-razavi">خراسان رضوی</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        شهر
                      </label>
                      <select
                        id="city"
                        className="w-full px-3 py-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
                      >
                        <option value="">انتخاب شهر</option>
                        <option value="tehran">تهران</option>
                        <option value="karaj">کرج</option>
                        <option value="shahriar">شهریار</option>
                        <option value="eslamshahr">اسلامشهر</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      کد پستی
                    </label>
                    <input
                      type="text"
                      id="postal-code"
                      className="w-full px-3 py-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
                      placeholder="1234567890"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="save-address"
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="save-address"
                      className="ms-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      این آدرس را ذخیره کن
                    </label>
                  </div>
                </div>
              </div>

              {/* <!--Delivery time--> */}
              <div className="mb-8">
                <h2 className="font-bold text-lg mb-4 relative pb-4 before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary after:absolute after:w-40 after:h-0.5 after:bottom-0 after:inset-s-4 after:bg-primary after:rounded-lg">
                  زمان تحویل را انتخاب کنید
                </h2>

                <div className="mb-6">
                  <div
                    className="flex overflow-x-auto pb-2 space-x-2"
                    id="day-selector"
                  >
                    <button
                      className="shrink-0 px-4 py-2 rounded-lg font-medium day-option border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-blue-500/20 dark:hover:text-gray-200 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 selected"
                      data-day-id="1"
                      data-day-name="امروز - پنجشنبه"
                    >
                      امروز - پنجشنبه
                    </button>
                    <button
                      className="shrink-0 px-4 py-2 rounded-lg font-medium day-option border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-blue-500/20 dark:hover:text-gray-200"
                      data-day-id="2"
                      data-day-name="فردا - جمعه"
                    >
                      فردا - جمعه
                    </button>
                    <button
                      className="shrink-0 px-4 py-2 rounded-lg font-medium day-option border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-blue-500/20 dark:hover:text-gray-200"
                      data-day-id="3"
                      data-day-name="شنبه"
                    >
                      شنبه
                    </button>
                    <button
                      className="shrink-0 px-4 py-2 rounded-lg font-medium day-option border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-blue-500/20 dark:hover:text-gray-200"
                      data-day-id="4"
                      data-day-name="یکشنبه"
                    >
                      یکشنبه
                    </button>
                    <button
                      className="shrink-0 px-4 py-2 rounded-lg font-medium day-option border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-blue-500/20 dark:hover:text-gray-200"
                      data-day-id="5"
                      data-day-name="دوشنبه"
                    >
                      دوشنبه
                    </button>
                    <button
                      className="shrink-0 px-4 py-2 rounded-lg font-medium day-option border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      data-day-id="6"
                      data-day-name="سه‌شنبه"
                      disabled
                    >
                      سه‌شنبه
                    </button>
                  </div>
                </div>

                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  بازه زمانی تحویل
                </h3>
                <div className="grid grid-cols-2 gap-3" id="time-slots">
                  <button
                    className="py-3 px-4 border rounded-lg time-slot border-gray-300 dark:border-gray-600 hover:border-primary-500 hover:bg-blue-50 dark:hover:bg-primary-900/20"
                    data-slot-id="1"
                    data-slot-name="۹ صبح تا ۱۲ ظهر"
                    data-extra-cost="0"
                  >
                    <span className="block font-medium dark:text-white">
                      ۹ صبح تا ۱۲ ظهر
                    </span>
                    <span className="block text-sm mt-1 text-gray-600 dark:text-gray-400">
                      هزینه معمولی
                    </span>
                  </button>
                  <button
                    className="py-3 px-4 border rounded-lg time-slot border-gray-300 dark:border-gray-600 hover:border-primary-500 hover:bg-blue-50 dark:hover:bg-primary-900/20"
                    data-slot-id="2"
                    data-slot-name="۱۲ ظهر تا ۴ بعدازظهر"
                    data-extra-cost="0"
                  >
                    <span className="block font-medium dark:text-white">
                      ۱۲ ظهر تا ۴ بعدازظهر
                    </span>
                    <span className="block text-sm mt-1 text-gray-600 dark:text-gray-400">
                      هزینه معمولی
                    </span>
                  </button>
                  <button
                    className="py-3 px-4 border rounded-lg time-slot border-primary-500 bg-blue-50 dark:bg-zinc-800 selected"
                    data-slot-id="3"
                    data-slot-name="۴ بعدازظهر تا ۸ شب"
                    data-extra-cost="0"
                  >
                    <span className="block font-medium dark:text-white">
                      ۴ بعدازظهر تا ۸ شب
                    </span>
                    <span className="block text-sm mt-1 text-gray-600 dark:text-gray-400">
                      هزینه معمولی
                    </span>
                  </button>
                  <button
                    className="py-3 px-4 border rounded-lg time-slot border-gray-300 dark:border-gray-600 hover:border-primary-500 hover:bg-blue-50 dark:hover:bg-primary-900/20"
                    data-slot-id="4"
                    data-slot-name="۸ شب تا ۱۲ شب"
                    data-extra-cost="10000"
                  >
                    <span className="block font-medium dark:text-white">
                      ۸ شب تا ۱۲ شب
                    </span>
                    <span className="block text-sm mt-1 text-gray-600 dark:text-gray-400">
                      هزینه +۱۰,۰۰۰ تومان
                    </span>
                  </button>
                </div>
              </div>

              {/* <!--Sending method--> */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 me-2 text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                    />
                  </svg>
                  روش ارسال
                </h2>

                <div className="space-y-4">
                  <div
                    className="shipping-method border border-gray-300 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-primary-500 transition-all"
                    data-shipping-id="1"
                    data-shipping-cost="15000"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center me-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-green-600 dark:text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">
                            پیک موتوری
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            تحویل در همان روز - مناسب برای مراکز شهر
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-gray-800 dark:text-white">
                          ۱۵,۰۰۰ تومان
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="shipping-method border border-primary-500 rounded-lg p-4 cursor-pointer bg-blue-50 dark:bg-zinc-800 selected"
                    data-shipping-id="2"
                    data-shipping-cost="25000"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center me-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-primary-600 dark:text-primary-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">
                            پست پیشتاز
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            تحویل ۲-۳ روز کاری - سراسر کشور
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-gray-800 dark:text-white">
                          ۲۵,۰۰۰ تومان
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="shipping-method border border-gray-300 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-primary-500 transition-all"
                    data-shipping-id="3"
                    data-shipping-cost="30000"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center me-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-purple-600 dark:text-purple-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">
                            پس کرایه
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            پرداخت در محل - هزینه ارسال: ۳۰,۰۰۰ تومان
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-gray-800 dark:text-white">
                          ۳۰,۰۰۰ تومان
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!--Payment method--> */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 me-2 text-primary-500"
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
                  روش پرداخت
                </h2>

                <div className="space-y-4">
                  <div
                    className="payment-method border border-primary-500 rounded-lg p-4 cursor-pointer bg-blue-50 dark:bg-zinc-800 selected"
                    data-payment-id="1"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center me-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-primary-600 dark:text-primary-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          درگاه پرداخت آنلاین
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          پرداخت امن با کلیه کارت‌های عضو شتاب
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="payment-method border border-gray-300 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-primary-500 transition-all"
                    data-payment-id="2"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center me-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-600 dark:text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          پرداخت در محل
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          پرداخت نقدی یا کارتخوان هنگام تحویل کالا
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="payment-method border border-gray-300 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-primary-500 transition-all"
                    data-payment-id="3"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center me-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-orange-600 dark:text-orange-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          کیف پول الکترونیکی
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          پرداخت از طریق موجودی کیف پول
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Left Section - Shopping Cart Summary --> */}
          <div>
            <div className="bg-white dark:bg-custom-dark rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-0">
              <h2
                className="font-black text-lg mb-4 relative pb-4 text-gray-900 dark:text-gray-200
                before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary
                after:absolute after:w-40 after:h-2 after:bottom-0 after:inset-s-4 after:bg-primary after:rounded-lg"
              >
                خلاصه سفارش
              </h2>

              {/* <!-- Products --> */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center me-3">
                      <Image
                        width={56}
                        height={56}
                        src="/images/product/wach-1.png"
                        alt=""
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        ساعت هوشمند اپل
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        1 عدد - رنگ مشکی
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    ۲۸,۵۰۰,۰۰۰ تومان
                  </span>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center me-3">
                      <Image
                        width={56}
                        height={56}
                        src="/images/product/wach-3.png"
                        alt=""
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        ساعت هوشمند سامسونگ
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        1 عدد - رنگ سفید
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    ۱۰,۹۰۰,۰۰۰ تومان
                  </span>
                </div>
              </div>

              {/* <!--Cost Summary--> */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    جمع کل:
                  </span>
                  <span
                    className="text-gray-800 dark:text-gray-200"
                    id="subtotal"
                  >
                    ۳۹,۴۰۰,۰۰۰ تومان
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    تخفیف:
                  </span>
                  <span
                    className="text-green-600 dark:text-green-400"
                    id="discount"
                  >
                    -۴,۱۰۰,۰۰۰ تومان
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    هزینه ارسال:
                  </span>
                  <span
                    className="text-gray-800 dark:text-gray-200"
                    id="shipping-cost"
                  >
                    ۲۵,۰۰۰ تومان
                  </span>
                </div>
                <div
                  className="justify-between hidden flex"
                  id="delivery-time-cost-container"
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    هزینه زمان تحویل:
                  </span>
                  <span
                    className="text-gray-800 dark:text-gray-200"
                    id="delivery-time-cost"
                  >
                    ۰ تومان
                  </span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-800 dark:text-gray-200 font-bold">
                      مبلغ قابل پرداخت:
                    </span>
                    <span
                      className="text-gray-800 dark:text-gray-200 font-bold text-lg"
                      id="total-cost"
                    >
                      ۳۵,۳۲۵,۰۰۰ تومان
                    </span>
                  </div>
                </div>
              </div>

              {/* <!--Choice details--> */}
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                  جزئیات انتخاب‌ها
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">
                      روش ارسال:
                    </span>
                    <span
                      className="text-blue-800 dark:text-blue-200"
                      id="selected-shipping"
                    >
                      پست پیشتاز
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">
                      زمان تحویل:
                    </span>
                    <span
                      className="text-blue-800 dark:text-blue-200"
                      id="selected-delivery-time"
                    >
                      فردا - ۴ بعدازظهر تا ۸ شب
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">
                      روش پرداخت:
                    </span>
                    <span
                      className="text-blue-800 dark:text-blue-200"
                      id="selected-payment"
                    >
                      درگاه پرداخت آنلاین
                    </span>
                  </div>
                </div>
              </div>

              {/* <!--Discount code--> */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  کد تخفیف
                </label>
                <div className="flex">
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-s-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-gray-200"
                    placeholder="کد تخفیف را وارد کنید"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-e-lg transition-colors">
                    اعمال
                  </button>
                </div>
              </div>

              {/* <!--Payment button--> */}
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                پرداخت و تکمیل سفارش
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                با کلیک بر روی دکمه پرداخت،
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500"
                >
                  قوانین و شرایط
                </a>
                را پذیرفته‌اید.
              </p>
            </div>

            {/* <!--Security info--> */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start">
                <i className="fas fa-shield-alt text-blue-500 dark:text-blue-300 mt-1 me-2"></i>
                <div>
                  <h3 className="font-medium text-blue-800 dark:text-blue-300">
                    پرداخت امن
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                    اطلاعات شما نزد ما کاملا محفوظ است و پرداخت از طریق درگاه
                    امن بانکی انجام می‌شود.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
