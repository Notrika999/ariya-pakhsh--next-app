import React from "react";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";

export default function Rules() {
  return (
    <SectionContainer>
      {/* <!--Page header--> */}
      <div className="text-center mb-12">
        <TitleAfter tag title={"قوانین و مقررات"} />
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          لطفاً قبل از استفاده از خدمات پارسی استور، این قوانین و مقررات را به
          دقت مطالعه کنید. استفاده از خدمات ما به منزله پذیرش کامل این شرایط
          است.
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
                href="#acceptance"
                className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                پذیرش شرایط
              </a>
              <a
                href="#account"
                className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                حساب کاربری
              </a>
              <a
                href="#orders"
                className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                سفارش و خرید
              </a>
              <a
                href="#payment"
                className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                پرداخت
              </a>
              <a
                href="#shipping"
                className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                ارسال و تحویل
              </a>
              <a
                href="#returns"
                className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                عودت و مرجوعی
              </a>
              <a
                href="#intellectual"
                className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                مالکیت فکری
              </a>
              <a
                href="#limitation"
                className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                محدودیت مسئولیت
              </a>
              <a
                href="#termination"
                className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                فسخ قرارداد
              </a>
              <a
                href="#changes"
                className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                تغییر شرایط
              </a>
              <a
                href="#governing"
                className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                قانون حاکم
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
            id="acceptance"
            className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
          >
            <TitleAfter title={"پذیرش شرایط"} />

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 me-2 flex-shrink-0"
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
                    <p className="text-blue-800 dark:text-blue-300">
                      با استفاده از وبسایت پارسی استور و خدمات آن، شما این
                      قوانین و مقررات را به طور کامل می‌پذیرید.
                    </p>
                  </div>
                </div>
              </div>

              <p>
                این شرایط استفاده، نحوه دسترسی و استفاده شما از وبسایت پارسی
                استور و خدمات مرتبط با آن را تنظیم می‌کند. در صورت عدم موافقت با
                هر بخش از این شرایط، لطفاً از استفاده از خدمات ما خودداری کنید.
              </p>

              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mt-6 mb-3">
                شرایط اضافی
              </h3>
              <ul className="list-disc list-inside space-y-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <li>سیاست حفظ حریم خصوصی</li>
                <li>سیاست بازگرداندن کالا</li>
                <li>شرایط استفاده از کوپن و تخفیف‌ها</li>
                <li>قوانین برنامه وفاداری</li>
              </ul>

              <p className="mt-4">
                این اسناد مکمل شرایط استفاده حاضر هستند و با استفاده از خدمات
                ما، آنها را نیز می‌پذیرید.
              </p>
            </div>
          </div>

          {/* <!--Part 2--> */}
          <div
            id="account"
            className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
          >
            <TitleAfter title={"حساب کاربری"} />

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">
                    ✅ مجاز
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-700 dark:text-green-400">
                    <li>ایجاد تنها یک حساب کاربری</li>
                    <li>استفاده از اطلاعات واقعی</li>
                    <li>حفظ امنیت حساب</li>
                    <li>به‌روزرسانی اطلاعات شخصی</li>
                  </ul>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h4 className="font-bold text-red-800 dark:text-red-300 mb-2">
                    ❌ غیرمجاز
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-400">
                    <li>ایجاد حساب تکراری</li>
                    <li>استفاده از اطلاعات جعلی</li>
                    <li>اشتراک‌گذاری حساب</li>
                    <li>فعالیت کلاهبردارانه</li>
                  </ul>
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mt-6 mb-3">
                مسئولیت‌های شما
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 ">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">
                      امنیت حساب
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      شما مسئول حفظ محرمانگی اطلاعات حساب و رمز عبور خود هستید.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 ">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">
                      فعالیت‌های حساب
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      شما مسئول تمام فعالیت‌هایی هستید که تحت حساب کاربری شما
                      انجام می‌شود.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 ">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">
                      اطلاعات دقیق
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      موظف هستید اطلاعات دقیق، کامل و به‌روز را ارائه دهید.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!--Part 3--> */}
          <div
            id="orders"
            className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
          >
            <TitleAfter title={"سفارش و خرید"} />

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mt-0.5 me-2 flex-shrink-0"
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
                      تکمیل فرآیند خرید به منزله تأیید سفارش و ایجاد تعهد قانونی
                      برای پرداخت است.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mt-6 mb-3">
                فرآیند سفارش
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    1
                  </div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                    انتخاب محصول
                  </h4>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    2
                  </div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                    تأیید سبد خرید
                  </h4>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    3
                  </div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                    پرداخت
                  </h4>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    4
                  </div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                    تأیید نهایی
                  </h4>
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mt-6 mb-3">
                قیمت‌ها و مالیات
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">
                    قیمت محصولات
                  </span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    به تومان ایران
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">
                    مالیات بر ارزش افزوده
                  </span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    ۹٪ محاسبه می‌شود
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">
                    هزینه ارسال
                  </span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    بر اساس آتحصیل محاسبه می‌شود
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    تخفیف‌ها
                  </span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    قابل ترکیب نیستند
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* <!--Part 4--> */}
          <div
            id="payment"
            className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
          >
            <TitleAfter title={"پرداخت"} />

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3">
                    💳 پرداخت آنلاین
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>کارت‌های عضو شتاب</li>
                    <li>کیف پول الکترونیکی</li>
                    <li>پرداخت امن through درگاه‌های معتبر</li>
                    <li>تأیید فوری تراکنش</li>
                  </ul>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3">
                    📦 پرداخت در محل
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>فقط برای سفارش‌های زیر ۵۰۰ هزار تومان</li>
                    <li>محدود به برخی مناطق</li>
                    <li>کارمزد اضافه ۵۰۰۰ تومان</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 me-2 flex-shrink-0"
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
                    <h4 className="font-bold text-red-800 dark:text-red-300">
                      تأخیر در پرداخت
                    </h4>
                    <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                      در صورت تأخیر در پرداخت، سفارش شما پس از ۲۴ ساعت لغو خواهد
                      شد.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mt-6 mb-3">
                سیاست بازپرداخت
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-gray-700 dark:text-gray-300">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-4 py-3">نوع درخواست</th>
                      <th className="px-4 py-3">شرایط</th>
                      <th className="px-4 py-3">مدت زمان</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-3 font-medium">لغو سفارش</td>
                      <td className="px-4 py-3">قبل از ارسال</td>
                      <td className="px-4 py-3">۲۴-۴۸ ساعت کاری</td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-3 font-medium">مرجوعی کالا</td>
                      <td className="px-4 py-3">مطابق شرایط بازگشت</td>
                      <td className="px-4 py-3">۳-۷ روز کاری</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="px-4 py-3 font-medium">خطای سیستمی</td>
                      <td className="px-4 py-3">تأیید توسط پشتیبانی</td>
                      <td className="px-4 py-3">۱-۲ روز کاری</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* <!--Part 5--> */}
          <div
            id="shipping"
            className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
          >
            <TitleAfter title={"ارسال و تحویل"} />
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    ۱-۲ روز
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    تهران
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    ۳-۵ روز
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    شهرستان‌ها
                  </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                    ۵-۷ روز
                  </div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">
                    مناطق دورافتاده
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-3">
                شرایط تحویل
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 ">
                  <svg
                    className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      تحویل درب منزل
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      تحویل در آدرس مشخص شده توسط شما
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 ">
                  <svg
                    className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      بسته‌بندی مناسب
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      بسته‌بندی محافظتی برای کالاهای حساس
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 ">
                  <svg
                    className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      پیگیری آنلاین
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      امکان پیگیری مرسوله از طریق پنل کاربری
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mt-0.5 me-2 flex-shrink-0"
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
                    <h4 className="font-bold text-yellow-800 dark:text-yellow-300">
                      تأخیر در تحویل
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">
                      در صورت تأخیر ناشی از شرکت حمل و نقل، ما پیگیری لازم را
                      انجام خواهیم داد، اما مسئول تأخیرهای خارج از کنترل خود
                      نیستیم.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!--Part 6--> */}
          <div
            id="returns"
            className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
          >
            <TitleAfter title={"عودت و مرجوعی"} />

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 dark:text-green-300 mb-3">
                    ✅ قابل بازگشت
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-700 dark:text-green-400">
                    <li>کالای معیوب</li>
                    <li>عدم تطابق با مشخصات</li>
                    <li>آسیب در حین حمل و نقل</li>
                    <li>کالای نادرست ارسال شده</li>
                  </ul>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h4 className="font-bold text-red-800 dark:text-red-300 mb-3">
                    ❌ غیرقابل بازگشت
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-400">
                    <li>کالاهای شخصی‌شده</li>
                    <li>نرم‌افزارهای باز شده</li>
                    <li>کالاهای استوک و حراج</li>
                    <li>پوشاک و لوازم آرایشی</li>
                  </ul>
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mt-6 mb-3">
                شرایط بازگشت
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">
                    مهلت درخواست بازگشت
                  </span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    ۷ روز از تاریخ تحویل
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">
                    شرایط بسته‌بندی
                  </span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    دست نخورده و کامل
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">
                    هزینه ارسال بازگشت
                  </span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    متوجه مشتری است
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    زمان بازپرداخت
                  </span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    ۳-۷ روز کاری
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  برای شروع فرآیند بازگشت، لطفاً از طریق پنل کاربری خود در بخش
                  پیگیری سفارشات اقدام کنید.
                </p>
              </div>
            </div>
          </div>

          {/* <!--Part 7--> */}
          <div
            id="intellectual"
            className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
          >
            <TitleAfter title={"مالکیت فکری"} />

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 me-2 flex-shrink-0"
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
                    <p className="text-purple-800 dark:text-purple-300">
                      تمام حقوق مادی و معنوی وبسایت، محتوا، طراحی، لوگو و نام
                      تجاری پارسی استور متعلق به این شرکت است.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mt-6 mb-3">
                ممنوعیت‌ها
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 ">
                  <svg
                    className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      کپی‌برداری
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      کپی، تکثیر یا انتشار محتوای سایت
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 ">
                  <svg
                    className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      مهندسی معکوس
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      تغییر، مهندسی معکوس یا استخراج کد
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 ">
                  <svg
                    className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      استفاده تجاری
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      استفاده تجاری از محتوای سایت
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 ">
                  <svg
                    className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      جعل هویت
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      استفاده از نام یا نشان تجاری
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
                <p className="text-sm">
                  هرگونه استفاده غیرمجاز از مالکیت فکری ما، پیگرد قانونی خواهد
                  داشت و ما حق پیگیری قضایی را برای خود محفوظ می‌داریم.
                </p>
              </div>
            </div>
          </div>

          {/* <!--Part 9--> */}
          <div
            id="limitation"
            className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
          >
            <TitleAfter title={"محدودیت مسئولیت"} />

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-orange-500 dark:text-orange-400 mt-0.5 me-2 flex-shrink-0"
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
                    <p className="text-orange-800 dark:text-orange-300">
                      ما خدمات خود را با دقت و تلاش ارائه می‌دهیم، اما
                      نمی‌توانیم تضمین کامل برای عملکرد بدون خطا ارائه دهیم.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mt-6 mb-3">
                مسئولیت‌های ما
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 ">
                  <svg
                    className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      توصیف دقیق محصولات
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      اطمینان از تطابق کالا با مشخصات اعلام شده
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 ">
                  <svg
                    className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      حفاظت از اطلاعات
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      رعایت سیاست حفظ حریم خصوصی
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 ">
                  <svg
                    className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      پشتیبانی مناسب
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      ارائه خدمات پشتیبانی به مشتریان
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mt-6 mb-3">
                مسئولیت‌های خارج از کنترل ما
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 ">
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
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
                  <span className="text-gray-600 dark:text-gray-400">
                    تأخیرهای ناشی از شرکت‌های حمل و نقل
                  </span>
                </div>
                <div className="flex items-center space-x-3 ">
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
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
                  <span className="text-gray-600 dark:text-gray-400">
                    مشکلات فنی اینترنت یا قطعی برق
                  </span>
                </div>
                <div className="flex items-center space-x-3 ">
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
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
                  <span className="text-gray-600 dark:text-gray-400">
                    حوادث غیرمترقبه و فورس ماژور
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* <!--Part 9--> */}
          <div
            id="termination"
            className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
          >
            <TitleAfter title={"فسخ قرارداد"} />

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 me-2 flex-shrink-0"
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
                    <p className="text-red-800 dark:text-red-300">
                      ما حق فسخ یا تعلیق دسترسی شما به خدمات را در صورت نقض این
                      شرایط استفاده، برای خود محفوظ می‌داریم.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mt-6 mb-3">
                دلایل فسخ
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 ">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 text-sm font-bold">
                      !
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">
                      تخلف از شرایط استفاده
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      نقض هر یک از بندهای این قرارداد
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 ">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 text-sm font-bold">
                      !
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">
                      فعالیت متقلبانه
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      کلاهبرداری، تقلب یا سوءاستفاده از سیستم
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 ">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 text-sm font-bold">
                      !
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">
                      تخلف قانونی
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      انجام فعالیت‌های غیرقانونی از طریق خدمات ما
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 ">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 text-sm font-bold">
                      !
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">
                      ایجاد اختلال
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      ایجاد اختلال در خدمات یا زیرساخت‌های فنی
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
                <p className="text-sm">
                  در صورت فسخ، دسترسی شما به حساب کاربری بلافاصله متوقف خواهد شد
                  و هرگونه تعهد مالی باقی‌مانده باید تسویه شود.
                </p>
              </div>
            </div>
          </div>

          {/* <!--Part 10--> */}
          <div
            id="changes"
            className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
          >
            <TitleAfter title={"تغییر شرایط"} />

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 me-2 flex-shrink-0"
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
                    <p className="text-blue-800 dark:text-blue-300">
                      ما حق به‌روزرسانی و تغییر این شرایط استفاده را در هر زمان
                      برای خود محفوظ می‌داریم.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mt-6 mb-3">
                روش اطلاع‌رسانی
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 ">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      ایمیل
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      ارسال به کاربران ثبت‌نام شده
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 ">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
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
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      اعلان در سایت
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      نمایش بنر اطلاع‌رسانی
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 ">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      به‌روزرسانی صفحه
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      تغییر تاریخ در ابتدای صفحه
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
                <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                  تغییرات ۳۰ روز پس از اطلاع‌رسانی رسمی لازم‌الاجرا خواهند بود.
                  ادامه استفاده از خدمات پس از این مدت به منزله پذیرش تغییرات
                  است.
                </p>
              </div>
            </div>
          </div>

          {/* <!--Part 11--> */}
          <div
            id="governing"
            className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
          >
            <TitleAfter title={"قانون حاکم"} />

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p>
                  این شرایط استفاده بر اساس قوانین جمهوری اسلامی ایران تنظیم شده
                  است و دادگاه‌های تهران صالح به رسیدگی به هرگونه اختلاف ناشی از
                  این شرایط خواهند بود.
                </p>
              </div>

              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mt-6 mb-3">
                حل اختلاف
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 ">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">
                      تماس با پشتیبانی
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      اولین قدم برای حل اختلاف، تماس با پشتیبانی ما است
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 ">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">
                      داوری
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      در صورت عدم حل اختلاف، طرفین می‌توانند به داوری متوسل شوند
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 ">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">
                      مراجع قضایی
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      در نهایت، اختلاف از طریق دادگاه‌های تهران رسیدگی خواهد شد
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!--Part 12--> */}
          <div
            id="contact"
            className="bg-white rounded-2xl shadow-lg p-8 dark:bg-custom-dark dark:border dark:border-gray-700"
          >
            <TitleAfter title={"تماس با ما"} />

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                اگر سوال، نگرانی یا درخواستی در مورد این شرایط استفاده دارید،
                لطفاً با ما تماس بگیرید:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                    📧 پشتیبانی ایمیلی
                  </h4>
                  <a
                    href="mailto:support@carup24.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    support@carup24.com
                  </a>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                    📞 تلفن تماس
                  </h4>
                  <a
                    href="tel:+982112345678"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                   90007824
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                  🏢 آدرس پستی
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                مازندران-ساری، بلوار امام رضا (ع)
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-4">
                <p className="text-green-800 dark:text-green-300 text-sm">
                  ما در اسرع وقت به درخواست‌های شما پاسخ خواهیم داد. معمولاً
                  درخواست‌ها ظرف ۴۸ ساعت کاری پاسخ داده می‌شوند.
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  با تشکر از شما که زمان گذاشتید و این شرایط استفاده را مطالعه
                  کردید.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
