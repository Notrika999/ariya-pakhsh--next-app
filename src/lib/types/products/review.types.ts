export type ReviewRecommendStatus = "neutral" | "recommended" | "notRecommended";

export type ProductReviewReply = {
  id: string;
  body: string;
  isOfficial: boolean;
  userDisplayName: string;
  createdAt: string;
};

export type ProductReviewMediaType = "image" | "video";

export type ProductReviewMediaProcessingStatus =
  | "pendingUpload"
  | "uploaded"
  | "processing"
  | "ready"
  | "failed"
  | "rejected"
  | "deleted";

export type ProductReviewMedia = {
  id: string;
  mediaType: ProductReviewMediaType | string;
  processingStatus: ProductReviewMediaProcessingStatus | string;
  fileName: string;
  contentType: string;
  url?: string | null;
  previewUrl?: string | null;
  thumbnailUrl?: string | null;
  posterUrl?: string | null;
  videoUrl?: string | null;
  moderationStatus?: string | null;
  width?: number | null;
  height?: number | null;
  durationSeconds?: number | null;
  sortOrder?: number | null;
  rejectionReason?: string | null;
};

export type ProductReview = {
  id: string;
  productId: string;
  userId: string;
  userDisplayName: string;
  rating: number;
  title: string;
  body: string;
  advantages: string[];
  disadvantages: string[];
  recommendStatus: ReviewRecommendStatus | string;
  isBuyer: boolean;
  likesCount: number;
  dislikesCount: number;
  userVote?: ReviewVoteType | null;
  createdAt: string;
  replies: ProductReviewReply[];
  media: ProductReviewMedia[];
};

export type ProductReviewsPage = {
  items: ProductReview[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type GetProductReviewsParams = {
  page?: number;
  pageSize?: number;
  sort?: string;
};

export type CreateProductReviewRequest = {
  rating: number;
  body: string;
  title: string;
  advantages: string[];
  disadvantages: string[];
  recommendStatus: ReviewRecommendStatus;
  mediaIds?: string[];
};

export type ProductReviewsSummary = {
  productId: string;
  totalReviews: number;
  averageRating: number;
  rating1Count: number;
  rating2Count: number;
  rating3Count: number;
  rating4Count: number;
  rating5Count: number;
  recommendedCount: number;
  notRecommendedCount: number;
  buyerReviewCount: number;
};

export type ReviewVoteType = "like" | "dislike";

export type VoteReviewRequest = {
  voteType: ReviewVoteType;
};

export type ReportReviewRequest = {
  reason: string;
  description: string;
};

export type ReviewMediaCapabilities = {
  enabled: boolean;
  maxImagesPerReview: number;
  maxVideosPerReview: number;
  maxImageSizeBytes: number;
  maxVideoSizeBytes: number;
  maxVideoDurationSeconds: number;
  allowedImageExtensions: string[];
  allowedImageMimeTypes: string[];
  allowedVideoExtensions: string[];
  allowedVideoMimeTypes: string[];
  uploadSessionMinutes: number;
  requireMediaModeration: boolean;
};

export type CreateReviewMediaUploadRequest = {
  fileName: string;
  mediaType: ProductReviewMediaType;
  contentType: string;
  size: number;
};

export type ReviewMediaUploadSession = {
  mediaId: string;
  uploadUrl: string;
  expiresAt?: string;
  maxAllowedSize?: number;
};
