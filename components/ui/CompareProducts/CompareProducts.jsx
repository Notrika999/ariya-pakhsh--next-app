import Image from "next/image";
import React from "react";
import CompareTop from "./CompareTop";
import CompareTable from "./CompareTable";

export default function CompareProducts() {
  return (
    <section className="py-5">
      <div className="container mx-auto">
        {/* <!--Select products to compare--> */}
        <div className="bg-white dark:bg-custom-dark rounded-xl shadow-md p-6 mb-8">
          <h2 className="font-bold text-lg mb-4 relative pb-4 text-gray-900 dark:text-white before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary after:absolute after:w-40 after:h-2 after:bottom-0 after:inset-s-4 after:bg-primary after:rounded-lg">
            انتخاب محصولات برای مقایسه
          </h2>

          <CompareTop />
        </div>

        {/* <!--Comparison table with Dark Mode--> */}
        <div className="bg-white dark:bg-custom-dark rounded-xl shadow-md overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <CompareTable />
          </div>
        </div>

        {/* <!--Product selection modal--> */}
        <div
          id="productModal"
          className="modal fixed z-50 inset-0 w-full h-full overflow-auto backdrop-blur bg-opacity-40 hidden"
        >
          <div className="modal-content bg-white dark:bg-zinc-900 dark:border dark:border-gray-600 rounded-xl p-6 shadow-lg max-w-200 w-[80%] mx-auto mt-[5%] animate-[modalopen_0.4s_ease]">
            {/* <!-- Header --> */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                انتخاب محصول برای مقایسه
              </h3>
              <span
                className="close text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 text-2xl cursor-pointer"
                
              >
                &times;
              </span>
            </div>

            {/* <!-- Product Grid --> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* <!-- Sample Product Card --> */}
              <div
                className="product-card bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:shadow-md transition duration-300"
               
              >
                <div className="flex justify-center mb-4">
                  <Image
                    width={100}
                    height={100}
                    src="/images/product/wach-3.png"
                    // src=?? "/images/default.png"
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

              {/* <!--The second product--> */}
              <div
                className="product-card bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:shadow-md transition duration-300"
                
              >
                <div className="flex justify-center mb-4">
                  <Image
                    width={100}
                    height={100}
                    src="/images/product/wach-2.png"
                    // src=?? "/images/default.png"
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

              {/* <!--The third product--> */}
              <div
                className="product-card bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:shadow-md transition duration-300"
                
              >
                <div className="flex justify-center mb-4">
                  <Image
                    width={100}
                    height={100}
                    src="/images/product/wach-1.png"
                    // src=?? "/images/default.png"
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

            {/* <!-- Buttons --> */}
            <div className="mt-6 flex justify-end">
              <button
                className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 py-2 px-6 rounded-lg text-sm font-medium transition duration-300 me-2"
                
              >
                انصراف
              </button>
              <button
                className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-lg text-sm font-medium transition duration-300"
                
              >
                تایید انتخاب
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
