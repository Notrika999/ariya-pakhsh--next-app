import React from "react";

export default function MissionVision() {
  return (
    <section className="mb-24">
      <div className="grid md:grid-cols-2 gap-12">
        {/* <!-- Mission --> */}
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
          <i className="fas fa-chalkboard-user text-2xl text-blue-600 dark:text-blue-400"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ماموریت ما
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            ارائه بهترین تجربه خرید آنلاین با محصولات باکیفیت، قیمت‌های منصفانه
            و خدمات مشتریان استثنایی. ما متعهدیم نیازهای مشتریان خود را درک کرده
            و راه‌حل‌های نوآورانه ارائه دهیم.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-gray-600 dark:text-gray-400">
              <i className="fas fa-check text-green-500 ms-2"></i>
              
              کیفیت بی‌نظیر در محصولات و خدمات
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-400">
             <i className="fas fa-check text-green-500 ms-2"></i>
              شفافیت کامل در قیمت‌گذاری
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-400">
             <i className="fas fa-check text-green-500 ms-2"></i>
              نوآوری مستمر در فرآیندها
            </li>
          </ul>
        </div>

        {/* <!-- Vision --> */}
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
          <i className="fas fa-eye-low-vision text-2xl text-purple-600"></i>
            
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            چشم‌انداز ما
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            ما چشم‌انداز تبدیل شدن به برترین پلتفرم تجارت الکترونیک در منطقه را
            داریم که نه تنها محصولات باکیفیت ارائه می‌دهد، بلکه استانداردهای
            جدیدی در خدمات مشتریان تعیین می‌کند.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-gray-600 dark:text-gray-400">
              <i className="fas fa-check text-green-500 ms-2"></i>
              رهبری بازار در حوزه تجارت الکترونیک
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-400">
              <i className="fas fa-check text-green-500 ms-2"></i>
              گسترش به بازارهای بین‌المللی
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-400">
              <i className="fas fa-check text-green-500 ms-2"></i>
              توسعه فناوری‌های نوین در تجارت
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
