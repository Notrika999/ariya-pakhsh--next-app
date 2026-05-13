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
          <i className="far fa-sliders text-3xl text-white"></i>
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
                <i className="far fa-close"></i>
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
