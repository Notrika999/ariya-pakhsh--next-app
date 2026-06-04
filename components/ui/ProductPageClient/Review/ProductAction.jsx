"use client";

import React, { useEffect, useState } from "react";
import QuantitySelector from "../../../modules/QuantityProductSelector/QuantityProductSelector";

export default function ProductAction() {
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  // تشخیص breakpoint واقعی
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");

    const handleResize = () => {
      setIsDesktop(mediaQuery.matches);
    };

    handleResize(); // initial check
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  const shouldShowPanel = isDesktop || isOpen;

  return (
    <>
      {!isDesktop && !isOpen && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-custom-dark border-t border-gray-200 xl:hidden z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="flex justify-between w-full  dark:text-white py-3 rounded-xl font-bold cursor-pointer"
          >
            <span>مشاهده جزئیات خرید</span>
            <i className="far fa-angle-up"></i>
          </button>
        </div>
      )}
      {shouldShowPanel && (
        <div className="bg-white xl:sticky fixed xl:top-0 bottom-0 inset-e-0 inset-s-0 xl:z-0 z-40 dark:bg-custom-dark dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 dark:border-gray-700  rounded-2xl px-6 py-4">
          {/* <!-- Close Btn --> */}
          <div className="xl:hidden block">
            <button onClick={() => setIsOpen(false)} className="text-red-600">
              <i className="far fa-circle-x cursor-pointer"></i>
            </button>
          </div>

          {/* <!-- Title And Seller Box --> */}
          <div className="bg-gray-100/90 xl:block hidden dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow py-5 px-3 space-y-5">
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
              <div className="flex items-center space-x-2 ">
                <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-700 dark:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 9h18M4 9l1-4h14l1 4m-1 11h-14a1 1 0 01-1-1v-7h16v7a1 1 0 01-1 1z"
                    />
                  </svg>
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
              </div>

              {/* <!-- Performance --> */}
              <div className="flex items-center space-x-2 ">
                <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-700 dark:text-gray-300"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M3.68 11.333h-.75zm0 1.667l-.528.532a.75.75 0 0 0 1.056 0zm2.208-1.134A.75.75 0 1 0 4.83 10.8zM2.528 10.8a.75.75 0 0 0-1.056 1.065zm16.088-3.408a.75.75 0 1 0 1.277-.786zM12.079 2.25c-5.047 0-9.15 4.061-9.15 9.083h1.5c0-4.182 3.42-7.583 7.65-7.583zm-9.15 9.083V13h1.5v-1.667zm1.28 2.2l1.679-1.667L4.83 10.8l-1.68 1.667zm0-1.065L2.528 10.8l-1.057 1.065l1.68 1.666zm15.684-5.86A9.16 9.16 0 0 0 12.08 2.25v1.5a7.66 7.66 0 0 1 6.537 3.643zM20.314 11l.527-.533a.75.75 0 0 0-1.054 0zM18.1 12.133a.75.75 0 0 0 1.055 1.067zm3.373 1.067a.75.75 0 1 0 1.054-1.067zM5.318 16.606a.75.75 0 1 0-1.277.788zm6.565 5.144c5.062 0 9.18-4.058 9.18-9.083h-1.5c0 4.18-3.43 7.583-7.68 7.583zm9.18-9.083V11h-1.5v1.667zm-1.276-2.2L18.1 12.133l1.055 1.067l1.686-1.667zm0 1.066l1.686 1.667l1.054-1.067l-1.686-1.666zM4.04 17.393a9.2 9.2 0 0 0 7.842 4.357v-1.5a7.7 7.7 0 0 1-6.565-3.644z"
                    />
                  </svg>
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
                  <svg
                    className="w-4 h-4 text-gray-700 dark:text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M3 11h8V3H3zm2-6h4v4H5zM3 21h8v-8H3zm2-6h4v4H5zm8-12v8h8V3zm6 6h-4V5h4zm0 10h2v2h-2zm-6-6h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm2 2h2v2h-2zm2-2h2v2h-2zm0-4h2v2h-2zm2 2h2v2h-2z"
                    />
                  </svg>
                </span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                  شناسه محصول
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-300">
                  P-8593135
                </span>
              </div>

              {/* <!-- Delivery --> */}
              <div className="flex items-center space-x-2 ">
                <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
                  <svg
                    className="w-4 h-4 text-gray-700 dark:text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinejoin="round"
                        strokeMiterlimit="1.5"
                        d="M8 19a2 2 0 1 0 0-4a2 2 0 0 0 0 4m10 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4"
                      />
                      <path d="M10.05 17H15V6.6a.6.6 0 0 0-.6-.6H1m4.65 11H3.6a.6.6 0 0 1-.6-.6v-4.9" />
                      <path strokeLinejoin="round" d="M2 9h4" />
                      <path d="M15 9h5.61a.6.6 0 0 1 .548.356l1.79 4.028a.6.6 0 0 1 .052.243V16.4a.6.6 0 0 1-.6.6h-1.9M15 17h1" />
                    </g>
                  </svg>
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
              </div>
            </div>
          </div>

          {/* <!-- Prices And Counter --> */}
          <div className="flex items-center space-x-4 justify-between mt-4 mb-2 ">
            <QuantitySelector value={quantity} onChange={setQuantity} min={1} />

            <div className="flex items-center">
              <div className="text-gray-700 dark:text-zinc-300 flex flex-col items-center">
                <div className="flex justify-between items-center">
                  <del className="text-zinc-400 dark:text-zinc-500">
                    <span>100000000</span>
                  </del>
                  <div className=" bg-secondary-500 text-white text-xs ms-2 font-bold px-2 py-1 rounded-xl rounded-bl-md shadow shadow-red-500/50 z-10">
                    35%
                  </div>
                </div>
                <span className="text-xl inline-block mt-2 font-bold dark:text-white">
                  90,000,000
                </span>
              </div>
              <span className="text-xs font-bold -rotate-90 dark:text-zinc-300">
                تومان
              </span>
            </div>
          </div>

          {/* <!-- Add to cart --> */}
          <div className="flex items-center justify-center">
            <button className="bg-primary shadow-primary-500  mt-3 hover:bg-primary-600 text-white font-semibold rounded-xl px-6 py-4 text-sm ms-auto cursor-pointer">
              افزودن به سبد خرید
            </button>
          </div>

          {/* <!-- Points --> */}
          <div className="flex items-center mt-2 justify-between pt-2">
            <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-1 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-amber-400 me-1 size-5"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
                ></path>
              </svg>
              امتیاز باشگاه مشتریان
            </span>
            <div className="flex items-center space-x-2">
              <span className="font-black text-sm dark:text-white">350</span>
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                امتیاز
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
