// src/lib/types/checkout/checkout.types.ts

export type CheckoutPaymentProvider = {
  code: string;
  title: string;
  description?: string;
  isAvailable: boolean;
  isDefault?: boolean;
  gatewayType?: string;
  minAmount?: number;
  maxAmount?: number;
  imageUrl?: string | null;
  logoUrl?: string | null;
};

export type CheckoutPaymentMethod = {
  code: string;
  title: string;
  description: string;
  isAvailable: boolean;
  imageUrl?: string | null;
  providers: CheckoutPaymentProvider[];
};

export type CheckoutApiErrorItem = {
  field?: string;
  message?: string;
  code?: string;
};

export type CheckoutShippingMethod = {
  id: string;
  shippingMethodId: string;
  shippingClassId?: string;
  shippingClassTitle?: string;
  title: string;
  description: string;
  price: number;
  formattedPrice?: string;
  methodType?: string;
  estimatedDeliveryDays?: number;
  cashOnDelivery?: boolean;
  isShippingPayAtDelivery?: boolean;
  isAvailable: boolean;
};

export type CheckoutShippingGroupItem = {
  productId: string;
  productName: string;
  productColorName?: string;
  productColorHex?: string;
  quantity: number;
};

export type CheckoutShippingGroup = {
  shippingClassId: string;
  shippingClassName: string;
  totalWeightGrams: number;
  itemCount: number;
  items: CheckoutShippingGroupItem[];
  options: CheckoutShippingMethod[];
};

export type CheckoutShippingOptionsResult = {
  groups: CheckoutShippingGroup[];
  cheapestTotalCost: number;
  formattedCheapestTotalCost: string;
  raw: unknown;
};

export type PlaceOrderShippingAddress = {
  countryCode: string;
  countryName: string;
  state: string;
  city: string;
  postalCode: string;
  addressLine: string;
  provinceId?: string;
  cityId?: string;
  recipientFirstName?: string;
  recipientLastName?: string;
  mobile?: string;
  phone?: string;
  email?: string;
};

export type PlaceOrderShippingSelection = {
  shippingClassId: string;
  shippingMethodId: string;
};

export type PlaceOrderPayload = {
  shippingMethodId: string;
  shippingSelections: PlaceOrderShippingSelection[];
  shippingAddress: PlaceOrderShippingAddress;
  paymentMethodCode: string;
  couponCode?: string;
  providerCode?: string;
  customerNote?: string;
  giftCardCode?: string;
};

export type PlaceOrderResult = {
  success?: boolean;
  code?: string;
  errors?: CheckoutApiErrorItem[];
  timestamp?: string;
  traceId?: string;
  orderId?: string;
  orderNumber?: string;
  paymentId?: string;
  paymentUrl?: string;
  redirectUrl?: string;
  message?: string;
  raw: unknown;
};

export type CheckoutCouponPayload = {
  couponCode?: string | null;
  providerCode?: string;
  shippingMethodId?: string;
  shippingSelections?: PlaceOrderShippingSelection[];
  shippingAddress?: PlaceOrderShippingAddress;
};

export type CheckoutGatewayFee = {
  providerCode: string;
  title: string;
  percent: number;
  amount: number;
};

export type CheckoutCouponDiscount = {
  couponCode: string;
  couponIsApplicable: boolean;
  couponMessage: string;
  couponItemsDiscount: number;
  couponShippingDiscount: number;
  couponTotalDiscount: number;
  campaignDiscount: number;
  appliedSource: string;
  appliedAmount: number;
  rejectedSource: string;
  rejectedAmount: number;
  decisionReason: string;
  itemsSubtotal: number;
  shippingFee: number;
  shippingPrice: number;
  gatewayFee: CheckoutGatewayFee | null;
  discount: number;
  payableAmount: number;
  onlinePayableAmount: number;
  totalOrderAmount: number;
  isShippingPayAtDelivery: boolean;
  raw: unknown;
};

export type StartPaymentPayload = {
  orderId: string;
  providerCode?: string;
  digipayType?: "bnpl";
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
