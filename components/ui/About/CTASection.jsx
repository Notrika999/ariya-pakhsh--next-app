import Link from "next/link";
import React from "react";

export default function CTASection() {
  return (
    <section className="space-y-4 text-center p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        آماده همکاری با ما هستید؟
      </h2>
      <p className="max-w-2xl mx-auto mb-8 opacity-90">
        با ما در ارتباط باشید تا بتوانیم در کنار هم تجربه‌ای بی‌نظیر خلق کنیم
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/contact"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition font-medium shadow-lg"
        >
          تماس با ما
          <i className="far fa-phone ms-2"></i>
          
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-6 py-3 bg-secondary-500 text-gray-50 rounded-xl hover:bg-secondary-500/80 transition font-medium backdrop-blur-sm"
        >
          مشاهده محصولات
        </Link>
      </div>
    </section>
  );
}
