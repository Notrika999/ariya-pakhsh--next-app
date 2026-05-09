import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import React from "react";

export default function DashboardHeader() {
  return (
    <div className=" bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <TitleAfter title={"داشبورد کاربری"} />
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            به پنل کاربری خود خوش آمدید، علی عزیز
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-3 ">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                اعتبار کیف پول
              </p>
              <p className="font-bold text-lg text-gray-800 dark:text-gray-200">
                ۲,۴۵۰,۰۰۰ تومان
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-circle-dollar-to-slot text-green-600 dark:text-green-400"></i>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
