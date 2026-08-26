// src/services/cart/cart.client.ts
"use client";

import { apiClient, ApiError } from "@/src/lib/http/api-client";
import type {
  AddCartItemPayload,
  CartApiEnvelope,
  CartApiItem,
  CartDto,
  MergeCartPayload,
  UpdateCartItemPayload,
} from "@/src/lib/types/cart/cart.api.types";
import type { CartItem } from "@/src/lib/types/cart/cartTypes";
import { getProductImage } from "@/src/utils/product-image";
import { guestSession } from "@/src/utils/guestSession";

const BASE = "/cart";
const CART_SYNC_ENDPOINT = "/api/v1/me/cart/synchronization";
const CART_ACCEPT_CHANGES_ENDPOINT = "/api/v1/me/cart/accept-changes";

/** Header forwarded by BFF to backend for guest carts */
export const GUEST_SESSION_HEADER = "X-Guest-Session-Id";

/** Common merge strategies; backend accepts string. */
export const CART_MERGE_STRATEGY = "Merge";

export type CartSynchronizationIssue = {
  issueType: string;
  severity: string;
  message: string;
  oldValue: string | null;
  newValue: string | null;
};

export type CartSynchronizationItem = {
  productId: string;
  variantId: string;
  productName: string;
  currentPrice: number;
  acceptedUnitPrice: number;
  quantity: number;
  issues: CartSynchronizationIssue[];
};

export type CartSynchronizationData = {
  hasErrors: boolean;
  hasWarnings: boolean;
  items: CartSynchronizationItem[];
};

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

function cartRequestConfig() {
  const sessionId = guestSession.get();
  return {
    headers: {
      [GUEST_SESSION_HEADER]: sessionId,
    },
  };
}

function rememberGuestSession(cart: CartDto | null | undefined) {
  if (cart?.sessionId?.trim()) {
    guestSession.set(cart.sessionId);
  }
}

function mapCartApiItem(value: unknown): CartApiItem | null {
  const item = getRecord(value);
  const variantId = String(item.variantId ?? "").trim();
  if (!variantId) return null;

  const unitPrice = Number(item.unitPrice ?? item.unitPriceSnapshot ?? 0) || 0;
  const campaignRaw = item.campaignPrice ?? item.campaignPriceSnapshot;
  const campaignPrice =
    campaignRaw === null || campaignRaw === undefined
      ? null
      : Number(campaignRaw) || 0;

  return {
    id: String(item.id ?? ""),
    variantId,
    productId: String(item.productId ?? ""),
    productTitle: String(item.productTitle ?? "محصول"),
    variantTitle: String(item.variantTitle ?? ""),
    imageUrl:
      typeof item.imageUrl === "string" && item.imageUrl.trim()
        ? item.imageUrl
        : null,
    quantity: Math.max(1, Number(item.quantity ?? 1) || 1),
    unitPriceSnapshot: unitPrice,
    campaignPriceSnapshot: campaignPrice,
    unitPrice,
    campaignPrice,
    lineTotal:
      Number(item.lineTotal ?? 0) ||
      (campaignPrice != null && campaignPrice > 0
        ? campaignPrice
        : unitPrice) * Math.max(1, Number(item.quantity ?? 1) || 1),
    addedAt: String(item.addedAt ?? ""),
    updatedAt: String(item.updatedAt ?? ""),
  };
}

function unwrapCart(payload: unknown): CartDto {
  const root = getRecord(payload) as CartApiEnvelope<CartDto>;
  const data = getRecord(root.data ?? root);
  const itemsRaw = Array.isArray(data.items) ? data.items : [];

  const items = itemsRaw
    .map(mapCartApiItem)
    .filter((item): item is CartApiItem => Boolean(item));

  return {
    id: String(data.id ?? ""),
    customerId: data.customerId ? String(data.customerId) : null,
    sessionId: data.sessionId ? String(data.sessionId) : null,
    isConverted: Boolean(data.isConverted),
    expiresAt: data.expiresAt ? String(data.expiresAt) : null,
    itemCount: Number(data.itemCount ?? items.length) || items.length,
    totalQuantity:
      Number(data.totalQuantity ?? 0) ||
      items.reduce((sum, item) => sum + item.quantity, 0),
    subtotalAmount: Number(data.subtotalAmount ?? 0) || 0,
    items,
  };
}

function mapCartSynchronizationIssue(value: unknown): CartSynchronizationIssue {
  const issue = getRecord(value);

  return {
    issueType: String(issue.issueType ?? ""),
    severity: String(issue.severity ?? ""),
    message: String(issue.message ?? ""),
    oldValue:
      issue.oldValue === null || issue.oldValue === undefined
        ? null
        : String(issue.oldValue),
    newValue:
      issue.newValue === null || issue.newValue === undefined
        ? null
        : String(issue.newValue),
  };
}

function mapCartSynchronizationItem(value: unknown): CartSynchronizationItem | null {
  const item = getRecord(value);
  const productId = String(item.productId ?? "").trim();
  const variantId = String(item.variantId ?? "").trim();

  if (!productId && !variantId) return null;

  const issues = Array.isArray(item.issues)
    ? item.issues.map(mapCartSynchronizationIssue)
    : [];

  return {
    productId,
    variantId,
    productName: String(item.productName ?? item.title ?? "محصول"),
    currentPrice: Number(item.currentPrice ?? 0) || 0,
    acceptedUnitPrice: Number(item.acceptedUnitPrice ?? 0) || 0,
    quantity: Number(item.quantity ?? 0) || 0,
    issues,
  };
}

function unwrapCartSynchronization(payload: unknown): CartSynchronizationData {
  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);
  const itemsRaw = Array.isArray(data.items) ? data.items : [];
  const items = itemsRaw
    .map(mapCartSynchronizationItem)
    .filter((item): item is CartSynchronizationItem => Boolean(item));

  return {
    hasErrors: Boolean(data.hasErrors),
    hasWarnings: Boolean(data.hasWarnings),
    items,
  };
}

export function mapCartDtoToItems(cart: CartDto): CartItem[] {
  return cart.items.map((item) => {
    const price =
      item.campaignPriceSnapshot != null && item.campaignPriceSnapshot > 0
        ? item.campaignPriceSnapshot
        : item.unitPriceSnapshot;

    const title = item.variantTitle
      ? `${item.productTitle} — ${item.variantTitle}`
      : item.productTitle;

    return {
      id: item.variantId,
      variantId: item.variantId,
      productId: item.productId || undefined,
      title,
      image: getProductImage(item.imageUrl),
      price,
      oldPrice:
        item.campaignPriceSnapshot != null &&
        item.campaignPriceSnapshot > 0 &&
        item.unitPriceSnapshot > item.campaignPriceSnapshot
          ? item.unitPriceSnapshot
          : undefined,
      unitPrice: item.unitPrice ?? item.unitPriceSnapshot,
      campaignPrice: item.campaignPrice ?? item.campaignPriceSnapshot,
      href: item.productId
        ? `/product/${item.productId}`
        : "#",
      quantity: item.quantity,
    };
  });
}

export async function getCart(): Promise<CartDto> {
  
  const response = await apiClient.get(BASE, cartRequestConfig());



  assertSuccess(response.data, "دریافت سبد خرید ناموفق بود");
  const cart = unwrapCart(response.data);
  rememberGuestSession(cart);
  return cart;
}

export async function synchronizeCart(): Promise<CartSynchronizationData> {
  const response = await apiClient.get(
    CART_SYNC_ENDPOINT,
    cartRequestConfig(),
  );

  assertSuccess(response.data, "همگام‌سازی سبد خرید ناموفق بود");
  return unwrapCartSynchronization(response.data);
}

export async function acceptCartChanges(productIds: string[]): Promise<void> {
  const response = await apiClient.post(
    CART_ACCEPT_CHANGES_ENDPOINT,
    {
      productIds: Array.from(
        new Set(productIds.map((id) => id.trim()).filter(Boolean)),
      ),
    },
    cartRequestConfig(),
  );
  assertSuccess(response.data, "ثبت تغییرات سبد خرید ناموفق بود");
}

export async function addCartItem(
  payload: AddCartItemPayload,
): Promise<CartDto> {
  const response = await apiClient.post(
    `${BASE}/items`,
    payload,
    cartRequestConfig(),
  );
  assertSuccess(response.data, "افزودن به سبد ناموفق بود");
  const cart = unwrapCart(response.data);
  rememberGuestSession(cart);
  return cart;
}

export async function updateCartItem(
  variantId: string,
  payload: UpdateCartItemPayload,
): Promise<CartDto> {
  const encoded = encodeURIComponent(variantId.trim());
  const response = await apiClient.put(
    `${BASE}/items/${encoded}`,
    payload,
    cartRequestConfig(),
  );
  assertSuccess(response.data, "به‌روزرسانی سبد ناموفق بود");
  const cart = unwrapCart(response.data);
  rememberGuestSession(cart);
  return cart;
}

export async function removeCartItem(variantId: string): Promise<CartDto | null> {
  const encoded = encodeURIComponent(variantId.trim());
  const response = await apiClient.delete(
    `${BASE}/items/${encoded}`,
    cartRequestConfig(),
  );
  assertSuccess(response.data, "حذف از سبد ناموفق بود");

  const root = getRecord(response.data);
  if (root.data == null) return null;
  const cart = unwrapCart(response.data);
  rememberGuestSession(cart);
  return cart;
}

export async function clearCartApi(): Promise<void> {
  const response = await apiClient.delete(BASE, cartRequestConfig());
  assertSuccess(response.data, "خالی کردن سبد ناموفق بود");
}

export async function mergeCart(payload: MergeCartPayload): Promise<CartDto | null> {
  const response = await apiClient.post(
    `${BASE}/merge`,
    payload,
    {
      headers: {
        [GUEST_SESSION_HEADER]: payload.guestSessionId,
      },
    },
  );
  assertSuccess(response.data, "ادغام سبد خرید ناموفق بود");

  const root = getRecord(response.data);
  if (root.data == null) return null;
  const cart = unwrapCart(response.data);
  rememberGuestSession(cart);
  return cart;
}
