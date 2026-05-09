import TitleAfter from '@/components/modules/TitleAfter/TitleAfter'
import React from 'react'

export default function CreditHistoryTop() {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <TitleAfter title={"تاریخچه اعتبار"} tag={false} />
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              مدیریت و پیگیری تراکنش‌های اعتباری شما
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-3 ">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  اعتبار فعلی
                </p>
                <p
                  id="current-balance"
                  className="font-bold text-lg text-gray-800 dark:text-gray-200"
                >
                  ۱۵۰,۰۰۰ تومان
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
