import React from "react";

export default function Seller() {
  return (
    <div className="bg-white dark:bg-custom-dark dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 dark:border-gray-700 mt-4 rounded-2xl px-6 py-6">
      {/* <!-- Title --> */}
      <h2
        className="font-bold text-lg mb-4 relative pb-4 text-gray-900 dark:text-gray-200
                before:absolute before:start-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary
                after:absolute after:w-40 after:h-2 after:bottom-0 after:start-4 after:bg-primary after:rounded-lg"
      >
        فروشندگان این کالا
      </h2>
      {/* <!-- Sellers --> */}
      <div className="border border-gray-200 rounded-2xl dark:border-gray-700">
        {/* <!-- Seller 1 --> */}
        <div
          className="grid items-center grid-cols-10 p-4 gap-4
                odd:custom-light even:bg-white
                dark:odd:bg-[#1e232a] dark:even:bg-[#252b33] first:rounded-t-2xl last:rounded-b-2xl"
        >
          {/* <!-- Name --> */}
          <div className="lg:col-span-2 col-span-6">
            <div className="flex items-start flex-col space-y-3 space-x-4">
              <div className="flex items-center space-x-2">
                <span className="size-8 flex items-center justify-center bg-white border border-gray-200 dark:bg-zinc-700 dark:border-zinc-600 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 text-gray-700 dark:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 9h18M4 9l1-4h14l1 4m-1 11h-14a1 1 0 01-1-1v-7h16v7a1 1 0 01-1 1z"
                    ></path>
                  </svg>
                </span>
                <div className="font-semibold dark:text-gray-200">مهرآفرین</div>
              </div>

              <div className="flex items-center space-x-2">
                <h5 className="text-sm dark:text-gray-300">رضایت خریداران</h5>
                <div className="flex items-center space-x-2">
                  <span className="text-sm dark:text-gray-300">عملکرد</span>
                  <div className="text-gray-500 dark:text-gray-500 text-sm">
                    {" "}
                    |
                  </div>
                  <span className="text-green-600 text-sm">عالی</span>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Delivery --> */}
          <div className="lg:col-span-2 col-span-6">
            <div className="flex items-center space-x-2">
              <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
                <svg
                  className="size-5 text-gray-700 dark:text-gray-300"
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
                    ></path>
                    <path d="M10.05 17H15V6.6a.6.6 0 0 0-.6-.6H1m4.65 11H3.6a.6.6 0 0 1-.6-.6v-4.9"></path>
                    <path strokeLinejoin="round" d="M2 9h4"></path>
                    <path d="M15 9h5.61a.6.6 0 0 1 .548.356l1.79 4.028a.6.6 0 0 1 .052.243V16.4a.6.6 0 0 1-.6.6h-1.9M15 17h1"></path>
                  </g>
                </svg>
              </span>
              <h6 className="dark:text-gray-200">آماده ارسال</h6>
            </div>
          </div>

          {/* <!-- Warranty --> */}
          <div className="lg:col-span-2 col-span-6">
            <div className="flex items-center space-x-2">
              <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
                <svg
                  className="size-5 text-gray-700 dark:text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
              </span>
              <h6 className="dark:text-gray-200">گارانتی</h6>
            </div>
          </div>

          {/* <!-- Price --> */}
          <div className="lg:col-span-2 col-span-6">
            <div className="flex items-center">
              <div className="text-gray-700 dark:text-gray-300 flex flex-col items-center">
                <div className="flex justify-between items-center">
                  <del className="text-zinc-400 dark:text-zinc-500">
                    <span>100000000</span>
                  </del>
                  <div className="bg-secondary-500 text-white text-xs ms-2 font-bold px-2 py-1 rounded-xl rounded-bl-md shadow shadow-red-500/50 z-10">
                    35%
                  </div>
                </div>
                <span className="text-xl inline-block mt-2 font-bold dark:text-white">
                  90,000,000
                  <span className="text-xs font-bold -rotate-90 dark:text-zinc-300">
                    تومان
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* <!-- Add To Cart --> */}
          <div className="lg:col-span-2 col-span-6">
            <div className="flex items-center justify-start xl:justify-end">
              <button className="bg-primary shadow-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl px-5 py-3 text-sm">
                افزودن به سبد خرید
              </button>
            </div>
          </div>
        </div>
        {/* <!-- Seller 2 --> */}
        <div
          className="grid items-center grid-cols-10 p-4 gap-4
                odd:custom-light even:bg-white
                dark:odd:bg-[#1e232a] dark:even:bg-[#252b33] first:rounded-t-2xl last:rounded-b-2xl"
        >
          {/* <!-- Name --> */}
          <div className="lg:col-span-2 col-span-6">
            <div className="flex items-start flex-col space-y-3 space-x-4">
              <div className="flex items-center space-x-2">
                <span className="size-8 flex items-center justify-center bg-white border border-gray-200 dark:bg-zinc-700 dark:border-zinc-600 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 text-gray-700 dark:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 9h18M4 9l1-4h14l1 4m-1 11h-14a1 1 0 01-1-1v-7h16v7a1 1 0 01-1 1z"
                    ></path>
                  </svg>
                </span>
                <div className="font-semibold dark:text-gray-200">مهرآفرین</div>
              </div>

              <div className="flex items-center space-x-2">
                <h5 className="text-sm dark:text-gray-300">رضایت خریداران</h5>
                <div className="flex items-center space-x-2">
                  <span className="text-sm dark:text-gray-300">عملکرد</span>
                  <div className="text-gray-500 dark:text-gray-500 text-sm">
                    {" "}
                    |
                  </div>
                  <span className="text-green-600 text-sm">عالی</span>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Delivery --> */}
          <div className="lg:col-span-2 col-span-6">
            <div className="flex items-center space-x-2">
              <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
                <svg
                  className="size-5 text-gray-700 dark:text-gray-300"
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
                    ></path>
                    <path d="M10.05 17H15V6.6a.6.6 0 0 0-.6-.6H1m4.65 11H3.6a.6.6 0 0 1-.6-.6v-4.9"></path>
                    <path strokeLinejoin="round" d="M2 9h4"></path>
                    <path d="M15 9h5.61a.6.6 0 0 1 .548.356l1.79 4.028a.6.6 0 0 1 .052.243V16.4a.6.6 0 0 1-.6.6h-1.9M15 17h1"></path>
                  </g>
                </svg>
              </span>
              <h6 className="dark:text-gray-200">آماده ارسال</h6>
            </div>
          </div>

          {/* <!-- Warranty --> */}
          <div className="lg:col-span-2 col-span-6">
            <div className="flex items-center space-x-2">
              <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
                <svg
                  className="size-5 text-gray-700 dark:text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
              </span>
              <h6 className="dark:text-gray-200">گارانتی</h6>
            </div>
          </div>

          {/* <!-- Price --> */}
          <div className="lg:col-span-2 col-span-6">
            <div className="flex items-center">
              <div className="text-gray-700 dark:text-gray-300 flex flex-col items-center">
                <div className="flex justify-between items-center">
                  <del className="text-zinc-400 dark:text-zinc-500">
                    <span>100000000</span>
                  </del>
                  <div className="bg-secondary-500 text-white text-xs ms-2 font-bold px-2 py-1 rounded-xl rounded-bl-md shadow shadow-red-500/50 z-10">
                    35%
                  </div>
                </div>
                <span className="text-xl inline-block mt-2 font-bold dark:text-white">
                  90,000,000
                  <span className="text-xs font-bold -rotate-90 dark:text-zinc-300">
                    تومان
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* <!-- Add To Cart --> */}
          <div className="lg:col-span-2 col-span-6">
            <div className="flex items-center justify-start xl:justify-end">
              <button className="bg-primary shadow-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl px-5 py-3 text-sm">
                افزودن به سبد خرید
              </button>
            </div>
          </div>
        </div>
        {/* <!-- Seller 3 --> */}
        <div
          className="grid items-center grid-cols-10 p-4 gap-4
                odd:custom-light even:bg-white
                dark:odd:bg-[#1e232a] dark:even:bg-[#252b33] first:rounded-t-2xl last:rounded-b-2xl"
        >
          {/* <!-- Name --> */}
          <div className="lg:col-span-2 col-span-6">
            <div className="flex items-start flex-col space-y-3 space-x-4">
              <div className="flex items-center space-x-2">
                <span className="size-8 flex items-center justify-center bg-white border border-gray-200 dark:bg-zinc-700 dark:border-zinc-600 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 text-gray-700 dark:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 9h18M4 9l1-4h14l1 4m-1 11h-14a1 1 0 01-1-1v-7h16v7a1 1 0 01-1 1z"
                    ></path>
                  </svg>
                </span>
                <div className="font-semibold dark:text-gray-200">مهرآفرین</div>
              </div>

              <div className="flex items-center space-x-2">
                <h5 className="text-sm dark:text-gray-300">رضایت خریداران</h5>
                <div className="flex items-center space-x-2">
                  <span className="text-sm dark:text-gray-300">عملکرد</span>
                  <div className="text-gray-500 dark:text-gray-500 text-sm">
                    {" "}
                    |
                  </div>
                  <span className="text-green-600 text-sm">عالی</span>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Delivery --> */}
          <div className="lg:col-span-2 col-span-6">
            <div className="flex items-center space-x-2">
              <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
                <svg
                  className="size-5 text-gray-700 dark:text-gray-300"
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
                    ></path>
                    <path d="M10.05 17H15V6.6a.6.6 0 0 0-.6-.6H1m4.65 11H3.6a.6.6 0 0 1-.6-.6v-4.9"></path>
                    <path strokeLinejoin="round" d="M2 9h4"></path>
                    <path d="M15 9h5.61a.6.6 0 0 1 .548.356l1.79 4.028a.6.6 0 0 1 .052.243V16.4a.6.6 0 0 1-.6.6h-1.9M15 17h1"></path>
                  </g>
                </svg>
              </span>
              <h6 className="dark:text-gray-200">آماده ارسال</h6>
            </div>
          </div>

          {/* <!-- Warranty --> */}
          <div className="lg:col-span-2 col-span-6">
            <div className="flex items-center space-x-2">
              <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
                <svg
                  className="size-5 text-gray-700 dark:text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
              </span>
              <h6 className="dark:text-gray-200">گارانتی</h6>
            </div>
          </div>

          {/* <!-- Price --> */}
          <div className="lg:col-span-2 col-span-6">
            <div className="flex items-center">
              <div className="text-gray-700 dark:text-gray-300 flex flex-col items-center">
                <div className="flex justify-between items-center">
                  <del className="text-zinc-400 dark:text-zinc-500">
                    <span>100000000</span>
                  </del>
                  <div className="bg-secondary-500 text-white text-xs ms-2 font-bold px-2 py-1 rounded-xl rounded-bl-md shadow shadow-red-500/50 z-10">
                    35%
                  </div>
                </div>
                <span className="text-xl inline-block mt-2 font-bold dark:text-white">
                  90,000,000
                  <span className="text-xs font-bold -rotate-90 dark:text-zinc-300">
                    تومان
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* <!-- Add To Cart --> */}
          <div className="lg:col-span-2 col-span-6">
            <div className="flex items-center justify-start xl:justify-end">
              <button className="bg-primary shadow-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl px-5 py-3 text-sm">
                افزودن به سبد خرید
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
