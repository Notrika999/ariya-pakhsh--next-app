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
  id?: string;
  productId?: string;
  variantId?: string;
  productTitle: string;
  productName?: string;
  variantTitle?: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  finalLineAmount?: number;
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
  canRequestReturn?: boolean;
  imageUrl: string | null;
  sku: string | null;
};

export type MyOrderShipmentItem = {
  orderItemId: string;
  quantity: number;
};

export type MyOrderShipment = {
  id: string;
  shipmentNumber: string;
  statusKey: string;
  statusTitleFa: string;
  trackingCode: string;
  courierName: string;
  shippingMethodTitle: string;
  shipmentFee: number;
  receiverName: string;
  receiverPhone: string;
  addressSnapshotJson: string;
  estimatedDeliveryAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  items: MyOrderShipmentItem[];
};

export type MyOrderDiscount = {
  discountSource: string;
  sourceLabel: string;
  discountAmount: number;
  isApplied: boolean;
  rejectionReason: string | null;
  decidedAt: string | null;
};

export type MyOrderPaymentAttempt = {
  id: string;
  amount: number;
  statusKey: string;
  statusTitleFa: string;
  refIdMasked: string;
  failureReasonFa: string | null;
  createdAt: string | null;
  settledAt: string | null;
  failedAt: string | null;
};

export type MyOrderPayment = {
  id: string;
  method: string;
  methodTitleFa: string;
  amount: number;
  statusKey: string;
  statusTitleFa: string;
  providerCode: string;
  attempts: MyOrderPaymentAttempt[];
};

export type MyOrderNote = {
  content: string;
  authorType: string;
  createdAt: string | null;
};

export type MyOrderReturnItem = {
  id: string;
  orderItemId: string;
  quantity: number;
  refundAmount: number;
  statusKey: string;
  statusTitleFa: string;
};

export type MyOrderReturnRefund = {
  id: string;
  amount: number;
  statusKey: string;
  statusTitleFa: string;
  createdAt: string | null;
  paidAt: string | null;
};

export type MyOrderReturn = {
  id: string;
  statusKey: string;
  statusTitleFa: string;
  reason: string | null;
  adminNote: string | null;
  totalRefundAmount: number;
  createdAt: string | null;
  decidedAt: string | null;
  completedAt: string | null;
  items: MyOrderReturnItem[];
  refund: MyOrderReturnRefund | null;
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
  shipments: MyOrderShipment[];
  discounts: MyOrderDiscount[];
  payments: MyOrderPayment[];
  notes: MyOrderNote[];
  returns: MyOrderReturn[];
};

export type MyOrdersPage = {
  items: MyOrderListItem[];
  orders?: MyOrderListItem[];
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
  productCondition: string;
};

export type CreateOrderReturnPayload = {
  orderId: string;
  reasonCode: string;
  description?: string;
  refundMethod?: string;
  isPurchaseCardOwnedByCustomer?: boolean;
  items: CreateOrderReturnItem[];
  evidenceFiles?: File[];
  customerNationalIdFiles?: File[];
  cardOwnerNationalIdFiles?: File[];
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
