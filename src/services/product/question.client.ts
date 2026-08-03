"use client";

import { apiClient, ApiError } from "@/src/lib/http/api-client";
import type {
  CreateProductQuestionRequest,
  CreateQuestionAnswerRequest,
  GetProductQuestionsParams,
  ProductQuestion,
  ProductQuestionAnswer,
  ProductQuestionsPage,
  QuestionVoteType,
  ReportQuestionRequest,
} from "@/src/lib/types/products/question.types";

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function logApiError(label: string, error: unknown) {

  if (error instanceof ApiError) {
    console.error(`[question.client] ${label} error body =>`, {
      status: error.status,
      code: error.code,
      message: error.message,
      data: error.data,
    });
  }
}

function normalizeQuestionVote(value: unknown): QuestionVoteType | null {
  return value === "like" || value === "dislike" ? value : null;
}

function mapAnswer(value: unknown): ProductQuestionAnswer {
  const record = getRecord(value);
  return {
    id: String(record.id ?? ""),
    questionId: String(record.questionId ?? ""),
    userId: String(record.userId ?? ""),
    userDisplayName: String(record.userDisplayName ?? "کاربر"),
    body: String(record.body ?? ""),
    isOfficial: Boolean(record.isOfficial),
    likesCount: Number(record.likesCount ?? 0),
    dislikesCount: Number(record.dislikesCount ?? 0),
    userVote: normalizeQuestionVote(
      record.userVote ?? record.currentUserVote ?? record.myVote,
    ),
    createdAt: String(record.createdAt ?? ""),
  };
}

function mapQuestion(value: unknown): ProductQuestion {
  const record = getRecord(value);
  return {
    id: String(record.id ?? ""),
    productId: String(record.productId ?? ""),
    userId: String(record.userId ?? ""),
    userDisplayName: String(record.userDisplayName ?? "کاربر"),
    body: String(record.body ?? ""),
    createdAt: String(record.createdAt ?? ""),
    answers: Array.isArray(record.answers)
      ? record.answers.map(mapAnswer)
      : [],
  };
}

function unwrapQuestionsPage(payload: unknown): ProductQuestionsPage {
  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);

  const itemsRaw = Array.isArray(data.items)
    ? data.items
    : Array.isArray(root.items)
      ? root.items
      : [];

  const items = itemsRaw.map(mapQuestion);

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

export async function getProductQuestions(
  productId: string,
  params: GetProductQuestionsParams = {},
): Promise<ProductQuestionsPage> {
  const query = {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
    sort: params.sort ?? "newest",
  };

  

  try {
    const response = await apiClient.get(`/products/${productId}/questions`, {
      params: query,
    });
  
    return unwrapQuestionsPage(response.data);
  } catch (error) {
    logApiError("getProductQuestions", error);
    throw error;
  }
}

export async function createProductQuestion(
  productId: string,
  body: CreateProductQuestionRequest,
): Promise<unknown> {


  try {
    const response = await apiClient.post(
      `/products/${productId}/questions`,
      body,
    );
   
    return response.data;
  } catch (error) {
    logApiError("createProductQuestion", error);
    throw error;
  }
}

export async function createQuestionAnswer(
  questionId: string,
  body: CreateQuestionAnswerRequest,
): Promise<unknown> {


  try {
    const response = await apiClient.post(
      `/Questions/${questionId}/answers`,
      body,
    );

    return response.data;
  } catch (error) {
    logApiError("createQuestionAnswer", error);
    throw error;
  }
}

export async function voteQuestionAnswer(
  answerId: string,
  voteType: QuestionVoteType,
): Promise<unknown> {
  const body = { voteType };


  try {
    const response = await apiClient.post(
      `/Questions/answers/${answerId}/vote`,
      body,
    );
   
    return response.data;
  } catch (error) {
    logApiError("voteQuestionAnswer", error);
    throw error;
  }
}

export async function reportProductQuestion(
  questionId: string,
  body: ReportQuestionRequest,
): Promise<unknown> {
  
  try {
    const response = await apiClient.post(
      `/Questions/${questionId}/report`,
      body,
    );
   
    return response.data;
  } catch (error) {
    logApiError("reportProductQuestion", error);
    throw error;
  }
}
