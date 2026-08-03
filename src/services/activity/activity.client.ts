"use client";

import { apiClient, ApiError } from "@/src/lib/http/api-client";
import type {
  ActivityFeedItem,
  ActivityFeedPage,
  ActivityStats,
  ActivitySummary,
  ActivityVisitGroup,
  ActivityVisitItem,
  ActivityVisitsPage,
} from "@/src/lib/types/userpanel/activity-history";

const BASE = "/me/activity";

type PageParams = {
  page?: number;
  pageSize?: number;
};

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function toNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function toString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function assertSuccess(payload: unknown, fallback: string) {
  const root = getRecord(payload);
  const ok = root.success ?? root.isSuccess;

  if (ok === false) {
    throw new ApiError(
      400,
      toString(root.message, fallback),
      typeof root.code === "string" ? root.code : undefined,
      payload,
    );
  }
}

function mapStats(value: unknown): ActivityStats {
  const record = getRecord(value);

  return {
    productVisits: toNumber(record.productVisits),
    purchases: toNumber(record.purchases),
    comments: toNumber(record.comments),
    tickets: toNumber(record.tickets),
  };
}

function mapVisitItem(value: unknown): ActivityVisitItem {
  const record = getRecord(value);

  return {
    visitId: toString(record.visitId),
    productId: toString(record.productId),
    slug: toString(record.slug),
    productCode: toString(record.productCode),
    title: toString(record.title),
    imageUrl: toString(record.imageUrl),
    price: toNumber(record.price),
    visitCount: toNumber(record.visitCount),
    lastViewedAt: toString(record.lastViewedAt),
    lastDurationSeconds: toNumber(record.lastDurationSeconds),
  };
}

function mapVisitGroup(value: unknown): ActivityVisitGroup {
  const record = getRecord(value);
  const itemsRaw = Array.isArray(record.items) ? record.items : [];

  return {
    dateLabel: toString(record.dateLabel),
    date: toString(record.date),
    items: itemsRaw
      .map(mapVisitItem)
      .filter((item) => item.productId || item.visitId),
  };
}

function mapFeedItem(value: unknown): ActivityFeedItem {
  const record = getRecord(value);

  return {
    id: toString(record.id),
    kind: toString(record.kind),
    kindTitleFa: toString(record.kindTitleFa),
    iconKey: toString(record.iconKey),
    occurredAt: toString(record.occurredAt),
    statusKey: toString(record.statusKey),
    statusTitleFa: toString(record.statusTitleFa),
    productId: toString(record.productId),
    productSlug: toString(record.productSlug),
    productTitle: toString(record.productTitle),
    referenceCode: toString(record.referenceCode),
    amount: toNumber(record.amount),
    subject: toString(record.subject),
    durationSeconds: toNumber(record.durationSeconds),
  };
}

function unwrapSummary(payload: unknown): ActivitySummary {
  assertSuccess(payload, "دریافت خلاصه فعالیت ناموفق بود");

  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);

  return {
    totalVisitCount: toNumber(data.totalVisitCount),
    stats: mapStats(data.stats),
  };
}

function unwrapVisits(payload: unknown): ActivityVisitsPage {
  assertSuccess(payload, "دریافت بازدیدهای اخیر ناموفق بود");

  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);
  const groupsRaw = Array.isArray(data.groups) ? data.groups : [];

  return {
    totalVisitCount: toNumber(data.totalVisitCount),
    groups: groupsRaw.map(mapVisitGroup).filter((group) => group.items.length),
    page: toNumber(data.page, 1),
    pageSize: toNumber(data.pageSize, 20),
    totalProducts: toNumber(data.totalProducts),
  };
}

function unwrapFeed(payload: unknown): ActivityFeedPage {
  assertSuccess(payload, "دریافت فعالیت‌های اخیر ناموفق بود");

  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);
  const itemsRaw = Array.isArray(data.items) ? data.items : [];

  return {
    totalVisitCount: toNumber(data.totalVisitCount),
    stats: mapStats(data.stats),
    items: itemsRaw.map(mapFeedItem).filter((item) => item.id),
    page: toNumber(data.page, 1),
    pageSize: toNumber(data.pageSize, 20),
    totalCount: toNumber(data.totalCount),
  };
}

function cleanPageParams(params: PageParams = {}) {
  return {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
  };
}

export async function getMyActivitySummary(): Promise<ActivitySummary> {
  const response = await apiClient.get(`${BASE}/summary`);

  console.log("getMyActivitySummary => ", response.data);
  return unwrapSummary(response.data);
}

export async function getMyActivityVisits(
  params?: PageParams,
): Promise<ActivityVisitsPage> {
  const response = await apiClient.get(`${BASE}/visits`, {
    params: cleanPageParams(params),
  });

  console.log("getMyActivityVisits => ", response.data);
  return unwrapVisits(response.data);
}

export async function getMyActivityFeed(
  params?: PageParams,
): Promise<ActivityFeedPage> {
  const response = await apiClient.get(`${BASE}/feed`, {
    params: cleanPageParams(params),
  });

  console.log("getMyActivityFeed => ", response.data);
  return unwrapFeed(response.data);
}

export async function clearMyActivityVisits(): Promise<void> {
  const response = await apiClient.delete(`${BASE}/visits`);
  assertSuccess(response.data, "پاک کردن تاریخچه بازدیدها ناموفق بود");
}

export async function deleteMyActivityVisit(productId: string): Promise<void> {
  const normalizedProductId = productId.trim();
  if (!normalizedProductId) {
    throw new ApiError(400, "شناسه محصول معتبر نیست", "VALIDATION_ERROR");
  }

  const response = await apiClient.delete(
    `${BASE}/visits/${encodeURIComponent(normalizedProductId)}`,
  );
  assertSuccess(response.data, "حذف بازدید محصول ناموفق بود");
}
