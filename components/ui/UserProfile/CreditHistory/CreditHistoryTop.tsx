"use client";

import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";

function formatMoney(value: number) {
  return `${new Intl.NumberFormat("fa-IR").format(
    Math.max(0, Math.round(Number(value) || 0)),
  )} تومان`;
}

export default function CreditHistoryTop({
  balance = 0,
}: {
  balance?: number;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <TitleAfter title={"تاریخچه اعتبار"} tag={false} />
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            مدیریت و پیگیری تراکنش‌های اعتباری شما
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                اعتبار فعلی
              </p>
              <p
                id="current-balance"
                className="text-lg font-bold text-gray-800 dark:text-gray-200"
              >
                {formatMoney(balance)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <i className="far fa-dollar-circle text-green-600 dark:text-green-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
