"use client";
// components/modules/AddressFormModal/AddressFormModal.tsx
import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import LocationAutocomplete from "@/components/ui/UserProfile/UserAddress/LocationAutocomplete";
import {
  createCustomerAddress,
  updateCustomerAddress,
} from "@/src/services/address/address.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { CustomerAddressPayload } from "@/src/lib/types/address/address.type";
import {
  getCityOptionsByProvince,
  getIranProvinceOptions,
} from "@/src/lib/data/iran-locations";
import {
  buildAddressPayload,
  EMPTY_ADDRESS_FORM,
  validateAddressForm,
  type AddressFieldErrors,
} from "@/src/lib/address/address-form";
import { FieldError, fieldClass } from "@/src/utils/form.validation";
import { notify } from "@/src/utils/toast";

const AddressLocationMap = dynamic(
  () => import("./AddressLocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-500 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-400">
        در حال بارگذاری نقشه...
      </div>
    ),
  },
);

const INPUT_CLASS =
  "appearance-none rounded-lg px-4 pe-10 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingId?: string | null;
  initialData?: CustomerAddressPayload;
  onSuccess?: () => void;
  showDefaultCheckbox?: boolean;
}

function AddressFormModalContent({
  onClose,
  editingId = null,
  initialData,
  onSuccess,
  showDefaultCheckbox = true,
}: AddressFormModalProps) {
  const [formData, setFormData] = useState<CustomerAddressPayload>(
    () => initialData ?? EMPTY_ADDRESS_FORM,
  );
  const [fieldErrors, setFieldErrors] = useState<AddressFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const provinceOptions = useMemo(() => getIranProvinceOptions(), []);
  const cityOptions = useMemo(
    () => getCityOptionsByProvince(formData.province),
    [formData.province],
  );

  const clearFieldError = (field: keyof AddressFieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleProvinceChange = (province: string) => {
    setFormData((prev) => ({
      ...prev,
      province,
      city: province !== prev.province ? "" : prev.city,
    }));
    clearFieldError("province");
    if (province !== formData.province) {
      clearFieldError("city");
    }
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors = validateAddressForm(formData);
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    const payload = buildAddressPayload(formData);

    setSubmitting(true);

    try {
      if (editingId) {
        await updateCustomerAddress(editingId, payload);
        notify.success("آدرس با موفقیت ویرایش شد.");
      } else {
        await createCustomerAddress(payload);
        notify.success("آدرس جدید با موفقیت ثبت شد.");
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("[AddressFormModal] submit failed =>", err);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-16 backdrop-blur-sm sm:pt-20">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-400 bg-white dark:border-gray-700 dark:bg-custom-dark">
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {editingId ? "ویرایش آدرس" : "افزودن آدرس"}
            </h3>
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <i className="fa fa-x"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                عنوان آدرس <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  clearFieldError("title");
                }}
                type="text"
                disabled={submitting}
                className={[fieldClass(Boolean(fieldErrors.title)), INPUT_CLASS].join(
                  " ",
                )}
                placeholder="مثال: منزل، محل کار"
              />
              <FieldError message={fieldErrors.title} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                نام گیرنده <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.receiverFirstName}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    receiverFirstName: e.target.value,
                  });
                  clearFieldError("receiverFirstName");
                }}
                disabled={submitting}
                className={[
                  fieldClass(Boolean(fieldErrors.receiverFirstName)),
                  INPUT_CLASS,
                ].join(" ")}
                placeholder="نام"
              />
              <FieldError message={fieldErrors.receiverFirstName} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                نام خانوادگی گیرنده <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.receiverLastName}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    receiverLastName: e.target.value,
                  });
                  clearFieldError("receiverLastName");
                }}
                disabled={submitting}
                className={[
                  fieldClass(Boolean(fieldErrors.receiverLastName)),
                  INPUT_CLASS,
                ].join(" ")}
                placeholder="نام خانوادگی"
              />
              <FieldError message={fieldErrors.receiverLastName} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                شماره موبایل گیرنده <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.receiverMobile}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    receiverMobile: e.target.value.replace(/\D/g, "").slice(0, 11),
                  });
                  clearFieldError("receiverMobile");
                }}
                disabled={submitting}
                className={[
                  fieldClass(Boolean(fieldErrors.receiverMobile)),
                  INPUT_CLASS,
                ].join(" ")}
                placeholder="09xxxxxxxxx"
                dir="ltr"
                inputMode="numeric"
                autoComplete="off"
              />
              <FieldError message={fieldErrors.receiverMobile} />
            </div>

            <LocationAutocomplete
              label="استان"
              value={formData.province}
              options={provinceOptions}
              onChange={handleProvinceChange}
              placeholder="جستجو یا انتخاب استان"
              required
              disabled={submitting}
              error={fieldErrors.province}
              onClearError={() => clearFieldError("province")}
            />

            <LocationAutocomplete
              label="شهر"
              value={formData.city}
              options={cityOptions}
              onChange={(city) => {
                setFormData({ ...formData, city });
                clearFieldError("city");
              }}
              placeholder={
                formData.province
                  ? "جستجو یا انتخاب شهر"
                  : "ابتدا استان را انتخاب کنید"
              }
              required
              disabled={!formData.province.trim() || submitting}
              error={fieldErrors.city}
              onClearError={() => clearFieldError("city")}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                کد پستی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    postalCode: e.target.value.replace(/\D/g, "").slice(0, 10),
                  });
                  clearFieldError("postalCode");
                }}
                disabled={submitting}
                className={[
                  fieldClass(Boolean(fieldErrors.postalCode)),
                  INPUT_CLASS,
                ].join(" ")}
                placeholder="۱۰ رقمی"
                dir="ltr"
                inputMode="numeric"
              />
              <FieldError message={fieldErrors.postalCode} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              آدرس کامل <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.addressLine}
              onChange={(e) => {
                setFormData({ ...formData, addressLine: e.target.value });
                clearFieldError("addressLine");
              }}
              disabled={submitting}
              className={[
                fieldClass(Boolean(fieldErrors.addressLine)),
                INPUT_CLASS,
                "p-3",
              ].join(" ")}
              placeholder="خیابان، کوچه، پلاک، طبقه، واحد"
            />
            <FieldError message={fieldErrors.addressLine} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              موقعیت روی نقشه <span className="text-red-500">*</span>
            </label>
            <AddressLocationMap
              latitude={formData.latitude}
              longitude={formData.longitude}
              disabled={submitting}
              hasError={Boolean(fieldErrors.latitude)}
              onChange={({ latitude, longitude }) => {
                setFormData((prev) => ({ ...prev, latitude, longitude }));
                clearFieldError("latitude");
              }}
            />
            <FieldError message={fieldErrors.latitude} />
          </div>

          {showDefaultCheckbox && (
            <div className="flex items-center space-x-2">
              <input
                id="setDefault"
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
                disabled={submitting}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="setDefault"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                تنظیم به عنوان آدرس پیش‌فرض
              </label>
            </div>
          )}

          <div className="flex flex-col border-t border-gray-200 pt-6 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="mb-3 w-full rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition duration-200 hover:bg-gray-200 disabled:opacity-60 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 sm:mb-0 sm:w-auto"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-white transition duration-200 hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
    </div>,
    document.body,
  );
}

export default function AddressFormModal(props: AddressFormModalProps) {
  if (!props.isOpen || typeof document === "undefined") return null;

  return (
    <AddressFormModalContent
      key={props.editingId ?? "new-address"}
      {...props}
    />
  );
}
