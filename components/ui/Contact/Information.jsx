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
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
          آدرس ما
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          تهران، خیابان ولیعصر، پلاک ۱۲۳۴، طبقه ۳
        </p>
      </div>

      {/* <!-- Card 2 --> */}
      <div
        className="contact-card bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition duration-200
                dark:bg-custom-dark dark:border-gray-700 border-s-primary dark:border-s-primary-700 border-s-3"
      >
        <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900/80 rounded-full flex items-center justify-center text-secondary-600 dark:text-secondary-400 mx-auto mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            ></path>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
          تلفن تماس
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-1">۰۲۱-۱۲۳۴۵۶۷۸</p>
        <p className="text-gray-600 dark:text-gray-400">۰۹۱۲-۱۲۳-۴۵۶۷</p>
      </div>

      {/* <!-- Card 3 --> */}
      <div
        className="contact-card bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition duration-200
                dark:bg-custom-dark dark:border-gray-700 border-s-primary dark:border-s-primary-700 border-s-3"
      >
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/80 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
          ایمیل
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-1">
          info@parsistore.com
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          support@parsistore.com
        </p>
      </div>

      {/* <!-- Card 4 --> */}
      <div
        className="contact-card bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition duration-200
                dark:bg-custom-dark dark:border-gray-700 border-s-primary dark:border-s-primary-700 border-s-3"
      >
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/80 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
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
