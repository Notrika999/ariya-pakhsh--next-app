// src/services/orders/orders.client.ts
"use client";

import { apiClient, ApiError } from "@/src/lib/http/api-client";
import type {
  CancelOrderItemPayload,
  CancelOrderItemResult,
  CreateOrderReturnPayload,
  CreateOrderReturnResult,
  GetMyOrdersParams,
  MyOrderDetail,
  MyOrderItem,
  MyOrderListItem,
  MyOrdersPage,
  RetryPaymentResult,
} from "@/src/lib/types/orders/order.types";
import { getProductImage } from "@/src/utils/product-image";

const BASE = "/me/orders";

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function assertSuccess(payload: unknown, fallback: string) {
  const root = getRecord(payload);
  const ok = root.success ?? root.isSuccess;
  if (ok === false) {
    throw new ApiError(
      400,
      typeof root.message === "string" && root.message
        ? root.message
        : fallback,
      typeof root.code === "string" ? root.code : undefined,
      payload,
    );
  }
}

function mapOrderListItem(value: unknown): MyOrderListItem {
  const item = getRecord(value);

  return {
    orderId: String(item.orderId ?? item.id ?? ""),
    publicOrderNumber: String(item.publicOrderNumber ?? item.orderNumber ?? ""),
    statusKey: String(item.statusKey ?? ""),
    statusTitleFa: String(item.statusTitleFa ?? item.statusTitle ?? ""),
    paymentStatusKey: String(item.paymentStatusKey ?? ""),
    paymentStatusTitleFa: String(
      item.paymentStatusTitleFa ?? item.paymentStatusTitle ?? "",
    ),
    fulfillmentStatusKey: String(item.fulfillmentStatusKey ?? ""),
    fulfillmentStatusTitleFa: String(
      item.fulfillmentStatusTitleFa ?? item.fulfillmentStatusTitle ?? "",
    ),
    payableAmount: Number(item.payableAmount ?? 0) || 0,
    paidAmount: Number(item.paidAmount ?? 0) || 0,
    itemCount: Number(item.itemCount ?? 0) || 0,
    createdAt: String(item.createdAt ?? ""),
    expiresAt: item.expiresAt ? String(item.expiresAt) : null,
    paidAt: item.paidAt ? String(item.paidAt) : null,
    canRetryPayment: Boolean(item.canRetryPayment),
    canRequestReturn: Boolean(item.canRequestReturn),
  };
}

function unwrapOrdersPage(payload: unknown): MyOrdersPage {
  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);
  const itemsRaw = Array.isArray(data.items)
    ? data.items
    : Array.isArray(root.items)
      ? root.items
      : [];

  const items = itemsRaw.map(mapOrderListItem).filter((item) => item.orderId);

  return {
    items,
    pageNumber: Number(data.pageNumber ?? root.pageNumber ?? 1),
    pageSize: Number(data.pageSize ?? root.pageSize ?? (items.length || 10)),
    totalCount: Number(data.totalCount ?? root.totalCount ?? items.length),
    totalPages: Number(data.totalPages ?? root.totalPages ?? 1),
    hasPreviousPage: Boolean(data.hasPreviousPage ?? root.hasPreviousPage),
    hasNextPage: Boolean(data.hasNextPage ?? root.hasNextPage),
  };
}

function unwrapOrder(payload: unknown): MyOrderListItem {
  const root = getRecord(payload);
  const data = root.data ?? root;
  return mapOrderListItem(data);
}

function pickImagePath(item: Record<string, unknown>): string | null {
  const nestedImage = getRecord(item.image ?? item.productImage ?? item.thumbnail);
  const candidates = [
    item.imageUrl,
    item.thumbnailUrl,
    item.thumbnailPath,
    item.mediumPath,
    nestedImage.url,
    nestedImage.thumbnailPath,
    nestedImage.mediumPath,
    nestedImage.path,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  const images = Array.isArray(item.images) ? item.images : [];
  for (const image of images) {
    const record = getRecord(image);
    const path =
      (typeof record.thumbnailPath === "string" && record.thumbnailPath) ||
      (typeof record.mediumPath === "string" && record.mediumPath) ||
      (typeof record.url === "string" && record.url) ||
      (typeof record.path === "string" && record.path) ||
      null;
    if (path) return path;
  }

  return null;
}

function mapOrderItem(value: unknown): MyOrderItem | null {
  const item = getRecord(value);
  const orderItemId = String(
    item.orderItemId ?? item.id ?? item.itemId ?? "",
  ).trim();
  if (!orderItemId) return null;

  const quantity = Math.max(1, Number(item.quantity ?? item.qty ?? 1) || 1);
  const unitPrice =
    Number(
      item.unitPrice ??
        item.price ??
        item.unitAmount ??
        item.originalUnitPrice ??
        0,
    ) || 0;
  const lineTotal =
    Number(
      item.finalLineAmount ??
        item.lineTotal ??
        item.totalPrice ??
        item.total ??
        unitPrice * quantity,
    ) ||
    unitPrice * quantity;

  const imagePath = pickImagePath(item);

  return {
    orderItemId,
    productId: typeof item.productId === "string" ? item.productId : undefined,
    variantId: typeof item.variantId === "string" ? item.variantId : undefined,
    productTitle: String(
      item.productTitle ?? item.name ?? item.title ?? "محصول",
    ),
    variantName: String(
      item.variantName ?? item.variantTitle ?? item.skuName ?? "",
    ),
    quantity,
    unitPrice,
    lineTotal,
    originalUnitPrice: Number(item.originalUnitPrice ?? unitPrice) || 0,
    campaignDiscountAmount: Number(item.campaignDiscountAmount ?? 0) || 0,
    couponDiscountShare: Number(item.couponDiscountShare ?? 0) || 0,
    refundableAmount: Number(item.refundableAmount ?? 0) || 0,
    refundedAmount: Number(item.refundedAmount ?? 0) || 0,
    quantityCancelled: Number(item.quantityCancelled ?? 0) || 0,
    quantityReturned: Number(item.quantityReturned ?? 0) || 0,
    cancelReason:
      typeof item.cancelReason === "string" ? item.cancelReason : null,
    statusKey: typeof item.statusKey === "string" ? item.statusKey : undefined,
    statusTitleFa:
      typeof item.statusTitleFa === "string" ? item.statusTitleFa : undefined,
    promotionTitle:
      typeof item.promotionTitle === "string" ? item.promotionTitle : null,
    imageUrl: imagePath ? getProductImage(imagePath) : getProductImage(null),
    sku:
      typeof item.sku === "string"
        ? item.sku
        : typeof item.productCode === "string"
          ? item.productCode
          : null,
  };
}

function unwrapOrderDetail(payload: unknown): MyOrderDetail {
  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);
  const base = mapOrderListItem(data);

  const itemsRaw = Array.isArray(data.items)
    ? data.items
    : Array.isArray(data.orderItems)
      ? data.orderItems
      : Array.isArray(data.lines)
        ? data.lines
        : [];

  const items = itemsRaw
    .map(mapOrderItem)
    .filter((item): item is MyOrderItem => Boolean(item));

  return {
    ...base,
    itemCount: base.itemCount || items.length,
    items,
    currency: String(data.currency ?? ""),
    subtotalAmount: Number(data.subtotalAmount ?? 0) || 0,
    campaignDiscountAmount: Number(data.campaignDiscountAmount ?? 0) || 0,
    couponDiscountAmount: Number(data.couponDiscountAmount ?? 0) || 0,
    manualDiscountAmount: Number(data.manualDiscountAmount ?? 0) || 0,
    appliedDiscountAmount: Number(data.appliedDiscountAmount ?? 0) || 0,
    appliedDiscountSource: String(data.appliedDiscountSource ?? ""),
    shippingFee: Number(data.shippingFee ?? 0) || 0,
    shippingDiscountAmount: Number(data.shippingDiscountAmount ?? 0) || 0,
    taxAmount: Number(data.taxAmount ?? 0) || 0,
    refundedAmount: Number(data.refundedAmount ?? 0) || 0,
    customerNote: String(data.customerNote ?? ""),
    selectedShippingMethodId: String(data.selectedShippingMethodId ?? ""),
    shippingMethodTitleSnapshot: String(data.shippingMethodTitleSnapshot ?? ""),
    shippingAddressSnapshotJson: String(data.shippingAddressSnapshotJson ?? ""),
    estimatedDeliveryDays: Number(data.estimatedDeliveryDays ?? 0) || 0,
    cancelledAt: data.cancelledAt ? String(data.cancelledAt) : null,
    closedAt: data.closedAt ? String(data.closedAt) : null,
    canRequestReturn: Boolean(data.canRequestReturn),
    shipments: Array.isArray(data.shipments) ? data.shipments : [],
    discounts: Array.isArray(data.discounts) ? data.discounts : [],
    payments: Array.isArray(data.payments) ? data.payments : [],
    notes: Array.isArray(data.notes) ? data.notes : [],
    returns: Array.isArray(data.returns) ? data.returns : [],
  };
}

function cleanParams(params: GetMyOrdersParams): Record<string, string | number> {
  const query: Record<string, string | number> = {};

  if (params.pageNumber != null) query.pageNumber = params.pageNumber;
  if (params.pageSize != null) query.pageSize = params.pageSize;
  if (params.statusKey?.trim()) query.statusKey = params.statusKey.trim();
  if (params.paymentStatusKey?.trim()) {
    query.paymentStatusKey = params.paymentStatusKey.trim();
  }
  if (params.fulfillmentStatusKey?.trim()) {
    query.fulfillmentStatusKey = params.fulfillmentStatusKey.trim();
  }
  if (params.fromDate?.trim()) query.fromDate = params.fromDate.trim();
  if (params.toDate?.trim()) query.toDate = params.toDate.trim();

  return query;
}

export async function getMyOrders(
  params: GetMyOrdersParams = {},
): Promise<MyOrdersPage> {
  const query = cleanParams(params);

  console.log("[Orders] GET /me/orders params =>", query);

  const response = await apiClient.get(BASE, { params: query });

  console.log("[Orders] GET /me/orders raw =>", response.data);

  assertSuccess(response.data, "دریافت سفارش‌ها ناموفق بود");
  return unwrapOrdersPage(response.data);
}

export async function getMyOrderByNumber(
  publicOrderNumber: string,
): Promise<MyOrderListItem> {
  const encoded = encodeURIComponent(publicOrderNumber.trim());

  console.log("[Orders] GET /me/orders/by-number =>", encoded);

  const response = await apiClient.get(`${BASE}/by-number/${encoded}`);

  console.log("[Orders] GET by-number raw =>", response.data);

  assertSuccess(response.data, "سفارش با این شماره پیدا نشد");
  return unwrapOrder(response.data);
}

export async function getMyOrderById(orderId: string): Promise<MyOrderDetail> {
  const encoded = encodeURIComponent(orderId.trim());

  console.log("[Orders] GET /me/orders/{orderId} =>", encoded);

  const response = await apiClient.get(`${BASE}/${encoded}`);

  console.log("[Orders] GET order detail raw =>", response.data);

  assertSuccess(response.data, "دریافت جزئیات سفارش ناموفق بود");
  return unwrapOrderDetail(response.data);
}

export async function retryMyOrderPayment(
  orderId: string,
): Promise<RetryPaymentResult> {
  const encoded = encodeURIComponent(orderId.trim());

  console.log("[Orders] POST retry-payment =>", encoded);

  const response = await apiClient.post(`${BASE}/${encoded}/retry-payment`);

  console.log("[Orders] retry-payment raw =>", response.data);

  assertSuccess(response.data, "پرداخت مجدد ناموفق بود");

  const root = getRecord(response.data);
  const data = getRecord(root.data ?? root);

  const paymentUrl =
    (typeof data.paymentUrl === "string" && data.paymentUrl) ||
    (typeof data.redirectUrl === "string" && data.redirectUrl) ||
    (typeof data.gatewayUrl === "string" && data.gatewayUrl) ||
    undefined;

  return {
    paymentUrl,
    redirectUrl: paymentUrl,
    message: typeof root.message === "string" ? root.message : undefined,
    raw: response.data,
  };
}

export async function createMyOrderReturn(
  orderId: string,
  payload: CreateOrderReturnPayload,
): Promise<CreateOrderReturnResult> {
  const encoded = encodeURIComponent(orderId.trim());

  console.log("[Orders] POST /me/orders/{orderId}/returns =>", encoded, payload);

  const response = await apiClient.post(`${BASE}/${encoded}/returns`, payload);

  console.log("[Orders] POST returns raw =>", response.data);

  assertSuccess(response.data, "ثبت درخواست مرجوعی ناموفق بود");

  const root = getRecord(response.data);
  const data = getRecord(root.data ?? root);

  return {
    returnId:
      (typeof data.returnId === "string" && data.returnId) ||
      (typeof data.id === "string" && data.id) ||
      (typeof root.data === "string" ? root.data : undefined),
    message: typeof root.message === "string" ? root.message : undefined,
    raw: response.data,
  };
}

export async function cancelMyOrderItem(
  orderId: string,
  orderItemId: string,
  payload: CancelOrderItemPayload,
): Promise<CancelOrderItemResult> {
  const encodedOrderId = encodeURIComponent(orderId.trim());
  const encodedOrderItemId = encodeURIComponent(orderItemId.trim());

  console.log("[Orders] POST /me/orders/{orderId}/items/{orderItemId}/cancel =>", {
    orderId: encodedOrderId,
    orderItemId: encodedOrderItemId,
    payload,
  });

  const response = await apiClient.post(
    `${BASE}/${encodedOrderId}/items/${encodedOrderItemId}/cancel`,
    payload,
  );

  console.log("[Orders] cancel item raw =>", response.data);

  assertSuccess(response.data, "لغو آیتم سفارش ناموفق بود");

  const root = getRecord(response.data);
  return {
    message: typeof root.message === "string" ? root.message : undefined,
    raw: response.data,
  };
}
