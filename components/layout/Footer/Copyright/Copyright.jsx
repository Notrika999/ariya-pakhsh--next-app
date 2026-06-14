import React from "react";

export default function Copyright() {
  return (
    <div className="py-10 bg-[#fcfcfc] dark:bg-[#0d1117] lg:mb-0 mb-15 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="flex sm:space-y-0 space-y-3 items-center justify-between flex-wrap">
          <p className="text-xs text-gray-700  dark:text-gray-400">
            2025 © - تمامی حقوق مادی و معنوی برای فروشگاه اینترنتی دیارا محفوظ
            می‌باشد.
          </p>
          <a
            href="#"
            className="text-xs text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary/80 transition-colors duration-200"
          >
            توسعه : امید حقی
          </a>
        </div>
      </div>
    </div>
  );
}
