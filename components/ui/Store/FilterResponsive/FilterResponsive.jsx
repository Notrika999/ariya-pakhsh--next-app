import React, { useState } from "react";
import Filter from "../Filter/Filter";

export default function FilterResponsive({
  filters,
  setFilters,
  brands,
  minLimit,
  maxLimit,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden block">
      <div className="fixed z-20 bottom-28 start-3">
        <button
          onClick={() => setOpen(true)}
          className="bg-primary px-3 py-3 rounded-lg drop-shadow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-8 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
        </button>
      </div>

      {/* <!--Filters--> */}
      {open && (
        <>
          {/* overlay */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* sidebar */}
          <div
            className={`fixed top-0 start-0 w-[80%] max-w-[360px] h-full bg-white dark:bg-[#0d1117] 
        border-e shadow-xl transform transition-all duration-300 z-50 overflow-y-scroll
        ${open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
          >
            {/* <!-- header --> */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
              <h2 className="font-bold text-base">فیلتر ها</h2>
              <button
                onClick={() => setOpen(false)}
                className="cursor-pointer"
                aria-label="بستن"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8 text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <Filter
              filters={filters}
              setFilters={setFilters}
              availableBrands={brands}
              minLimit={minLimit}
              maxLimit={maxLimit}
            />
          </div>
        </>
      )}
      {/* <!-- End Filters --> */}
    </div>
  );
}
