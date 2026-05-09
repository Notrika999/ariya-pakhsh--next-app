"use client";
import React, { useEffect, useState } from "react";

const pColors = {
  colors: ["آبی", "سبز", "قرمز"],
  defaultColor: "آبی",
};
export default function Description() {
  const [selectedColor, setSelectedColor] = useState(pColors.defaultColor);

  return (
    <section className="xl:col-span-5 mt-7 col-span-12 pb-10 w-full dark:text-gray-200">
      {/* <!-- Category --> */}
      <ul className="space-x-2 flex items-center">
        <li>
          <a href="" className="text-primary">
            اپل
          </a>
        </li>
        <li className="text-gray-400 dark:text-gray-500">/</li>
        <li>
          <a href="" className="text-primary">
            گوشی اپل
          </a>
        </li>
      </ul>

      {/* <!-- Title --> */}
      <div className="space-y-2 mt-2 pb-2 border-b border-b-gray-300 dark:border-b-gray-700">
        {/* <!-- Fa title --> */}
        <h2 className="font-black leading-8">
          گوشی موبایل اپل مدل iPhone 16 Pro ZAA دو سیم کارت ظرفیت 256 گیگابایت و
          رم 8 گیگابایت
        </h2>

        {/* <!-- En title --> */}
        <h2 className="text-gray-400 dark:text-gray-500 text-sm leading-8">
          Samsung Galaxy Watch5 44mm Smartwatch
        </h2>
      </div>

      {/* <!-- Rating , Comments and Question --> */}
      <div className="flex flex-wrap items-center pt-2 mt-2 space-x-2">
        {/* <!-- Rating --> */}
        <div className="flex items-center space-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            className="text-amber-400 size-5"
          >
            <path
              fill="currentColor"
              d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
            />
          </svg>
          <h4 className="text-sm font-bold">4.6</h4>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            (امتیاز ۳۰۸ خریدار)
          </span>
        </div>

        {/* <!-- Comments --> */}
        <div>
          <a
            href="#comments"
            className="bg-gray-200 hover:bg-primary/20 transition dark:bg-zinc-800 dark:text-gray-200 px-2 py-1 space-x-1 rounded-full flex items-center"
          >
            <span className="text-xs">185 دیدگاه </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </a>
        </div>

        {/* <!-- Question --> */}
        <div>
          <a
            href="#question"
            className="bg-gray-200 hover:bg-primary/20 transition dark:bg-zinc-800 dark:text-gray-200 px-2 py-1 space-x-1 rounded-full flex items-center"
          >
            <span className="text-xs">265 پرسش </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* <!-- Color Picker --> */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center space-x-2">
          <h4 className="font-bold text-lg">رنگ:</h4>
          <p id="selectedColor" className="text-lg">
            {selectedColor}
          </p>
        </div>

        {/* <!-- Colors --> */}
        <div className="flex my-4 flex-wrap items-center space-x-3">
          {pColors.colors.map((color) => (
            <div key={color} className="flex items-center">
              <input
                type="radio"
                name="color"
                id={color}
                value={color}
                className="hidden peer"
                checked={selectedColor === color}
                onChange={(e) => setSelectedColor(e.target.value)}
              />

              <label
                htmlFor={color}
                className="select-none dark:!text-white cursor-pointer flex items-center justify-center rounded-full border-2 border-gray-200 dark:border-gray-600 py-1 px-3 text-gray-700 transition-colors duration-200 ease-in-out peer-checked:text-gray-900 peer-checked:border-primary-500"
              >
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* <!-- Feature --> */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center space-x-2">
          <h4 className="font-bold text-lg">ویژگی ها</h4>
        </div>

        <div className="grid gap-3 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {/* <!-- Items --> */}
          <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg relative group">
            <h5 className="line-clamp-1 text-xs text-gray-600 dark:text-gray-300">
              نوع صفحه نمایش
            </h5>
            <h6 className="line-clamp-1 mt-3 text-xs">AMOLED</h6>

            <span className="absolute text-nowrap z-50 end-1/2 ms-2 -top-3 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
              <span className="absolute end-1/2 -bottom-[10px] rotate-[90deg] -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
              AMOLED
            </span>
          </div>
          {/* <!-- Items --> */}
          <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg relative group">
            <h5 className="line-clamp-1 text-xs text-gray-600 dark:text-gray-300">
              نرخ نوسازی
            </h5>
            <h6 className="line-clamp-1 mt-3 text-xs">120Hz Adaptive</h6>
            <span className="absolute text-nowrap z-50 end-1/2 ms-2 -top-3 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
              <span className="absolute end-1/2 -bottom-[10px] rotate-[90deg] -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
              120Hz Adaptive
            </span>
          </div>
          {/* <!-- Items --> */}
          <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg relative group">
            <h5 className="line-clamp-1 text-xs text-gray-600 dark:text-gray-300">
              حداکثر روشنایی
            </h5>
            <h6 className="line-clamp-1 mt-3 text-xs">2000 nits</h6>
            <span className="absolute text-nowrap z-50 end-1/2 ms-2 -top-3 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
              <span className="absolute end-1/2 -bottom-[10px] rotate-[90deg] -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
              2000 nits
            </span>
          </div>
          {/* <!-- Items --> */}
          <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg relative group">
            <h5 className="line-clamp-1 text-xs text-gray-600 dark:text-gray-300">
              رزولوشن
            </h5>
            <h6 className="line-clamp-1 mt-3 text-xs">1290 × 2796</h6>
            <span className="absolute text-nowrap z-50 end-1/2 ms-2 -top-3 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
              <span className="absolute end-1/2 -bottom-[10px] rotate-[90deg] -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
              1290 × 2796
            </span>
          </div>
          {/* <!-- Items --> */}
          <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg relative group">
            <h5 className="line-clamp-1 text-xs text-gray-600 dark:text-gray-300">
              نوع محافظ صفحه
            </h5>
            <h6 className="line-clamp-1 mt-3 text-xs">Ceramic Shield</h6>
            <span className="absolute text-nowrap z-50 end-1/2 ms-2 -top-3 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
              <span className="absolute end-1/2 -bottom-[10px] rotate-[90deg] -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
              Ceramic Shield
            </span>
          </div>
          {/* <!-- Items --> */}
          <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg relative group">
            <h5 className="line-clamp-1 text-xs text-gray-600 dark:text-gray-300">
              نسبت صفحه به بدنه
            </h5>
            <h6 className="line-clamp-1 mt-3 text-xs">89.8%</h6>
            <span className="absolute text-nowrap z-50 end-1/2 ms-2 -top-3 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
              <span className="absolute end-1/2 -bottom-[10px] rotate-[90deg] -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
              89.8%
            </span>
          </div>
        </div>
      </div>

      {/* <!-- Alert --> */}
      <div className="rounded my-3 mx-5 lg:mx-0">
        <div className="flex">
          <div className="flex mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              className="size-5 text-gray-500 dark:text-gray-400"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12S17.937 22.75 12 22.75S1.25 17.937 1.25 12M12 6.25a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0V7a.75.75 0 0 1 .75-.75m.568 11.25a.75.75 0 0 0-1.115-1.003l-.01.011a.75.75 0 0 0 1.114 1.004z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="ms-2 text-xs leading-6 text-justify text-neutral-500 dark:text-neutral-400">
            امکان برگشت کالا در گروه موبایل با دلیل انصراف از خرید تنها در صورتی
            مورد قبول است که پلمب کالا باز نشده باشد. تمام گوشی‌های دیجی‌کالا
            ضمانت رجیستری دارند. در صورت وجود مشکل رجیستری، می‌توانید بعد از
            مهلت قانونی ۳۰ روزه، گوشی خریداری‌شده را مرجوع کنید.
          </span>
        </div>
      </div>
    </section>
  );
}
