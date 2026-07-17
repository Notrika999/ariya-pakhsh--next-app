// src/lib/types/orders/order.types.ts

export type MyOrderListItem = {
  orderId: string;
  publicOrderNumber: string;
  statusKey: string;
  statusTitleFa: string;
  paymentStatusKey: string;
  paymentStatusTitleFa: string;
  fulfillmentStatusKey: string;
  fulfillmentStatusTitleFa: string;
  payableAmount: number;
  paidAmount: number;
  itemCount: number;
  createdAt: string;
  expiresAt: string | null;
  paidAt: string | null;
  canRetryPayment: boolean;
  canRequestReturn?: boolean;
  items?: MyOrderItem[];
};

export type MyOrderItem = {
  orderItemId: string;
  productId?: string;
  variantId?: string;
  productTitle: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  originalUnitPrice?: number;
  campaignDiscountAmount?: number;
  couponDiscountShare?: number;
  refundableAmount?: number;
  refundedAmount?: number;
  quantityCancelled?: number;
  quantityReturned?: number;
  cancelReason?: string | null;
  statusKey?: string;
  statusTitleFa?: string;
  promotionTitle?: string | null;
  imageUrl: string | null;
  sku: string | null;
};

export type MyOrderDetail = MyOrderListItem & {
  items: MyOrderItem[];
  currency: string;
  subtotalAmount: number;
  campaignDiscountAmount: number;
  couponDiscountAmount: number;
  manualDiscountAmount: number;
  appliedDiscountAmount: number;
  appliedDiscountSource: string;
  shippingFee: number;
  shippingDiscountAmount: number;
  taxAmount: number;
  refundedAmount: number;
  customerNote: string;
  selectedShippingMethodId: string;
  shippingMethodTitleSnapshot: string;
  shippingAddressSnapshotJson: string;
  estimatedDeliveryDays: number;
  cancelledAt: string | null;
  closedAt: string | null;
  shipments: unknown[];
  discounts: unknown[];
  payments: unknown[];
  notes: unknown[];
  returns: unknown[];
};

export type MyOrdersPage = {
  items: MyOrderListItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type GetMyOrdersParams = {
  pageNumber?: number;
  pageSize?: number;
  statusKey?: string;
  paymentStatusKey?: string;
  fulfillmentStatusKey?: string;
  fromDate?: string;
  toDate?: string;
};

export type RetryPaymentResult = {
  paymentUrl?: string;
  redirectUrl?: string;
  message?: string;
  raw: unknown;
};

export type CreateOrderReturnItem = {
  orderItemId: string;
  quantity: number;
};

export type CreateOrderReturnPayload = {
  reason: string;
  items: CreateOrderReturnItem[];
};

export type CreateOrderReturnResult = {
  returnId?: string;
  message?: string;
  raw: unknown;
};

export type CancelOrderItemPayload = {
  reason: string;
  quantity: number;
};

export type CancelOrderItemResult = {
  message?: string;
  raw: unknown;
};
