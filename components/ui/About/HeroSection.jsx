import React from "react";

export default function HeroSection() {
  return (
    <div className="text-center mb-16">
      <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 animate-pulse">
        درباره ما
      </span>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
        ما داستانی داریم که می‌خواهیم تعریف کنیم
      </h1>
      <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
        از یک ایده ساده در سال ۱۳۹۰ تا تبدیل شدن به یکی از پیشروترین فروشگاه‌های
        اینترنتی کشور، مسیری پر از تجربه و یادگیری را طی کرده‌ایم.
      </p>
    </div>
  );
}
