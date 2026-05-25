import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HeaderCart({ open, onClose }) {
  return (
    <div
      className={`fixed top-0 inset-e-0 sm:w-100 w-[80%] h-full bg-white dark:bg-[#0d1117] 
      text-gray-900 dark:text-gray-100 border-s border-gray-200 dark:border-gray-800 shadow-xl
      transform transition-all duration-300 z-50
      ${open ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible"}`}
      role="dialog"
      aria-labelledby="cart-title"
      aria-modal="true"
    >
      {/* <!-- Header --> */}
      <header className="border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
        <h2 className="font-bold text-base">سبد خرید شما</h2>
        <button
          onClick={onClose}
          className="cursor-pointer"
          aria-label="بستن سبد خرید"
        >
            <i className="far fa-x"></i>
        </button>
      </header>

      {/* <!-- Cart Items --> */}
      <main className="relative space-y-4 divide-y divide-gray-200 dark:divide-gray-800 p-3 overflow-y-scroll h-full">
        {/* <!-- Product 1 --> */}
        <div className="py-3 last:mb-35">
          <div className="flex flex-wrap items-center">
            <div className="text-start w-1/3">
              <Image
                width={120}
                height={120}
                className="max-w-full rounded-lg shadow-sm dark:shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                src="/images/product/wach-1.png"
                // src=?? "/images/default.png"
                alt="ساعت مچی عقربه‌ای مردانه اینویکتا مدل Automatico Ghost Reserve"
                loading="lazy"
              />
            </div>

            <div className="w-2/3 space-y-4 px-2">
              <h3 className="font-bold leading-7 text-gray-800 dark:text-gray-100">
                <Link href="/product/1">
                  ساعت مچی عقربه‌ای مردانه اینویکتا مدل Automatico Ghost Reserve
                </Link>
              </h3>

              <div className="flex items-center justify-between">
                <del
                  className="text-rose-600 dark:text-gray-400 line-through"
                  content="IRR"
                >
                  <span>5,000,000</span>
                </del>
                <ins
                  className="no-underline text-xl text-green-600 font-bold dark:text-green-400"
                  content="2500000"
                >
                  2,500,000
                  <span className="text-sm font-normal text-gray-700 dark:text-gray-300">
                    تومان
                  </span>
                </ins>
              </div>

              <div className="flex items-end justify-between">
                <span>تعداد: 3</span>
                <button
                  className="bg-red-100 hover:bg-red-200 dark:bg-custom-dark dark:hover:bg-[#1f242c] text-red-800 dark:text-gray-200 border border-transparent dark:border-gray-700 p-2 rounded-lg transition-colors duration-200"
                  role="button"
                  aria-label="حذف محصول از سبد خرید"
                >
                    <i className="far fa-x text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <!-- Footer --> */}
      <footer className="p-3 absolute bottom-0 start-0 end-0 bg-white dark:bg-custom-dark border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <span className="inline-block text-lg">جمع کل</span>
            <h3 className="font-bold text-xl" content="11000000">
              11,000,000 تومان
            </h3>
          </div>
          <div className="text-end">
            <Link
              href="/checkout"
              className="bg-primary dark:bg-primary-500 hover:bg-primary-600 dark:hover:bg-primary-400 text-white py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
              role="button"
              aria-label="تکمیل فرایند خرید"
            >
              تکمیل خرید
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
