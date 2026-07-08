import { validateMobile } from "@/src/utils/auth.validation";
import {
  getCitiesByProvince,
  getIranProvinceNames,
  resolveIranProvince,
} from "@/src/lib/data/iran-locations";
import {
  CustomerAddressDto,
  CustomerAddressPayload,
} from "@/src/lib/types/address/address.type";

export const EMPTY_ADDRESS_FORM: CustomerAddressPayload = {
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

export type AddressFieldErrors = Partial<
  Record<keyof CustomerAddressPayload, string>
>;

export function formatReceiver(address: CustomerAddressDto): string {
  return [address.receiverFirstName, address.receiverLastName]
    .filter(Boolean)
    .join(" ");
}

export function formatLocation(address: CustomerAddressDto): string {
  return [address.province, address.city, address.addressLine]
    .filter(Boolean)
    .join("، ");
}

export function addressToFormPayload(
  address: CustomerAddressDto,
): CustomerAddressPayload {
  return {
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
  };
}

export function validateAddressForm(
  formData: CustomerAddressPayload,
): AddressFieldErrors {
  const nextErrors: AddressFieldErrors = {};
  const provinceOptions = getIranProvinceNames();
  const cityOptions = getCitiesByProvince(resolveIranProvince(formData.province));

  if (!formData.title.trim()) {
    nextErrors.title = "عنوان آدرس الزامی است";
  }

  if (!formData.receiverFirstName.trim()) {
    nextErrors.receiverFirstName = "نام گیرنده الزامی است";
  }

  if (!formData.receiverLastName.trim()) {
    nextErrors.receiverLastName = "نام خانوادگی گیرنده الزامی است";
  }

  if (!formData.receiverMobile.trim()) {
    nextErrors.receiverMobile = "شماره موبایل گیرنده الزامی است";
  } else if (!validateMobile(formData.receiverMobile)) {
    nextErrors.receiverMobile = "شماره موبایل معتبر نیست";
  }

  const resolvedProvince = resolveIranProvince(formData.province);
  if (!formData.province.trim()) {
    nextErrors.province = "استان الزامی است";
  } else if (!provinceOptions.includes(resolvedProvince)) {
    nextErrors.province = "لطفاً استان را از لیست انتخاب کنید";
  }

  if (!formData.city.trim()) {
    nextErrors.city = "شهر الزامی است";
  } else if (
    formData.province.trim() &&
    !cityOptions.includes(formData.city.trim())
  ) {
    nextErrors.city = "لطفاً شهر را از لیست انتخاب کنید";
  }

  if (!formData.postalCode.trim()) {
    nextErrors.postalCode = "کد پستی الزامی است";
  } else if (!/^\d{10}$/.test(formData.postalCode.trim())) {
    nextErrors.postalCode = "کد پستی باید ۱۰ رقم باشد";
  }

  if (!formData.addressLine.trim()) {
    nextErrors.addressLine = "آدرس کامل الزامی است";
  }

  return nextErrors;
}

export function buildAddressPayload(
  formData: CustomerAddressPayload,
): CustomerAddressPayload {
  return {
    ...formData,
    province: resolveIranProvince(formData.province),
  };
}
