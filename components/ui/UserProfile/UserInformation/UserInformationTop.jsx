import React from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";

export default function UserInformationTop() {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <TitleAfter title={"اطلاعات حساب کاربری"} />
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            اطلاعات شخصی و امنیتی خود را مدیریت کنید
          </p>
        </div>
      </div>
    </div>
  );
}
