import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import React from "react";

export default function DiscountAndPointsTop() {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <TitleAfter title={"کدهای تخفیف و امتیازات"} tag={false} />
            <p className="text-gray-600 dark:text-gray-400">
              مدیریت کدهای تخفیف و امتیازات کسب شده
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                امتیاز کل
              </p>
              <span className="text-2xl font-bold text-primary">۱,۲۵۰</span>
            </div>
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <i className="far fa-gift text-white text-xl"></i>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
