"use client";

import { useState } from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";

export default function UserInformationSecuritySettings() {
  // State for showing the password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // State for password fields
  const [passwordData, setPasswordData] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  // Two-factor toggle state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Active sessions (could come from API)
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: "iPhone 13",
      location: "تهران، ایران • فعلاً فعال",
      iconColor: "blue",
      iconClass: "far fa-mobile"
    },
    {
      id: 2,
      device: "Windows Chrome",
      location: "تهران، ایران • ۲ روز پیش",
      iconColor: "green",
      iconClass: "far fa-tv"
    },
  ]);

  // Toggle show/hide password form
  const togglePasswordForm = () => {
    setShowPasswordForm((prev) => !prev);
  };

  // Handle password updates
  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log("Password form submitted:", passwordData);

    // If you want validation/API, tell me
  };

  // Remove session
  const removeSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <TitleAfter title={"تنظیمات امنیتی"} />

      <div className="space-y-6">
        {/* Password Change */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                تغییر رمز عبور
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                آخرین تغییر: ۳ ماه پیش
              </p>
            </div>
            <button
              className="text-primary hover:text-primary/80 font-medium"
              onClick={togglePasswordForm}
            >
              تغییر رمز عبور
            </button>
          </div>

          {showPasswordForm && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label
                    htmlFor="frmCurrentPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    رمز عبور فعلی
                  </label>
                  <input
                    type="password"
                    id="frmCurrentPassword"
                    value={passwordData.current}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, current: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="frmNewPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    رمز عبور جدید
                  </label>
                  <input
                    type="password"
                    id="frmNewPassword"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="frmConfirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    تکرار رمز عبور جدید
                  </label>
                  <input
                    type="password"
                    id="frmConfirmPassword"
                    value={passwordData.confirm}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirm: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white"
                  >
                    بروزرسانی رمز عبور
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                احراز هویت دو مرحله‌ای
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                افزایش امنیت حساب کاربری
              </p>
            </div>

            <div className="flex items-center">
              <span
                className={`text-sm me-2 ${
                  twoFactorEnabled ? "text-green-500" : "text-red-500"
                }`}
              >
                {twoFactorEnabled ? "فعال" : "غیرفعال"}
              </span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled((v) => !v)}
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all duration-300"></div>
                <span className="absolute end-0.5 top-0.5 w-5 h-5 bg-white dark:bg-gray-200 rounded-full transition-transform duration-300 peer-checked:translate-x-full"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                جلسات فعال
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                مدیریت دستگاه‌های متصل
              </p>
            </div>
            <button className="text-primary hover:text-primary/80 font-medium">
              مشاهده همه
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex justify-between items-center p-3 bg-custom-light dark:bg-zinc-800 rounded-lg"
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center me-3 ${
                      s.iconColor === "blue"
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "bg-green-100 dark:bg-green-900"
                    }`}
                  >
                    <i className={`${s.iconClass} ${s.iconColor === "blue"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-green-600 dark:text-green-400"} text-sm`}></i>
                    
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {s.device}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {s.location}
                    </p>
                  </div>
                </div>

                <button
                  className="text-red-500 hover:text-red-700 text-sm"
                  onClick={() => removeSession(s.id)}
                >
                  خروج
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
