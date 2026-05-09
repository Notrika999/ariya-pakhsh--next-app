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
          href="#"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition font-medium shadow-lg"
        >
          تماس با ما
          <svg
            className="w-4 h-4 ms-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </Link>
        <Link
          href="#"
          className="inline-flex items-center justify-center px-6 py-3 bg-secondary-500 text-gray-800 rounded-xl hover:bg-secondary-500/80 transition font-medium backdrop-blur-sm"
        >
          مشاهده محصولات
        </Link>
      </div>
    </section>
  );
}
