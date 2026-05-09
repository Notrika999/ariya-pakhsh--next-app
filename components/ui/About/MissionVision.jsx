import React from "react";

export default function MissionVision() {
  return (
    <section className="mb-24">
      <div className="grid md:grid-cols-2 gap-12">
        {/* <!-- Mission --> */}
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
              />
            </svg>
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
              <svg
                className="w-5 h-5 text-green-500 ms-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              کیفیت بی‌نظیر در محصولات و خدمات
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-400">
              <svg
                className="w-5 h-5 text-green-500 ms-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              شفافیت کامل در قیمت‌گذاری
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-400">
              <svg
                className="w-5 h-5 text-green-500 ms-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              نوآوری مستمر در فرآیندها
            </li>
          </ul>
        </div>

        {/* <!-- Vision --> */}
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8 text-purple-600 dark:text-purple-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12a8.001 8.001 0 0 1 7.964-7.554M12 12a8 8 0 0 0-7.964 7.554"
              />
            </svg>
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
              <svg
                className="w-5 h-5 text-green-500 ms-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              رهبری بازار در حوزه تجارت الکترونیک
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-400">
              <svg
                className="w-5 h-5 text-green-500 ms-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              گسترش به بازارهای بین‌المللی
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-400">
              <svg
                className="w-5 h-5 text-green-500 ms-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              توسعه فناوری‌های نوین در تجارت
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
