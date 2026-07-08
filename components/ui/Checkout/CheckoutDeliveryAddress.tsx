"use client";

import { useCallback, useEffect, useState } from "react";
import AddressFormModal from "@/components/modules/AddressFormModal/AddressFormModal";
import { getCustomerAddresses } from "@/src/services/address/address.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { CustomerAddressDto } from "@/src/lib/types/address/address.type";
import {
  addressToFormPayload,
  formatLocation,
  formatReceiver,
} from "@/src/lib/address/address-form";
import { notify } from "@/src/utils/toast";

function getAddressIcon(title: string): string {
  const value = title.trim().toLowerCase();
  if (value.includes("کار") || value.includes("office")) return "fa-toolbox text-green-500";
  if (value.includes("فروشگاه") || value.includes("shop")) return "fa-hotel text-purple-500";
  return "fa-house text-primary-500";
}

interface CheckoutDeliveryAddressProps {
  selectedAddressId: string | null;
  onSelectAddress: (addressId: string | null) => void;
}

export default function CheckoutDeliveryAddress({
  selectedAddressId,
  onSelectAddress,
}: CheckoutDeliveryAddressProps) {
  const [addresses, setAddresses] = useState<CustomerAddressDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingInitialData, setEditingInitialData] = useState<
    ReturnType<typeof addressToFormPayload> | undefined
  >(undefined);

  const loadAddresses = useCallback(
    async (options?: { preserveSelection?: boolean }) => {
      setLoading(true);
      try {
        const data = await getCustomerAddresses();
        setAddresses(data);

        if (data.length === 0) {
          onSelectAddress(null);
          return;
        }

        if (!options?.preserveSelection || !selectedAddressId) {
          const defaultAddress = data.find((item) => item.isDefault) ?? data[0];
          onSelectAddress(defaultAddress.id);
          return;
        }

        const selectedExists = data.some((item) => item.id === selectedAddressId);
        if (!selectedExists) {
          const defaultAddress = data.find((item) => item.isDefault) ?? data[0];
          onSelectAddress(defaultAddress.id);
        }
      } catch (err) {
        console.error("[CheckoutDeliveryAddress] load failed =>", err);
        notify.error(getAuthErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [onSelectAddress, selectedAddressId],
  );

  useEffect(() => {
    void loadAddresses();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setEditingInitialData(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (address: CustomerAddressDto) => {
    setEditingId(address.id);
    setEditingInitialData(addressToFormPayload(address));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setEditingInitialData(undefined);
  };

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center text-xl font-bold text-gray-800 dark:text-white">
          <i className="far fa-location-dot text-primary-500"></i>
          آدرس تحویل
        </h2>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center text-sm text-primary-500 hover:text-primary-700 dark:text-gray-400"
        >
          <span className="text-xl">+</span>
          افزودن آدرس جدید
        </button>
      </div>

      <div className="mb-6">
        <h3 className="mb-3 text-lg font-medium text-gray-700 dark:text-gray-300">
          آدرس‌های ذخیره شده
        </h3>

        {loading ? (
          <div className="rounded-lg border border-gray-200 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            در حال دریافت آدرس‌ها...
          </div>
        ) : addresses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              هنوز آدرسی ثبت نکرده‌اید.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-3 text-sm font-medium text-primary-500 hover:text-primary-700"
            >
              افزودن اولین آدرس
            </button>
          </div>
        ) : (
          <div className="space-y-3" id="saved-addresses">
            {addresses.map((address) => {
              const isSelected = selectedAddressId === address.id;
              return (
                <div
                  key={address.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectAddress(address.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectAddress(address.id);
                    }
                  }}
                  className={[
                    "address-item cursor-pointer rounded-lg border p-4 transition-all",
                    isSelected
                      ? "selected border-primary-500 bg-blue-50 dark:bg-zinc-800"
                      : "border-gray-300 hover:border-primary-500 dark:border-gray-600",
                  ].join(" ")}
                  data-address-id={address.id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center">
                      <i
                        className={`far ${getAddressIcon(address.title)} me-2 shrink-0`}
                      ></i>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-medium text-gray-800 dark:text-white">
                            {address.title}
                          </h4>
                          {address.isDefault && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                              پیش‌فرض
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatReceiver(address)} - {address.receiverMobile}
                        </p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {formatLocation(address)}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(address);
                        }}
                        className="text-sm text-gray-500 hover:text-primary-500 dark:text-gray-400"
                      >
                        ویرایش
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAddress(address.id);
                        }}
                        className="text-sm text-primary-500 hover:text-primary-700 dark:text-gray-400"
                      >
                        {isSelected ? "انتخاب شده" : "انتخاب"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddressFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editingId={editingId}
        initialData={editingInitialData}
        onSuccess={() => void loadAddresses({ preserveSelection: true })}
      />
    </div>
  );
}
