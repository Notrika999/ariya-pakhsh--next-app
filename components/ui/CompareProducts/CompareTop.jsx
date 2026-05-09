import Image from "next/image";
import React from "react";

export default function CompareTop() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* <!--Product 1--> */}
      <div
        className="product-card border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary-300 transition duration-300 min-h-[200px]"
        onClick="openModal()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span className="text-gray-600 dark:text-gray-300">افزودن محصول</span>
      </div>

      {/* <!--Product 2--> */}
      <div className="product-card bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 relative overflow-hidden">
        <button
          className="absolute top-2 end-2 text-gray-400 dark:text-gray-300 hover:text-red-500 z-10"
          onClick="removeProduct(1)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex justify-center mb-4">
          <Image
            width={100}
            height={100}
            src="/images/product/mobile-2.png"
            alt="گوشی سامسونگ"
            className="h-32 object-contain"
          />
        </div>
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 text-center mb-1">
          گوشی سامسونگ گلکسی S23 اولترا
        </h3>
        <div className="text-center">
          <span className="text-primary-600 dark:text-primary-200 font-medium">
            ۴۹,۹۰۰,۰۰۰ تومان
          </span>
        </div>
      </div>

      {/* <!--Product 3--> */}
      <div className="product-card bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 relative overflow-hidden">
        <button
          className="absolute top-2 end-2 text-gray-400 dark:text-gray-300 hover:text-red-500 z-10"
          onClick="removeProduct(2)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex justify-center mb-4">
          <Image
            width={100}
            height={100}
            src="/images/product/mobile-1.png"
            alt="آیفون"
            className="h-32 object-contain"
          />
        </div>
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 text-center mb-1">
          آیفون 14 پرو مکس
        </h3>
        <div className="text-center">
          <span className="text-primary-600 dark:text-primary-200 font-medium">
            ۵۶,۵۰۰,۰۰۰ تومان
          </span>
        </div>
      </div>

      {/* <!--Product 4--> */}
      <div className="product-card bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 relative overflow-hidden">
        <button
          className="absolute top-2 end-2 text-gray-400 dark:text-gray-300 hover:text-red-500 z-10"
          onClick="removeProduct(3)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex justify-center mb-4">
          <Image
            width={100}
            height={100}
            src="/images/product/mobile-3.png"
            alt="شیائومی"
            className="h-32 object-contain"
          />
        </div>
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 text-center mb-1">
          گوشی شیائومی 13 پرو
        </h3>
        <div className="text-center">
          <span className="text-primary-600 dark:text-primary-200 font-medium">
            ۳۲,۷۰۰,۰۰۰ تومان
          </span>
        </div>
      </div>
    </div>
  );
}
