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

/** Header forwarded by BFF to backend for guest carts */
export const GUEST_SESSION_HEADER = "X-Guest-Session-Id";

/** Common merge strategies; backend accepts string. */
export const CART_MERGE_STRATEGY = "Merge";

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

  const unitPrice = Number(item.unitPriceSnapshot ?? item.unitPrice ?? 0) || 0;
  const campaignRaw = item.campaignPriceSnapshot;
  const campaignPrice =
    campaignRaw === null || campaignRaw === undefined
      ? null
      : Number(campaignRaw) || 0;

  return {
    id: String(item.id ?? ""),
    variantId,
    productId: String(item.productId ?? ""),
    productTitle: String(item.productTitle ?? item.title ?? "محصول"),
    variantTitle: String(item.variantTitle ?? ""),
    imageUrl:
      typeof item.imageUrl === "string" && item.imageUrl.trim()
        ? item.imageUrl
        : null,
    quantity: Math.max(1, Number(item.quantity ?? 1) || 1),
    unitPriceSnapshot: unitPrice,
    campaignPriceSnapshot: campaignPrice,
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

export async function addCartItem(
  payload: AddCartItemPayload,
): Promise<CartDto> {
  console.log("[Cart] POST /cart/items =>", payload);
  const response = await apiClient.post(
    `${BASE}/items`,
    payload,
    cartRequestConfig(),
  );
  console.log("[Cart] POST items raw =>", response.data);
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
  console.log("[Cart] PUT /cart/items/{variantId} =>", encoded, payload);
  const response = await apiClient.put(
    `${BASE}/items/${encoded}`,
    payload,
    cartRequestConfig(),
  );
  console.log("[Cart] PUT items raw =>", response.data);
  assertSuccess(response.data, "به‌روزرسانی سبد ناموفق بود");
  const cart = unwrapCart(response.data);
  rememberGuestSession(cart);
  return cart;
}

export async function removeCartItem(variantId: string): Promise<CartDto | null> {
  const encoded = encodeURIComponent(variantId.trim());
  console.log("[Cart] DELETE /cart/items/{variantId} =>", encoded);
  const response = await apiClient.delete(
    `${BASE}/items/${encoded}`,
    cartRequestConfig(),
  );
  console.log("[Cart] DELETE item raw =>", response.data);
  assertSuccess(response.data, "حذف از سبد ناموفق بود");

  const root = getRecord(response.data);
  if (root.data == null) return null;
  const cart = unwrapCart(response.data);
  rememberGuestSession(cart);
  return cart;
}

export async function clearCartApi(): Promise<void> {
  console.log("[Cart] DELETE /cart");
  const response = await apiClient.delete(BASE, cartRequestConfig());
  console.log("[Cart] DELETE cart raw =>", response.data);
  assertSuccess(response.data, "خالی کردن سبد ناموفق بود");
}

export async function mergeCart(payload: MergeCartPayload): Promise<CartDto | null> {
  console.log("[Cart] POST /cart/merge =>", payload);
  const response = await apiClient.post(
    `${BASE}/merge`,
    payload,
    {
      headers: {
        [GUEST_SESSION_HEADER]: payload.guestSessionId,
      },
    },
  );
  console.log("[Cart] POST merge raw =>", response.data);
  assertSuccess(response.data, "ادغام سبد خرید ناموفق بود");

  const root = getRecord(response.data);
  if (root.data == null) return null;
  const cart = unwrapCart(response.data);
  rememberGuestSession(cart);
  return cart;
}
