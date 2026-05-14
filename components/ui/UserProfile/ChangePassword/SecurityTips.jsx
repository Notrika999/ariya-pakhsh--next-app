import React from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";

export default function SecurityTips() {
  return (
    <div className="bg-blue-50 drop-shadow-lg dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center shrink-0">
          <i className="far fa-exclamation-circle rotate-180 text-blue-600 dark:text-blue-400"></i>
          
        </div>
        <div>
          <TitleAfter title={"نکات امنیتی رمز عبور"} />
          <ul className="mt-2 text-blue-700 dark:text-blue-400 text-sm space-y-1">
            <li className="flex items-center">
              <i className="far fa-check me-2"></i>
              از ترکیب حروف، اعداد و نمادها استفاده کنید
            </li>
            <li className="flex items-center">
             <i className="far fa-check me-2"></i>
              رمز عبور باید حداقل ۸ کاراکتر باشد
            </li>
            <li className="flex items-center">
              <i className="far fa-check me-2"></i>
              از اطلاعات شخصی قابل حدس زدن استفاده نکنید
            </li>
            <li className="flex items-center">
              <i className="far fa-check me-2"></i>
              رمز عبور را در جای امن نگهداری کنید
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
