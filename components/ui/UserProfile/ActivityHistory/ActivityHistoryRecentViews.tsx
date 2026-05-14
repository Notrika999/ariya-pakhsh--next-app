import React from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";
import ActivityHistoryCard from "../../../modules/ActivityHistoryCard/ActivityHistoryCard";
import { RecentViewItem } from "@/lib/types/userpanel/activity-history";

interface Props {
  recentViews: RecentViewItem[];
}

export default function ActivityHistoryRecentViews({
  recentViews = [],
}: Props) {
  return (
    <div id="recent-views" className="tab-content space-y-6">
      {/* <!-- Today's Views --> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"امروز"} tag={false} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentViews
            .filter((i) => i.date === "today")
            .map((item) => (
              <ActivityHistoryCard key={item.id} product={item} />
            ))}
        </div>
      </div>

      {/* <!-- Yesterday's Views --> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"دیروز"} tag={false} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentViews
            .filter((i) => i.date === "yesterday")
            .map((item) => (
              <ActivityHistoryCard key={item.id} product={item} />
            ))}
        </div>
      </div>

      {/* <!-- Clear History Button --> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              پاک کردن تاریخچه بازدیدها
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              با پاک کردن تاریخچه، تمام بازدیدهای شما حذف خواهند شد
            </p>
          </div>
          <button className="mt-4 sm:mt-0 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium flex items-center justify-center">
            <i className="far fa-trash-can me-2"></i>
            
            پاک کردن تاریخچه
          </button>
        </div>
      </div>
    </div>
  );
}
