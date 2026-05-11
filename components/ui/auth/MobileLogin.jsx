import React from "react";

export default function MobileLogin({ onContinue }) {
  return (
    <>
      {/* <!-- Step 1: Mobile Number Input --> */}
      <div className="form-step active" id="step-1">
        <form className="space-y-5" id="authForm" noValidate>
          {/* <!-- Mobile number --> */}
          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              شماره موبایل
            </label>
            <div className="relative">
              <input
                name="mobile"
                type="tel"
                id="mobile"
                inputMode="numeric"
                pattern="09[0-9]{9}"
                className="w-full ps-12 pe-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                placeholder="09xxxxxxxxx"
                required
              />
              <div className="absolute input-icon top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <i className="fa-solid fa-mobile-screen"></i>

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
              onClick={onContinue}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <span className="flex items-center">
                ادامه
                <i className="fa-solid fa-arrow-alt-left ms-2"></i>

              </span>
            </button>
          </div>
        </form>

        {/* <!-- Social login --> */}
        {/* <div className="mt-6 mb-4">
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

        </div> */}
      </div>
    </>
  );
}
