"use client";

import { apiClient, ApiError } from "@/src/lib/http/api-client";
import type {
  GiftCard,
  GiftCardsPage,
  GiftCardStatus,
} from "@/src/lib/types/userpanel/GiftCard";

const BASE = "/me/gift-cards";

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
      typeof root.message === "string" && root.message ? root.message : fallback,
      typeof root.code === "string" ? root.code : undefined,
      payload,
    );
  }
}

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapGiftCard(value: unknown, type: GiftCardStatus): GiftCard {
  const item = getRecord(value);

  return {
    id: String(item.id ?? ""),
    type,
    code: String(item.code ?? ""),
    title: String(item.title ?? ""),
    amount: toNumber(item.amount),
    remainingBalance: toNumber(item.remainingBalance),
    currency: String(item.currency ?? "IRT"),
    expiresAt: item.expiresAt ? String(item.expiresAt) : null,
    statusKey: String(item.statusKey ?? type),
    statusTitle: String(item.statusTitle ?? ""),
  };
}

function unwrapGiftCardsPage(
  payload: unknown,
  type: GiftCardStatus,
): GiftCardsPage {
  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);
  const itemsRaw = Array.isArray(data.items)
    ? data.items
    : Array.isArray(root.items)
      ? root.items
      : [];

  const items = itemsRaw
    .map((item) => mapGiftCard(item, type))
    .filter((item) => item.id);

  return {
    items,
    pageNumber: toNumber(data.pageNumber ?? root.pageNumber) || 1,
    pageSize: toNumber(data.pageSize ?? root.pageSize) || items.length,
    totalCount: toNumber(data.totalCount ?? root.totalCount) || items.length,
    totalPages: toNumber(data.totalPages ?? root.totalPages) || 1,
    hasPreviousPage: Boolean(data.hasPreviousPage ?? root.hasPreviousPage),
    hasNextPage: Boolean(data.hasNextPage ?? root.hasNextPage),
  };
}

function unwrapGiftCardDetail(payload: unknown): GiftCard {
  const root = getRecord(payload);
  return mapGiftCard(root.data ?? root, "active");
}

export async function getActiveGiftCards(): Promise<GiftCardsPage> {
  const response = await apiClient.get(`${BASE}/active`);
  assertSuccess(response.data, "دریافت کارت‌های هدیه فعال ناموفق بود");
  return unwrapGiftCardsPage(response.data, "active");
}

export async function getUsedGiftCards(): Promise<GiftCardsPage> {
  const response = await apiClient.get(`${BASE}/used`);
  assertSuccess(response.data, "دریافت کارت‌های هدیه استفاده‌شده ناموفق بود");
  return unwrapGiftCardsPage(response.data, "used");
}

export async function getGiftCardById(id: string): Promise<GiftCard> {
  const encoded = encodeURIComponent(id.trim());
  const response = await apiClient.get(`${BASE}/${encoded}`);
  assertSuccess(response.data, "دریافت جزئیات کارت هدیه ناموفق بود");
  return unwrapGiftCardDetail(response.data);
}
