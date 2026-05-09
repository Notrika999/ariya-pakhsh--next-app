import React from "react";

export default function OurValues() {
  return (
    <section className="mb-24">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          ارزش‌های ما
        </span>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          اصولی که به آن پایبندیم
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
          ارزش‌های بنیادین ما که در تمام تعاملات با مشتریان و شرکا رعایت می‌کنیم
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition group">
          <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-7 h-7 text-green-600 dark:text-green-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
            صداقت و شفافیت
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            ما معتقدیم که شفافیت در تمام مراحل خرید، پایه و اساس اعتماد بین ما و
            مشتریانمان است.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition group">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-7 h-7 text-blue-600 dark:text-blue-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
            تخصص و دانش
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            تیم ما همواره در حال یادگیری و به روزرسانی دانش خود برای ارائه
            بهترین راهکارها به مشتریان است.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition group">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-7 h-7 text-purple-600 dark:text-purple-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
            تعهد به مشتری
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            رضایت مشتری اولویت اول ماست و تمام تلاش خود را برای ایجاد تجربه‌ای
            به یاد ماندنی به کار می‌گیریم.
          </p>
        </div>
      </div>
    </section>
  );
}
