import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import React from "react";

export default function OrderDetailsTop() {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4 ">
          <div>
            <TitleAfter title={"جزئیات سفارش #ORD-7842"} />
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              مشاهده اطلاعات کامل سفارش
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-3 ">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                وضعیت سفارش
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                تحویل شده
              </span>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <i className="far fa-check text-green-600 dark:text-green-400"></i>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
