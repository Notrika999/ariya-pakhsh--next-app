"use client";

import UserProfileTop, { UserProfileTopStat } from "../UserProfileTop";

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
    <UserProfileTop
      title="تاریخچه اعتبار"
      titleTag={false}
      description="مدیریت و پیگیری تراکنش‌های اعتباری شما"
      aside={
        <UserProfileTopStat
          label="اعتبار فعلی"
          value={formatMoney(balance)}
          id="current-balance"
          iconClassName="bg-green-100 dark:bg-green-900"
          icon={
            <i className="far fa-dollar-circle text-green-600 dark:text-green-400"></i>
          }
        />
      }
    />
  );
}
