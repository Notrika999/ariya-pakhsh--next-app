"use client";

import { apiClient, ApiError } from "@/src/lib/http/api-client";
import type {
<<<<<<< HEAD
  CreateReviewMediaUploadRequest,
  CreateProductReviewRequest,
  GetProductReviewsParams,
  ProductReview,
  ProductReviewMedia,
  ProductReviewMediaType,
  ProductReviewsPage,
  ProductReviewsSummary,
  ReportReviewRequest,
  ReviewMediaCapabilities,
  ReviewMediaUploadSession,
=======
  CreateProductReviewRequest,
  GetProductReviewsParams,
  ProductReview,
  ProductReviewsPage,
  ProductReviewsSummary,
  ReportReviewRequest,
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  ReviewVoteType,
} from "@/src/lib/types/products/review.types";

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function logApiError(label: string, error: unknown) {
  // console.error(`[review.client] ${label} failed =>`, error);
  if (error instanceof ApiError) {
    // console.error(`[review.client] ${label} error body =>`, {
    //   status: error.status,
    //   code: error.code,
    //   message: error.message,
    //   data: error.data,
    // });
  }
}

function normalizeReviewVote(value: unknown): ReviewVoteType | null {
  return value === "like" || value === "dislike" ? value : null;
}

<<<<<<< HEAD
function pickString(
  record: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.length > 0) return value;
  }

  return undefined;
}

function pickNumber(
  record: Record<string, unknown>,
  keys: string[],
): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return undefined;
}

function pickBoolean(
  record: Record<string, unknown>,
  keys: string[],
): boolean | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") return value;
  }

  return undefined;
}

function pickStringArray(
  record: Record<string, unknown>,
  key: string,
): string[] {
  const value = record[key];
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function unwrapDataRecord(payload: unknown): Record<string, unknown> {
  const root = getRecord(payload);
  return getRecord(root.data ?? root);
}

function mapReviewMedia(value: unknown): ProductReviewMedia {
  const record = getRecord(value);
  return {
    id: String(record.id ?? record.mediaId ?? ""),
    mediaType: String(record.mediaType ?? record.type ?? ""),
    processingStatus: String(record.processingStatus ?? record.status ?? ""),
    fileName: String(record.fileName ?? record.originalFileName ?? ""),
    contentType: String(record.contentType ?? record.mimeType ?? ""),
    url:
      pickString(record, ["url", "mediaUrl", "contentUrl", "videoUrl"]) ??
      null,
    previewUrl: pickString(record, ["previewUrl", "previewPath"]) ?? null,
    thumbnailUrl:
      pickString(record, ["thumbnailUrl", "thumbnailPath", "thumbUrl"]) ?? null,
    posterUrl: pickString(record, ["posterUrl", "videoPosterUrl"]) ?? null,
    videoUrl: pickString(record, ["videoUrl", "sourceUrl"]) ?? null,
    moderationStatus: pickString(record, ["moderationStatus"]) ?? null,
    width: pickNumber(record, ["width"]) ?? null,
    height: pickNumber(record, ["height"]) ?? null,
    durationSeconds: pickNumber(record, ["durationSeconds"]) ?? null,
    sortOrder: pickNumber(record, ["sortOrder"]) ?? null,
    rejectionReason:
      pickString(record, ["rejectionReason", "errorMessage", "message"]) ??
      null,
  };
}

function unwrapReviewMedia(payload: unknown): ProductReviewMedia {
  return mapReviewMedia(unwrapDataRecord(payload));
}

function unwrapReviewMediaCapabilities(payload: unknown): ReviewMediaCapabilities {
  const data = unwrapDataRecord(payload);

  return {
    enabled: pickBoolean(data, ["enabled"]) ?? false,
    maxImagesPerReview: pickNumber(data, ["maxImagesPerReview"]) ?? 0,
    maxVideosPerReview: pickNumber(data, ["maxVideosPerReview"]) ?? 0,
    maxImageSizeBytes: pickNumber(data, ["maxImageSizeBytes"]) ?? 0,
    maxVideoSizeBytes: pickNumber(data, ["maxVideoSizeBytes"]) ?? 0,
    maxVideoDurationSeconds:
      pickNumber(data, ["maxVideoDurationSeconds"]) ?? 0,
    allowedImageExtensions: pickStringArray(data, "allowedImageExtensions"),
    allowedImageMimeTypes: pickStringArray(data, "allowedImageMimeTypes"),
    allowedVideoExtensions: pickStringArray(data, "allowedVideoExtensions"),
    allowedVideoMimeTypes: pickStringArray(data, "allowedVideoMimeTypes"),
    uploadSessionMinutes: pickNumber(data, ["uploadSessionMinutes"]) ?? 0,
    requireMediaModeration:
      pickBoolean(data, ["requireMediaModeration"]) ?? false,
  };
}

function unwrapReviewMediaUploadSession(
  payload: unknown,
): ReviewMediaUploadSession {
  const data = unwrapDataRecord(payload);
  const mediaId = String(data.mediaId ?? data.id ?? "");

  return {
    mediaId,
    uploadUrl:
      pickString(data, ["uploadUrl", "url"]) ??
      `/me/review-media/${encodeURIComponent(mediaId)}/content`,
    expiresAt: pickString(data, ["expiresAt"]),
    maxAllowedSize: pickNumber(data, ["maxAllowedSize", "maxAllowedSizeBytes"]),
  };
}

=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
function unwrapReviewsPage(payload: unknown): ProductReviewsPage {
  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);

<<<<<<< HEAD
  const itemsRaw = Array.isArray(payload)
    ? payload
    : Array.isArray(root.data)
      ? root.data
      : Array.isArray(data.items)
        ? data.items
        : Array.isArray(root.items)
          ? root.items
          : [];
=======
  const itemsRaw = Array.isArray(data.items)
    ? data.items
    : Array.isArray(root.items)
      ? root.items
      : [];
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

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
      userVote: normalizeReviewVote(
        record.userVote ?? record.currentUserVote ?? record.myVote,
      ),
      createdAt: String(record.createdAt ?? ""),
<<<<<<< HEAD
      media: Array.isArray(record.media)
        ? record.media
            .map(mapReviewMedia)
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        : Array.isArray(record.medias)
          ? record.medias
              .map(mapReviewMedia)
              .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          : Array.isArray(record.mediaItems)
            ? record.mediaItems
                .map(mapReviewMedia)
                .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            : [],
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
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

<<<<<<< HEAD
export async function getReviewMediaCapabilities(): Promise<ReviewMediaCapabilities> {
  try {
    const response = await apiClient.get("/me/review-media/capabilities");
    return unwrapReviewMediaCapabilities(response.data);
  } catch (error) {
    logApiError("getReviewMediaCapabilities", error);
    throw error;
  }
}

export async function createReviewMediaUpload(
  body: CreateReviewMediaUploadRequest,
): Promise<ReviewMediaUploadSession> {
  try {
    const response = await apiClient.post("/me/review-media/uploads", body);
    return unwrapReviewMediaUploadSession(response.data);
  } catch (error) {
    logApiError("createReviewMediaUpload", error);
    throw error;
  }
}

export async function uploadReviewMediaContent(
  uploadUrl: string,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<unknown> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiClient.put(uploadUrl, formData, {
      timeout: 0,
      onUploadProgress(event) {
        if (!event.total) return;
        onProgress?.(Math.round((event.loaded * 100) / event.total));
      },
    });

    return response.data;
  } catch (error) {
    logApiError("uploadReviewMediaContent", error);
    throw error;
  }
}

export async function completeReviewMediaUpload(
  mediaId: string,
): Promise<unknown> {
  try {
    const response = await apiClient.post(
      `/me/review-media/${encodeURIComponent(mediaId)}/complete`,
    );
    return response.data;
  } catch (error) {
    logApiError("completeReviewMediaUpload", error);
    throw error;
  }
}

export async function getReviewMedia(
  mediaId: string,
): Promise<ProductReviewMedia> {
  try {
    const response = await apiClient.get(
      `/me/review-media/${encodeURIComponent(mediaId)}`,
    );
    return unwrapReviewMedia(response.data);
  } catch (error) {
    logApiError("getReviewMedia", error);
    throw error;
  }
}

export async function deleteReviewMedia(mediaId: string): Promise<unknown> {
  try {
    const response = await apiClient.delete(
      `/me/review-media/${encodeURIComponent(mediaId)}`,
    );
    return response.data;
  } catch (error) {
    logApiError("deleteReviewMedia", error);
    throw error;
  }
}

export function getReviewMediaTypeFromFile(
  file: File,
  capabilities: ReviewMediaCapabilities,
): ProductReviewMediaType | null {
  if (capabilities.allowedImageMimeTypes.includes(file.type)) return "image";
  if (capabilities.allowedVideoMimeTypes.includes(file.type)) return "video";

  const fileName = file.name.toLowerCase();
  if (
    capabilities.allowedImageExtensions.some((extension) =>
      fileName.endsWith(extension.toLowerCase()),
    )
  ) {
    return "image";
  }
  if (
    capabilities.allowedVideoExtensions.some((extension) =>
      fileName.endsWith(extension.toLowerCase()),
    )
  ) {
    return "video";
  }

  return null;
}

=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
export async function voteProductReview(
  reviewId: string,
  voteType: ReviewVoteType,
): Promise<unknown> {
  const body = { voteType };
 

  try {
    const response = await apiClient.post(`/Reviews/${reviewId}/vote`, body);
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
    return response.data;
  } catch (error) {
    logApiError("reportProductReview", error);
    throw error;
  }
}

export async function deleteProductReview(reviewId: string): Promise<unknown> {
 

  try {
    const response = await apiClient.delete(`/Reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    logApiError("deleteProductReview", error);
    throw error;
  }
}
