// src/services/orders/orders.client.ts
"use client";

import { apiClient, ApiError } from "@/src/lib/http/api-client";
import type {
  CancelOrderItemPayload,
  CancelOrderItemResult,
  CreateOrderReturnResult,
  GetMyOrdersParams,
  MyOrderDetail,
  MyOrderDiscount,
  MyOrderItem,
  MyOrderListItem,
  MyOrderNote,
  MyOrderPayment,
  MyOrderPaymentAttempt,
  MyOrderReturn,
  MyOrderReturnItem,
  MyOrderReturnRefund,
  MyOrderShipment,
  MyOrderShipmentItem,
  MyOrdersPage,
  RetryPaymentResult,
  ShippingAddressSnapshot,
} from "@/src/lib/types/orders/order.types";
import { getProductImage } from "@/src/utils/product-image";

const BASE = "/me/orders";
const FRONT_API_BASE = "/api/v1/me/orders";

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number")
    return Number.isFinite(value) ? value : fallback;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function toString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function toNullableString(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

function toJsonString(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";

  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function toShippingAddressSnapshot(
  value: unknown,
): ShippingAddressSnapshot | null {
  let source = value;

  if (typeof source === "string") {
    try {
      source = JSON.parse(source) as unknown;
    } catch {
      return null;
    }
  }

  if (!source || typeof source !== "object") return null;

  return source as ShippingAddressSnapshot;
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

function getHeaderValue(
  headers: unknown,
  key: string,
): string | undefined {
  if (!headers || typeof headers !== "object") return undefined;

  const record = headers as Record<string, unknown>;
  const direct = record[key] ?? record[key.toLowerCase()];
  if (typeof direct === "string") return direct;

  const getter = (headers as { get?: (name: string) => unknown }).get;
  if (typeof getter === "function") {
    const value = getter.call(headers, key);
    return typeof value === "string" ? value : undefined;
  }

  return undefined;
}

function getInvoiceFileName(contentDisposition?: string): string {
  if (!contentDisposition) return "invoice.pdf";

  const utfMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) {
    try {
      return decodeURIComponent(utfMatch[1].replace(/["']/g, ""));
    } catch {
      return utfMatch[1].replace(/["']/g, "");
    }
  }

  const plainMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  return plainMatch?.[1]?.trim() || "invoice.pdf";
}

function mapOrderListItem(value: unknown): MyOrderListItem {
  const item = getRecord(value);
  const itemsRaw = Array.isArray(item.items)
    ? item.items
    : Array.isArray(item.orderItems)
      ? item.orderItems
      : Array.isArray(item.lines)
        ? item.lines
        : [];
  const items = itemsRaw
    .map(mapOrderItem)
    .filter((orderItem): orderItem is MyOrderItem => Boolean(orderItem));

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
    payableAmount: toNumber(item.payableAmount),
    paidAmount: toNumber(item.paidAmount),
    itemCount: toNumber(item.itemCount),
    createdAt: String(item.createdAt ?? ""),
    expiresAt: toNullableString(item.expiresAt),
    paidAt: toNullableString(item.paidAt),
    canRetryPayment: Boolean(item.canRetryPayment),
    canRequestReturn:
      item.canRequestReturn === undefined || item.canRequestReturn === null
        ? undefined
        : Boolean(item.canRequestReturn),
    items,
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
    orders: items,
    pageNumber: toNumber(data.pageNumber ?? root.pageNumber, 1),
    pageSize: toNumber(data.pageSize ?? root.pageSize, items.length || 10),
    totalCount: toNumber(data.totalCount ?? root.totalCount, items.length),
    totalPages: toNumber(data.totalPages ?? root.totalPages, 1),
    hasPreviousPage: Boolean(data.hasPreviousPage ?? root.hasPreviousPage),
    hasNextPage: Boolean(data.hasNextPage ?? root.hasNextPage),
  };
}

function pickImagePath(item: Record<string, unknown>): string | null {
  const nestedImage = getRecord(
    item.image ?? item.productImage ?? item.thumbnail,
  );
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
  const product = getRecord(item.product);
  const variant = getRecord(item.variant);
  const orderItemId = String(
    item.orderItemId ?? item.id ?? item.itemId ?? "",
  ).trim();
  if (!orderItemId) return null;

  const quantity = Math.max(1, toNumber(item.quantity ?? item.qty, 1));
  const unitPrice = toNumber(
    item.unitPrice ?? item.price ?? item.unitAmount ?? item.originalUnitPrice,
  );
  const finalLineAmount = toNumber(
    item.finalLineAmount ?? item.lineTotal ?? item.totalPrice ?? item.total,
    unitPrice * quantity,
  );
  const imagePath = pickImagePath(item);
  const productTitle = String(
    item.productTitle ?? item.productName ?? item.name ?? item.title ?? "محصول",
  );
  const variantTitle = String(
    item.variantTitle ?? item.variantName ?? item.skuName ?? "",
  );
  const publicCode =
    toString(item.publicCode) ||
    toString(item.productPublicCode) ||
    toString(item.productCode) ||
    toString(item.code) ||
    toString(product.publicCode) ||
    toString(product.productCode) ||
    toString(product.code) ||
    "";
  const slug =
    toString(item.slug) ||
    toString(item.productSlug) ||
    toString(product.slug) ||
    toString(product.productSlug) ||
    "";

  return {
    orderItemId,
    id: orderItemId,
    productId: toString(item.productId) || toString(product.productId) || undefined,
    productCode: publicCode || null,
    productSlug: slug || null,
    publicCode,
    slug,
    variantId: toString(item.variantId) || toString(variant.variantId) || undefined,
    productTitle,
    productName: productTitle,
    variantTitle,
    variantName: variantTitle,
    quantity,
    unitPrice,
    lineTotal: finalLineAmount,
    finalLineAmount,
    originalUnitPrice: toNumber(item.originalUnitPrice, unitPrice),
    campaignDiscountAmount: toNumber(item.campaignDiscountAmount),
    couponDiscountShare: toNumber(item.couponDiscountShare),
    refundableAmount: toNumber(item.refundableAmount),
    refundedAmount: toNumber(item.refundedAmount),
    quantityCancelled: toNumber(item.quantityCancelled),
    quantityReturned: toNumber(item.quantityReturned),
    cancelReason: toNullableString(item.cancelReason),
    statusKey: toString(item.statusKey) || undefined,
    statusTitleFa: toString(item.statusTitleFa) || undefined,
    promotionTitle: toNullableString(item.promotionTitle),
    canRequestReturn: Boolean(item.canRequestReturn),
    imageUrl: imagePath ? getProductImage(imagePath) : getProductImage(null),
    sku: toString(item.sku) || toString(item.productCode) || null,
  };
}

function mapShipmentItem(value: unknown): MyOrderShipmentItem | null {
  const item = getRecord(value);
  const orderItemId = String(item.orderItemId ?? "").trim();
  if (!orderItemId) return null;

  return {
    orderItemId,
    quantity: toNumber(item.quantity),
  };
}

function mapShipment(value: unknown): MyOrderShipment {
  const item = getRecord(value);
  const itemsRaw = Array.isArray(item.items) ? item.items : [];

  return {
    id: String(item.id ?? ""),
    shipmentNumber: String(item.shipmentNumber ?? ""),
    statusKey: String(item.statusKey ?? ""),
    statusTitleFa: String(item.statusTitleFa ?? ""),
    trackingCode: String(item.trackingCode ?? ""),
    courierName: String(item.courierName ?? ""),
    shippingMethodTitle: String(item.shippingMethodTitle ?? ""),
    shipmentFee: toNumber(item.shipmentFee),
    receiverName: String(item.receiverName ?? ""),
    receiverPhone: String(item.receiverPhone ?? ""),
    addressSnapshotJson: String(item.addressSnapshotJson ?? ""),
    estimatedDeliveryAt: toNullableString(item.estimatedDeliveryAt),
    shippedAt: toNullableString(item.shippedAt),
    deliveredAt: toNullableString(item.deliveredAt),
    items: itemsRaw
      .map(mapShipmentItem)
      .filter((shipmentItem): shipmentItem is MyOrderShipmentItem =>
        Boolean(shipmentItem),
      ),
  };
}

function mapDiscount(value: unknown): MyOrderDiscount {
  const item = getRecord(value);

  return {
    discountSource: String(item.discountSource ?? ""),
    sourceLabel: String(item.sourceLabel ?? ""),
    discountAmount: toNumber(item.discountAmount),
    isApplied: Boolean(item.isApplied),
    rejectionReason: toNullableString(item.rejectionReason),
    decidedAt: toNullableString(item.decidedAt),
  };
}

function mapPaymentAttempt(value: unknown): MyOrderPaymentAttempt {
  const item = getRecord(value);

  return {
    id: String(item.id ?? ""),
    amount: toNumber(item.amount),
    statusKey: String(item.statusKey ?? ""),
    statusTitleFa: String(item.statusTitleFa ?? ""),
    refIdMasked: String(item.refIdMasked ?? ""),
    failureReasonFa: toNullableString(item.failureReasonFa),
    createdAt: toNullableString(item.createdAt),
    settledAt: toNullableString(item.settledAt),
    failedAt: toNullableString(item.failedAt),
  };
}

function mapPayment(value: unknown): MyOrderPayment {
  const item = getRecord(value);
  const attemptsRaw = Array.isArray(item.attempts) ? item.attempts : [];

  return {
    id: String(item.id ?? ""),
    method: String(item.method ?? ""),
    methodTitleFa: String(item.methodTitleFa ?? ""),
    amount: toNumber(item.amount),
    statusKey: String(item.statusKey ?? ""),
    statusTitleFa: String(item.statusTitleFa ?? ""),
    providerCode: String(item.providerCode ?? ""),
    attempts: attemptsRaw.map(mapPaymentAttempt),
  };
}

function mapNote(value: unknown): MyOrderNote {
  const item = getRecord(value);

  return {
    content: String(item.content ?? ""),
    authorType: String(item.authorType ?? ""),
    createdAt: toNullableString(item.createdAt),
  };
}

function mapReturnItem(value: unknown): MyOrderReturnItem {
  const item = getRecord(value);

  return {
    id: String(item.id ?? ""),
    orderItemId: String(item.orderItemId ?? ""),
    quantity: toNumber(item.quantity),
    refundAmount: toNumber(item.refundAmount),
    statusKey: String(item.statusKey ?? ""),
    statusTitleFa: String(item.statusTitleFa ?? ""),
  };
}

function mapReturnRefund(value: unknown): MyOrderReturnRefund | null {
  const item = getRecord(value);
  if (!Object.keys(item).length) return null;

  return {
    id: String(item.id ?? ""),
    amount: toNumber(item.amount),
    statusKey: String(item.statusKey ?? ""),
    statusTitleFa: String(item.statusTitleFa ?? ""),
    createdAt: toNullableString(item.createdAt),
    paidAt: toNullableString(item.paidAt),
  };
}

function mapReturn(value: unknown): MyOrderReturn {
  const item = getRecord(value);
  const itemsRaw = Array.isArray(item.items) ? item.items : [];

  return {
    id: String(item.id ?? ""),
    statusKey: String(item.statusKey ?? ""),
    statusTitleFa: String(item.statusTitleFa ?? ""),
    reason: toNullableString(item.reason),
    adminNote: toNullableString(item.adminNote),
    totalRefundAmount: toNumber(item.totalRefundAmount),
    createdAt: toNullableString(item.createdAt),
    decidedAt: toNullableString(item.decidedAt),
    completedAt: toNullableString(item.completedAt),
    items: itemsRaw.map(mapReturnItem),
    refund: mapReturnRefund(item.refund),
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
    subtotalAmount: toNumber(data.subtotalAmount),
    campaignDiscountAmount: toNumber(data.campaignDiscountAmount),
    couponDiscountAmount: toNumber(data.couponDiscountAmount),
    manualDiscountAmount: toNumber(data.manualDiscountAmount),
    appliedDiscountAmount: toNumber(data.appliedDiscountAmount),
    appliedDiscountSource: String(data.appliedDiscountSource ?? ""),
    shippingFee: toNumber(data.shippingFee),
    shippingDiscountAmount: toNumber(data.shippingDiscountAmount),
    taxAmount: toNumber(data.taxAmount),
    refundedAmount: toNumber(data.refundedAmount),
    customerNote: String(data.customerNote ?? ""),
    selectedShippingMethodId: String(data.selectedShippingMethodId ?? ""),
    shippingMethodTitleSnapshot: String(data.shippingMethodTitleSnapshot ?? ""),
    shippingAddressSnapshotJson: toJsonString(
      data.shippingAddressSnapshotJson ?? data.shippingAddressSnapshot,
    ),
    shippingAddressSnapshot: toShippingAddressSnapshot(
      data.shippingAddressSnapshot ?? data.shippingAddressSnapshotJson,
    ),
    estimatedDeliveryDays: toNumber(data.estimatedDeliveryDays),
    cancelledAt: toNullableString(data.cancelledAt),
    closedAt: toNullableString(data.closedAt),
    canRequestReturn: Boolean(data.canRequestReturn),
    shipments: Array.isArray(data.shipments)
      ? data.shipments.map(mapShipment)
      : [],
    discounts: Array.isArray(data.discounts)
      ? data.discounts.map(mapDiscount)
      : [],
    payments: Array.isArray(data.payments) ? data.payments.map(mapPayment) : [],
    notes: Array.isArray(data.notes) ? data.notes.map(mapNote) : [],
    returns: Array.isArray(data.returns) ? data.returns.map(mapReturn) : [],
  };
}

function cleanParams(
  params: GetMyOrdersParams,
): Record<string, string | number> {
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

  const response = await apiClient.get(BASE, { params: query });

  assertSuccess(response.data, "دریافت سفارش‌ها ناموفق بود");
  return unwrapOrdersPage(response.data);
}

export async function getMyOrderByNumber(
  publicOrderNumber: string,
): Promise<MyOrderDetail> {
  const encoded = encodeURIComponent(publicOrderNumber.trim());

  const response = await apiClient.get(`${BASE}/by-number/${encoded}`);

  console.log(response)

  assertSuccess(response.data, "سفارش با این شماره پیدا نشد");
  return unwrapOrderDetail(response.data);
}

export async function getMyOrderById(orderId: string): Promise<MyOrderDetail> {
  const encoded = encodeURIComponent(orderId.trim());

  const response = await apiClient.get(`${BASE}/${encoded}`);

    

  assertSuccess(response.data, "دریافت جزئیات سفارش ناموفق بود");
  return unwrapOrderDetail(response.data);
}

export async function retryMyOrderPayment(
  orderId: string,
): Promise<RetryPaymentResult> {
  const encoded = encodeURIComponent(orderId.trim());

  const response = await apiClient.post(`${BASE}/${encoded}/retry-payment`);

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

export async function downloadMyOrderInvoice(
  orderId: string,
): Promise<{ blob: Blob; fileName: string }> {
  const encoded = encodeURIComponent(orderId.trim());

  const response = await apiClient.get(`${FRONT_API_BASE}/${encoded}/invoice`, {
    responseType: "blob",
    headers: {
      Accept: "application/pdf,application/octet-stream,*/*",
    },
  });

  const contentDisposition = getHeaderValue(
    response.headers,
    "content-disposition",
  );

  return {
    blob: response.data as Blob,
    fileName: getInvoiceFileName(contentDisposition),
  };
}

export async function createMyOrderReturn(
  orderId: string,
  payload: FormData,
): Promise<CreateOrderReturnResult> {
  const encoded = encodeURIComponent(orderId.trim());

  const response = await apiClient.post(
    `${BASE}/${encoded}/returns`,
    payload,
  );

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

  const response = await apiClient.post(
    `${BASE}/${encodedOrderId}/items/${encodedOrderItemId}/cancel`,
    payload,
  );

  assertSuccess(response.data, "لغو آیتم سفارش ناموفق بود");

  const root = getRecord(response.data);
  return {
    message: typeof root.message === "string" ? root.message : undefined,
    raw: response.data,
  };
}
