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
          <i className="far fa-circle-check text-green-600 dark:text-green-400 text-2xl"></i>
            
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
          <i className="far fa-lightbulb text-blue-600 dark:text-blue-400 text-2xl"></i>
           
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
          <i className="far fa-heart text-purple-600 dark:text-purple-400 text-2xl"></i>
           
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
