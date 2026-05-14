import React from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";
export default function UserFavoritesTop() {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <TitleAfter title={"محصولات ذخیره شده"} />
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            مدیریت و مشاهده محصولات مورد علاقه شما
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-3 ">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                تعداد محصولات ذخیره شده
              </p>
              <p className="font-bold text-lg text-gray-800 dark:text-gray-200">
                ۸ محصول
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <i className="far fa-heart text-blue-600 dark:text-blue-400 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
