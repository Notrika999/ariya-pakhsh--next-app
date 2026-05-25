import Image from "next/image";
import React from "react";

export default function CompareTable() {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-gray-600">
        {/* <!--Header Row--> */}
        <tr className="sticky-product-header">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-100 w-1/5 bg-white dark:bg-zinc-800">
            محصولات
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 text-center w-1/5 bg-white dark:bg-zinc-800">
            <div className="flex flex-col items-center">
              <Image
                width={100}
                height={100}
                src="/images/product/mobile-2.png"
                // src=?? "/images/default.png"
                alt="گوشی سامسونگ"
                className="h-16 object-contain mb-2"
              />
              <span className="font-medium">گلکسی S23 اولترا</span>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 text-center w-1/5 bg-white dark:bg-zinc-800">
            <div className="flex flex-col items-center">
              <Image
                width={100}
                height={100}
                src="/images/product/mobile-1.png"
                // src=?? "/images/default.png"
                alt="آیفون"
                className="h-16 object-contain mb-2"
              />
              <span className="font-medium">آیفون 14 پرو مکس</span>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 text-center w-1/5 bg-white dark:bg-zinc-800">
            <div className="flex flex-col items-center">
              <Image
                width={100}
                height={100}
                src="/images/product/mobile-3.png"
                // src=?? "/images/default.png"
                alt="شیائومی"
                className="h-16 object-contain mb-2"
              />
              <span className="font-medium">شیائومی 13 پرو</span>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 text-center w-1/5 bg-white dark:bg-zinc-800">
            <div className="flex flex-col items-center">
              <i className="fas fa-plus text-2xl text-gray-400 dark:text-gray-500 mb-2"></i>
              
              <span className="text-gray-500 dark:text-gray-400">
                افزودن محصول
              </span>
            </div>
          </td>
        </tr>
      </thead>
      {/* <!--General Specs Rows--> */}
      <tbody id="general-specs">
        <tr className="feature-row">
          <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">
            برند
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            سامسونگ
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            اپل
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            شیائومی
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            -
          </td>
        </tr>
        <tr className="feature-row">
          <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">
            سال عرضه
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            2023
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            2022
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            2022
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            -
          </td>
        </tr>
        <tr className="feature-row">
          <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">
            سیستم عامل
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            اندروید 13
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            iOS 16
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            اندروید 12
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            -
          </td>
        </tr>
        <tr className="feature-row">
          <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">
            پردازنده
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            اسنپدراگون 8 نسل 2
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            A16 بایونیک
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            اسنپدراگون 8 نسل 1
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            -
          </td>
        </tr>
        <tr className="feature-row">
          <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">
            حافظه RAM
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            12 گیگابایت
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            6 گیگابایت
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            8 گیگابایت
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            -
          </td>
        </tr>
        <tr className="feature-row">
          <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">
            حافظه داخلی
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            256 گیگابایت
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            128 گیگابایت
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            256 گیگابایت
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            -
          </td>
        </tr>
        <tr className="feature-row">
          <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">
            قیمت
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            ۴۹,۹۰۰,۰۰۰ تومان
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            ۵۶,۵۰۰,۰۰۰ تومان
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            ۳۲,۷۰۰,۰۰۰ تومان
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
            -
          </td>
        </tr>
      </tbody>
    </table>
  );
}
