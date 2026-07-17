// src/lib/types/checkout/checkout.types.ts

export type CheckoutPaymentProvider = {
  code: string;
  title: string;
  description?: string;
  isAvailable: boolean;
  isDefault?: boolean;
  logoUrl?: string | null;
};

export type CheckoutPaymentMethod = {
  code: string;
  title: string;
  description: string;
  isAvailable: boolean;
  providers: CheckoutPaymentProvider[];
};

export type CheckoutShippingMethod = {
  id: string;
  title: string;
  description: string;
  price: number;
  formattedPrice?: string;
  methodType?: string;
  estimatedDeliveryDays?: number;
  isAvailable: boolean;
};

export type PlaceOrderShippingAddress = {
  countryCode: string;
  countryName: string;
  state: string;
  city: string;
  postalCode: string;
  addressLine: string;
};

export type PlaceOrderPayload = {
  shippingMethodId: string;
  shippingAddress: PlaceOrderShippingAddress;
  paymentMethodCode: string;
  couponCode?: string;
  providerCode?: string;
  customerNote?: string;
  giftCardCode?: string;
};

export type PlaceOrderResult = {
  orderId?: string;
  orderNumber?: string;
  paymentId?: string;
  paymentUrl?: string;
  redirectUrl?: string;
  message?: string;
  raw: unknown;
};

export type StartPaymentPayload = {
  orderId: string;
  providerCode?: string;
};

export type StartPaymentResult = {
  orderId?: string;
  orderNumber?: string;
  paymentAttemptId?: string;
  redirectUrl?: string;
  expiresAt?: string | null;
  message?: string;
  raw: unknown;
};
