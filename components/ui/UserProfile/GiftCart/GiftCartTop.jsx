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
               <i className="far fa-gift text-xl text-white"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
