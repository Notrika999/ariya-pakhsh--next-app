import React from "react";
import type { LoyaltyPointsSummary } from "@/src/lib/types/userpanel/loyalty";
import UserProfileTop, { UserProfileTopStat } from "../UserProfileTop";

type DiscountAndPointsTopProps = {
  summary: LoyaltyPointsSummary;
};

export default function DiscountAndPointsTop({
  summary,
}: DiscountAndPointsTopProps) {
  const numberFormatter = new Intl.NumberFormat("fa-IR");

  return (
    <UserProfileTop
      title="کدهای تخفیف و امتیازات"
      titleTag={false}
      description="مدیریت کدهای تخفیف و امتیازات کسب شده"
      aside={
        <UserProfileTopStat
          label="امتیاز کل"
          value={numberFormatter.format(summary.totalPoints)}
          valueClassName="text-2xl font-bold text-primary"
          icon={<i className="far fa-gift text-xl text-white"></i>}
        />
      }
    />
  );
}
