import React from "react";
import UserProfileTop, { UserProfileTopStat } from "../UserProfileTop";

export default function ActivityHistoryTop({ summary, loading = false }) {
  const totalVisitCount = Number(summary?.totalVisitCount) || 0;

  return (
    <UserProfileTop
      title="آخرین بازدیدها و فعالیت‌ها"
      description="پیگیری تاریخچه فعالیت‌های شما"
      aside={
        <UserProfileTopStat
          label="تعداد بازدیدها"
          value={
            loading
              ? "..."
              : new Intl.NumberFormat("fa-IR").format(totalVisitCount)
          }
          valueClassName="text-2xl font-bold text-primary"
          icon={<i className="far fa-eye text-white"></i>}
        />
      }
    />
  );
}
