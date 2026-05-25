import Image from "next/image";
import Link from "next/link";
import React from "react";

function FailPayment() {
  return (
    // <!-- START CONTENT -->
    <section className="py-5">
      <div className="container mx-auto">
        {/* <!-- Content --> */}
        <div className="max-w-md w-full mx-auto">
          {/* <!--Original card--> */}
          <div className="bg-white dark:bg-custom-dark rounded-2xl shadow-xl overflow-hidden border border-red-200 dark:border-red-800">
            {/* <!-- Header --> */}
            <div className="bg-linear-to-l from-red-500 to-rose-600 p-6 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="far fa-x text-2xl text-white"></i>
              </div>
              <h1 className="text-2xl font-black text-white">پرداخت ناموفق</h1>
              <p className="text-red-100 mt-2">پرداخت شما انجام نشد</p>
            </div>

            {/* <!-- Content --> */}
            <div className="p-6">
              {/* <!--Error information--> */}
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <i className="far fa-triangle-exclamation text-red-500"></i>
                  

                  <span className="font-medium text-gray-800 dark:text-white">
                    علت خطا:
                  </span>
                </div>
                <p
                  className="text-sm text-gray-600 dark:text-gray-400"
                  id="errorMessage"
                >
                  موجودی حساب شما کافی نمی‌باشد. لطفاً از صحت اطلاعات کارت بانکی
                  اطمینان حاصل کنید.
                </p>
              </div>

              {/* <!--Error code--> */}
              <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-6">
                <span className="text-gray-600 dark:text-gray-300">
                  کد خطا:
                </span>
                <span className="font-bold text-gray-800 dark:text-white">
                  ERR-85742
                </span>
              </div>

              {/* <!-- Product --> */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3">
                  محصول انتخابی
                </h3>
                <div className="flex items-center space-x-3 ">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Image
                      width={100}
                      height={100}
                      src="/images/product/wach-1.png"
                      // src= ?? "/images/default.png"
                      alt=""
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      گوشی موبایل اپل مدل iPhone 16 Pro
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      رنگ: مشکی - ظرفیت: 256GB
                    </p>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">
                      ۲,۵۴۰,۰۰۰ تومان
                    </p>
                  </div>
                </div>
              </div>

              {/* <!-- Guidance --> */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-2  mb-2">
                  <i className="far fa-lightbulb text-yellow-500"></i>
                 
                  <span className="font-medium text-gray-800 dark:text-white">
                    راهنمایی:
                  </span>
                </div>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 ps-4">
                  <li className="flex items-start"> 
                    <i className="fa fa-check text-green-500 mt-1 me-1"></i>
                    
                    از صحت اطلاعات کارت بانکی اطمینان حاصل کنید
                  </li>
                  <li className="flex items-start">
                    <i className="fa fa-check text-green-500 mt-1 me-1"></i>
                    موجودی حساب خود را بررسی کنید
                  </li>
                  <li className="flex items-start">
                    <i className="fa fa-check text-green-500 mt-1 me-1"></i>
                    در صورت تکرار خطا، با بانک خود تماس بگیرید
                  </li>
                </ul>
              </div>

              {/* <!--Action buttons--> */}
              <div className="space-y-3">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <i className="far fa-rotate me-2"></i>
                 
                  تلاش مجدد پرداخت
                </button>
                <Link
                  href="#"
                  className="w-full bg-primary hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <i className="far fa-cart-shopping me-2 "></i>
                 
                  بازگشت به سبد خرید
                </Link>
                <Link
                  href="/"
                  className=" w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <i className="far fa-home text-xl mb-2"></i>
                 
                  بازگشت به صفحه اصلی
                </Link>
              </div>
            </div>
          </div>

          {/* <!--Additional information--> */}
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>در صورت بروز مشکل، با پشتیبانی تماس بگیرید:</p>
            <p className="font-medium mt-1">۰۲۱-۸۸۵۶۱۲۴۵</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FailPayment;

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};