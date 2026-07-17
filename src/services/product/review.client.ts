"use client";

import { apiClient, ApiError } from "@/src/lib/http/api-client";
import type {
  CreateProductReviewRequest,
  GetProductReviewsParams,
  ProductReview,
  ProductReviewsPage,
  ProductReviewsSummary,
  ReportReviewRequest,
  ReviewVoteType,
} from "@/src/lib/types/products/review.types";

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function logApiError(label: string, error: unknown) {
  console.error(`[review.client] ${label} failed =>`, error);
  if (error instanceof ApiError) {
    console.error(`[review.client] ${label} error body =>`, {
      status: error.status,
      code: error.code,
      message: error.message,
      data: error.data,
    });
  }
}

function unwrapReviewsPage(payload: unknown): ProductReviewsPage {
  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);

  const itemsRaw = Array.isArray(data.items)
    ? data.items
    : Array.isArray(root.items)
      ? root.items
      : [];

  const items = itemsRaw.map((item) => {
    const record = getRecord(item);
    return {
      id: String(record.id ?? ""),
      productId: String(record.productId ?? ""),
      userId: String(record.userId ?? ""),
      userDisplayName: String(record.userDisplayName ?? "کاربر"),
      rating: Number(record.rating ?? 0),
      title: String(record.title ?? ""),
      body: String(record.body ?? ""),
      advantages: Array.isArray(record.advantages)
        ? record.advantages.map(String)
        : [],
      disadvantages: Array.isArray(record.disadvantages)
        ? record.disadvantages.map(String)
        : [],
      recommendStatus: String(record.recommendStatus ?? "neutral"),
      isBuyer: Boolean(record.isBuyer),
      likesCount: Number(record.likesCount ?? 0),
      dislikesCount: Number(record.dislikesCount ?? 0),
      createdAt: String(record.createdAt ?? ""),
      replies: Array.isArray(record.replies)
        ? record.replies.map((reply) => {
            const replyRecord = getRecord(reply);
            return {
              id: String(replyRecord.id ?? ""),
              body: String(replyRecord.body ?? ""),
              isOfficial: Boolean(replyRecord.isOfficial),
              userDisplayName: String(replyRecord.userDisplayName ?? ""),
              createdAt: String(replyRecord.createdAt ?? ""),
            };
          })
        : [],
    } satisfies ProductReview;
  });

  return {
    items,
    pageNumber: Number(data.pageNumber ?? root.pageNumber ?? 1),
    pageSize: Number(data.pageSize ?? root.pageSize ?? 10),
    totalCount: Number(data.totalCount ?? root.totalCount ?? items.length),
    totalPages: Number(data.totalPages ?? root.totalPages ?? 1),
    hasPreviousPage: Boolean(data.hasPreviousPage ?? root.hasPreviousPage),
    hasNextPage: Boolean(data.hasNextPage ?? root.hasNextPage),
  };
}

function unwrapSummary(payload: unknown): ProductReviewsSummary {
  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);

  return {
    productId: String(data.productId ?? ""),
    totalReviews: Number(data.totalReviews ?? 0),
    averageRating: Number(data.averageRating ?? 0),
    rating1Count: Number(data.rating1Count ?? 0),
    rating2Count: Number(data.rating2Count ?? 0),
    rating3Count: Number(data.rating3Count ?? 0),
    rating4Count: Number(data.rating4Count ?? 0),
    rating5Count: Number(data.rating5Count ?? 0),
    recommendedCount: Number(data.recommendedCount ?? 0),
    notRecommendedCount: Number(data.notRecommendedCount ?? 0),
    buyerReviewCount: Number(data.buyerReviewCount ?? 0),
  };
}

export async function getProductReviews(
  productId: string,
  params: GetProductReviewsParams = {},
): Promise<ProductReviewsPage> {
  const query = {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
    sort: params.sort ?? "newest",
  };



  try {
    const response = await apiClient.get(`/products/${productId}/reviews`, {
      params: query,
    });
    
    return unwrapReviewsPage(response.data);
  } catch (error) {
    logApiError("getProductReviews", error);
    throw error;
  }
}

export async function getProductReviewsSummary(
  productId: string,
): Promise<ProductReviewsSummary> {
 

  try {
    const response = await apiClient.get(
      `/products/${productId}/reviews/summary`,
    );
    
    return unwrapSummary(response.data);
  } catch (error) {
    logApiError("getProductReviewsSummary", error);
    throw error;
  }
}

export async function createProductReview(
  productId: string,
  body: CreateProductReviewRequest,
): Promise<unknown> {
 

  try {
    const response = await apiClient.post(
      `/products/${productId}/reviews`,
      body,
    );
    
    return response.data;
  } catch (error) {
    logApiError("createProductReview", error);
    throw error;
  }
}

export async function voteProductReview(
  reviewId: string,
  voteType: ReviewVoteType,
): Promise<unknown> {
  const body = { voteType };
 

  try {
    const response = await apiClient.post(`/Reviews/${reviewId}/vote`, body);
    console.log("[review.client] voteProductReview response =>", response.data);
    return response.data;
  } catch (error) {
    logApiError("voteProductReview", error);
    throw error;
  }
}

export async function reportProductReview(
  reviewId: string,
  body: ReportReviewRequest,
): Promise<unknown> {


  try {
    const response = await apiClient.post(`/Reviews/${reviewId}/report`, body);
    console.log(
      "[review.client] reportProductReview response =>",
      response.data,
    );
    return response.data;
  } catch (error) {
    logApiError("reportProductReview", error);
    throw error;
  }
}

export async function deleteProductReview(reviewId: string): Promise<unknown> {
 

  try {
    const response = await apiClient.delete(`/Reviews/${reviewId}`);
    console.log(
      "[review.client] deleteProductReview response =>",
      response.data,
    );
    return response.data;
  } catch (error) {
    logApiError("deleteProductReview", error);
    throw error;
  }
}
