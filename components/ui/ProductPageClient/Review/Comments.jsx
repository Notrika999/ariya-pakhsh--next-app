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
                <i className="fa fa-star text-orange-400 ms-1 text-sm"></i>
                <i className="fa fa-star text-orange-400 ms-1 text-sm"></i>
                <i className="fa fa-star text-orange-400 ms-1 text-sm"></i>
                <i className="fa fa-star text-orange-400 ms-1 text-sm"></i>
                <i className="fa fa-star ms-1 text-gray-300 dark:text-gray-500 text-sm"></i>
               
                
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
                    <i className="far fa-star text-gray-400 text-lg"></i>
                    
                  </label>

                  <input
                    type="radio"
                    id="star2"
                    name="rating"
                    className="hidden"
                    value="2"
                  />
                  <label htmlFor="star2" className="cursor-pointer">
                    <i className="far fa-star text-gray-400 text-lg"></i>
                  </label>

                  <input
                    type="radio"
                    id="star3"
                    name="rating"
                    className="hidden"
                    value="3"
                  />
                  <label htmlFor="star3" className="cursor-pointer">
                    <i className="far fa-star text-gray-400 text-lg"></i>
                  </label>

                  <input
                    type="radio"
                    id="star4"
                    name="rating"
                    className="hidden"
                    value="4"
                  />
                  <label htmlFor="star4" className="cursor-pointer">
                    <i className="far fa-star text-gray-400 text-lg"></i>
                  </label>

                  <input
                    type="radio"
                    id="star5"
                    name="rating"
                    className="hidden"
                    value="5"
                  />
                  <label htmlFor="star5" className="cursor-pointer">
                    <i className="far fa-star text-gray-400 text-lg"></i>
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
                    <i className="fas fa-bars-staggered"></i>
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
                   <i className="fa fa-star text-orange-400 ms-1 text-sm"></i>
                <i className="fa fa-star text-orange-400 ms-1 text-sm"></i>
                <i className="fa fa-star text-orange-400 ms-1 text-sm"></i>
                <i className="fa fa-star text-orange-400 ms-1 text-sm"></i>
                <i className="fa fa-star ms-1 text-gray-300 dark:text-gray-500 text-sm"></i>
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
                    <i className="far fa-check me-3 text-green-600 dark:text-green-400"></i>
                   
                    <span className="text-gray-700 dark:text-gray-300">
                      قیمت مناسب
                    </span>
                  </div>
                  <div className="flex items-center p-2 rounded-lg">
                    <i className="far fa-check me-3 text-green-600 dark:text-green-400"></i>
                    <span className="text-gray-700 dark:text-gray-300">
                      باتری عالی
                    </span>
                  </div>
                  <div className="flex items-center p-2 rounded-lg">
                    <i className="far fa-check me-3 text-green-600 dark:text-green-400"></i>
                    <span className="text-gray-700 dark:text-gray-300">
                      کیفیت ساخت بالا
                    </span>
                  </div>
                  <div className="flex items-center p-2 rounded-lg">
                   <i className="far fa-check me-3 text-green-600 dark:text-green-400"></i>
                    <span className="text-gray-700 dark:text-gray-300">
                      آنتن‌دهی قوی
                    </span>
                  </div>
                  <div className="flex items-center p-2 rounded-lg">
                    <i className="far fa-x me-3 text-red-500 dark:text-red-400"></i>
                   
                    <span className="text-gray-700 dark:text-gray-300">
                      رابط کاربری ضعیف
                    </span>
                  </div>
                </div>

                {/* <!-- Footer --> */}
                <div className="flex sm:flex-nowrap sm:space-y-0 space-y-3 flex-wrap justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <i className="far fa-store text-gray-500 dark:text-gray-400 me-2"></i>
                     
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
                      <i className="far fa-thumbs-up"></i>
                      <span className="text-sm font-medium">12</span>
                    </button>

                    {/* <!-- Dislike Button --> */}
                    <button className="dislike-btn flex items-center space-x-1  text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200">
                      <i className="far fa-thumbs-down"></i>

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
