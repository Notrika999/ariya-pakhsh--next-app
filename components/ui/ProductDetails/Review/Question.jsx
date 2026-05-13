import React from "react";

export default function Question() {
  return (
    <>
      <div className="space-y-4">
        <h2 className="text-2xl pb-3 font-black text-zinc-800 relative before:absolute before:bottom-0 before:start-0 before:h-1 before:w-22 before:bg-primary-500 before:rounded dark:text-white">
          سوالی داری در مورد این محصول؟
        </h2>
        <p className="text-neutral-700 text-sm dark:text-white">
          برای ثبت نظر، از طریق دکمه افزودن دیدگاه جدید نمایید. اگر این محصول را
          قبلا خریده باشید، نظر شما به عنوان خریدار ثبت خواهد شد.
        </p>
      </div>

      {/* <!-- form --> */}
      <div className="w-full pb-4 border-b my-5 border-b-gray-300">
        <form action="">
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor="nameQ" className="mb-3 inline-block">
                نام و نام خانوادگی:
              </label>
              <input
                id="nameQ"
                type="text"
                placeholder="نام خود را وارد کنید"
                className="w-full px-3 py-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
              />
            </div>
            <div>
              <label htmlFor="emailQ" className="mb-3 inline-block">
                ایمیل:
              </label>
              <input
                id="emailQ"
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="w-full px-3 py-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="saveInfoQ"
              className="ms-2 ms-2 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="saveInfoQ">
              ذخیره نام، ایمیل و وب‌سایت من برای نظرات بعدی
            </label>
          </div>
          <div>
            <label htmlFor="commentQ" className="mb-3 inline-block">
              نظر:
            </label>
            <textarea
              id="commentQ"
              placeholder="متن نظر!"
              className="w-full px-3 py-4 border border-gray-300 dark:border-gray-700
                              bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-lg h-32 mb-4"
            ></textarea>
          </div>
          <button className="bg-primary hover:bg-primary-600 text-white py-3 px-20 rounded-lg">
            ثبت نظر
          </button>
        </form>
      </div>

      {/* <!-- Questions --> */}
      <div className="space-y-6">
        {/* <!--Filters header--> */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-custom-light dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700">
          {/* <!-- Sorting --> */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <i className="fas fa-arrow-down-short-wide"></i>
              <span className="text-sm font-medium">مرتب‌سازی:</span>
            </div>
            <div className="flex gap-2 whitespace-nowrap overflow-x-scroll pb-2 hide-scrollbar">
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 hover:bg-primary/90">
                جدیدترین
              </button>
              <button className="px-4 py-2 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium border border-gray-300 dark:border-zinc-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all duration-200">
                محبوب‌ترین
              </button>
              <button className="px-4 py-2 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium border border-gray-300 dark:border-zinc-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all duration-200">
                دارای پاسخ
              </button>
            </div>
          </div>

          {/* <!-- Search and count --> */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-primary">852</span> سوال
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در سوالات..."
                className="pe-10 ps-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
              <i className="fa fa-search text-gray-400 dark:text-gray-500 absolute end-3 top-1/2 transform -translate-y-1/2"></i>
              
            </div>
          </div>
        </div>

        {/* <!--List of questions--> */}
        <div className="space-y-6">
          {/* <!--Sample question 1--> */}
          <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="p-6">
              {/* <!--Question header--> */}
              <div className="flex items-start justify-between mb-4 flex-wrap space-y-3 sm:space-y-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    م
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      محمد رضایی
                      <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                        خریدار
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <i className="far fa-clock"></i>
                      ۲ روز پیش
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium">
                    پاسخ داده شده
                  </span>
                </div>
              </div>

              {/* <!--Question text--> */}
              <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3 leading-relaxed">
                نزدیک یک ماهه استفاده میکنم صورتم همش جوش های ریز ودرشت میزنه
                کسی علتشو میدونه؟؟
              </h3>

              {/* <!--Question statistics--> */}
              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <i className="far fa-comments"></i>
                  ۴ پاسخ
                </div>
                <div className="flex items-center gap-1">
                  <i className="far fa-thumbs-up"></i>
                  ۱۲ مفید
                </div>
              </div>
            </div>

            {/* <!--Answers (Collapsible)--> */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-custom-light dark:bg-zinc-800">
              <div className="p-6 space-y-4">
                {/* <!--Seller's response--> */}
                <div className="bg-white dark:bg-zinc-800 border border-green-200 dark:border-green-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      گ
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800 dark:text-white">
                          گالری تاوک
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                          فروشنده
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        سلام اوایل استفاده از این محصول جوش های زیر پوستی میریزه
                        بیرون بعد به مرور زمان بهتر می شود.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      پاسخ داده شده در ۱۴۰۲/۱۰/۱۵
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200 group">
                        <i className="far fa-thumbs-up"></i>
                        <span className="text-sm font-medium">۸</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 group">
                        <i className="far fa-thumbs-down"></i>
                        <span className="text-sm font-medium">۱</span>
                      </button>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>

        </div>

        {/* <!--Load more button--> */}
        <div className="text-center pt-6">
          <button className="px-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-all duration-200 font-medium">
            مشاهده سوالات بیشتر
          </button>
        </div>
      </div>
    </>
  );
}
