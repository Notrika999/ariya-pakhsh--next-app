export type CommunityReviewStatus = "approved" | "pending" | "rejected" | string;
export type CommunityQuestionStatus =
  | "answered"
  | "pending"
  | "rejected"
  | string;

export type CommunitySummary = {
  reviewsCount: number;
  questionsCount: number;
};

export type MyReviewItem = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productCode: string;
  productImageUrl: string;
  rating: number;
  title: string;
  body: string;
  advantages: string[];
  disadvantages: string[];
  recommendStatus: "neutral" | "recommended" | "notRecommended" | string;
  status: CommunityReviewStatus;
  statusLabel: string;
  likesCount: number;
  canEdit: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MyReviewsPage = {
  items: MyReviewItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type UpdateMyReviewRequest = {
  rating: number;
  title: string;
  body: string;
  advantages: string[];
  disadvantages: string[];
  recommendStatus: MyReviewItem["recommendStatus"];
};

export type MyQuestionAnswer = {
  id: string;
  body: string;
  createdAt: string;
};

export type MyQuestionItem = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productCode: string;
  productImageUrl: string;
  body: string;
  status: CommunityQuestionStatus;
  displayStatus: string;
  displayStatusLabel: string;
  createdAt: string;
  officialAnswer: MyQuestionAnswer | null;
};

export type MyQuestionsPage = {
  items: MyQuestionItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type CommunityPageParams = {
  page?: number;
  pageSize?: number;
};
