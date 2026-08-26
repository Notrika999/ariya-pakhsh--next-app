"use client";

import UserProfileTop, { UserProfileTopStat } from "../UserProfileTop";

export default function UserOrdersTop({ activeCount = 0 }) {
  return (
    <UserProfileTop
      title="سفارش‌های من"
      description="مدیریت و پیگیری سفارش‌های خود"
      aside={
        <UserProfileTopStat
          label="تعداد سفارش‌ها"
          value={`${new Intl.NumberFormat("fa-IR").format(activeCount)} سفارش`}
          iconClassName="bg-blue-100 dark:bg-blue-900"
          icon={
            <i className="far fa-shopping-bag text-xl text-blue-600 dark:text-blue-400"></i>
          }
        />
      }
    />
  );
}
