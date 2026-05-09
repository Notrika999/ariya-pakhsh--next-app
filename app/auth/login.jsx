import React from "react";
import MobileLogin from "@/components/ui/auth/MobileLogin";

function login() {
  return (
    <div className="relative bg-gray-100 dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen flex flex-col">
      |
      <main className="flex-grow container mx-auto px-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="max-w-md mx-auto min-h-screen justify-center flex items-center">
          <div className="bg-white relative w-full dark:bg-custom-dark rounded-2xl shadow-soft p-8 border border-gray-100 dark:border-gray-700 fade-in">
            {/* <!-- logo --> */}
            <div className="flex items-center mb-5 justify-center">
              <img
                className="h-12 dark:invert"
                src="assets/images/logo.png"
                loading="lazy"
                alt=""
              />
            </div>

            {/* <!-- Step Indicators --> */}
            <div className="flex justify-center mb-6">
              <span className="step-indicator active" data-step="1"></span>
              <span className="step-indicator" data-step="2"></span>
              <span className="step-indicator" data-step="3"></span>
              <span className="step-indicator" data-step="4"></span>
            </div>

            {/* <!-- Title --> */}
            <div className="text-center mb-8">
              <h2
                className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2"
                id="step-title"
              >
                ورود / ثبت نام
              </h2>
              <p
                className="text-gray-500 dark:text-gray-400 text-sm"
                id="step-description"
              >
                برای ثبت نام یا ورود، شماره موبایل خود را وارد کنید
              </p>
            </div>

            <MobileLogin />

            {/* <!-- Step 2: Login Method Selection --> */}
            <div className="form-step" id="step-2 ">
              <div className="space-y-4">
                {/* <!-- Method selection buttons --> */}
                {/* <button
                  type="button"
                  id="chooseOtpLogin"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  ورود با کد یکبار مصرف
                </button> */}

                <button
                  type="button"
                  id="choosePasswordLogin"
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white dark:bg-custom-dark dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1f242c] transition-colors"
                >
                  ورود با رمز عبور
                </button>

                {/* <!-- Forgot Password Link --> */}
                {/* <div className="text-center pt-2">
                  <button
                    type="button"
                    id="showForgotPasswordStep"
                    className="text-sm text-primary hover:text-primary/90 transition-colors"
                  >
                    رمز عبور خود را فراموش کرده‌اید؟
                  </button>
                </div> */}

                {/* <!-- Password login form (hidden by default) --> */}
                {/* <form id="passwordLoginForm" className="hidden space-y-5">
                  <div>
                    <label
                      for="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                    >
                      رمز عبور
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        autocomplete="password"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="رمز عبور خود را وارد کنید"
                        required
                      />
                      <button
                        type="button"
                        className="absolute password-toggle top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                        onClick="togglePassword('password', this)"
                      >
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
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      </button>
                    </div>
                    <p
                      className="error-message text-sm text-red-600 mt-2 hidden"
                      id="password-error"
                    ></p>
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      id="showForgotPasswordStep2"
                      className="text-sm text-primary hover:text-primary/90 transition-colors"
                    >
                      رمز عبور خود را فراموش کرده‌اید؟
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      id="backToMethod"
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-custom-dark hover:bg-gray-50 dark:hover:bg-[#1f242c] transition-colors"
                    >
                      بازگشت
                    </button>
                    <button
                      type="button"
                      id="loginWithPassword"
                      className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                    >
                      ورود
                    </button>
                  </div>
                </form>

                <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    id="backToMobile"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    تغییر شماره موبایل
                  </button>
                </div> */}
              </div>
            </div>

            {/* <!-- Step 3: OTP Verification --> */}
            {/* <div className="form-step" id="step-3">
              <form className="space-y-5" id="otpForm" novalidate>
                <div className="text-center mb-4">
                  <p className="text-green-600 text-sm mb-3">
                    کد تایید برای{" "}
                    <strong style={{ direction: "ltr" }} id="maskedMobile">
                      09******123
                    </strong>{" "}
                    ارسال شد
                  </p>
                  <input
                    name="otp_code"
                    type="tel"
                    id="otpCode"
                    inputmode="numeric"
                    pattern="[0-9]{4}"
                    maxlength="4"
                    className="w-full px-4 text-center text-lg py-3 border border-gray-300 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="_ _ _ _"
                    required
                    autofocus
                  />
                </div>

                <p
                  className="error-message text-sm text-red-600 text-center hidden"
                  id="otp-error"
                ></p>

                <div>
                  <button
                    type="button"
                    id="verifyOtpBtn"
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  >
                    ادامه ثبت نام
                  </button>
                </div>

                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 space-y-2">
                  <div>
                    <button
                      type="button"
                      id="resend-otp-button"
                      className="transition-colors duration-200 text-primary hover:text-primary/90"
                    >
                      <span className="text-green-600 font-medium">
                        ارسال دوباره کد
                      </span>
                    </button>
                  </div>
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      type="button"
                      id="cancelOtp"
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      برگشت
                    </button>
                  </div>
                </div>
              </form>
            </div> */}

            {/* <!-- Step 4: New User Registration --> */}
            {/* <div className="form-step" id="step-4">
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      for="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                    >
                      نام
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="نام"
                      required
                    />
                    <p
                      className="error-message text-sm text-red-600 mt-2 hidden"
                      id="name-error"
                    ></p>
                  </div>

                  <div>
                    <label
                      for="family"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                    >
                      نام خانوادگی
                    </label>
                    <input
                      type="text"
                      id="family"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="نام خانوادگی"
                      required
                    />
                    <p
                      className="error-message text-sm text-red-600 mt-2 hidden"
                      id="family-error"
                    ></p>
                  </div>
                </div>

                <div>
                  <label
                    for="regPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  >
                    رمز عبور
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      autocomplete="regPassword"
                      id="regPassword"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="رمز عبور دلخواه خود را وارد کنید"
                      required
                    />
                    <button
                      type="button"
                      className="absolute password-toggle top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                      onClick="togglePassword('regPassword', this)"
                    >
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
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center" id="lengthCondition">
                      <span className="w-4 h-4 ms-2">○</span>حداقل 8 کاراکتر
                    </div>
                    <div className="flex items-center" id="uppercaseCondition">
                      <span className="w-4 h-4 ms-2">○</span>حرف بزرگ (A-Z)
                    </div>
                    <div className="flex items-center" id="lowercaseCondition">
                      <span className="w-4 h-4 ms-2">○</span>حرف کوچک (a-z)
                    </div>
                    <div className="flex items-center" id="numberCondition">
                      <span className="w-4 h-4 ms-2">○</span>عدد (0-9)
                    </div>
                  </div>

                  <p
                    className="error-message text-sm text-red-600 mt-2 hidden"
                    id="regPassword-error"
                  ></p>
                </div>

                <button
                  type="button"
                  id="registerAndLogin"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  تکمیل ثبت نام و ورود
                </button>
              </form>
            </div> */}

            {/* <!-- Step 5: Forgot Password --> */}
            {/* <div className="form-step" id="step-5">
              <form className="space-y-5">
                <div className="text-center mb-4">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    برای بازیابی رمز عبور، کد تایید به شماره{" "}
                    <strong id="forgotPasswordMobile">09******123</strong> ارسال
                    خواهد شد.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    id="backFromForgotPassword"
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-custom-dark hover:bg-gray-50 dark:hover:bg-[#1f242c] transition-colors"
                  >
                    بازگشت
                  </button>
                  <button
                    type="button"
                    id="requestPasswordReset"
                    className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  >
                    دریافت کد تایید
                  </button>
                </div>
              </form>
            </div> */}

            {/* <!-- Step 6: Set New Password --> */}
            {/* <div className="form-step" id="step-6">
              <form className="space-y-5">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                    تنظیم رمز عبور جدید
                  </h3>
                </div>

                <div>
                  <label
                    for="newPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  >
                    رمز عبور جدید
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      autocomplete="newPassword"
                      id="newPassword"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="رمز عبور جدید"
                      required
                    />
                    <button
                      type="button"
                      className="absolute password-toggle top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                      onClick="togglePassword('newPassword', this)"
                    >
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
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center" id="newLengthCondition">
                      <span className="w-4 h-4 ms-2">○</span>حداقل 8 کاراکتر
                    </div>
                    <div
                      className="flex items-center"
                      id="newUppercaseCondition"
                    >
                      <span className="w-4 h-4 ms-2">○</span>حرف بزرگ (A-Z)
                    </div>
                    <div
                      className="flex items-center"
                      id="newLowercaseCondition"
                    >
                      <span className="w-4 h-4 ms-2">○</span>حرف کوچک (a-z)
                    </div>
                    <div className="flex items-center" id="newNumberCondition">
                      <span className="w-4 h-4 ms-2">○</span>عدد (0-9)
                    </div>
                  </div>

                  <p
                    className="error-message text-sm text-red-600 mt-2 hidden"
                    id="newPassword-error"
                  ></p>
                </div>

                <div>
                  <label
                    for="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  >
                    تکرار رمز عبور جدید
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      autocomplete="confirmPassword"
                      id="confirmPassword"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="تکرار رمز عبور جدید"
                      required
                    />
                    <button
                      type="button"
                      className="absolute password-toggle top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                      onClick="togglePassword('confirmPassword', this)"
                    >
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
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </button>
                  </div>
                  <p
                    className="error-message text-sm text-red-600 mt-2 hidden"
                    id="confirmPassword-error"
                  ></p>
                </div>

                <button
                  type="button"
                  id="resetPassword"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  تغییر رمز عبور و ورود
                </button>
              </form>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default login;
