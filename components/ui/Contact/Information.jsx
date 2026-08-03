import React from "react";

export default function Information() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {/* <!-- Card 1 --> */}
      <div
        className="contact-card bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition duration-200
                dark:bg-custom-dark dark:border-gray-700 border-s-primary dark:border-s-primary-700 border-s-3"
      >
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/80 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto mb-4">
        <i className="far fa-location-dot text-2xl"></i>
          
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
          آدرس ما
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          مازندران-ساری، بلوار امام رضا (ع) 
        </p>
      </div>

      {/* <!-- Card 2 --> */}
      <div
        className="contact-card bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition duration-200
                dark:bg-custom-dark dark:border-gray-700 border-s-primary dark:border-s-primary-700 border-s-3"
      >
        <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900/80 rounded-full flex items-center justify-center text-secondary-600 dark:text-secondary-400 mx-auto mb-4">
        <i className="far fa-phone text-xl"></i>
          
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
          تلفن تماس
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-1">90007824</p>
        <p className="text-gray-600 dark:text-gray-400 " dir="ltr">۰۹۱1-xxx-xxxx</p>
      </div>

      {/* <!-- Card 3 --> */}
      <div
        className="contact-card bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition duration-200
                dark:bg-custom-dark dark:border-gray-700 border-s-primary dark:border-s-primary-700 border-s-3"
      >
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/80 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto mb-4">
        <i className="far fa-envelope text-2xl"></i>
          
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
          ایمیل
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-1">
          info@carup24.com
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          support@carup24.com
        </p>
      </div>

      {/* <!-- Card 4 --> */}
      <div
        className="contact-card bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition duration-200
                dark:bg-custom-dark dark:border-gray-700 border-s-primary dark:border-s-primary-700 border-s-3"
      >
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/80 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto mb-4">
        <i className="far fa-clock text-2xl"></i>
         
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
          ساعات کاری
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-1">
          شنبه تا چهارشنبه: ۸:۰۰-۱۷:۰۰
        </p>
        <p className="text-gray-600 dark:text-gray-400">پنجشنبه: ۸:۰۰-۱۲:۰۰</p>
      </div>
    </div>
  );
}
