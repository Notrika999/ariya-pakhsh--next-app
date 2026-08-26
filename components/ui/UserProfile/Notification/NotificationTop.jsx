import React from "react";
import UserProfileTop, { UserProfileTopStat } from "../UserProfileTop";

export default function NotificationTop({ notificationsLength }) {
  return (
    <UserProfileTop
      title="اعلانات سایت"
      description="پیگیری آخرین اطلاعیه‌ها و اخبار"
      aside={
        <UserProfileTopStat
          label="اعلانات خوانده نشده"
          value={notificationsLength}
          id="unread-count"
          valueClassName="text-2xl font-bold text-primary"
          icon={<i className="far fa-bell text-xl text-white"></i>}
        />
      }
    />
  );
}
