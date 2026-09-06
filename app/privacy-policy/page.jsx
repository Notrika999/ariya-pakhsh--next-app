import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import { absoluteUrl } from "@/src/lib/seo/site";
import React from "react";

export const metadata = {
  alternates: {
    canonical: absoluteUrl("/privacy-policy"),
  },
};

function PrivacyPolicy() {
  return (
    // <!-- START CONTENT /-->
    <section className="py-5">
      <div className="container mx-auto">
        {/* <!--Page header--> */}
        <div className="text-center mb-12">
          {/*  */}
          {<TitleAfter title={"سیاست حفظ حریم خصوصی"} tag={true} />}
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            ما در دیارا استور به حریم خصوصی شما احترام می‌گذاریم. این سند توضیح
            می‌دهد که چگونه اطلاعات شخصی شما را جمع‌آوری، استفاده و محافظت
            می‌کنیم.
          </p>
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <span>آخرین بروزرسانی: ۱ دی ۱۴۰۲</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* <!-- Sidebar --> */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 dark:bg-custom-dark dark:border dark:border-gray-700">
              <TitleAfter title={"فهرست مطالب"} />
              <nav className="space-y-2">
                <a
                  href="#info-collection"
                  className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  اطلاعاتی که جمع‌آوری می‌کنیم
                </a>
                <a
                  href="#info-usage"
                  className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  نحوه استفاده از اطلاعات
                </a>
                <a
                  href="#info-sharing"
                  className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  اشتراک‌گذاری اطلاعات
                </a>
                <a
                  href="#cookies"
                  className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  کوکی‌ها و فناوری‌های مشابه
                </a>
                <a
                  href="#data-security"
                  className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  امنیت داده‌ها
                </a>
                <a
                  href="#user-rights"
                  className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  حقوق کاربران
                </a>
                <a
                  href="#children-privacy"
                  className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  حریم خصوصی کودکان
                </a>
                <a
                  href="#policy-changes"
                  className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  تغییرات سیاست
                </a>
                <a
                  href="#contact"
                  className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  تماس با ما
                </a>
              </nav>
            </div>
          </div>

          {/* <!--Main content--> */}
          <div className="lg:col-span-3 space-y-8">
            {/* <!--Part 1--> */}
            <div
              id="info-collection"
              className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
            >
              <TitleAfter title={"اطلاعاتی که جمع‌آوری می‌کنیم"} />

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>ما اطلاعات زیر را از کاربران جمع‌آوری می‌کنیم:</p>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-3">
                    اطلاعات شخصی
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>نام و نام خانوادگی</li>
                    <li>آدرس ایمیل</li>
                    <li>شماره تلفن</li>
                    <li>آدرس پستی</li>
                    <li>اطلاعات پرداخت (از طریق درگاه‌های امن)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-3">
                    اطلاعات فنی
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>آی‌پی آدرس</li>
                    <li>نوع مرورگر و دستگاه</li>
                    <li>سیستم عامل</li>
                    <li>اطلاعات لاگ سرور</li>
                    <li>کوکی‌ها و داده‌های مشابه</li>
                  </ul>
                </div>

                <p className="mt-4">
                  این اطلاعات برای ارائه خدمات بهتر، پردازش سفارشات و بهبود
                  تجربه کاربری جمع‌آوری می‌شوند.
                </p>
              </div>
            </div>

            {/* <!--Part 2--> */}
            <div
              id="info-usage"
              className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
            >
              <TitleAfter title={"نحوه استفاده از اطلاعات"} />

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>اطلاعات جمع‌آوری شده برای اهداف زیر استفاده می‌شوند:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-start space-x-3 ">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center shrink-0">
                      <i className="far fa-bag-shopping text-blue-600 dark:text-blue-400"></i>
                     
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">
                        پردازش سفارشات
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        انجام خرید و تحویل محصولات
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 ">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">
                        پشتیبانی مشتریان
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        پاسخ به سوالات و حل مشکلات
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 ">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4 text-purple-600 dark:text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">
                        بهبود خدمات
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        توسعه و ارتقای ویژگی‌های جدید
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 ">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center shrink-0">
                      <i className="far fa-circle-exclamation text-sm text-yellow-600 dark:text-yellow-400"></i>
                      
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">
                        ارتباطات بازاریابی
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        ارسال اخبار و پیشنهادات ویژه
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!--Part 3--> */}
            <div
              id="info-sharing"
              className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
            >
              <TitleAfter title={"اشتراک‌گذاری اطلاعات"} />

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  ما اطلاعات شخصی شما را به اشخاص ثالث نمی‌فروشیم. اطلاعات فقط
                  در موارد زیر اشتراک‌گذاری می‌شوند:
                </p>

                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mt-4">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-orange-500 dark:text-orange-400 mt-0.5 me-2 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <h4 className="font-bold text-orange-800 dark:text-orange-300">
                        تأمین‌کنندگان خدمات
                      </h4>
                      <p className="text-orange-700 dark:text-orange-400 text-sm mt-1">
                        شرکت‌های حمل و نقل، پردازش پرداخت و خدمات پشتیبانی که به
                        ما در ارائه خدمات کمک می‌کنند.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 me-2 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <h4 className="font-bold text-blue-800 dark:text-blue-300">
                        الزامات قانونی
                      </h4>
                      <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">
                        در صورت درخواست مقامات قضایی یا رعایت قوانین و مقررات.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 me-2 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <h4 className="font-bold text-green-800 dark:text-green-300">
                        حفاظت از حقوق
                      </h4>
                      <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                        برای بررسی تخلفات احتمالی، اعمال شرایط استفاده یا محافظت
                        از حقوق، اموال یا ایمنی ما و کاربران.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!--Part 4--> */}
            <div
              id="cookies"
              className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
            >
              <TitleAfter title={"کوکی‌ها و فناوری‌های مشابه"} />

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  ما از کوکی‌ها و فناوری‌های مشابه برای بهبود تجربه کاربری
                  استفاده می‌کنیم:
                </p>

                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-sm text-right text-gray-700 dark:text-gray-300">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th className="px-4 py-3">نوع کوکی</th>
                        <th className="px-4 py-3">هدف</th>
                        <th className="px-4 py-3">مدت زمان</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-4 py-3 font-medium">
                          کوکی‌های ضروری
                        </td>
                        <td className="px-4 py-3">عملکرد اصلی سایت</td>
                        <td className="px-4 py-3">جلسه</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-4 py-3 font-medium">
                          کوکی‌های عملکردی
                        </td>
                        <td className="px-4 py-3">بهبود تجربه کاربری</td>
                        <td className="px-4 py-3">۱ سال</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-4 py-3 font-medium">
                          کوکی‌های تحلیلی
                        </td>
                        <td className="px-4 py-3">تجزیه و تحلیل ترافیک</td>
                        <td className="px-4 py-3">۲ سال</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="px-4 py-3 font-medium">
                          کوکی‌های تبلیغاتی
                        </td>
                        <td className="px-4 py-3">شخصی‌سازی تبلیغات</td>
                        <td className="px-4 py-3">۹۰ روز</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
                  <p className="text-sm">
                    شما می‌توانید تنظیمات مرورگر خود را برای غیرفعال کردن
                    کوکی‌ها تغییر دهید، اما این ممکن است بر عملکرد برخی بخش‌های
                    سایت تأثیر بگذارد.
                  </p>
                </div>
              </div>
            </div>

            {/* <!--Part 5--> */}
            <div
              id="data-security"
              className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
            >
              <TitleAfter title={"امنیت داده‌ها"} />

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  ما از اقدامات امنیتی مناسب برای محافظت از اطلاعات شما در برابر
                  دسترسی، تغییر، افشا یا تخریب غیرمجاز استفاده می‌کنیم:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="flex items-center space-x-3 ">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">
                        رمزنگاری داده‌ها
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        استفاده از پروتکل SSL برای انتقال امن داده‌ها
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 ">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">
                        کنترل دسترسی
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        دسترسی محدود به اطلاعات حساس
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 ">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6 text-purple-600 dark:text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">
                        پشتیبان‌گیری منظم
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        ذخیره‌سازی امن و پشتیبان‌گیری دوره‌ای
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 ">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6 text-red-600 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">
                        نظارت مستمر
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        مانیتورینگ و شناسایی تهدیدات امنیتی
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!--Part 6--> */}
            <div
              id="user-rights"
              className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
            >
              <TitleAfter title={"حقوق کاربران"} />

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  شما به عنوان کاربر، حقوق زیر را در رابطه با اطلاعات شخصی خود
                  دارید:
                </p>

                <div className="space-y-4 mt-4">
                  <div className="flex items-start space-x-3 ">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">
                        دسترسی به اطلاعات
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        حق درخواست کپی اطلاعات شخصی که در اختیار ما داریم.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 ">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">
                        تصحیح اطلاعات
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        حق درخواست تصحیح اطلاعات نادرست یا ناقص.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 ">
                    <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-red-600 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">
                        حذف اطلاعات
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        حق درخواست حذف اطلاعات شخصی در شرایط خاص.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 ">
                    <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-yellow-600 dark:text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">
                        انتقال داده
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        حق دریافت اطلاعات در قالب قابل خواندن توسط ماشین.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    برای اعمال هر یک از این حقوق، لطفاً از طریق اطلاعات تماس
                    موجود در پایان این صفحه با ما ارتباط برقرار کنید.
                  </p>
                </div>
              </div>
            </div>

            {/* <!--Part 7--> */}
            <div
              id="children-privacy"
              className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
            >
              <TitleAfter title={"حریم خصوصی کودکان"} />

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="flex items-start bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <svg
                    className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mt-0.5 me-2 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <div>
                    <p className="text-yellow-800 dark:text-yellow-300">
                      خدمات ما برای افراد زیر ۱۳ سال طراحی نشده است و ما عمداً
                      اطلاعات شخصی کودکان زیر ۱۳ سال را جمع‌آوری نمی‌کنیم.
                    </p>
                  </div>
                </div>

                <p>
                  اگر والدین یا سرپرست قانونی هستید و معتقدید کودک شما اطلاعاتی
                  را برای ما ارائه داده است، لطفاً با ما تماس بگیرید تا این
                  اطلاعات را حذف کنیم.
                </p>
              </div>
            </div>

            {/* <!--Part 8--> */}
            <div
              id="policy-changes"
              className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
            >
              <TitleAfter title={"تغییرات سیاست"} />

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  ما ممکن است این سیاست حفظ حریم خصوصی را به مرور زمان به روز
                  کنیم. تغییرات مهم از طریق روش‌های زیر اطلاع‌رسانی خواهند شد:
                </p>

                <ul className="list-disc list-inside space-y-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
                  <li>ارسال ایمیل به کاربران ثبت‌نام شده</li>
                  <li>نمایش اعلان در وبسایت</li>
                  <li>به روزرسانی تاریخ آخرین بروزرسانی در ابتدای این صفحه</li>
                </ul>

                <p>
                  توصیه می‌کنیم به طور دوره‌ای این صفحه را بررسی کنید تا از
                  هرگونه تغییر مطلع شوید.
                </p>
              </div>
            </div>

            {/* <!--Part 9--> */}
            <div
              id="contact"
              className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
            >
              <TitleAfter title={"تماس با ما"} />

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  اگر سوال، نگرانی یا درخواستی در مورد این سیاست حفظ حریم خصوصی
                  دارید، لطفاً با ما تماس بگیرید:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                      پشتیبانی ایمیلی
                    </h4>
                    <a
                      href="mailto:privacy@parsistore.com"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      privacy@parsistore.com
                    </a>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                      تلفن تماس
                    </h4>
                    <a
                      href="tel:+982112345678"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      ۰۲۱-۱۲۳۴۵۶۷۸
                    </a>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                    آدرس پستی
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    تهران، خیابان ولیعصر، پلاک ۱۲۳۴، طبقه ۳ - واحد حریم خصوصی
                  </p>
                </div>

                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-800 dark:text-green-300 text-sm">
                    ما در اسرع وقت به درخواست‌های شما پاسخ خواهیم داد. معمولاً
                    درخواست‌ها ظرف ۷۲ ساعت کاری پاسخ داده می‌شوند.
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

export default PrivacyPolicy;
