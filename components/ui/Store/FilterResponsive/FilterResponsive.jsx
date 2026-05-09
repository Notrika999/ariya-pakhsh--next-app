import React, { useState } from "react";

export default function FilterResponsive({ filters, setFilters }) {
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

            <section className="space-y-5 p-3 my-5 sticky top-0">
              {/* <!-- Search --> */}
              <section>
                <div className="dark:bg-custom-dark dark:border-gray-700 dark:text-white bg-white rounded-lg drop-shadow-lg border-gray-300 border-1 p-4">
                  <h2 className="font-bold text-base mb-4 relative pb-4 before:absolute before:start-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary after:absolute after:w-40 after:h-2 after:bottom-0 after:start-4 after:bg-primary after:rounded-lg">
                    جستجوی محصولات
                  </h2>
                  <div className="relative flex items-center w-full">
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
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
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </section>
              {/* <!-- Filter applied --> */}
              <section>
                <div className="dark:bg-custom-dark bg-white rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                  {/* <!-- Title --> */}
                  <h2
                    className="font-bold text-lg mb-4 relative pb-4
                                before:absolute before:start-0 before:bottom-0 before:w-2 before:h-2 before:bg-primary before:rounded-full
                                after:absolute after:start-4 after:bottom-0 after:w-32 after:h-1.5 after:bg-primary/70 after:rounded-lg"
                  >
                    فیلترهای فعال
                  </h2>

                  {/* <!--Selected filters--> */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* <!--Any filter--> */}
                    <a
                      href="#"
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-300
                                       dark:border-gray-600 rounded-xl text-xs text-gray-700 dark:text-gray-200
                                       hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                    >
                      <span>موجودی</span>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.8"
                        stroke="currentColor"
                        className="w-3.5 h-3.5 opacity-70"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </a>

                    <a href="#" className="filter-tag">
                      تخفیف‌خورده
                    </a>
                    <a href="#" className="filter-tag">
                      قرمز
                    </a>
                    <a href="#" className="filter-tag">
                      سبز
                    </a>
                    <a href="#" className="filter-tag">
                      آبی
                    </a>
                  </div>
                </div>
              </section>
              {/* <!-- Color --> */}
              <section>
                <div className="dark:bg-custom-dark dark:border-gray-700 dark:text-white bg-white rounded-lg drop-shadow-lg border-gray-300 border-1 p-4">
                  <h2 className="font-bold text-base mb-4 relative pb-4 before:absolute before:start-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary after:absolute after:w-40 after:h-2 after:bottom-0 after:start-4 after:bg-primary after:rounded-lg">
                    رنگ ها
                  </h2>
                  <div className="relative space-x-2 flex-wrap flex items-center w-full">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="color"
                        id="greenColorRes"
                        className="hidden peer"
                      />
                      <label
                        for="greenColorRes"
                        className="select-none dark:!text-white cursor-pointer flex items-center justify-center rounded-full border-2 border-gray-200 py-1 px-3 text-gray-700 transition-colors duration-200 ease-in-out peer-checked:text-gray-900 peer-checked:border-primary-500"
                      >
                        <span className="size-4 bg-green-600 rounded-full"></span>
                        <span className="dir-ltr ms-2 text-sm">سبز</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="color"
                        id="blueColorRes"
                        className="hidden peer"
                      />
                      <label
                        for="blueColorRes"
                        className="select-none dark:!text-white cursor-pointer flex items-center justify-center rounded-full border-2 border-gray-200 py-1 px-3 text-gray-700 transition-colors duration-200 ease-in-out peer-checked:text-gray-900 peer-checked:border-primary-500"
                      >
                        <span className="size-4 bg-blue-600 rounded-full"></span>
                        <span className="dir-ltr ms-2 text-sm">ابی</span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>
              {/* <!-- Range --> */}
              <section>
                <div className="dark:bg-custom-dark dark:border-gray-700 dark:text-white bg-white rounded-lg drop-shadow-lg border-gray-300 border-1 p-4">
                  <h2 className="font-bold text-base mb-4 relative pb-4 before:absolute before:start-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary after:absolute after:w-40 after:h-2 after:bottom-0 after:start-4 after:bg-primary after:rounded-lg">
                    فیلتر قیمت
                  </h2>
                  <div className="relative space-x-2 flex-wrap flex items-center w-full">
                    <div className="price-filter">
                      <div className="p-4 rounded-lg space-y-4 mx-auto">
                        <div className="flex items-baseline gap-4">
                          <div className="flex-1">
                            <input
                              type="text"
                              className="min-input w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-zinc-900 text-center"
                              disabled
                            />
                            <strong className="block text-center mt-3 text-sm">
                              تومان
                            </strong>
                          </div>
                          <span className="text-gray-500 block">تا</span>
                          <div className="flex-1">
                            <input
                              type="text"
                              className="max-input w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-zinc-900 text-center bg-gray-100"
                              disabled
                            />
                            <strong className="block text-center mt-3 text-sm">
                              تومان
                            </strong>
                          </div>
                        </div>
                        <div className="slider-container">
                          <div className="slider-track"></div>
                          <div className="slider-range"></div>
                          <div className="slider-thumb min-thumb"></div>
                          <div className="slider-thumb max-thumb"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* <!-- Brand --> */}
              <section>
                <div className="dark:bg-custom-dark dark:border-gray-700 dark:text-white bg-white rounded-lg drop-shadow-lg border-gray-300 border-1 p-4">
                  <h2 className="font-bold text-base mb-4 relative pb-4 before:absolute before:start-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary after:absolute after:w-40 after:h-2 after:bottom-0 after:start-4 after:bg-primary after:rounded-lg">
                    برند ها
                  </h2>
                  <div className="space-y-3">
                    <div className="relative space-x-2 flex-wrap flex items-center w-full">
                      <label className="inline-flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="hidden peer"
                          checked
                        />
                        <div className="w-5 h-5 border rounded bg-white border-gray-400 peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition-all shadow-sm">
                          <svg
                            className="w-4 h-4 text-white peer-checked:block"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-4 4.5a.75.75 0 0 1-1.08.02l-2-2a.75.75 0 0 1 1.08-1.04l1.47 1.47 3.46-3.98z"
                            ></path>
                          </svg>
                        </div>
                        <span className="me-2 text-gray-700 dark:text-white text-sm">
                          سامسونگ
                        </span>
                      </label>
                    </div>
                    <div className="relative space-x-2 flex-wrap flex items-center w-full">
                      <label className="inline-flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="hidden peer" />
                        <div className="w-5 h-5 border rounded bg-white border-gray-400 peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition-all shadow-sm">
                          <svg
                            className="w-4 h-4 text-white peer-checked:block"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-4 4.5a.75.75 0 0 1-1.08.02l-2-2a.75.75 0 0 1 1.08-1.04l1.47 1.47 3.46-3.98z"
                            ></path>
                          </svg>
                        </div>
                        <span className="me-2 text-gray-700 dark:text-white text-sm">
                          اپل
                        </span>
                      </label>
                    </div>
                    <div className="relative space-x-2 flex-wrap flex items-center w-full">
                      <label className="inline-flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="hidden peer" />
                        <div className="w-5 h-5 border rounded bg-white border-gray-400 peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition-all shadow-sm">
                          <svg
                            className="w-4 h-4 text-white peer-checked:block"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-4 4.5a.75.75 0 0 1-1.08.02l-2-2a.75.75 0 0 1 1.08-1.04l1.47 1.47 3.46-3.98z"
                            ></path>
                          </svg>
                        </div>
                        <span className="me-2 text-gray-700 dark:text-white text-sm">
                          شیائومی
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </div>
        </>
      )}
      {/* <!-- End Filters --> */}
    </div>
  );
}
