import React from 'react'
import TitleAfter from "../../../modules/TitleAfter/TitleAfter"

export default function GiftCartTop() {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <TitleAfter title={"کارت‌های هدیه"} />
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                مدیریت و خرید کارت‌های هدیه
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  موجودی کل
                </p>
                <span className="text-2xl font-bold text-primary">
                  ۷۵۰,۰۰۰ تومان
                </span>
              </div>
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
