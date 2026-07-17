import Link from "next/link";
import React from "react";

export default function CartEmpty() {
  return (
    // <!-- START CONTENT -->
    <section className="py-5">
      <div className="container">
        <div className="text-center py-12">
          {/* <!--Empty shopping cart icon--> */}
          <div className="w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center bounce-animation">
            <i className="far fa-cart-shopping text-9xl"></i>
          </div>

          {/* <!--Explanatory text--> */}
          <h2 className="text-2xl font-black text-gray-800 dark:text-gray-300 mb-4">
            سبد خرید شما خالی است
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
            هنوز هیچ محصولی به سبد خرید خود اضافه نکرده‌اید. برای مشاهده محصولات
            و اضافه کردن آنها به سبد خرید، از دکمه زیر استفاده کنید.
          </p>

          {/* <!--Action buttons--> */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="bg-primary hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <i className="far fa-house me-1"></i>
              بازگشت به صفحه اصلی
            </Link>
            <Link
              href="/products"
              className="border border-secondary-600 bg-secondary text-secondary-900 hover:bg-secondary-400 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <i className="far fa-bag-shopping me-1"></i>
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
