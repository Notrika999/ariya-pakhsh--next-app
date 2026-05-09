import React from "react";

export default function HeaderSearch() {
  return (
    <div className="lg:col-span-6 lg:block lg:order-2 order-4 hidden col-span-4 w-full">
      <div className="flex items-center w-full justify-between">
        {/* search  */}
        <div className="flex w-full items-center">
          {/* Search component */}
          <div className="relative flex items-center w-full">
            <input
              type="text"
              id="searchInput"
              className="w-full appearance-none rounded-xl border border-gray-300 dark:border-gray-700 py-3 ps-4 pe-10 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-custom-dark text-gray-900 dark:text-gray-100 transition-colors duration-300"
              placeholder="جستجوی محصولات ...."
            />

            <button className="p-2 rounded-3xl absolute end-1 hover:opacity-90 transition-opacity">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
            {/* Search results */}
            <div
              id="searchResults"
              className="absolute top-13 end-0 start-0 z-10 bg-white dark:bg-custom-dark border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] overflow-hidden transition-colors duration-300 hidden"
            >
              {/* The results content will be filled by JavaScript  */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
