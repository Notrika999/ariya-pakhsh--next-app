import Link from "next/link";
import React from "react";

function page404() {
  return (
    <section className="py-5">
      <div className="container">
        {/* <!-- Content --> */}
        <div className="max-w-4xl w-full mx-auto">
          {/* <!--Back button--> */}
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 me-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              بازگشت به صفحه اصلی
            </Link>
          </div>

          {/* <!--Main content--> */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              {/* <!--Image section--> */}
              <div className="md:w-2/5 p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-indigo-700 dark:to-purple-900 dark:text-white">
                <div className="text-center text-white">
                  <div className="text-8xl font-black mb-4">404</div>
                  <div className="text-xl font-medium">صفحه یافت نشد</div>
                </div>
              </div>

              {/* <!--Text section--> */}
              <div className="md:w-3/5 p-8 md:p-12">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  اوپس! به نظر می‌رسد گم شده‌اید
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد، حذف شده یا
                  آدرس آن تغییر کرده است. می‌توانید از طریق جستجو یا دکمه‌های
                  زیر به محتوای مورد نظر خود دسترسی پیدا کنید.
                </p>

                {/* <!--Statistics and information--> */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      404
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      کد خطا
                    </div>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      صفحه
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      موجود نیست
                    </div>
                  </div>
                </div>

                {/* <!--Search form--> */}
                <div className="mb-8">
                  <label
                    for="search"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    صفحه مورد نظر خود را جستجو کنید
                  </label>
                  <div className="flex rounded-lg shadow-sm">
                    <input
                      type="text"
                      id="search"
                      className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-s-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="جستجو..."
                    />
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-l-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-5 me-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        ></path>
                      </svg>
                      جستجو
                    </button>
                  </div>
                </div>

                {/* <!--Action buttons--> */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="/"
                    className="inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-5 me-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                      />
                    </svg>
                    صفحه اصلی
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex justify-center items-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-5 me-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                      />
                    </svg>
                    تماس با پشتیبانی
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default page404;
