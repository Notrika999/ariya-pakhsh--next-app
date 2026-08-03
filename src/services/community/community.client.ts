"use client";

import { apiClient, ApiError } from "@/src/lib/http/api-client";
import type {
  CommunityPageParams,
  CommunitySummary,
  MyQuestionAnswer,
  MyQuestionItem,
  MyQuestionsPage,
  MyReviewItem,
  MyReviewsPage,
  UpdateMyReviewRequest,
} from "@/src/lib/types/userpanel/comments";

const BASE = "/me";

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

function toPositiveNumber(value: unknown, fallback = 1): number {
  const parsed = toNumber(value, fallback);
  return parsed > 0 ? parsed : fallback;
}

function toOptionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
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

function mapStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function mapReview(value: unknown): MyReviewItem {
  const record = getRecord(value);

  return {
    id: toString(record.id),
    productId: toString(record.productId),
    productName: toString(record.productName, "محصول"),
    productSlug: toString(record.productSlug),
    productCode: toString(record.productCode),
    productImageUrl: toString(record.productImageUrl),
    rating: toNumber(record.rating),
    title: toString(record.title),
    body: toString(record.body),
    advantages: mapStringArray(record.advantages),
    disadvantages: mapStringArray(record.disadvantages),
    recommendStatus: toString(record.recommendStatus, "neutral"),
    status: toString(record.status, "pending"),
    statusLabel: toString(record.statusLabel, "در انتظار بررسی"),
    likesCount: toNumber(record.likesCount),
    canEdit: Boolean(record.canEdit),
    createdAt: toString(record.createdAt),
    updatedAt: toString(record.updatedAt),
  };
}

function mapQuestionAnswer(value: unknown): MyQuestionAnswer | null {
  if (!value) return null;

  const record = getRecord(value);
  const id = toString(record.id);
  const body = toString(record.body);

  if (!id && !body) return null;

  return {
    id,
    body,
    createdAt: toString(record.createdAt),
  };
}

function mapQuestion(value: unknown): MyQuestionItem {
  const record = getRecord(value);

  return {
    id: toString(record.id),
    productId: toString(record.productId),
    productName: toString(record.productName, "محصول"),
    productSlug: toString(record.productSlug),
    productCode: toString(record.productCode),
    productImageUrl: toString(record.productImageUrl),
    body: toString(record.body),
    status: toString(record.status, "pending"),
    displayStatus: toString(record.displayStatus),
    displayStatusLabel: toString(
      record.displayStatusLabel,
      toString(record.displayStatus, "در انتظار پاسخ"),
    ),
    createdAt: toString(record.createdAt),
    officialAnswer: mapQuestionAnswer(record.officialAnswer),
  };
}

function mapPage<T>(
  data: Record<string, unknown>,
  mapItem: (value: unknown) => T,
  params?: CommunityPageParams,
): {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
} {
  const itemsRaw = Array.isArray(data.items) ? data.items : [];
  const requestedPage = toPositiveNumber(params?.page, 1);
  const requestedPageSize = toPositiveNumber(params?.pageSize, 10);
  const pageNumber = toPositiveNumber(data.pageNumber, requestedPage);
  const pageSize = toPositiveNumber(data.pageSize, requestedPageSize);
  const totalCount = toNumber(data.totalCount, itemsRaw.length);
  const computedTotalPages = Math.max(Math.ceil(totalCount / pageSize), 1);
  const totalPages = toPositiveNumber(data.totalPages, computedTotalPages);
  const hasPreviousPage =
    toOptionalBoolean(data.hasPreviousPage) ?? pageNumber > 1;
  const hasNextPage =
    toOptionalBoolean(data.hasNextPage) ?? pageNumber < totalPages;

  return {
    items: itemsRaw.map(mapItem),
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
}

function cleanPageParams(params: CommunityPageParams = {}) {
  return {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
  };
}

export async function getMyCommunitySummary(): Promise<CommunitySummary> {
  const response = await apiClient.get(`${BASE}/community/summary`);
  const data = unwrapData(response.data, "دریافت خلاصه نظرات و پرسش‌ها ناموفق بود");

  return {
    reviewsCount: toNumber(data.reviewsCount),
    questionsCount: toNumber(data.questionsCount),
  };
}

export async function getMyReviews(
  params?: CommunityPageParams,
): Promise<MyReviewsPage> {
  const queryParams = cleanPageParams(params);
  const response = await apiClient.get(`${BASE}/reviews`, {
    params: queryParams,
  });

  const data = unwrapData(response.data, "دریافت نظرات ناموفق بود");

  return mapPage(data, mapReview, queryParams);
}

export async function updateMyReview(
  reviewId: string,
  body: UpdateMyReviewRequest,
): Promise<void> {
  const response = await apiClient.put(
    `${BASE}/reviews/${encodeURIComponent(reviewId)}`,
    body,
  );

  assertSuccess(response.data, "ویرایش نظر ناموفق بود");
}

export async function deleteMyReview(reviewId: string): Promise<void> {
  const response = await apiClient.delete(
    `${BASE}/reviews/${encodeURIComponent(reviewId)}`,
  );

  assertSuccess(response.data, "حذف نظر ناموفق بود");
}

export async function getMyQuestions(
  params?: CommunityPageParams,
): Promise<MyQuestionsPage> {
  const queryParams = cleanPageParams(params);
  const response = await apiClient.get(`${BASE}/questions`, {
    params: queryParams,
  });
  const data = unwrapData(response.data, "دریافت پرسش‌ها ناموفق بود");

  return mapPage(data, mapQuestion, queryParams);
}

export async function deleteMyQuestion(questionId: string): Promise<void> {
  const response = await apiClient.delete(
    `${BASE}/questions/${encodeURIComponent(questionId)}`,
  );

  assertSuccess(response.data, "حذف پرسش ناموفق بود");
}
