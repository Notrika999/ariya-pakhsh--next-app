"use client";
// src/services/coupon/coupon.client.ts
import { apiClient, ApiError } from "@/src/lib/http/api-client";
import type {
  CouponPageParams,
  MyCouponsApiResponse,
  MyCouponItem,
  MyCouponsPage,
  MyCouponStatus,
} from "@/src/lib/types/userpanel/coupon";

const BASE = "/me/coupons";

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function toString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeKey(key: string) {
  return key.replace(/[_-\s]/g, "").toLowerCase();
}

function toDisplayString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value.trim() ? value : fallback;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  return fallback;
}

function pickString(
  record: Record<string, unknown>,
  keys: string[],
  fallback = "",
): string {
  for (const key of keys) {
    const exactValue = toDisplayString(record[key]);
    if (exactValue) return exactValue;
  }

  const normalizedLookup = new Map(
    Object.entries(record).map(([key, value]) => [normalizeKey(key), value]),
  );

  for (const key of keys) {
    const value = toDisplayString(normalizedLookup.get(normalizeKey(key)));
    if (value) return value;
  }

  return fallback;
}

function pickNestedString(
  record: Record<string, unknown>,
  keys: string[],
  fallback = "",
): string {
  const directValue = pickString(record, keys);
  if (directValue) return directValue;

  const nestedCandidates = [
    "coupon",
    "couponCode",
    "couponInfo",
    "couponDetail",
    "couponDetails",
    "definition",
    "discount",
  ];

  for (const nestedKey of nestedCandidates) {
    const nestedRecord = getRecord(record[nestedKey]);
    const nestedValue = pickString(nestedRecord, keys);
    if (nestedValue) return nestedValue;
  }

  return fallback;
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

function toPositiveNumber(value: unknown, fallback = 1): number {
  const parsed = toNumber(value, fallback);
  return parsed > 0 ? parsed : fallback;
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

function mapCoupon(value: unknown): MyCouponItem {
  const record = getRecord(value);

  return {
    couponId: toString(record.couponId),
    couponCodeId: toString(record.couponCodeId),
    code: toString(record.code),
    name: toString(record.name),
    description: toString(record.description),
    discountType: toString(record.discountType),
    discountValue: toNumber(record.discountValue),
    minPurchaseAmount: toNumber(record.minPurchaseAmount),
    maxDiscountAmount: toNumber(record.maxDiscountAmount),
    validFrom: pickNestedString(record, [
      "validFrom",
      "ValidFrom",
      "valid_from",
      "startDate",
      "startsAt",
    ]),
    validTo: pickNestedString(record, [
      "validTo",
      "ValidTo",
      "valid_to",
      "validUntil",
      "ValidUntil",
      "valid_until",
      "expiresAt",
      "expireAt",
      "expiredAt",
      "expiryAt",
      "expirationDate",
      "expirationTime",
      "expiryDate",
      "endDate",
      "endsAt",
    ]),
    status: toString(record.status),
    usedAt: pickNestedString(record, ["usedAt", "UsedAt", "used_at"]),
  };
}

function cleanPageParams(params: CouponPageParams = {}) {
  const cleaned: CouponPageParams = {
    page: params.page ?? 1,
  };

  if (typeof params.pageSize === "number") {
    cleaned.pageSize = params.pageSize;
  }

  return cleaned;
}

export async function getMyCoupons(
  status: MyCouponStatus,
  params?: CouponPageParams,
): Promise<MyCouponsPage> {
  const queryParams = cleanPageParams(params);
  const response = await apiClient.get<MyCouponsApiResponse>(
    `${BASE}/${status}`,
    {
    params: queryParams,
    },
  );
  const data = unwrapData(response.data, "دریافت کدهای تخفیف ناموفق بود");
  const itemsRaw = Array.isArray(data.items) ? data.items : [];
  const requestedPageSize =
    typeof queryParams.pageSize === "number" && queryParams.pageSize > 0
      ? queryParams.pageSize
      : undefined;
  const pageSize =
    requestedPageSize ?? toPositiveNumber(data.pageSize, itemsRaw.length || 20);
  const pageNumber = toPositiveNumber(data.pageNumber, queryParams.page ?? 1);
  const totalCount = toNumber(data.totalCount, itemsRaw.length);
  const totalPages = toPositiveNumber(
    data.totalPages,
    Math.max(Math.ceil(totalCount / pageSize), 1),
  );

  return {
    items: itemsRaw.map(mapCoupon),
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage: Boolean(data.hasPreviousPage),
    hasNextPage: Boolean(data.hasNextPage),
  };
}
