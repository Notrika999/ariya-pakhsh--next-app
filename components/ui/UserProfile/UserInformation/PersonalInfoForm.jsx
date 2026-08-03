"use client";
// components/ui/UserProfile/UserInformation/PersonalInfoForm.jsx
import { useEffect, useState } from "react";
import DateObject from "react-date-object";
import DatePicker from "@/components/modules/DatePicker/AppDatePicker";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian_en from "react-date-object/locales/gregorian_en";
import "react-multi-date-picker/styles/colors/red.css";
import {
  getAuthErrorMessage,
  updateProfile,
} from "@/src/services/auth/auth.client";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";
import { notify } from "@/src/utils/toast";

function toInitialBirthDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString();
}

function toPickerValue(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new DateObject({
    date,
    calendar: gregorian,
    locale: gregorian_en,
  }).convert(persian, persian_fa);
}

function toBackendBirthDate(value) {
  if (!value) return null;
  if (Array.isArray(value)) return null;

  const date = new DateObject(value).convert(gregorian, gregorian_en);
  return `${date.format("YYYY-MM-DD")}T00:00:00.000Z`;
}

function createFormState(user) {
  return {
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phoneNumber ?? user?.phone ?? "",
    nationalCode: user?.nationalCode ?? "",
    birthDate: toInitialBirthDate(user?.birthDate),
    birthDatePicker: toPickerValue(user?.birthDate),
    gender: user?.gender ?? "",
  };
}

export default function PersonalInfoForm({ user }) {
  const setUser = useAuthStore((state) => state.setUser);

  const [form, setForm] = useState(() => createFormState(user));
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    queueMicrotask(() => {
      setForm(createFormState(user));
    });
  }, [user]);

  const handleChange = (e) => {
    const { id, value, name } = e.target;

    if (name === "gender") {
      setForm((prev) => ({ ...prev, gender: value }));
    } else {
      setForm((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleBirthDateChange = (value) => {
    setForm((prev) => ({
      ...prev,
      birthDate: toBackendBirthDate(value),
      birthDatePicker: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setStatusMessage("");

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      birthDate: form.birthDate || null,
    };

    try {
      const updatedUser = await updateProfile(payload);
      setUser({
        ...(user ?? {}),
        ...updatedUser,
        ...payload,
        birthDate: payload.birthDate ?? undefined,
      });
      setStatusMessage("اطلاعات پروفایل با موفقیت ذخیره شد.");
      notify.success("اطلاعات پروفایل ذخیره شد.");
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setErrorMessage(message);
      notify.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            نام
          </label>
          <input
            type="text"
            id="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            نام خانوادگی
          </label>
          <input
            type="text"
            id="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            پست الکترونیکی
          </label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            شماره تلفن
          </label>
          <input
            type="tel"
            id="phone"
            value={form.phone}
            disabled
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400"
          />
        </div>

        {/* <div>
          <label
            htmlFor="nationalCode"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            کد ملی
          </label>
          <input
            type="text"
            id="nationalCode"
            value={form.nationalCode}
            disabled
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400"
          />
        </div> */}

        <div>
          <label
            htmlFor="birthDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            تاریخ تولد
          </label>
          <DatePicker
            value={form.birthDatePicker}
            onChange={handleBirthDateChange}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            className="red"
            containerClassName="w-full"
            inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
            placeholder="تاریخ تولد را انتخاب کنید"
            format="YYYY/MM/DD"
            editable={false}
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            جنسیت
          </label>

          <div className="flex items-center space-x-4 mt-2">

            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={form.gender === "male"}
                onChange={handleChange}
                className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
              />
              <span className="ms-2 text-gray-700 dark:text-gray-300">
                مرد
              </span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={form.gender === "female"}
                onChange={handleChange}
                className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
              />
              <span className="ms-2 text-gray-700 dark:text-gray-300">
                زن
              </span>
            </label>

          </div>
        </div> */}
      </div>

      {errorMessage && (
        <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {errorMessage}
        </p>
      )}

      {statusMessage && (
        <p className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">
          {statusMessage}
        </p>
      )}

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "در حال ذخیره..." : "ذخیره تغییرات اطلاعات شخصی"}
        </button>
      </div>
    </form>
  );
}
