import Link from "next/link";
import React from "react";

export default function CartEmpty() {
  return (
    // <!-- START CONTENT -->
    <section className="py-5">
      <div className="container">
        <div className="text-center py-12">
          {/* <!--Empty shopping cart icon--> */}
          <div className="w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center bounce-animation">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-32 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>

          {/* <!--Explanatory text--> */}
          <h2 className="text-2xl font-black text-gray-800 dark:text-gray-300 mb-4">
            سبد خرید شما خالی است
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
            هنوز هیچ محصولی به سبد خرید خود اضافه نکرده‌اید. برای مشاهده محصولات
            و اضافه کردن آنها به سبد خرید، از دکمه زیر استفاده کنید.
          </p>

          {/* <!--Action buttons--> */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="bg-primary hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              بازگشت به صفحه اصلی
            </Link>
            <a
              href="/shop"
              className="border border-secondary-600 bg-secondary text-secondary-900 hover:bg-secondary-400 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              مشاهده محصولات
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
