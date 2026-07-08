"use client";
// componenets/ui/userProfile/userAddress/UserAddress.tsx
import React, { useCallback, useEffect, useState } from "react";
import UserAddressTop from "./UserAddressTop";
import AddressFormModal from "@/components/modules/AddressFormModal/AddressFormModal";
import {
  deleteCustomerAddress,
  getCustomerAddresses,
  setDefaultCustomerAddress,
} from "@/src/services/address/address.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { CustomerAddressDto, CustomerAddressPayload } from "@/src/lib/types/address/address.type";
import {
  addressToFormPayload,
  formatLocation,
  formatReceiver,
} from "@/src/lib/address/address-form";
import { notify } from "@/src/utils/toast";

export default function UserAddress() {
  const [addresses, setAddresses] = useState<CustomerAddressDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingInitialData, setEditingInitialData] = useState<
    CustomerAddressPayload | undefined
  >(undefined);

  const loadAddresses = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getCustomerAddresses();
      setAddresses(data);
    } catch (err) {
      console.error("[UserAddress] loadAddresses => error", err);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAddresses();
  }, [loadAddresses]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setEditingInitialData(undefined);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setEditingInitialData(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const address = addresses.find((item) => item.id === id);
    if (!address) return;

    setEditingId(id);
    setEditingInitialData(addressToFormPayload(address));
    setIsModalOpen(true);
  };

  const handleSetDefault = async (id: string) => {
    setActionId(id);

    try {
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

  return (
    <div className="lg:col-span-3 space-y-8">
      <UserAddressTop addressLength={addresses.length} />

      <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <button
          onClick={openCreateModal}
          disabled={loading}
          className="flex w-full items-center justify-center rounded-lg bg-primary px-6 py-4 text-white shadow-sm transition duration-200 hover:bg-primary/90 hover:shadow active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-primary/80 dark:text-white dark:hover:bg-primary/60"
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2" id="addressesList">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`relative rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark ${
                addr.isDefault ? "border-2 border-primary" : ""
              }`}
            >
              {addr.isDefault && (
                <div className="absolute end-20 top-5">
                  <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                    پیش‌فرض
                  </span>
                </div>
              )}

              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {addr.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="edit-btn cursor-pointer text-blue-600 hover:text-blue-800 disabled:opacity-50 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => handleEdit(addr.id)}
                    disabled={Boolean(actionId)}
                  >
                    <i className="far fa-pen-to-square"></i>
                  </button>

                  <button
                    type="button"
                    className="delete-btn cursor-pointer text-red-600 hover:text-red-800 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                    onClick={() => void handleDelete(addr.id)}
                    disabled={Boolean(actionId)}
                  >
                    <i className="far fa-trash-can"></i>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <i className="far fa-user mt-0.5 shrink-0 text-gray-400"></i>
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatReceiver(addr)}
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <i className="far fa-location-pin mt-0.5 shrink-0 text-gray-400"></i>
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatLocation(addr)}
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <i className="far fa-phone mt-0.5 shrink-0 text-gray-400"></i>
                  <span className="text-gray-600 dark:text-gray-400" dir="ltr">
                    {addr.receiverMobile}
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <i className="far fa-home mt-0.5 shrink-0 text-gray-400"></i>
                  <span className="text-gray-600 dark:text-gray-400">
                    کد پستی: {addr.postalCode}
                  </span>
                </div>
              </div>

              {!addr.isDefault && (
                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => void handleSetDefault(addr.id)}
                    disabled={actionId === addr.id}
                    className="set-default-btn w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
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

      <AddressFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editingId={editingId}
        initialData={editingInitialData}
        onSuccess={() => void loadAddresses()}
      />
    </div>
  );
}
