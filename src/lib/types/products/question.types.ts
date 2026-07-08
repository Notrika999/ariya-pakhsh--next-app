export type ProductQuestionAnswer = {
  id: string;
  questionId: string;
  userId: string;
  userDisplayName: string;
  body: string;
  isOfficial: boolean;
  likesCount: number;
  dislikesCount: number;
  createdAt: string;
};

export type ProductQuestion = {
  id: string;
  productId: string;
  userId: string;
  userDisplayName: string;
  body: string;
  createdAt: string;
  answers: ProductQuestionAnswer[];
};

export type ProductQuestionsPage = {
  items: ProductQuestion[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type GetProductQuestionsParams = {
  page?: number;
  pageSize?: number;
  sort?: string;
};

export type CreateProductQuestionRequest = {
  body: string;
};

export type CreateQuestionAnswerRequest = {
  body: string;
};

export type QuestionVoteType = "like" | "dislike";

export type ReportQuestionRequest = {
  reason: string;
  description: string;
};
