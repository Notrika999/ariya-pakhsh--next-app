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
          <i className="far fa-plus me-2"></i>
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
                  className="edit-btn text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                  onClick={() => handleEdit(addr.id)}
                >
                  <i className="far fa-pen-to-square"></i>
                </button>

                <button
                  className="delete-btn text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                  onClick={() => handleDelete(addr.id)}
                >
                  <i className="far fa-trash-can"></i>
                </button>
              </div>
            </div>

            {/* بخش اطلاعات آدرس */}
            <div className="space-y-2">
              {/* گیرنده */}
              <div className="flex items-start space-x-2 ">
                <i className="far fa-user text-gray-400 mt-0.5 flex-shrink-0"></i>
                <span className="text-gray-600 dark:text-gray-400">
                  {addr.receiver}
                </span>
              </div>

              {/* آدرس کامل */}
              <div className="flex items-start space-x-2 ">
                <i className="far fa-location-pin text-gray-400 mt-0.5 shrink-0"></i>
                <span className="text-gray-600 dark:text-gray-400">
                  {addr.address}
                </span>
              </div>

              {/* تلفن */}
              <div className="flex items-start space-x-2 ">
                <i className="far fa-phone text-gray-400 mt-0.5 shrink-0"></i>
                
                <span className="text-gray-600 dark:text-gray-400">
                  {addr.phone}
                </span>
              </div>

              {/* کد پستی */}
              <div className="flex items-start space-x-2 ">
                <i className="far fa-home text-gray-400 mt-0.5 shrink-0"></i>
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
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
                >
                  <i className="fa fa-x "></i>
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
