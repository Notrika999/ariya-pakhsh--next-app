import React from "react";

export default function PointsSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* <!-- Total Points --> */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
          <i className="fas fa-arrow-trend-up text-white"></i>
          
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          امتیاز کل
        </h3>
        <p className="text-3xl font-bold text-primary">۱,۲۵۰</p>
      </div>

      {/* <!-- Available Points --> */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <i className="far fa-check-circle text-white"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          امتیاز قابل استفاده
        </h3>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
          ۸۵۰
        </p>
      </div>

      {/* <!-- Used Points --> */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
         <i className="far fa-plus-circle text-white"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          امتیاز استفاده شده
        </h3>
        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          ۴۰۰
        </p>
      </div>
    </div>
  );
}
