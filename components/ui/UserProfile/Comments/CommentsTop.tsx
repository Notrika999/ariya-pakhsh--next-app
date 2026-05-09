import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import React from "react";

export default function CommentsTop() {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4 ">
          <div>
            <TitleAfter title={"نظرات و پرسش‌های من"} tag={false} />
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              مدیریت نظرات و سوالات شما در مورد محصولات
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-3 ">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                تعداد کل نظرات
              </p>
              <span className="text-lg font-bold text-primary">۱۵</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
