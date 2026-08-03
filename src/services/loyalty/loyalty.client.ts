"use client";

import { apiClient, ApiError } from "@/src/lib/http/api-client";
import type {
  LoyaltyHistoryParams,
  LoyaltyPointsHistoryItem,
  LoyaltyPointsHistoryPage,
  LoyaltyPointsRule,
  LoyaltyPointsRules,
  LoyaltyPointsSummary,
} from "@/src/lib/types/userpanel/loyalty";

const BASE = "/me/loyalty/points";

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function toString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function assertSuccess(payload: unknown, fallback: string) {
  const root = getRecord(payload);
  const ok = root.success ?? root.isSuccess;

  if (ok === false) {
    throw new ApiError(
      400,
      toString(root.message, fallback),
      toString(root.code) || undefined,
      payload,
    );
  }
}

function unwrapData(payload: unknown, fallback: string) {
  assertSuccess(payload, fallback);
  const root = getRecord(payload);
  return getRecord(root.data ?? root);
}

function mapRule(value: unknown): LoyaltyPointsRule {
  const record = getRecord(value);

  return {
    id: toString(record.id),
    key: toString(record.key),
    side: toString(record.side),
    actionType: toString(record.actionType),
    title: toString(record.title),
    description: toString(record.description),
    points: toNumber(record.points),
  };
}

function mapHistoryItem(value: unknown): LoyaltyPointsHistoryItem {
  const record = getRecord(value);

  return {
    id: toString(record.id),
    type: toString(record.type),
    status: toString(record.status),
    amount: toNumber(record.amount),
    balanceAfter: toNumber(record.balanceAfter),
    reason: toString(record.reason),
    referenceType: toString(record.referenceType),
    referenceId: toString(record.referenceId),
    createdAt: toString(record.createdAt),
  };
}

function cleanHistoryParams(params: LoyaltyHistoryParams = {}) {
  return {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
  };
}

export async function getMyLoyaltyPointsSummary(): Promise<LoyaltyPointsSummary> {
  const response = await apiClient.get(`${BASE}/summary`);
  const data = unwrapData(response.data, "دریافت خلاصه امتیازات ناموفق بود");

  return {
    totalPoints: toNumber(data.totalPoints),
    usablePoints: toNumber(data.usablePoints),
    usedPoints: toNumber(data.usedPoints),
    statusKey: toString(data.statusKey),
  };
}

export async function getMyLoyaltyPointsHistory(
  params?: LoyaltyHistoryParams,
): Promise<LoyaltyPointsHistoryPage> {
  const response = await apiClient.get(`${BASE}/history`, {
    params: cleanHistoryParams(params),
  });
  const data = unwrapData(response.data, "دریافت تاریخچه امتیازات ناموفق بود");
  const itemsRaw = Array.isArray(data.items) ? data.items : [];

  return {
    items: itemsRaw.map(mapHistoryItem).filter((item) => item.id),
    pageNumber: toNumber(data.pageNumber, 1),
    pageSize: toNumber(data.pageSize, itemsRaw.length || 20),
    totalCount: toNumber(data.totalCount, itemsRaw.length),
    totalPages: toNumber(data.totalPages, 1),
    hasPreviousPage: Boolean(data.hasPreviousPage),
    hasNextPage: Boolean(data.hasNextPage),
  };
}

export async function getMyLoyaltyPointsRules(): Promise<LoyaltyPointsRules> {
  const response = await apiClient.get(`${BASE}/rules`);
  const data = unwrapData(response.data, "دریافت قوانین امتیازات ناموفق بود");

  return {
    enabled: Boolean(data.enabled),
    earnRules: Array.isArray(data.earnRules) ? data.earnRules.map(mapRule) : [],
    spendRules: Array.isArray(data.spendRules)
      ? data.spendRules.map(mapRule)
      : [],
    rules: Array.isArray(data.rules) ? data.rules.map(mapRule) : [],
  };
}

export async function redeemMyLoyaltyPoints(points: number): Promise<void> {
  const response = await apiClient.post(`${BASE}/redeem`, { points });
  assertSuccess(response.data, "تبدیل امتیاز ناموفق بود");
}
