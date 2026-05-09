"use client";

import { useState } from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";
export default function UserInformationAccountPreferences() {
  const initialState = {
    emailNotifications: true,
    smsNotifications: true,
    offersNotifications: true,
    privateAccount: true,
    showInSearch: true,
  };

  const [settings, setSettings] = useState(initialState);

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Saved settings:", settings);

    // اگر ذخیره سرور داری اینجا بگو تا برات اضافه کنم
  };
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <TitleAfter title={"تنظیمات حساب"} />
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notification Preferences */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
              تنظیمات اطلاع‌رسانی
            </h3>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    ایمیل اطلاع‌رسانی
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ارسال ایمیل برای به‌روزرسانی‌ها و پیشنهادات
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.emailNotifications}
                    onChange={() => toggleSetting("emailNotifications")}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all duration-300"></div>
                  <span className="absolute end-0.5 top-0.5 w-5 h-5 bg-white dark:bg-gray-200 rounded-full transition-transform duration-300 peer-checked:translate-x-full"></span>
                </label>
              </div>

              {/* SMS */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    پیامک اطلاع‌رسانی
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ارسال پیامک برای وضعیت سفارش‌ها
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.smsNotifications}
                    onChange={() => toggleSetting("smsNotifications")}
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all duration-300"></div>
                  <span className="absolute end-0.5 top-0.5 w-5 h-5 bg-white dark:bg-gray-200 rounded-full transition-transform duration-300 peer-checked:translate-x-full"></span>
                </label>
              </div>

              {/* Offers */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    اخبار و پیشنهادات ویژه
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    دریافت پیشنهادات تخفیف و محصولات جدید
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.offersNotifications}
                    onChange={() => toggleSetting("offersNotifications")}
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all duration-300"></div>
                  <span className="absolute end-0.5 top-0.5 w-5 h-5 bg-white dark:bg-gray-200 rounded-full transition-transform duration-300 peer-checked:translate-x-full"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
              تنظیمات حریم خصوصی
            </h3>

            <div className="space-y-4">
              {/* Private Account */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    حساب خصوصی
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    مخفی کردن فعالیت‌های شما از دیگر کاربران
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.privateAccount}
                    onChange={() => toggleSetting("privateAccount")}
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all duration-300"></div>
                  <span className="absolute end-0.5 top-0.5 w-5 h-5 bg-white dark:bg-gray-200 rounded-full transition-transform duration-300 peer-checked:translate-x-full"></span>
                </label>
              </div>

              {/* Show in Search */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    نمایش پروفایل در نتایج جستجو
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    اجازه نمایش پروفایل شما در نتایج موتورهای جستجو
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.showInSearch}
                    onChange={() => toggleSetting("showInSearch")}
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all duration-300"></div>
                  <span className="absolute end-0.5 top-0.5 w-5 h-5 bg-white dark:bg-gray-200 rounded-full transition-transform duration-300 peer-checked:translate-x-full"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white"
            >
              ذخیره تنظیمات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
