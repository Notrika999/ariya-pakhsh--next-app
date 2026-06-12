"use client";
// components/ui/UserProfile/ChangePassword/ChangePasswordForm.tsx
import React, { useState } from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [rulesState, setRulesState] = useState({});
  const [progressColor, setProgressColor] = useState("bg-red-500");
  const [progressPercent, setProgressPercent] = useState("25%");
  const [matchMessage, setMatchMessage] = useState("");
  const [passwordMatchColor, setPasswordMatchColor] = useState("");

  // Password Rules Object
  const passwordRules = {
    minLength: {
      label: "حداقل ۸ کاراکتر",
      test: (v: string) => v.length >= 8,
    },
    upperLower: {
      label: "شامل حروف بزرگ و کوچک",
      test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v),
    },
    number: {
      label: "شامل حداقل یک عدد",
      test: (v: string) => /\d/.test(v),
    },
    symbol: {
      label: "شامل حداقل یک نماد",
      test: (v: string) => /[^A-Za-z0-9]/.test(v),
    },
  };

  function evaluatePassword(password: string) {
    const resultObject = {} as Record<string, boolean>;

    Object.keys(passwordRules).forEach((key) => {
      const rule = passwordRules[key as keyof typeof passwordRules];
      resultObject[key] = rule.test(password);
    });

    const count = Object.values(resultObject).filter(Boolean).length;

    const percentage = (count / 4) * 100;

    let color = "bg-red-500";
    if (count === 2) color = "bg-orange-400";
    if (count === 3) color = "bg-yellow-400";
    if (count === 4) color = "bg-green-500";

    return { resultObject, percentage, color };
  }

  const handleNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);

    const { resultObject, percentage, color } = evaluatePassword(value);

    setRulesState(resultObject);
    setProgressPercent(`${percentage}%`);
    setProgressColor(color);

    // اگر confirm پر شده بود، دوباره چک کن
    if (confirmPassword) {
      if (confirmPassword === value) {
        setMatchMessage("رمز عبور مطابقت دارد");
        setPasswordMatchColor("text-green-500");
      } else {
        setMatchMessage("رمز عبور مطابقت ندارد");
        setPasswordMatchColor("text-red-500");
      }
    }
  };

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (!value) {
      setMatchMessage("");
      setPasswordMatchColor("");
      return;
    }

    if (value === newPassword) {
      setMatchMessage("رمز عبور مطابقت دارد");
      setPasswordMatchColor("text-green-500");
    } else {
      setMatchMessage("رمز عبور مطابقت ندارد");
      setPasswordMatchColor("text-red-500");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (confirmPassword !== newPassword) {
      setMatchMessage("رمز عبور مطابقت ندارد");
      setPasswordMatchColor("text-red-500");
      return;
    }

    const allRulesPassed = Object.values(rulesState).every(Boolean);
    if (!allRulesPassed) {
      alert("رمز عبور جدید شرایط لازم را ندارد.");
      return;
    }

    const { resultObject } = evaluatePassword(newPassword);

    const allValid = Object.values(resultObject).every(Boolean);

    if (!allValid) {
      alert("رمز عبور شرایط لازم را ندارد");
      return;
    }

    // ساخت آبجکت ارسال به بک‌اند
    const payload = {
      currentPassword,
      newPassword,
      confirmPassword,
    };

    // درخواست به سرور
    try {
      
      // const res = await fetch("/api/change-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      // const data = await res.json();
      // if (res.ok) {
      //   alert("رمز عبور با موفقیت تغییر کرد.");
      // } else {
      //   alert(data.message || "خطا در تغییر رمز عبور.");
      // }
    } catch {
      alert("ارتباط با سرور برقرار نشد.");
    }
  };

  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <TitleAfter title="فرم تغییر رمز عبور" tag={false} />

      <form
        id="change-password-form"
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        {/* Current Password */}
        <div>
          <label
            htmlFor="current-password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            رمز عبور فعلی
          </label>

          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white transition-colors"
              placeholder="رمز عبور فعلی خود را وارد کنید"
              required
            />

            {/* FontAwesome Icon */}
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <i
                className={`${
                  showCurrentPassword
                    ? "fa-regular fa-eye-slash"
                    : "fa-regular fa-eye"
                } text-[#BCC1C8] text-lg`}
              ></i>
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor="new-password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            رمز عبور جدید
          </label>

          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              onChange={handleNewPassword}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 dark:bg-zinc-800 dark:border-gray-600"
              placeholder="رمز عبور جدید"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <i
                className={`${
                  showNewPassword
                    ? "fa-regular fa-eye-slash"
                    : "fa-regular fa-eye"
                }`}
              ></i>
            </button>
          </div>

          {/* Password Strength */}
          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-500">سطح امنیت رمز عبور</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className={`${progressColor} h-2 rounded-full transition-all`}
                style={{ width: progressPercent }}
              ></div>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="mt-4 space-y-1 text-xs">
            {Object.keys(passwordRules).map((key) => {
              const rule = passwordRules[key as keyof typeof passwordRules];
              const passed = rulesState[key];

              return (
                <div key={key} className="flex items-center">
                  {passed ? (
                    <i className="fa-solid fa-check text-green-500 ml-1"></i>
                  ) : (
                    <i className="fa-solid fa-xmark text-red-500 ml-1"></i>
                  )}
                  {rule.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            تکرار رمز عبور جدید
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              onChange={handleConfirmPassword}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white transition-colors"
              placeholder="رمز عبور جدید خود را مجدداً وارد کنید"
              required
            />

            {/* FontAwesome */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <i
                className={`${
                  showConfirmPassword
                    ? "fa-regular fa-eye-slash"
                    : "fa-regular fa-eye"
                } text-lg`}
              ></i>
            </button>
          </div>

          <div
            id="password-match-message"
            className={`mt-2 text-xs ${passwordMatchColor}`}
          >
            {matchMessage}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium text-sm mb-4 sm:mb-0 flex items-center"
          >
            <i className="fa-regular fa-eye ml-1 text-sm"></i>
            فراموشی رمز عبور؟
          </button>

          <div className="flex space-x-3">
            <button
              type="button"
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95 transition font-medium"
            >
              انصراف
            </button>

            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 active:scale-95 transition font-medium flex items-center"
            >
              <i className="fa-solid fa-check ml-2 text-base"></i>
              تغییر رمز عبور
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
