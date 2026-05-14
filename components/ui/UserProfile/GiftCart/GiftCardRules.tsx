import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import React from "react";

export default function GiftCardRules() {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <TitleAfter title={"قوانین کارت‌های هدیه"} tag={false} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
            مزایا و ویژگی‌ها
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
            <i className="far fa-check text-green-500 mt-0.5 shrink-0"></i>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                قابل استفاده برای تمام محصولات
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="far fa-check text-green-500 mt-0.5 shrink-0"></i>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                معتبر به مدت ۶ ماه
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="far fa-check text-green-500 mt-0.5 shrink-0"></i>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                قابل ترکیب با سایر تخفیف‌ها
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="far fa-check text-green-500 mt-0.5 shrink-0"></i>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ارسال فوری از طریق ایمیل
              </span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
            محدودیت‌ها
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
             <i className="far fa-exclamation-triangle text-blue-500 mt-0.5 shrink-0"></i>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                غیرقابل برگشت و تبدیل به پول نقد
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="far fa-exclamation-triangle text-blue-500 mt-0.5 shrink-0"></i>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                حداقل مبلغ خرید: ۱۰۰,۰۰۰ تومان
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="far fa-exclamation-triangle text-blue-500 mt-0.5 shrink-0"></i>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                فقط یک بار قابل استفاده
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
