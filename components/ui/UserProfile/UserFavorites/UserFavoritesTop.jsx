import React from "react";
import UserProfileTop, { UserProfileTopStat } from "../UserProfileTop";

export default function UserFavoritesTop({ totalCount = 0 }) {
  const countLabel = new Intl.NumberFormat("fa-IR").format(totalCount);

  return (
    <UserProfileTop
      title="محصولات ذخیره شده"
      description="مدیریت و مشاهده محصولات مورد علاقه شما"
      aside={
        <UserProfileTopStat
          label="تعداد محصولات ذخیره شده"
          value={`${countLabel} محصول`}
          iconClassName="bg-blue-100 dark:bg-blue-900"
          icon={
            <i className="far fa-heart text-xl text-blue-600 dark:text-blue-400"></i>
          }
        />
      }
    />
  );
}
