"use client";

import { useState } from "react";

export default function PersonalInfoForm() {
  const initialState = {
    firstName: "امیر",
    lastName: "رضایی",
    email: "amir.rezaei@example.com",
    phone: "09001234567",
    birthDate: "۱۳۷۰/۰۵/۱۵",
    gender: "male",
  };

  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    const { id, value, name } = e.target;

    if (name === "gender") {
      setForm((prev) => ({ ...prev, gender: value }));
    } else {
      setForm((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
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
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="birthDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            تاریخ تولد
          </label>
          <input
            type="text"
            id="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
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
        </div>

      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white"
        >
          ذخیره تغییرات اطلاعات شخصی
        </button>
      </div>
    </form>
  );
}
