import React from "react";
import UserProfileTop, { UserProfileTopStat } from "../UserProfileTop";

export default function OrderDetailsTop() {
  return (
    <UserProfileTop
      title="جزئیات سفارش #ORD-7842"
      description="مشاهده اطلاعات کامل سفارش"
      aside={
        <UserProfileTopStat
          label="وضعیت سفارش"
          value={
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">
              تحویل شده
            </span>
          }
          iconClassName="bg-green-100 dark:bg-green-900"
          icon={<i className="far fa-check text-green-600 dark:text-green-400"></i>}
        />
      }
    />
  );
}
