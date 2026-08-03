export type ReviewRecommendStatus = "neutral" | "recommended" | "notRecommended";

export type ProductReviewReply = {
  id: string;
  body: string;
  isOfficial: boolean;
  userDisplayName: string;
  createdAt: string;
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
