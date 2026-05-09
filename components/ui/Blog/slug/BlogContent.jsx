import Image from "next/image";
import Link from "next/link";
import React from "react";
import BlogTop from "../BlogTop";
import BlogVideoSidebar from "../BlogVideoSidebar";
import BlogSidebar from "../BlogSidebar";

export default function BlogContent() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* <!-- Post --> */}
      <div className="xl:col-span-3 col-span-4 bg-white rounded-xl shadow-md overflow-hidden">
        {/* <!--The main image of the article--> */}
        <Image
          width={1052}
          height={384}
          src="/images/blog/cover.jpg"
          alt="گوشی‌های هوشمند"
          className="w-full h-64 md:h-96 object-cover"
        />

        {/* <!--Header of the article--> */}
        <div className="p-6 md:p-8 dark:bg-custom-dark">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
                تکنولوژی
              </span>
              <span className="text-sm text-gray-500">15 خرداد 1402</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">5 دقیقه مطالعه</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-gray-800 mb-6 dark:text-white">
            راهنمای خرید بهترین گوشی هوشمند در سال 1402
          </h1>

          {/* <!--Author information--> */}
          <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
            <Image
              width={100}
              height={100}
              src="/images/user/profile-Image.jpg"
              alt="نویسنده"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ms-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-300">
                محمد رضایی
              </h4>
              <p className="text-sm text-gray-500">کارشناس فناوری اطلاعات</p>
            </div>
          </div>

          {/* <!--Content of the article--> */}
          <div className="article-content text-gray-700 dark:text-gray-300">
            <p>
              در دنیای امروز که گوشی‌های هوشمند به بخش جدایی‌ناپذیر زندگی ما
              تبدیل شده‌اند، انتخاب یک مدل مناسب می‌تواند چالش برانگیز باشد. در
              این مقاله به بررسی معیارهای انتخاب یک گوشی هوشمند مناسب و معرفی
              بهترین مدل‌های سال 1402 می‌پردازیم.
            </p>

            <h2>معیارهای انتخاب گوشی هوشمند</h2>

            <p>
              قبل از پرداختن به مدل‌های خاص، بهتر است معیارهای کلی برای انتخاب
              یک گوشی مناسب را بررسی کنیم:
            </p>

            <ul>
              <li>
                <strong>بودجه:</strong> محدوده قیمتی که برای خرید در نظر دارید
                مهمترین عامل است.
              </li>
              <li>
                <strong>سیستم عامل:</strong> انتخاب بین اندروید و iOS بستگی به
                ترجیحات و نیازهای شما دارد.
              </li>
              <li>
                <strong>کارایی پردازنده:</strong> برای کاربری سنگین مانند گیمینگ
                یا ویرایش ویدئو اهمیت دارد.
              </li>
              <li>
                <strong>کیفیت دوربین:</strong> برای عکاسان حرفه‌ای یا
                علاقه‌مندان به شبکه‌های اجتماعی حیاتی است.
              </li>
              <li>
                <strong>طول عمر باتری:</strong> برای کاربرانی که زیاد از گوشی
                استفاده می‌کنند بسیار مهم است.
              </li>
            </ul>

            <h2>بهترین گوشی‌های اندرویدی 1402</h2>

            <p>
              در رده‌بندی گوشی‌های اندرویدی سال جاری، مدل‌های زیر به عنوان
              بهترین‌ها شناخته شده‌اند:
            </p>

            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              1. سامسونگ گلکسی S23 اولترا
            </h3>

            <p>
              این گوشی با پردازنده قدرتمند اسنپدراگون 8 نسل 2، صفحه نمایش 6.8
              اینچی داینامیک AMOLED 2X و سیستم چهار دوربین 200 مگاپیکسلی، یکی از
              بهترین انتخاب‌ها برای کاربران حرفه‌ای است.
            </p>

            <Image
              width={100}
              height={100}
              src="/images/blog/blog-5.jpg"
              alt="سامسونگ گلکسی S23 اولترا"
              className="w-full h-auto my-6 rounded-lg"
            />

            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              2. شیائومی 13 پرو
            </h3>

            <p>
              با قیمتی مناسب‌تر نسبت به رقبای پرچمدار، این مدل شیائومی پردازنده
              قدرتمند، صفحه نمایش 120 هرتز و سیستم سه دوربین لایکا را ارائه
              می‌دهد.
            </p>

            <h2>بهترین آیفون‌های 1402</h2>

            <p>برای طرفداران اپل، انتخاب‌های سال جاری شامل موارد زیر است:</p>

            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              1. آیفون 14 پرو مکس
            </h3>

            <p>
              با تراشه A16 بایونیک، صفحه نمایش همیشه روشن و سیستم دوربین
              پیشرفته، این مدل همچنان یکی از قدرتمندترین گوشی‌های بازار محسوب
              می‌شود.
            </p>

            {/* <Image
                  width={100}
                  height={100}
                  src="https://images.unsplash.com/photo-1664478546384-d57ffe74a78c?ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80"
                  alt="آیفون 14 پرو مکس"
                  className="w-full h-auto my-6 rounded-lg"
                /> */}

            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              2. آیفون SE 2022
            </h3>

            <p>
              گزینه‌ای مقرون‌به‌صرفه با تراشه A15 همانند آیفون 13، اما با طراحی
              قدیمی‌تر و صفحه نمایش کوچک‌تر.
            </p>

            <h2 className="dark:text-gray-200">نتیجه‌گیری</h2>

            <p>
              انتخاب بهترین گوشی هوشمند به نیازها و بودجه شما بستگی دارد.
              مدل‌های معرفی شده در این مقاله هر کدام در رده خود بهترین عملکرد را
              ارائه می‌دهند. پیشنهاد می‌کنیم قبل از خرید، حتما گوشی مورد نظر را
              از نزدیک بررسی کنید.
            </p>
          </div>

          {/* <!--Article tags--> */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <Link
                href="#"
                className="bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/50 dark:text-white hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition duration-300"
              >
                گوشی هوشمند
              </Link>
              <Link
                href="#"
                className="bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/50 dark:text-white hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition duration-300"
              >
                راهنمای خرید
              </Link>
              <Link
                href="#"
                className="bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/50 dark:text-white hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition duration-300"
              >
                تکنولوژی
              </Link>
              <Link
                href="#"
                className="bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/50 dark:text-white hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition duration-300"
              >
                اندروید
              </Link>
              <Link
                href="#"
                className="bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/50 dark:text-white hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition duration-300"
              >
                آیفون
              </Link>
            </div>
          </div>

          {/* <!--Sharing--> */}
          <div className="mt-8 dark:bg-zinc-800 bg-custom-light p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-3 dark:text-white">
              این مقاله را با دوستان خود به اشتراک بگذارید
            </h3>
            <div className="flex space-x-3">
              <Link
                href="#"
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </Link>
              <Link
                href="#"
                className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </Link>
              <Link
                href="#"
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </Link>
              <Link
                href="#"
                className="bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </Link>
            </div>
          </div>

          {/* <!-- the author --> */}
          <div className="mt-8 bg-custom-light dark:bg-zinc-800 p-6 rounded-lg">
            <div className="flex items-center">
              <Image
                width={100}
                height={100}
                src="/images/user/user.jpg"
                alt="نویسنده"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="ms-4">
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-300">
                  محمد رضایی
                </h4>
                <p className="text-gray-600 mb-2 dark:text-gray-400">
                  کارشناس فناوری اطلاعات با 10 سال سابقه در حوزه موبایل و گجت‌ها
                </p>
                <div className="flex space-x-3">
                  <Link
                    href="#"
                    className="text-gray-500 dark:text-gray-300 hover:text-blue-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                    </svg>
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-500 dark:text-gray-300 hover:text-blue-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                    </svg>
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-500 dark:text-gray-300 hover:text-gray-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-700 dark:text-gray-400">
              محمد رضایی متخصص حوزه فناوری و نویسنده دائمی وبلاگ فروشگاه ما است.
              او با بیش از 10 سال سابقه در بررسی و تحلیل گجت‌های دیجیتال،
              راهنمای‌های تخصصی برای خریداران تهیه می‌کند.
            </p>
          </div>

          {/* <!--Related articles--> */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200 dark:text-gray-300">
              مقالات مرتبط
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="#" className="flex items-start space-x-3 group">
                <Image
                  width={100}
                  height={100}
                  src="/images/blog/blog-5.jpg"
                  alt="مقاله مرتبط"
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div>
                  <h4 className="font-medium text-gray-800 group-hover:text-primary-600 dark:text-gray-300">
                    مقایسه پردازنده‌های موبایل در سال 1402
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    12 اردیبهشت 1402 • 4 دقیقه
                  </span>
                </div>
              </Link>
              <Link href="#" className="flex items-start space-x-3 group">
                <Image
                  width={100}
                  height={100}
                  src="/images/blog/blog-3.jpg"
                  alt="مقاله مرتبط"
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div>
                  <h4 className="font-medium text-gray-800 group-hover:text-primary-600 dark:text-gray-300">
                    راهنمای خرید تبلت برای دانشجویان
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    5 اردیبهشت 1402 • 6 دقیقه
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* <!-- Comments --> */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200 dark:text-gray-300">
              نظرات کاربران (4)
            </h3>

            <form className="mb-8">
              <textarea
                placeholder="نظر خود را بنویسید..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="3"
              ></textarea>
              <button
                type="submit"
                className="mt-3 bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-lg transition duration-300"
              >
                ارسال نظر
              </button>
            </form>

            <div className="space-y-6">
              {/* <!--Comment 1--> */}
              <div className="flex items-start space-x-3">
                <Image
                  width={100}
                  height={100}
                  src="/images/user/profile-img.jpg"
                  alt="کاربر"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="w-full">
                  <div className="bg-custom-light dark:bg-zinc-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-800 dark:text-gray-300">
                        نازنین محمدی
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-300">
                        2 روز پیش
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                      مقاله بسیار مفیدی بود. ممنون از راهنمایی‌های تخصصی‌تون. من
                      خودم گلکسی S23 دارم و واقعا راضیم.
                    </p>
                  </div>
                  <div className="mt-2 flex space-x-4 text-sm">
                    <button className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-400">
                      پاسخ
                    </button>
                    <button className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-400">
                      پسندیدم (5)
                    </button>
                  </div>
                </div>
              </div>

              {/* <!--Comment 2--> */}
              <div className="flex items-start space-x-3">
                <Image
                  width={100}
                  height={100}
                  src="/images/user/profile-img-2.jpg"
                  alt="کاربر"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <div className="bg-custom-light dark:bg-zinc-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-800 dark:text-gray-300">
                        امیرحسین رضایی
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-300">
                        1 هفته پیش
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                      آیا مدل‌های چینی مثل شیائومی و اوپو هم گزینه مناسبی هستند؟
                      به نظر من کیفیت ساخت این برندها در سال‌های اخیر خیلی بهتر
                      شده.
                    </p>
                  </div>
                  <div className="mt-2 flex space-x-4 text-sm">
                    <button className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-400">
                      پاسخ
                    </button>
                    <button className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-400">
                      پسندیدم (2)
                    </button>
                  </div>

                  {/* <!--Reply to comment 2--> */}
                  <div className="mt-4 flex items-start space-x-3 ps-4">
                    <Image
                      width={100}
                      height={100}
                      src="/images/user/user.png"
                      alt="نویسنده"
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <div className="bg-primary-50 dark:bg-zinc-700 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-800  dark:text-gray-300">
                            محمد رضایی (نویسنده)
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-300">
                            5 روز پیش
                          </span>
                        </div>
                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                          بله کاملا درست می‌فرمایید. برندهای چینی در سال‌های
                          اخیر پیشرفت چشمگیری داشته‌اند. به خصوص در زمینه دوربین
                          و باتری عملکرد بسیار خوبی ارائه می‌دهند.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Sidebar --> */}
      <div className="xl:col-span-1 col-span-4">
        <div className="sticky top-0 space-y-4">
          {/* <!-- Category --> */}
          <BlogSidebar />
          {/* <!-- Latest post --> */}
          <BlogVideoSidebar />
        </div>
      </div>
    </div>
  );
}
