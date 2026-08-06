"use client";

import { apiClient } from "@/src/lib/http/api-client";
import type {
  GetMyWishlistParams,
  WishlistItem,
  WishlistPage,
  WishlistProductStatus,
} from "@/src/lib/types/wishlist/wishlist.type";

const PRODUCTS_PATH = "/Wishlists/products";
const MY_PATH = "/Wishlists/my";

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function unwrapWishlistStatus(payload: unknown): WishlistProductStatus {
  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);

  return {
    productId: String(data.productId ?? ""),
    isInWishlist: Boolean(data.isInWishlist),
  };
}

function mapWishlistItem(value: unknown): WishlistItem {
  const record = getRecord(value);

  return {
    wishlistItemId: String(record.wishlistItemId ?? ""),
    productId: String(record.productId ?? ""),
    name: String(record.name ?? ""),
    slug: String(record.slug ?? ""),
    publicCode: String(record.publicCode ?? ""),
    priceWhenAdded: Number(record.priceWhenAdded ?? 0),
    currentPrice: Number(record.currentPrice ?? 0),
    salePrice:
      record.salePrice === null || record.salePrice === undefined
        ? null
        : Number(record.salePrice),
    isOnSale: Boolean(record.isOnSale),
    currencyCode: String(record.currencyCode ?? "IRT"),
    inStock: Boolean(record.inStock),
    isActive: Boolean(record.isActive),
    thumbnailPath: record.thumbnailPath
      ? String(record.thumbnailPath)
      : null,
    mediumPath: record.mediumPath ? String(record.mediumPath) : null,
    addedAt: String(record.addedAt ?? ""),
    hasPriceDropped: Boolean(record.hasPriceDropped),
  };
}

function unwrapWishlistPage(payload: unknown): WishlistPage {
  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);
  const itemsRaw = Array.isArray(data.items)
    ? data.items
    : Array.isArray(root.items)
      ? root.items
      : [];

  const items = itemsRaw.map(mapWishlistItem);

  return {
    items,
    pageNumber: Number(data.pageNumber ?? root.pageNumber ?? 1),
    pageSize: Number(data.pageSize ?? root.pageSize ?? (items.length || 12)),
    totalCount: Number(data.totalCount ?? root.totalCount ?? items.length),
    totalPages: Number(data.totalPages ?? root.totalPages ?? 1),
    hasPreviousPage: Boolean(data.hasPreviousPage ?? root.hasPreviousPage),
    hasNextPage: Boolean(data.hasNextPage ?? root.hasNextPage),
  };
}

export async function getWishlistProductStatus(
  productId: string,
): Promise<WishlistProductStatus> {
  const response = await apiClient.get(`${PRODUCTS_PATH}/${productId}/status`);
  return unwrapWishlistStatus(response.data);
}

export async function addWishlistProduct(
  productId: string,
): Promise<WishlistProductStatus> {
  const response = await apiClient.post(`${PRODUCTS_PATH}/${productId}`);
  const status = unwrapWishlistStatus(response.data);
  return {
    productId: status.productId || productId,
    // POST موفق یعنی محصول اضافه شده؛ حتی اگر body خالی باشد
    isInWishlist: true,
  };
}

export async function removeWishlistProduct(
  productId: string,
): Promise<WishlistProductStatus> {
  await apiClient.delete(`${PRODUCTS_PATH}/${productId}`);
  return {
    productId,
    isInWishlist: false,
  };
}

export async function getMyWishlist(
  params: GetMyWishlistParams = {},
): Promise<WishlistPage> {
  const response = await apiClient.get(MY_PATH, {
    params: {
      pageNumber: params.pageNumber ?? 1,
      pageSize: params.pageSize ?? 12,
    },
  });

  return unwrapWishlistPage(response.data);
}
