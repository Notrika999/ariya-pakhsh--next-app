import React from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";

function getDisplayName(user) {
  return (
    user?.displayName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "کاربر"
  );
}

export default function UserInformationTop({ user }) {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <TitleAfter title={"اطلاعات حساب کاربری"} />
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            اطلاعات شخصی و امنیتی خود را مدیریت کنید
          </p>
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
        </div>
      </div>
    </div>
  );
}
