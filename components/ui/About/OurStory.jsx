import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function OurStory() {
  return (
    <section className="mb-24">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition duration-500">
            <Image
              width={472}
              height={283}
              src="/images/about/about.jpg"
              alt="همکاری تیم ما"
              className="w-full h-auto"
            />

            <div className="absolute inset-0 bg-linear-to-t from-gray-900/70 to-transparent opacity-70"></div>
            <div className="absolute bottom-6 inset-e-6 text-white">
              <p className="text-sm">تیم متعهد ما در سال ۱۴۰۲</p>
            </div>
          </div>

          {/* <!-- Floating elements --> */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/60 rounded-2xl -z-10"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary/60 rounded-3xl -z-10"></div>
        </div>

        <div className="lg:w-1/2">
          <div className="mb-2">
            <span className="text-primary font-semibold">داستان ما</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            سفری که از یک ایده شروع شد
          </h2>

          <div className="space-y-4 mb-8">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              در سال ۱۳۹۰، گروهی از جوانان پرانرژی و خلاق با یک هدف مشترک گرد هم
              آمدیم: ایجاد یک تجربه خرید آنلاین منحصربه‌فرد برای هموطنان عزیز.
              ما معتقد بودیم که خرید اینترنتی باید بیش از یک تراکنش ساده باشد.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              امروز با افتخار به بیش از ۵۰۰۰ مشتری وفادار خدمت می‌کنیم و
              توانسته‌ایم اعتماد آن‌ها را با ارائه محصولات باکیفیت و خدمات پس از
              فروش ممتاز جلب کنیم.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="#"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition font-medium shadow-lg hover:shadow-xl"
            >
              بیشتر درباره ما
              <i className="fas fa-angle-left ms-2"></i>
            </Link>
            <Link
              href="#"
              className="inline-flex items-center px-6 py-3 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition font-medium border border-gray-200 dark:border-zinc-700"
            >
              تماس با ما
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
