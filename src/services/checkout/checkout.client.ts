// src/services/checkout/checkout.client.ts
"use client";

import { apiClient, ApiError } from "@/src/lib/http/api-client";
import type {
  CheckoutApiErrorItem,
  CheckoutCouponDiscount,
  CheckoutCouponPayload,
  CheckoutPaymentMethod,
  CheckoutPaymentProvider,
  CheckoutShippingGroup,
  CheckoutShippingGroupItem,
  CheckoutShippingMethod,
  CheckoutShippingOptionsResult,
  PlaceOrderPayload,
  PlaceOrderResult,
  StartPaymentPayload,
  StartPaymentResult,
} from "@/src/lib/types/checkout/checkout.types";
import {
  addCartItem,
  getCart,
  updateCartItem,
} from "@/src/services/cart/cart.client";
import type { CartItem } from "@/src/lib/types/cart/cartTypes";

const BASE = "/Checkout";

// getRecord یک تابع است که یک آرگومان unknown را دریافت می کند و یک آبجکت Record<string, unknown> را برمی گرداند.
function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

// unwrapDataArray یک تابع است که یک آرگومان unknown را دریافت می کند و یک آرایه unknown[] را برمی گرداند.
function unwrapDataArray(payload: unknown): unknown[] {
  const root = getRecord(payload);
  if (Array.isArray(root.data)) return root.data;
  if (Array.isArray(payload)) return payload;
  return [];
}

// unwrapDataObject یک تابع است که یک آرگومان unknown را دریافت می کند و یک آبجکت Record<string, unknown> را برمی گرداند.
function unwrapDataObject(payload: unknown): Record<string, unknown> {
  const root = getRecord(payload);
  const data = root.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return root;
}

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : undefined;
}

function mapApiErrors(value: unknown): CheckoutApiErrorItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((error) => {
      const item = getRecord(error);
      return {
        field: typeof item.field === "string" ? item.field : undefined,
        message: typeof item.message === "string" ? item.message : undefined,
        code: typeof item.code === "string" ? item.code : undefined,
      };
    })
    .filter((item) => item.field || item.message || item.code);
}

// assertSuccess یک تابع است که یک آرگومان unknown و یک آرگومان string را دریافت می کند و یک آبجکت Record<string, unknown> را برمی گرداند.
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

// mapPaymentProvider یک تابع است که یک آرگومان unknown را دریافت می کند و یک آبجکت CheckoutPaymentProvider را برمی گرداند.
function mapPaymentProvider(value: unknown): CheckoutPaymentProvider | null {
  const item = getRecord(value);
  const code = String(
    item.code ?? item.providerCode ?? item.bankCode ?? item.id ?? "",
  ).trim();
  if (!code) return null;
  const imageUrl =
    toOptionalString(item.imageUrl) ??
    toOptionalString(item.logoUrl) ??
    toOptionalString(item.logo) ??
    null;

  return {
    code,
    title: String(
      item.titleFa ?? item.title ?? item.name ?? item.bankName ?? code,
    ),
    description:
      toOptionalString(item.descriptionFa) ?? toOptionalString(item.description),
    isAvailable: item.isAvailable !== false,
    isDefault: Boolean(item.isDefault),
    gatewayType: toOptionalString(item.gatewayType),
    minAmount: item.minAmount === undefined ? undefined : toNumber(item.minAmount),
    maxAmount: item.maxAmount === undefined ? undefined : toNumber(item.maxAmount),
    imageUrl,
    logoUrl: imageUrl,
  };
}

// extractProviders یک تابع است که یک آرگومان Record<string, unknown> را دریافت می کند و یک آرایه unknown[] را برمی گرداند.
function extractProviders(item: Record<string, unknown>): unknown[] {
  const candidates = [
    item.providers,
    item.banks,
    item.gateways,
    item.paymentProviders,
    item.gatewayProviders,
    item.bankProviders,
    item.availableProviders,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

// mapPaymentMethod یک تابع است که یک آرگومان unknown را دریافت می کند و یک آبجکت CheckoutPaymentMethod را برمی گرداند.
function mapPaymentMethod(value: unknown): CheckoutPaymentMethod | null {
  const item = getRecord(value);
  const code = String(item.code ?? "").trim();
  if (!code) return null;

  const providers = extractProviders(item)
    .map(mapPaymentProvider)
    .filter((provider): provider is CheckoutPaymentProvider => Boolean(provider));
  const defaultProvider =
    providers.find((provider) => provider.isDefault && provider.isAvailable) ??
    providers.find((provider) => provider.isAvailable) ??
    providers[0];
  const imageUrl =
    toOptionalString(item.imageUrl) ??
    toOptionalString(item.logoUrl) ??
    defaultProvider?.imageUrl ??
    null;

  return {
    code,
    title: String(item.title ?? item.name ?? code),
    description: String(item.description ?? ""),
    isAvailable: item.isAvailable !== false,
    imageUrl,
    providers,
  };
}

// mapShippingMethod یک تابع است که یک آرگومان unknown را دریافت می کند و یک آبجکت CheckoutShippingMethod را برمی گرداند.
function mapShippingMethod(
  value: unknown,
  context?: {
    shippingClassId?: string;
    shippingClassTitle?: string;
  },
): CheckoutShippingMethod | null {
  const item = getRecord(value);
  const shippingClass = getRecord(item.shippingClass);
  const shippingClassId = String(
    item.shippingClassId ??
      item.classId ??
      item.productShippingClassId ??
      shippingClass.id ??
      shippingClass.shippingClassId ??
      context?.shippingClassId ??
      "",
  ).trim();
  const shippingMethodId = String(
    item.shippingMethodId ?? item.methodId ?? item.id ?? item.code ?? "",
  ).trim();
  if (!shippingMethodId) return null;

  return {
    id: shippingClassId
      ? `${shippingClassId}:${shippingMethodId}`
      : shippingMethodId,
    shippingMethodId,
    shippingClassId: shippingClassId || undefined,
    shippingClassTitle:
      String(
        item.shippingClassTitle ??
          item.shippingClassName ??
          item.classTitle ??
          item.className ??
          shippingClass.title ??
          shippingClass.name ??
          context?.shippingClassTitle ??
          "",
      ).trim() || undefined,
    title: String(item.methodName ?? item.name ?? item.title ?? "روش ارسال"),
    description: String(item.description ?? item.methodType ?? ""),
    price: Number(item.price ?? item.cost ?? item.shippingCost ?? 0) || 0,
    formattedPrice:
      typeof item.formattedCost === "string" ? item.formattedCost : undefined,
    methodType:
      typeof item.methodType === "string" ? item.methodType : undefined,
    estimatedDeliveryDays:
      typeof item.estimatedDeliveryDays === "number"
        ? item.estimatedDeliveryDays
        : undefined,
    cashOnDelivery:
      typeof item.cashOnDelivery === "boolean"
        ? item.cashOnDelivery
        : undefined,
    isShippingPayAtDelivery:
      typeof item.isShippingPayAtDelivery === "boolean"
        ? item.isShippingPayAtDelivery
        : undefined,
    isAvailable: item.isAvailable !== false,
  };
}

function mapShippingGroupItem(value: unknown): CheckoutShippingGroupItem | null {
  const item = getRecord(value);
  const productId = String(item.productId ?? item.id ?? "").trim();
  const productName = String(item.productName ?? item.name ?? item.title ?? "");
  if (!productId && !productName) return null;

  return {
    productId,
    productName,
    quantity: Math.max(0, toNumber(item.quantity)),
  };
}

function mapShippingGroup(value: unknown): CheckoutShippingGroup | null {
  const group = getRecord(value);
  const shippingClassId = String(group.shippingClassId ?? group.id ?? "").trim();
  if (!shippingClassId) return null;

  const shippingClassName = String(
    group.shippingClassName ?? group.name ?? group.title ?? "",
  );

  const items = Array.isArray(group.items)
    ? group.items
        .map(mapShippingGroupItem)
        .filter((item): item is CheckoutShippingGroupItem => Boolean(item))
    : [];

  const options = Array.isArray(group.options)
    ? group.options
        .map((option) =>
          mapShippingMethod(option, {
            shippingClassId,
            shippingClassTitle: shippingClassName,
          }),
        )
        .filter((item): item is CheckoutShippingMethod => Boolean(item))
    : [];

  return {
    shippingClassId,
    shippingClassName,
    totalWeightGrams: toNumber(group.totalWeightGrams),
    itemCount: toNumber(group.itemCount),
    items,
    options,
  };
}

function mapShippingOptionsResult(raw: unknown): CheckoutShippingOptionsResult {
  const data = unwrapDataObject(raw);
  const groups = Array.isArray(data.groups)
    ? data.groups
        .map(mapShippingGroup)
        .filter((group): group is CheckoutShippingGroup => Boolean(group))
    : [];

  return {
    groups,
    cheapestTotalCost: toNumber(data.cheapestTotalCost),
    formattedCheapestTotalCost: String(data.formattedCheapestTotalCost ?? ""),
    raw,
  };
}

function mapCouponDiscount(
  payload: unknown,
  raw: unknown,
): CheckoutCouponDiscount {
  const data = getRecord(payload);

  return {
    couponCode: String(data.couponCode ?? ""),
    couponIsApplicable: Boolean(data.couponIsApplicable),
    couponMessage: String(data.couponMessage ?? ""),
    couponItemsDiscount: toNumber(data.couponItemsDiscount),
    couponShippingDiscount: toNumber(data.couponShippingDiscount),
    couponTotalDiscount: toNumber(data.couponTotalDiscount),
    campaignDiscount: toNumber(data.campaignDiscount),
    appliedSource: String(data.appliedSource ?? ""),
    appliedAmount: toNumber(data.appliedAmount),
    rejectedSource: String(data.rejectedSource ?? ""),
    rejectedAmount: toNumber(data.rejectedAmount),
    decisionReason: String(data.decisionReason ?? ""),
    itemsSubtotal: toNumber(data.itemsSubtotal),
    shippingFee: toNumber(data.shippingFee),
    discount: toNumber(data.discount),
    payableAmount: toNumber(data.payableAmount),
    raw,
  };
}

// getCheckoutPaymentMethods یک تابع است که یک آبجکت Promise<CheckoutPaymentMethod[]> را برمی گرداند.
export async function getCheckoutPaymentMethods(): Promise<
  CheckoutPaymentMethod[]
> {
  const response = await apiClient.get(`${BASE}/payment-methods`);

  // Debug: ساختار خام پاسخ برای انتخاب بانک مقصد / provider


  assertSuccess(response.data, "دریافت روش‌های پرداخت ناموفق بود");

  const mapped = unwrapDataArray(response.data)
    .map(mapPaymentMethod)
    .filter((item): item is CheckoutPaymentMethod => Boolean(item));


  return mapped;
}

// getCheckoutShippingMethods یک تابع است که یک آبجکت Promise<CheckoutShippingMethod[]> را برمی گرداند.
export async function getCheckoutShippingMethods(): Promise<
  CheckoutShippingMethod[]
> {
  const response = await apiClient.get("/shipping/methods");

  assertSuccess(response.data, "دریافت روش‌های ارسال ناموفق بود");

  const mapped = unwrapDataArray(response.data)
    .map((item) => mapShippingMethod(item))
    .filter((item): item is CheckoutShippingMethod => Boolean(item));

  return mapped;
}

// Returns shipping option groups for the selected delivery address.
export async function getCheckoutShippingOptions(payload: {
  shippingAddress: PlaceOrderPayload["shippingAddress"];
}): Promise<CheckoutShippingOptionsResult> {
  const response = await apiClient.post("/shipping/options", payload);

  assertSuccess(response.data, "دریافت گزینه‌های ارسال ناموفق بود");

  return mapShippingOptionsResult(response.data);
}

function buildCouponPayload(payload: CheckoutCouponPayload): CheckoutCouponPayload {
  return {
    couponCode: payload.couponCode.trim(),
    shippingMethodId: payload.shippingMethodId,
    shippingAddress: payload.shippingAddress,
  };
}

export async function applyCheckoutCoupon(
  payload: CheckoutCouponPayload,
): Promise<CheckoutCouponDiscount> {
  const body = buildCouponPayload(payload);

  const response = await apiClient.post(`${BASE}/apply-coupon`, body);
  assertSuccess(response.data, "اعمال کد تخفیف ناموفق بود");

  return mapCouponDiscount(unwrapDataObject(response.data), response.data);
}

export async function previewCheckoutDiscount(
  payload: CheckoutCouponPayload,
): Promise<CheckoutCouponDiscount> {
  const body = buildCouponPayload(payload);

  const response = await apiClient.post(`${BASE}/preview-discount`, body);
  assertSuccess(response.data, "محاسبه تخفیف ناموفق بود");

  return mapCouponDiscount(unwrapDataObject(response.data), response.data);
}

// placeCheckoutOrder یک تابع است که یک آبجکت PlaceOrderPayload را دریافت می کند و یک آبجکت PlaceOrderResult را برمی گرداند.
export async function placeCheckoutOrder(
  payload: PlaceOrderPayload,
): Promise<PlaceOrderResult> {
  const body: PlaceOrderPayload = {
    shippingMethodId: payload.shippingMethodId,
    shippingSelections: payload.shippingSelections,
    shippingAddress: payload.shippingAddress,
    paymentMethodCode: payload.paymentMethodCode,
  };

  if (payload.providerCode?.trim()) {
    body.providerCode = payload.providerCode.trim();
  }
  if (payload.couponCode?.trim()) {
    body.couponCode = payload.couponCode.trim();
  }
  if (payload.customerNote?.trim()) {
    body.customerNote = payload.customerNote.trim();
  }
  if (payload.giftCardCode?.trim()) {
    body.giftCardCode = payload.giftCardCode.trim();
  }


  const response = await apiClient.post(`${BASE}/place-order`, body);
  assertSuccess(response.data, "ثبت سفارش ناموفق بود");

  const data = unwrapDataObject(response.data);
  const root = getRecord(response.data);

  const paymentUrl =
    (typeof data.paymentUrl === "string" && data.paymentUrl) ||
    (typeof data.redirectUrl === "string" && data.redirectUrl) ||
    (typeof data.gatewayUrl === "string" && data.gatewayUrl) ||
    undefined;

  return {
    success:
      typeof root.success === "boolean"
        ? root.success
        : typeof root.isSuccess === "boolean"
          ? root.isSuccess
          : undefined,
    code: typeof root.code === "string" ? root.code : undefined,
    errors: mapApiErrors(root.errors),
    timestamp:
      typeof root.timestamp === "string" ? root.timestamp : undefined,
    traceId: typeof root.traceId === "string" ? root.traceId : undefined,
    orderId:
      typeof data.orderId === "string"
        ? data.orderId
        : typeof data.id === "string"
          ? data.id
          : undefined,
    orderNumber:
      typeof data.orderNumber === "string"
        ? data.orderNumber
        : typeof data.publicOrderNumber === "string"
          ? data.publicOrderNumber
          : undefined,
    paymentId:
      typeof data.paymentId === "string" ? data.paymentId : undefined,
    paymentUrl,
    redirectUrl: paymentUrl,
    message:
      typeof root.message === "string"
        ? root.message
        : typeof data.message === "string"
          ? data.message
          : undefined,
    raw: response.data,
  };
}

/**
 * place-order از سبد سرور سفارش می‌سازد؛ اگر UI پر باشد ولی سبد API خالی باشد، آیتم‌ها را sync می‌کند.
 */
export async function ensureServerCartHasItems(
  localItems: CartItem[],
): Promise<number> {
  let cart = await getCart();


  if (cart.items.length > 0) {
    return cart.items.length;
  }

  if (localItems.length === 0) {
    return 0;
  }


  for (const item of localItems) {
    const variantId = String(item.variantId ?? item.id ?? "").trim();
    if (!variantId) continue;
    const quantity = Math.max(1, Number(item.quantity) || 1);

    try {
      cart = await addCartItem({ variantId, quantity });
    } catch (error) {
      console.warn("[Checkout] addCartItem failed, trying update =>", variantId, error);
      try {
        cart = await updateCartItem(variantId, { quantity });
      } catch (updateError) {
        console.error("[Checkout] updateCartItem failed =>", variantId, updateError);
      }
    }
  }

  cart = await getCart();

  

  return cart.items.length;
}

// startOrderPayment یک تابع است که یک آبجکت StartPaymentPayload را دریافت می کند و یک آبجکت StartPaymentResult را برمی گرداند.
export async function startOrderPayment(
  payload: StartPaymentPayload,
): Promise<StartPaymentResult> {
  const body: StartPaymentPayload = {
    orderId: payload.orderId,
  };
  if (payload.providerCode?.trim()) {
    body.providerCode = payload.providerCode.trim();
  }


  const response = await apiClient.post("/Payments/start", body);
  assertSuccess(response.data, "شروع پرداخت ناموفق بود");

  const data = unwrapDataObject(response.data);
  const root = getRecord(response.data);

  const redirectUrl =
    (typeof data.redirectUrl === "string" && data.redirectUrl) ||
    (typeof data.paymentUrl === "string" && data.paymentUrl) ||
    (typeof data.gatewayUrl === "string" && data.gatewayUrl) ||
    undefined;

  return {
    orderId: typeof data.orderId === "string" ? data.orderId : undefined,
    orderNumber:
      typeof data.publicOrderNumber === "string"
        ? data.publicOrderNumber
        : typeof data.orderNumber === "string"
          ? data.orderNumber
          : undefined,
    paymentAttemptId:
      typeof data.paymentAttemptId === "string"
        ? data.paymentAttemptId
        : undefined,
    redirectUrl,
    expiresAt: data.expiresAt ? String(data.expiresAt) : null,
    message: typeof root.message === "string" ? root.message : undefined,
    raw: response.data,
  };
}
