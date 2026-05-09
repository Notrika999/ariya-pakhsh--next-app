import React from "react";

export default function MobileLogin() {
  return (
    <>
      {/* <!-- Step 1: Mobile Number Input --> */}
      <div className="form-step active" id="step-1">
        <form className="space-y-5" id="authForm" novalidate>
          {/* <!-- Mobile number --> */}
          <div>
            <label
              for="mobile"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              شماره موبایل
            </label>
            <div className="relative">
              <input
                name="mobile"
                type="tel"
                id="mobile"
                inputmode="numeric"
                pattern="09[0-9]{9}"
                className="w-full ps-12 pe-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                placeholder="09xxxxxxxxx"
                required
              />
              <div className="absolute input-icon top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
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
                    d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                  />
                </svg>
              </div>
            </div>
            <p
              className="error-message text-sm text-red-600 mt-2 hidden"
              id="mobile-error"
            ></p>
          </div>

          {/* <!-- Continue button --> */}
          <div>
            <button
              type="button"
              id="checkMobileBtn"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <span className="flex items-center">
                ادامه
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 ms-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
              </span>
            </button>
          </div>
        </form>

        {/* <!-- Social login --> */}
        <div className="mt-6 mb-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-custom-dark text-gray-500 dark:text-gray-400">
                یا ورود با
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="col-span-3">
              <a
                href="#"
                className="w-full inline-flex justify-center items-center py-4 px-4 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-custom-dark text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1f242c] transition-colors"
              >
                <span className="me-3">حساب کاربری گوگل</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                >
                  <g fill="none" fillRule="evenodd" clipRule="evenodd">
                    <path
                      fill="#F44336"
                      d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86"
                      opacity=".987"
                    />
                    <path
                      fill="#FFC107"
                      d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92"
                      opacity=".997"
                    />
                    <path
                      fill="#448AFF"
                      d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49"
                      opacity=".999"
                    />
                    <path
                      fill="#43A047"
                      d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z"
                      opacity=".993"
                    />
                  </g>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
