"use client";
// componenets/ui/userProfile/userAddress/UserAddress.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import UserAddressTop from "./UserAddressTop";
import LocationAutocomplete from "./LocationAutocomplete";
import {
  createCustomerAddress,
  deleteCustomerAddress,
  getCustomerAddresses,
  setDefaultCustomerAddress,
  updateCustomerAddress,
} from "@/src/services/address/address.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import {
  CustomerAddressDto,
  CustomerAddressPayload,
} from "@/src/lib/types/address/address.type";
import {
  getCitiesByProvince,
  getIranProvinceNames,
  resolveIranProvince,
} from "@/src/lib/data/iran-locations";
import { notify } from "@/src/utils/toast";

const EMPTY_FORM: CustomerAddressPayload = {
  title: "",
  province: "",
  city: "",
  addressLine: "",
  postalCode: "",
  receiverFirstName: "",
  receiverLastName: "",
  receiverMobile: "",
  isDefault: false,
  latitude: 0,
  longitude: 0,
};

function formatReceiver(address: CustomerAddressDto): string {
  return [address.receiverFirstName, address.receiverLastName]
    .filter(Boolean)
    .join(" ");
}

function formatLocation(address: CustomerAddressDto): string {
  return [address.province, address.city, address.addressLine]
    .filter(Boolean)
    .join("، ");
}

export default function UserAddress() {
  const [addresses, setAddresses] = useState<CustomerAddressDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CustomerAddressPayload>(EMPTY_FORM);

  const provinceOptions = useMemo(() => getIranProvinceNames(), []);
  const cityOptions = useMemo(
    () => getCitiesByProvince(resolveIranProvince(formData.province)),
    [formData.province],
  );

  const loadAddresses = useCallback(async () => {
    setLoading(true);

    try {
      console.log("[UserAddress] loadAddresses => start");
      const data = await getCustomerAddresses();
      setAddresses(data);
      console.log("[UserAddress] loadAddresses => success", data.length);
    } catch (err) {
      console.error("[UserAddress] loadAddresses => error", err);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);

      try {
        console.log("[UserAddress] loadAddresses => start");
        const data = await getCustomerAddresses();
        if (!cancelled) {
          setAddresses(data);
          console.log("[UserAddress] loadAddresses => success", data.length);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[UserAddress] loadAddresses => error", err);
          notify.error(getAuthErrorMessage(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleProvinceChange = (province: string) => {
    setFormData((prev) => ({
      ...prev,
      province,
      city: province !== prev.province ? "" : prev.city,
    }));
  };

  const handleSetDefault = async (id: string) => {
    setActionId(id);

    try {
      console.log("[UserAddress] handleSetDefault =>", id);
      await setDefaultCustomerAddress(id);
      await loadAddresses();
      notify.success("آدرس پیش‌فرض با موفقیت تنظیم شد.");
    } catch (err) {
      console.error("[UserAddress] handleSetDefault => error", err);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionId(id);

    try {
      console.log("[UserAddress] handleDelete =>", id);
      await deleteCustomerAddress(id);
      await loadAddresses();
      notify.success("آدرس با موفقیت حذف شد.");
    } catch (err) {
      console.error("[UserAddress] handleDelete => error", err);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resolvedProvince = resolveIranProvince(formData.province);
    if (!provinceOptions.includes(resolvedProvince)) {
      notify.warning("لطفاً استان را از لیست انتخاب کنید.");
      return;
    }

    if (!formData.city.trim()) {
      notify.warning("لطفاً شهر را انتخاب کنید.");
      return;
    }

    const payload: CustomerAddressPayload = {
      ...formData,
      province: resolvedProvince,
    };

    setSubmitting(true);

    try {
      if (editingId) {
        console.log("[UserAddress] handleSubmit => update", editingId, payload);
        await updateCustomerAddress(editingId, payload);
        notify.success("آدرس با موفقیت ویرایش شد.");
      } else {
        console.log("[UserAddress] handleSubmit => create", payload);
        await createCustomerAddress(payload);
        notify.success("آدرس جدید با موفقیت ثبت شد.");
      }

      setIsModalOpen(false);
      resetForm();
      await loadAddresses();
    } catch (err) {
      console.error("[UserAddress] handleSubmit => error", err);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (id: string) => {
    const address = addresses.find((item) => item.id === id);
    if (!address) return;

    setEditingId(id);
    setFormData({
      title: address.title,
      province: resolveIranProvince(address.province),
      city: address.city,
      addressLine: address.addressLine,
      postalCode: address.postalCode,
      receiverFirstName: address.receiverFirstName,
      receiverLastName: address.receiverLastName,
      receiverMobile: address.receiverMobile,
      isDefault: address.isDefault,
      latitude: address.latitude ?? 0,
      longitude: address.longitude ?? 0,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="lg:col-span-3 space-y-8">
      <UserAddressTop addressLength={addresses.length} />

      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <button
          onClick={openCreateModal}
          disabled={loading || submitting}
          className="w-full bg-primary text-white px-6 py-4 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-60"
        >
          <i className="far fa-plus me-2"></i>
          افزودن آدرس جدید
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-8 text-center text-gray-500 drop-shadow-lg dark:bg-custom-dark dark:text-gray-400">
          در حال دریافت آدرس‌ها...
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center text-gray-500 drop-shadow-lg dark:bg-custom-dark dark:text-gray-400">
          هنوز آدرسی ثبت نشده است.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="addressesList">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700 relative ${
                addr.isDefault ? "border-2 border-primary" : ""
              }`}
            >
              {addr.isDefault && (
                <div className="absolute top-5 end-20">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
                    پیش‌فرض
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                  {addr.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="edit-btn text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer disabled:opacity-50"
                    onClick={() => handleEdit(addr.id)}
                    disabled={Boolean(actionId) || submitting}
                  >
                    <i className="far fa-pen-to-square"></i>
                  </button>

                  <button
                    type="button"
                    className="delete-btn text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 cursor-pointer disabled:opacity-50"
                    onClick={() => void handleDelete(addr.id)}
                    disabled={Boolean(actionId) || submitting}
                  >
                    <i className="far fa-trash-can"></i>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <i className="far fa-user text-gray-400 mt-0.5 flex-shrink-0"></i>
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatReceiver(addr)}
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <i className="far fa-location-pin text-gray-400 mt-0.5 shrink-0"></i>
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatLocation(addr)}
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <i className="far fa-phone text-gray-400 mt-0.5 shrink-0"></i>
                  <span className="text-gray-600 dark:text-gray-400" dir="ltr">
                    {addr.receiverMobile}
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <i className="far fa-home text-gray-400 mt-0.5 shrink-0"></i>
                  <span className="text-gray-600 dark:text-gray-400">
                    کد پستی: {addr.postalCode}
                  </span>
                </div>
              </div>

              {!addr.isDefault && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => void handleSetDefault(addr.id)}
                    disabled={actionId === addr.id || submitting}
                    className="set-default-btn w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 text-sm font-medium dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionId === addr.id
                      ? "در حال تنظیم..."
                      : "تنظیم به عنوان پیش‌فرض"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-400 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-custom-dark dark:border dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {editingId ? "ویرایش آدرس" : "افزودن آدرس"}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
                >
                  <i className="fa fa-x"></i>
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
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
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
                    value={formData.receiverFirstName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        receiverFirstName: e.target.value,
                      })
                    }
                    className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
                    placeholder="نام"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نام خانوادگی گیرنده
                  </label>
                  <input
                    type="text"
                    value={formData.receiverLastName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        receiverLastName: e.target.value,
                      })
                    }
                    className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
                    placeholder="نام خانوادگی"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    شماره موبایل گیرنده
                  </label>
                  <input
                    type="tel"
                    value={formData.receiverMobile}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        receiverMobile: e.target.value,
                      })
                    }
                    className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
                    placeholder="09xxxxxxxxx"
                    dir="ltr"
                    required
                  />
                </div>

                <LocationAutocomplete
                  label="استان"
                  value={formData.province}
                  options={provinceOptions}
                  onChange={handleProvinceChange}
                  placeholder="جستجو یا انتخاب استان"
                  required
                />

                <LocationAutocomplete
                  label="شهر"
                  value={formData.city}
                  options={cityOptions}
                  onChange={(city) => setFormData({ ...formData, city })}
                  placeholder={
                    formData.province
                      ? "جستجو یا انتخاب شهر"
                      : "ابتدا استان را انتخاب کنید"
                  }
                  required
                  disabled={!formData.province.trim()}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    کد پستی
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
                    placeholder="۱۰ رقمی"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  آدرس کامل
                </label>
                <textarea
                  rows={3}
                  value={formData.addressLine}
                  onChange={(e) =>
                    setFormData({ ...formData, addressLine: e.target.value })
                  }
                  className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
                  placeholder="خیابان، کوچه، پلاک، طبقه، واحد"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="setDefault"
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
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
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  disabled={submitting}
                  className="w-full sm:w-auto bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-200 font-medium mb-3 sm:mb-0 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 disabled:opacity-60"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 font-medium disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "در حال ذخیره..."
                    : editingId
                      ? "ذخیره تغییرات"
                      : "ثبت آدرس"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
