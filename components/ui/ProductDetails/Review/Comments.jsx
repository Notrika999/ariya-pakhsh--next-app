import React from "react";

export default function Comments() {
  return (
    <>
      <div className="space-y-4">
        <h2
          className="text-2xl pb-3 font-black text-zinc-800 dark:text-white relative
                                before:absolute before:bottom-0 before:right-0 before:h-1 before:w-22 before:bg-secondary-500 before:rounded"
        >
          نظرت در مورد این محصول چیه؟
        </h2>

        <p className="text-neutral-700 dark:text-gray-300 text-sm">
          برای ثبت نظر، از طریق دکمه افزودن دیدگاه جدید استفاده نمایید.
        </p>
      </div>

      <div className="grid grid-cols-6 gap-6 mt-8">
        {/* <!-- rating --> */}
        <div className="lg:col-span-2 col-span-6">
          <div className="sticky top-0 space-y-4">
            {/* <!-- متوسط امتیاز --> */}
            <div
              className="space-y-8 border border-gray-200 dark:border-gray-700
                                            p-4 rounded text-center bg-white dark:bg-zinc-800"
            >
              <h4 className="text-3xl dark:text-white">متوسط امتیاز ها</h4>
              <h5 className="text-3xl dark:text-white">3.00</h5>

              {/* <!-- Average --> */}
              <div className="flex rounded items-center p-2 custom-light dark:bg-zinc-700 justify-center">
                <svg
                  className="w-4 h-4 text-orange-400 ms-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"></path>
                </svg>
                <svg
                  className="w-4 h-4 text-orange-400 ms-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"></path>
                </svg>
                <svg
                  className="w-4 h-4 text-orange-400 ms-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"></path>
                </svg>
                <svg
                  className="w-4 h-4 text-orange-400 ms-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"></path>
                </svg>
                <svg
                  className="w-4 h-4 ms-1 text-gray-300 dark:text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"></path>
                </svg>
              </div>
            </div>

            {/* <!--Star percentage chart--> */}
            <div
              className="w-full p-4 border border-gray-200 dark:border-gray-700
                                        rounded custom-light dark:bg-zinc-800 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <span className="w-12 text-right whitespace-nowrap dark:text-gray-300">
                  5 ستاره
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden h-2">
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: "10%" }}
                  ></div>
                </div>
                <span className="w-8 text-left dark:text-gray-300">5</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-12 text-right whitespace-nowrap dark:text-gray-300">
                  4 ستاره
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden h-2">
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: "20%" }}
                  ></div>
                </div>
                <span className="w-8 text-left dark:text-gray-300">17</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-12 text-right whitespace-nowrap dark:text-gray-300">
                  3 ستاره
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden h-2">
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: "50%" }}
                  ></div>
                </div>
                <span className="w-8 text-left dark:text-gray-300">85</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-12 text-right whitespace-nowrap dark:text-gray-300">
                  2 ستاره
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden h-2">
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: "5%" }}
                  ></div>
                </div>
                <span className="w-8 text-left dark:text-gray-300">3</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-12 text-right whitespace-nowrap dark:text-gray-300">
                  1 ستاره
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden h-2">
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
                <span className="w-8 text-left dark:text-gray-300">652</span>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- form and comment --> */}
        <div className="lg:col-span-4 col-span-6">
          {/* <!-- form --> */}
          <div className="w-full pb-4 border-b border-gray-300 dark:border-gray-700">
            <div>
              {/* <!-- inputs --> */}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="mb-3 inline-block dark:text-gray-300">
                    نام و نام خانوادگی:
                  </label>
                  <input
                    type="text"
                    placeholder="نام خود را وارد کنید"
                    className="w-full px-3 py-4 border border-gray-300 dark:border-gray-700
                                   rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
                  />
                </div>

                <div>
                  <label className="mb-3 inline-block dark:text-gray-300">
                    ایمیل:
                  </label>
                  <input
                    type="email"
                    placeholder="ایمیل خود را وارد کنید"
                    className="w-full px-3 py-4 border border-gray-300 dark:border-gray-700
                                   rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>

              {/* <!-- checkbox --> */}
              <div className="flex items-center space-x-2 mb-4 text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 bg-gray-100 dark:bg-zinc-800
                               border-gray-300 dark:border-gray-600 rounded"
                />
                <label>ذخیره اطلاعات برای نظرات بعدی</label>
              </div>

              {/* <!-- rating --> */}
              <div className="mb-4">
                <label className="block mb-4 dark:text-gray-300">
                  امتیاز شما:
                </label>
                <div className="flex space-x-2">
                  <input
                    type="radio"
                    id="star1"
                    name="rating"
                    className="hidden"
                    value="1"
                  />
                  <label htmlFor="star1" className="cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="size-6 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03z"
                      ></path>
                    </svg>
                  </label>

                  <input
                    type="radio"
                    id="star2"
                    name="rating"
                    className="hidden"
                    value="2"
                  />
                  <label htmlFor="star2" className="cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="size-6 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03z"
                      ></path>
                    </svg>
                  </label>

                  <input
                    type="radio"
                    id="star3"
                    name="rating"
                    className="hidden"
                    value="3"
                  />
                  <label htmlFor="star3" className="cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="size-6 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03z"
                      ></path>
                    </svg>
                  </label>

                  <input
                    type="radio"
                    id="star4"
                    name="rating"
                    className="hidden"
                    value="4"
                  />
                  <label htmlFor="star4" className="cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="size-6 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03z"
                      ></path>
                    </svg>
                  </label>

                  <input
                    type="radio"
                    id="star5"
                    name="rating"
                    className="hidden"
                    value="5"
                  />
                  <label htmlFor="star5" className="cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="size-6 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03z"
                      ></path>
                    </svg>
                  </label>
                </div>
              </div>

              {/* <!-- textarea --> */}
              <label className="mb-3 inline-block dark:text-gray-300">
                نظر:
              </label>
              <textarea
                placeholder="متن نظر!"
                className="w-full px-3 py-4 border border-gray-300 dark:border-gray-700
                              bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-lg h-32 mb-4"
              ></textarea>

              {/* <!-- tags --> */}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    نقاط قوت:
                  </label>
                  <div
                    className="tag-container flex flex-wrap gap-2 p-2
                                                    border border-gray-300 dark:border-gray-700 rounded-lg
                                                    bg-custom-light dark:bg-zinc-800 min-h-[50px] items-center"
                  >
                    <input
                      className="tag-input bg-transparent text-gray-800 dark:text-gray-200
                                                    placeholder-gray-500 flex-grow px-3 py-2 outline-none"
                      placeholder="نقاط قوت را وارد کنید و بعد اینتر را بزنید"
                      data-color="bg-green-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    نقاط ضعف:
                  </label>
                  <div
                    className="tag-container flex flex-wrap gap-2 p-2
                                                border border-gray-300 dark:border-gray-700 rounded-lg
                                                bg-custom-light dark:bg-zinc-800 min-h-[50px] items-center"
                  >
                    <input
                      className="tag-input bg-transparent text-gray-800 dark:text-gray-200
                                                    placeholder-gray-500 flex-grow px-3 py-2 outline-none"
                      placeholder="نقاط ضعف را وارد کنید و بعد اینتر را بزنید"
                    />
                  </div>
                </div>
              </div>

              <button className="bg-primary hover:bg-primary-600 text-white py-3 px-20 rounded-lg">
                ثبت نظر
              </button>
            </div>
          </div>

          {/* <!-- comments --> */}
          <div className="space-y-5 mt-6">
            <div className="grid py-5 gap-4 grid-cols-4">
              <div className="md:col-span-3 col-span-4">
                <div className="flex space-x-3 items-center">
                  <div className="space-x-3 flex items-center">
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
                        d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"
                      ></path>
                    </svg>
                    <span className="text-sm">مرتب سازی:</span>
                  </div>
                  <nav>
                    <ul className="flex items-center space-x-3 text-sm">
                      <li>
                        <a href="" className="text-primary">
                          جدیدترین
                        </a>
                      </li>
                      <li>
                        <a href="">بیشترین پاسخ</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="md:col-span-1 col-span-4">
                <div className="md:text-left">
                  <span className="text-neutral-600 text-sm dark:text-white">
                    852 نظر تایید شده
                  </span>
                </div>
              </div>
            </div>

            {/* <!-- Comment Card --> */}
            <div className="bg-white border dark:border-gray-700 border-gray-200 dark:bg-zinc-800 rounded-xl shadow mb-6 overflow-hidden">
              <div className="p-5">
                {/* <!-- Header --> */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3 ">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                      <img
                        src="/images/user/user.png"
                        className="w-full h-full rounded-full"
                        alt=""
                      />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 dark:text-gray-200">
                        حسین امیری
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ۵ روز پیش
                      </div>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-3 py-1 rounded-full">
                    خریدار
                  </span>
                </div>

                {/* <!-- Rating --> */}
                <div className="flex mb-4">
                  {/* <!-- Filled Stars --> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="text-amber-400 size-5"
                  >
                    <path
                      fill="currentColor"
                      d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
                    ></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="text-amber-400 size-5"
                  >
                    <path
                      fill="currentColor"
                      d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
                    ></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="text-amber-400 size-5"
                  >
                    <path
                      fill="currentColor"
                      d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
                    ></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="text-amber-400 size-5"
                  >
                    <path
                      fill="currentColor"
                      d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
                    ></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="text-gray-300 size-5"
                  >
                    <path
                      fill="currentColor"
                      d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
                    ></path>
                  </svg>
                </div>

                {/* <!-- Comment Text --> */}
                <p className="text-gray-700 dark:text-gray-300 mb-5 leading-7 text-justify">
                  این گوشی مناسب است و از نظر کیفیت و متریال با مدل‌های مشابه
                  برابری می‌کند. طراحی زیبا و امکانات کامل آن واقعاً راضی‌کننده
                  است.
                </p>

                {/* <!-- Pros & Cons --> */}
                <div className="space-y-1 mb-5">
                  <div className="flex items-center p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 me-3 text-green-600 dark:text-green-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      قیمت مناسب
                    </span>
                  </div>
                  <div className="flex items-center p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 me-3 text-green-600 dark:text-green-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      باتری عالی
                    </span>
                  </div>
                  <div className="flex items-center p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 me-3 text-green-600 dark:text-green-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      کیفیت ساخت بالا
                    </span>
                  </div>
                  <div className="flex items-center p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 me-3 text-green-600 dark:text-green-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      آنتن‌دهی قوی
                    </span>
                  </div>
                  <div className="flex items-center p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 me-3 text-red-500 dark:text-red-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      رابط کاربری ضعیف
                    </span>
                  </div>
                </div>

                {/* <!-- Footer --> */}
                <div className="flex sm:flex-nowrap sm:space-y-0 space-y-3 flex-wrap justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400 me-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                        />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        دیجی کالا
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-800 rounded-full me-2 border border-gray-300 dark:border-gray-600"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        مشکی
                      </span>
                    </div>
                  </div>

                  {/* <!-- Like & Dislike Buttons --> */}
                  <div className="flex items-center space-x-3">
                    <span>آیا این دیدگاه برایتان مفید بود؟</span>
                    {/* <!-- Like Button --> */}
                    <button className="like-btn flex items-center space-x-1  text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400 transition-colors duration-200">
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
                          d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                        />
                      </svg>
                      <span className="text-sm font-medium">12</span>
                    </button>

                    {/* <!-- Dislike Button --> */}
                    <button className="dislike-btn flex items-center space-x-1  text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200">
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
                          d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
                        />
                      </svg>

                      <span className="text-sm font-medium">2</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Comment Card --> */}
            <div className="bg-white border dark:border-gray-700 border-gray-200 dark:bg-zinc-800 rounded-xl shadow mb-6 overflow-hidden">
              <div className="p-5">
                {/* <!-- Header --> */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3 ">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      م
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 dark:text-gray-200">
                        مریم رضایی
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ۲ روز پیش
                      </div>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-3 py-1 rounded-full">
                    خریدار
                  </span>
                </div>

                {/* <!-- Rating --> */}
                <div className="flex mb-4">
                  {/* <!-- Filled Stars --> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="text-amber-400 size-5"
                  >
                    <path
                      fill="currentColor"
                      d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
                    ></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="text-amber-400 size-5"
                  >
                    <path
                      fill="currentColor"
                      d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
                    ></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="text-amber-400 size-5"
                  >
                    <path
                      fill="currentColor"
                      d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
                    ></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="text-amber-400 size-5"
                  >
                    <path
                      fill="currentColor"
                      d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
                    ></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="text-gray-300 size-5"
                  >
                    <path
                      fill="currentColor"
                      d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
                    ></path>
                  </svg>
                </div>

                {/* <!-- Comment Text --> */}
                <p className="text-gray-700 dark:text-gray-300 mb-5 leading-7 text-justify">
                  این محصول واقعاً عالی است. از خریدم کاملاً راضی هستم و به همه
                  دوستانم توصیه می‌کنم. کیفیت ساخت فوق‌العاده‌ای دارد.
                </p>

                {/* <!-- Pros & Cons --> */}
                <div className="space-y-1 mb-5">
                  <div className="flex items-center p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 me-3 text-green-600 dark:text-green-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      طراحی شیک و زیبا
                    </span>
                  </div>
                  <div className="flex items-center p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 me-3 text-green-600 dark:text-green-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      ارزش خرید بالا
                    </span>
                  </div>
                  <div className="flex items-center p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 me-3 text-green-600 dark:text-green-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      خدمات پس از فروش خوب
                    </span>
                  </div>
                </div>

                {/* <!-- Footer --> */}
                <div className="flex sm:flex-nowrap sm:space-y-0 space-y-3 flex-wrap justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400 me-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                        />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        دیجی کالا
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-800 rounded-full me-2 border border-gray-300 dark:border-gray-600"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        مشکی
                      </span>
                    </div>
                  </div>

                  {/* <!-- Like & Dislike Buttons --> */}
                  <div className="flex items-center space-x-3">
                    <span>آیا این دیدگاه برایتان مفید بود؟</span>
                    {/* <!-- Like Button --> */}
                    <button className="like-btn flex items-center space-x-1  text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400 transition-colors duration-200">
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
                          d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                        />
                      </svg>
                      <span className="text-sm font-medium">12</span>
                    </button>

                    {/* <!-- Dislike Button --> */}
                    <button className="dislike-btn flex items-center space-x-1  text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200">
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
                          d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
                        />
                      </svg>

                      <span className="text-sm font-medium">2</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
