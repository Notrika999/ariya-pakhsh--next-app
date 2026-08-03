import React from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";

export default function ActivityHistoryTop({ summary, loading = false }) {
  const totalVisitCount = Number(summary?.totalVisitCount) || 0;

  return (
    <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <TitleAfter title="آخرین بازدیدها و فعالیت‌ها" />
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              پیگیری تاریخچه فعالیت‌های شما
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                تعداد بازدیدها
              </p>
              <span className="text-2xl font-bold text-primary">
                {loading
                  ? "..."
                  : new Intl.NumberFormat("fa-IR").format(totalVisitCount)}
              </span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <i className="far fa-eye text-white"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
