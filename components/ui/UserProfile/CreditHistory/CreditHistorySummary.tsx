import React from 'react'

export default function CreditHistorySummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* <!-- Total Income --> */}
        <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                مجموع واریزی
              </p>
              <p
                id="total-income"
                className="font-bold text-2xl text-gray-800 dark:text-gray-200 mt-1"
              >
                ۵۰۰,۰۰۰ تومان
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <i className="far fa-check-circle text-blue-600 dark:text-blue-400"></i>
             
            </div>
          </div>
        </div>

        {/* <!-- Total Expense --> */}
        <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                مجموع برداشت
              </p>
              <p
                id="total-expense"
                className="font-bold text-2xl text-gray-800 dark:text-gray-200 mt-1"
              >
                ۳۵۰,۰۰۰ تومان
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <i className="far fa-xmark-circle text-red-600 dark:text-red-400"></i>
             
            </div>
          </div>
        </div>

        {/* <!-- Last Transaction --> */}
        <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                آخرین تراکنش
              </p>
              <p
                id="last-transaction"
                className="font-bold text-2xl text-gray-800 dark:text-gray-200 mt-1"
              >
                ۵۰,۰۰۰ تومان
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
              <i className="far fa-clock text-gray-600 dark:text-gray-400"></i>
             
            </div>
          </div>
        </div>
      </div>
  )
}
