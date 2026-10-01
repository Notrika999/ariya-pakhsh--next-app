export interface CustomerAddressDto {
  id: string;
  title: string;
  province: string;
  city: string;
<<<<<<< HEAD
  provinceId?: string;
  cityId?: string;
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  addressLine: string;
  postalCode: string;
  receiverFirstName: string;
  receiverLastName: string;
  receiverMobile: string;
  isDefault: boolean;
  latitude: number;
  longitude: number;
}

export interface CustomerAddressPayload {
  title: string;
  province: string;
  city: string;
<<<<<<< HEAD
  provinceId?: string;
  cityId?: string;
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  addressLine: string;
  postalCode: string;
  receiverFirstName: string;
  receiverLastName: string;
  receiverMobile: string;
  isDefault: boolean;
  latitude: number;
  longitude: number;
}

export interface CustomerAddressBulkPayload {
  addresses: CustomerAddressPayload[];
}

export interface ApiErrorItem {
  field?: string;
  message?: string;
  code?: string;
}

export interface CustomerAddressApiEnvelope<T> {
  success?: boolean;
  message?: string;
  code?: string;
  errors?: ApiErrorItem[];
  timestamp?: string;
  traceId?: string;
  data?: T;
}
