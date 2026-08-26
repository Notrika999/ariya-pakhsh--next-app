// components/layout/Header/Top/HeaderTop.jsx
"use client";

import React, { Suspense } from "react";
import HeaderLogo from "./HeaderLogo";
import HeaderSearch from "./HeaderSearch";
import HeaderSetting from "./HeaderSetting";

export default function HeaderTop() {
  return (
    <div className="flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:place-items-center">
      <div className="flex w-full items-center justify-between gap-3 lg:contents">
        {/* logo  */}
        <HeaderLogo />

        <Suspense
          fallback={
            <div className="h-10 min-w-0 flex-1 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 lg:hidden" />
          }
        >
          <HeaderSearch
            className="order-2 block min-w-0 flex-1 lg:hidden"
            inputClassName="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white py-2 pe-3 ps-9 text-[11px] font-semibold placeholder-gray-400 shadow-sm transition-colors duration-300 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
            buttonClassName="absolute right-2 rounded-lg p-1.5 text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-100"
            placeholder="جستجو در کارآپ"
            resultsClassName="fixed inset-x-3 top-[58px] z-50 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)] transition-colors duration-300 dark:border-gray-800 dark:bg-custom-dark dark:shadow-[0_18px_45px_rgba(0,0,0,0.45)] lg:hidden"
            resultsVariant="mobile"
            resultsId="mobileHeaderSearchResults"
          />
        </Suspense>

        {/* login and basket and favorite and dark mode  */}
        <HeaderSetting />
      </div>

      {/* search and filter  */}
      <Suspense
        fallback={
          <div className="lg:col-span-6 lg:block lg:order-2 order-4 hidden col-span-4 h-14 w-full rounded-2xl bg-gray-100 dark:bg-gray-900" />
        }
      >
        <HeaderSearch />
      </Suspense>

    </div>
  );
}
