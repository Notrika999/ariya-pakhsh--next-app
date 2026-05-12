import Image from "next/image";
import Link from "next/link";
import React from "react";

function FailPayment() {
  return (
    // <!-- START CONTENT -->
    <section className="py-5">
      <div className="container mx-auto">
        {/* <!-- Content --> */}
        <div className="max-w-md w-full mx-auto">
          {/* <!--Original card--> */}
          <div className="bg-white dark:bg-custom-dark rounded-2xl shadow-xl overflow-hidden border border-red-200 dark:border-red-800">
            {/* <!-- Header --> */}
            <div className="bg-linear-to-l from-red-500 to-rose-600 p-6 text-center">
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
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-black text-white">پرداخت ناموفق</h1>
              <p className="text-red-100 mt-2">پرداخت شما انجام نشد</p>
            </div>

            {/* <!-- Content --> */}
            <div className="p-6">
              {/* <!--Error information--> */}
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                  </svg>

                  <span className="font-medium text-gray-800 dark:text-white">
                    علت خطا:
                  </span>
                </div>
                <p
                  className="text-sm text-gray-600 dark:text-gray-400"
                  id="errorMessage"
                >
                  موجودی حساب شما کافی نمی‌باشد. لطفاً از صحت اطلاعات کارت بانکی
                  اطمینان حاصل کنید.
                </p>
              </div>

              {/* <!--Error code--> */}
              <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-6">
                <span className="text-gray-600 dark:text-gray-300">
                  کد خطا:
                </span>
                <span className="font-bold text-gray-800 dark:text-white">
                  ERR-85742
                </span>
              </div>

              {/* <!-- Product --> */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3">
                  محصول انتخابی
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
                    <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">
                      ۲,۵۴۰,۰۰۰ تومان
                    </p>
                  </div>
                </div>
              </div>

              {/* <!-- Guidance --> */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-2  mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 text-yellow-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                    />
                  </svg>

                  <span className="font-medium text-gray-800 dark:text-white">
                    راهنمایی:
                  </span>
                </div>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 ps-4">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-4 text-green-500 mt-1 me-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                    از صحت اطلاعات کارت بانکی اطمینان حاصل کنید
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-4 text-green-500 mt-1 me-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                    موجودی حساب خود را بررسی کنید
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-4 text-green-500 mt-1 me-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                    در صورت تکرار خطا، با بانک خود تماس بگیرید
                  </li>
                </ul>
              </div>

              {/* <!--Action buttons--> */}
              <div className="space-y-3">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200">
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
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  تلاش مجدد پرداخت
                </button>
                <Link
                  href="#"
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
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                  بازگشت به سبد خرید
                </Link>
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
            <p>در صورت بروز مشکل، با پشتیبانی تماس بگیرید:</p>
            <p className="font-medium mt-1">۰۲۱-۸۸۵۶۱۲۴۵</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FailPayment;

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};