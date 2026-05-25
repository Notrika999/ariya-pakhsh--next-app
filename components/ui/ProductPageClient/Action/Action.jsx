"use client";
import React, { useState } from "react";
import QuantitySelector from "../../../modules/QuantityProductSelector/QuantityProductSelector";

export default function Action({ product, isOutOfStock }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <section className="xl:col-span-3 mt-7 col-span-12 pb-10 w-full">
      <div className="bg-gray-100/90 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow py-5 px-3 space-y-5">
        {/* <!-- Title --> */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800 dark:text-white text-base">
            فروشنده
          </h3>
          <a
            href="#"
            className="text-primary-600 dark:text-primary-400 text-xs"
          >
            1 فروشنده دیگر
          </a>
        </div>

        {/* <!-- Seller Box --> */}
        <div className="rounded-xl py-4 px-2 space-y-4">
          {/* <!-- Seller --> */}
          {/* <div className="flex items-center space-x-2 ">
            <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
              <i className="far fa-shop text-gray-700 dark:text-gray-300 text-sm"></i>
            </span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
              فروشنده
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-300 flex items-center">
              همراه ایرانیان
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-blue-500 ms-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.3 8.3l-5 5a1 1 0 01-1.4 0l-2-2a1 1 0 111.4-1.4l1.3 1.3 4.3-4.3a1 1 0 011.4 1.4z"></path>
              </svg>
            </span>
          </div> */}

          {/* <!-- Performance --> */}
          <div className="flex items-center space-x-2 ">
            <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
              <i className="far fa-rotate text-gray-700 dark:text-gray-300 text-sm"></i>
            </span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
              عملکرد
            </span>
            <span className="text-xs text-green-600 dark:text-green-400">
              عالی
            </span>
          </div>

          {/* <!-- Product id --> */}
          <div className="flex items-center space-x-2 ">
            <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
              <i className="fas fa-qrcode text-gray-700 dark:text-gray-300 text-sm"></i>
            </span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
              شناسه محصول
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-300">
              P-8593135
            </span>
          </div>

          {/* <!-- End of inventory --> */}
          <div className="flex items-center space-x-2">
            <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
              <i className="far fa-truck-fast text-gray-700 dark:text-gray-300 text-xs"></i>
            </span>

            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
              وضعیت موجودی
            </span>

            {isOutOfStock ? (
              <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 rounded-full">
                ناموجود
              </span>
            ) : (
              <span className="text-xs text-green-600">موجود</span>
            )}
          </div>

          {/* <!-- Delivery --> */}
          <div className="flex items-center space-x-2 ">
            <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
              <i className="far fa-truck-fast text-gray-700 dark:text-gray-300 text-xs"></i>
            </span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
              ارسال از فروشگاه اصلی
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-300">
              آماده ارسال
            </span>
          </div>

          {/* <!-- Tags --> */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
              کالای اصل
            </span>
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
              کالای نو
            </span>

            {/* <!-- End of inventory --> */}
            {isOutOfStock && (
              <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 rounded-full">
                ناموجود
              </span>
            )}
          </div>
        </div>
      </div>

      {/* <!-- Likes --> */}
      <div className="overflow-hidden h-10 my-3">
        <div id="verticalSlider" className="transition-transform duration-500">
          <div className="h-10 flex text-sm items-center text-gray-700 dark:text-gray-300">
            🛒 + <b className="mx-1">4</b> عدد در سبد خرید کاربران
          </div>
          <div className="h-10 flex text-sm items-center text-gray-700 dark:text-gray-300">
            👁️ + <b className="mx-1">1500</b> نفر این کالا را مشاهده کرده‌اند
          </div>
          <div className="h-10 flex text-sm items-center text-gray-700 dark:text-gray-300">
            ❤️ + <b className="mx-1">100</b> نفر به این کالا علاقه دارند
          </div>
          <div className="h-10 flex text-sm items-center text-gray-700 dark:text-gray-300">
            🛒 + <b className="mx-1">4</b> عدد در سبد خرید کاربران
          </div>
        </div>
      </div>

      {/* <!-- Prices And Counter --> */}
      <div className="flex items-center space-x-4 justify-between mt-4 mb-2 ">
        {!isOutOfStock && (
          <QuantitySelector value={quantity} onChange={setQuantity} min={1} />
        )}

        <div className="flex items-center">
          <div className="text-gray-700 dark:text-zinc-300 flex flex-col items-center">
            <div className="flex justify-between items-center">
              <del className="text-zinc-400 dark:text-zinc-500">
                <span>100000000</span>
              </del>
              <div
                className={` text-white text-xs ms-2 font-bold px-2 py-1 rounded-xl rounded-bl-md shadow shadow-red-500/50 z-10 ${isOutOfStock ? "bg-gray-400" : "bg-secondary-500"}`}
              >
                35%
              </div>
            </div>
            <span
              className={`text-xl inline-block mt-2 font-bold ${isOutOfStock ? "text-gray-300" : "dark:text-white"}`}
            >
              90,000,000
            </span>
          </div>
          <span className="text-xs font-bold -rotate-90 dark:text-zinc-300">
            تومان
          </span>
        </div>
      </div>

      {/* <!-- Add to cart --> */}
      {!isOutOfStock && (
        <div className="flex items-center justify-center">
          <button className="bg-primary shadow-primary-500 ms-auto mt-3 hover:bg-primary-600 text-white font-semibold rounded-xl px-6 py-4 text-sm">
            افزودن به سبد خرید
          </button>
        </div>
      )}

      {isOutOfStock && (
        <>
          <div className="flex items-center justify-center">
            <button className="bg-gray-400 cursor-not-allowed w-full mt-3 text-white font-semibold rounded-xl px-6 py-4 text-sm">
              اتمام موجودی
            </button>
          </div>

          <div className="mt-3">
            <button className="bg-primary shadow-primary-500 w-full hover:bg-primary-600 text-white font-semibold rounded-xl px-6 py-3 text-sm">
              📧 به من اطلاع بده
            </button>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
              وقتی محصول موجود شد به من اطلاع بده
            </p>
          </div>
        </>
      )}

      {/* <!-- Points --> */}
      <div className="flex items-center mt-2 justify-between pt-2">
        <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-1 ">
          <i className="fa fa-star text-amber-400 me-1"></i>
          امتیاز باشگاه مشتریان
        </span>
        <div className="flex items-center space-x-2">
          <span className="font-black text-sm dark:text-white">350</span>
          <span className="text-gray-600 dark:text-gray-300 text-sm">
            امتیاز
          </span>
        </div>
      </div>
    </section>
  );
}
