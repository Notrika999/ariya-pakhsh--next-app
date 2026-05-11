import React from 'react'

export default function OTPVerification() {
  return (
    <div className="form-step" id="step-3">
              <form className="space-y-5" id="otpForm" noValidate>
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
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                    maxLength={4}
                    className="w-full px-4 text-center text-lg py-3 border border-gray-300 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="_ _ _ _"
                    required
                    autoFocus
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
            </div>
  )
}
