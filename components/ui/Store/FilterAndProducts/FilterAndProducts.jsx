import ProductCard from "@/components/modules/ProductCard/ProductCard";
import Image from "next/image";
import React, { useState } from "react";
import Filter from "../Filter/Filter";

export default function FilterAndProducts({ storeProducts }) {
  const [filters, setFilters] = useState({
    search: "",
    color: "",
    brand: [],
  });

  const filteredProducts = storeProducts.filter((product) => {
    const matchSearch = product.title.includes(filters.search);

    const matchColor = !filters.color || product.colors.includes(filters.color);

    return matchSearch && matchColor;
  });
  return (
    <div className="grid gap-4 grid-cols-4">
      {/* <!-- Filter --> */}
      <Filter filters={filters} setFilters={setFilters} />

      {/* <!-- Products --> */}
      <section className="lg:col-span-3 col-span-4 w-full">
        {/* <!-- Quick Filter --> */}
        <div className="flex flex-wrap items-center sm:space-y-0 space-y-3  space-x-3">
          {/* <!--Icon and title--> */}
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 dark:text-white text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
              />
            </svg>

            <span className="text-gray-700 dark:text-gray-200">
              مرتب سازی بر اساس:
            </span>
          </div>

          {/* <!--Filter list--> */}
          <div className="flex items-center overflow-x-scroll max-sm:hide-scrollbar gap-6 text-gray-600 dark:text-gray-300 text-sm">
            <button className="dark:bg-gray-800 dark:text-white bg-gray-900 text-white px-4 py-1 rounded-full">
              همه
            </button>
            <button className="hover:text-gray-900 dark:hover:text-white transition">
              پربازدید
            </button>
            <button className="hover:text-gray-900 dark:hover:text-white transition">
              محبوب‌ترین
            </button>
            <button className="hover:text-gray-900 dark:hover:text-white transition">
              پرفروش‌ترین
            </button>
            <button className="hover:text-gray-900 dark:hover:text-white transition">
              گران‌ترین
            </button>
            <button className="hover:text-gray-900 dark:hover:text-white transition">
              ارزان‌ترین
            </button>
          </div>
        </div>

        {/* <!-- Items --> */}
        <div className="grid mt-6 grid-cols-12 gap-[2px] place-items-center">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="lg:col-span-3 sm:col-span-6 col-span-12 w-full"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* <!-- Pagination --> */}
        <nav
          className="flex flex-wrap justify-center my-6 bg-white dark:bg-custom-dark border border-gray-200 dark:border-gray-700
                       shadow-sm py-4 rounded-xl items-center gap-2 px-4"
          aria-label="Pagination"
        >
          {/* <!-- Previous --> */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-sm rounded-lg
                                   text-gray-600 dark:text-gray-300
                                   hover:bg-gray-100 dark:hover:bg-white/10
                                   disabled:opacity-40 disabled:pointer-events-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.6"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
            قبلی
          </button>

          {/* <!-- Pages --> */}
          <div className="flex items-center gap-2">
            {/* <!-- Active --> */}
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2.5 rounded-lg text-sm
                               bg-primary text-white shadow-sm
                               dark:bg-primary/80 dark:text-white"
            >
              1
            </button>

            <button
              type="button"
              className="flex items-center justify-center px-4 py-2.5 rounded-lg text-sm
                                   text-gray-700 dark:text-gray-200
                                   hover:bg-gray-100 dark:hover:bg-white/10
                                   transition"
            >
              2
            </button>

            <button
              type="button"
              className="flex items-center justify-center px-4 py-2.5 rounded-lg text-sm
                                   text-gray-700 dark:text-gray-200
                                   hover:bg-gray-100 dark:hover:bg-white/10
                                   transition"
            >
              3
            </button>
          </div>

          {/* <!-- Next --> */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-sm rounded-lg
                               text-gray-600 dark:text-gray-300
                               hover:bg-gray-100 dark:hover:bg-white/10"
          >
            بعدی
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.6"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        </nav>
      </section>
    </div>
  );
}
