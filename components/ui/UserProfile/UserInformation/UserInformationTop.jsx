import React from "react";
import UserProfileTop from "../UserProfileTop";

function getDisplayName(user) {
  return (
    user?.displayName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "کاربر"
  );
}

export default function UserInformationTop({ user }) {
  return (
    <UserProfileTop
      title="اطلاعات حساب کاربری"
      description="اطلاعات شخصی و امنیتی خود را مدیریت کنید"
    >
      {user && (
        <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{getDisplayName(user)}</span>
          <span dir="ltr">{user.phoneNumber || user.phone}</span>
          {user.registrationStatusDisplayName || user.registrationStatus ? (
            <span>
              وضعیت:{" "}
              {user.registrationStatusDisplayName || user.registrationStatus}
            </span>
          ) : null}
        </div>
      )}
    </UserProfileTop>
  );
}
