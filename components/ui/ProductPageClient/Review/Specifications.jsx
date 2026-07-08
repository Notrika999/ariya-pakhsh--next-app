import React from "react";

export default function Specifications() {
  return (
    <>
      <h2 className="text-2xl pb-3 font-black text-zinc-800 relative before:absolute before:bottom-0 before:right-0 before:h-1 before:w-22 before:bg-secondary-500 before:rounded dark:text-white">
        مشخصات فنی
      </h2>

      <div className="mx-auto p-6">
        {/* مشخصات کلی */}
        <div className="pb-10 last:pb-0">
          <h2 className="text-2xl font-bold mt-6 mb-4 pb-2">مشخصات کلی</h2>

          <div className="grid grid-cols-2 gap-6 text-right">
            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              نوع محصول:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              روکش صندلی خودرو
            </span>

            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              نوع دوخت:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              سفارشی متناسب با خودرو
            </span>

            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              جنس:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              چرم مصنوعی، پارچه، مخمل یا ترکیبی
            </span>

            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              مناسب برای:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              خودروهای سواری داخلی و خارجی
            </span>

            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              رنگ‌بندی:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              متنوع (مشکی، طوسی، کرم، قرمز، قهوه‌ای و ...)
            </span>

            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              کشور سازنده:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              ایران
            </span>

            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              گارانتی:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              بسته به برند تولیدکننده
            </span>
          </div>
        </div>

        {/* ویژگی‌ها */}
        <div className="pb-10 last:pb-0">
          <h2 className="text-2xl font-bold mt-6 mb-4 pb-2">ویژگی‌ها</h2>

          <div className="grid grid-cols-2 gap-6 text-right">
            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              مقاومت در برابر سایش:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              دارد
            </span>

            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              قابلیت شستشو:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              دارد
            </span>

            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              مقاومت در برابر نور خورشید:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              دارد
            </span>

            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              ضد تعریق:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              در مدل‌های پارچه‌ای و ترکیبی
            </span>

            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              سازگار با ایربگ جانبی:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              بله (در مدل‌های استاندارد)
            </span>

            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              قابلیت نصب:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              نصب آسان بدون نیاز به تغییر در صندلی
            </span>

            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              مناسب چهار فصل:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              بله
            </span>

            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              اقلام همراه:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              قلاب نصب، بست و دفترچه راهنما
            </span>
          </div>
        </div>

        {/* مزایا */}
        <div>
          <h2 className="text-2xl font-bold mt-6 mb-4 pb-2">مزایا</h2>

          <div className="grid grid-cols-2 gap-6 text-right">
            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              مزیت اصلی:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              محافظت از صندلی فابریک و افزایش زیبایی کابین خودرو
            </span>

            <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:odd:bg-[#1e232a] dark:text-white">
              مناسب برای:
            </span>
            <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:even:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
              استفاده روزمره، تاکسی‌های اینترنتی، خودروهای شخصی و سازمانی
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
