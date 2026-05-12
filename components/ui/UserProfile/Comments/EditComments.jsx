import React from "react";
import SidebarResponsive from "../SidebarResponsive";
import UserSidebar from "../UserSidebar";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";

export default function EditComments() {
  return (
    <section className="py-5">
      <div className="container mx-auto">
        <div className="grid my-4 grid-cols-1 lg:grid-cols-4 gap-8">
          {/* <!-- User Panel Sidebar show in responsive break point lg --> */}
          <div className="lg:hidden block">
            <SidebarResponsive />
          </div>

          {/* <!--User Panel Sidebar--> */}
          <div className="lg:col-span-1 lg:block hidden">
            {/* <!--Navigation menu--> */}
            <div className="sticky top-0">
              <UserSidebar />
            </div>
          </div>

          {/* <!--Main Data content--> */}
          <div className="lg:col-span-3 space-y-8">
            {/* <!-- Dashboard header --> */}
            <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick="history.back()"
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition duration-200"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      ></path>
                    </svg>
                  </button>
                  <div>
                    <TitleAfter title={"ویرایش نظر"} />
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      ویرایش نظر شما برای محصول
                    </p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        وضعیت نظر
                      </p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                        تأیید شده
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Product Info --> */}
            <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
              <TitleAfter title={"محصول مرتبط"} />
              <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="shrink-0">
                  <img
                    src="assets/images/product/television-2.png"
                    className="size-24 rounded-lg"
                    alt="گوشی موبایل سامسونگ گلکسی A73"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 text-lg">
                    گوشی موبایل سامسونگ گلکسی A73
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    کد محصول: PRD-001
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-400">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        ۵.۰
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ۱۲۴ نفر مفید دانستند
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Edit Comment Form --> */}
            <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
              <TitleAfter title={"ویرایش نظر"} />
              <form id="editCommentForm">
                {/* <!-- Rating Section --> */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    امتیاز شما
                  </label>
                  <div className="flex space-x-1" id="starRating">
                    <svg
                      className="w-10 h-10 cursor-pointer text-yellow-400"
                      data-rating="1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-10 h-10 cursor-pointer text-yellow-400"
                      data-rating="2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-10 h-10 cursor-pointer text-yellow-400"
                      data-rating="3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-10 h-10 cursor-pointer text-yellow-400"
                      data-rating="4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-10 h-10 cursor-pointer text-gray-300"
                      data-rating="5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mt-2" id="ratingText">
                    امتیاز: ۴ از ۵
                  </p>
                </div>

                {/* <!-- Comment Text Section --> */}
                <div className="mb-6">
                  <label
                    for="commentText"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                  >
                    متن نظر
                  </label>
                  <textarea
                    id="commentText"
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-200 resize-none"
                    placeholder="نظر خود را درباره این محصول بنویسید..."
                  >
                    این گوشی واقعا عالیه! باتری فوق العاده ای داره و دوربینش
                    خیلی خوبه. پیشنهاد میکنم حتما بخرید. کیفیت ساخت عالی و
                    عملکرد بسیار روانی داره.
                  </textarea>
                  <p className="text-xs text-gray-500 mt-2">
                    حداقل ۱۰ کاراکتر و حداکثر ۱۰۰۰ کاراکتر
                  </p>
                </div>

                {/* <!-- Form Actions --> */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick="history.back()"
                    className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600 transition duration-200"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition duration-200 flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 me-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    ذخیره تغییرات
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
