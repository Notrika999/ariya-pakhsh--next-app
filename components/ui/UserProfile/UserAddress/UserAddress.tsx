"use client";

import React, { useState } from "react";
import UserAddressTop from "./UserAddressTop";

type Address = {
  id: number;
  title: string;
  receiver: string;
  phone: string;
  address: string;
  postalCode: string;
  province: string;
  city: string;
  isDefault: boolean;
};

export default function UserAddress() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      title: "منزل",
      receiver: "امیر رضایی",
      phone: "09001234567",
      address:
        "تهران، خیابان ولیعصر، کوچه شهید فلانی، پلاک ۱۲۳، طبقه ۲، واحد ۴",
      postalCode: "1234567890",
      province: "",
      city: "",
      isDefault: true,
    },
    {
      id: 2,
      title: "محل کار",
      receiver: "امیر رضایی",
      phone: "021-88561234",
      address: "تهران، میدان ونک، خیابان ملاصدرا، پلاک ۱۲، ساختمان ۳، واحد ۵",
      postalCode: "1234567891",
      province: "",
      city: "",
      isDefault: false,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    receiver: "",
    phone: "",
    address: "",
    postalCode: "",
    province: "",
    city: "",
  });

  const handleSetDefault = (id: number) => {
    setAddresses((prev) =>
      prev.map((addr) => ({ ...addr, isDefault: addr.id === id })),
    );
  };

  const handleDelete = (id: number) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // edit
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingId ? { ...addr, ...formData } : addr,
        ),
      );
    } else {
      // add
      const newAddress = {
        id: Date.now(),
        ...formData,
        isDefault: false,
      };

      setAddresses((prev) => [...prev, newAddress]);
    }

    setIsModalOpen(false);

    setFormData({
      title: "",
      receiver: "",
      phone: "",
      address: "",
      postalCode: "",
      province: "",
      city: "",
    });

    setEditingId(null);
  };

  const handleEdit = (id: number) => {
    const address = addresses.find((a) => a.id === id);

    if (!address) return;

    setEditingId(id);

    setFormData({
      title: address.title,
      receiver: address.receiver,
      phone: address.phone,
      address: address.address,
      postalCode: address.postalCode,
      province: address.province,
      city: address.city,
    });

    setIsModalOpen(true);
  };

  return (
    <div className="lg:col-span-3 space-y-8">
      {/* <!--Dashboard header--> */}
      <UserAddressTop addressLength={addresses.length} />

      {/* <!--Add New Address Button--> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: "",
              receiver: "",
              phone: "",
              address: "",
              postalCode: "",
            });
            setIsModalOpen(true);
          }}
          className="w-full bg-primary text-white px-6 py-4 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 me-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          افزودن آدرس جدید
        </button>
      </div>

      {/* <!--Addresses List--> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="addressesList">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700 relative ${
              addr.isDefault ? "border-2 border-primary" : ""
            }`}
          >
            {/* نشان پیش‌فرض */}
            {addr.isDefault && (
              <div className="absolute top-5 end-20">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
                  پیش‌فرض
                </span>
              </div>
            )}

            {/* عنوان آدرس + دکمه‌های ویرایش و حذف */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                {addr.title}
              </h3>
              <div className="flex items-center space-x-2 ">
                <button
                  className="edit-btn text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={() => handleEdit(addr.id)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </button>

                <button
                  className="delete-btn text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  onClick={() => handleDelete(addr.id)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* بخش اطلاعات آدرس */}
            <div className="space-y-2">
              {/* گیرنده */}
              <div className="flex items-start space-x-2 ">
                <svg
                  className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-400">
                  {addr.receiver}
                </span>
              </div>

              {/* آدرس کامل */}
              <div className="flex items-start space-x-2 ">
                <svg
                  className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-400">
                  {addr.address}
                </span>
              </div>

              {/* تلفن */}
              <div className="flex items-start space-x-2 ">
                <svg
                  className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-400">
                  {addr.phone}
                </span>
              </div>

              {/* کد پستی */}
              <div className="flex items-start space-x-2 ">
                <svg
                  className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-400">
                  کد پستی: {addr.postalCode}
                </span>
              </div>
            </div>

            {/* دکمه تنظیم پیش‌فرض */}
            {!addr.isDefault && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="set-default-btn w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 text-sm font-medium dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                >
                  تنظیم به عنوان پیش‌فرض
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* <!--Add Address Modal--> */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-400 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-custom-dark dark:border dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {editingId ? "ویرایش آدرس" : "افزودن آدرس"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    عنوان آدرس
                  </label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    value={formData.title}
                    type="text"
                    className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
                    placeholder="مثال: منزل، محل کار"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نام گیرنده
                  </label>
                  <input
                    type="text"
                    onChange={(e) =>
                      setFormData({ ...formData, receiver: e.target.value })
                    }
                    value={formData.receiver}
                    className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
                    placeholder="نام و نام خانوادگی"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    شماره تلفن
                  </label>
                  <input
                    type="tel"
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    value={formData.phone}
                    className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
                    placeholder="09xxxxxxxxx"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    استان
                  </label>
                  <select
                    className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({ ...formData, province: e.target.value })
                    }
                    required
                  >
                    <option value="">انتخاب استان</option>
                    <option value="tehran">تهران</option>
                    <option value="alborz">البرز</option>
                    <option value="isfahan">اصفهان</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    شهر
                  </label>
                  <select
                    className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                  >
                    <option value="">انتخاب شهر</option>
                    <option value="tehran">تهران</option>
                    <option value="karaj">کرج</option>
                    <option value="isfahan">اصفهان</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    کد پستی
                  </label>
                  <input
                    type="text"
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    value={formData.postalCode}
                    className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
                    placeholder="۱۰ رقمی"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  آدرس کامل
                </label>
                <textarea
                  rows="3"
                  className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
                  placeholder="خیابان، کوچه، پلاک، طبقه، واحد"
                  required
                ></textarea>
              </div>

              <div className="flex items-center space-x-2 ">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label
                  htmlFor="setDefault"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  تنظیم به عنوان آدرس پیش‌فرض
                </label>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-200 font-medium mb-3 sm:mb-0 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 font-medium"
                >
                  {editingId ? "ذخیره تغییرات" : "ثبت آدرس"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
