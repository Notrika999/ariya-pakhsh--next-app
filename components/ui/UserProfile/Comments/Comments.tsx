"use client";
// components/ui/UserProfile/Comments/Comments.tsx
import React, { useCallback, useEffect, useState } from "react";
import CommentsTop from "./CommentsTop";
import TabsSection from "../../../modules/TabsSection/TabsSection";
import CommentSection from "./CommentSection";
import QuestionsSection from "./QuestionsSection";
import {
  deleteMyQuestion,
  deleteMyReview,
  getMyCommunitySummary,
  getMyQuestions,
  getMyReviews,
  updateMyReview,
} from "@/src/services/community/community.client";
import type {
  CommunitySummary,
  MyQuestionsPage,
  MyReviewsPage,
  UpdateMyReviewRequest,
} from "@/src/lib/types/userpanel/comments";
import { notify } from "@/src/utils/toast";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";

const PAGE_SIZE = 10;

const EMPTY_SUMMARY: CommunitySummary = {
  reviewsCount: 0,
  questionsCount: 0,
};

const EMPTY_REVIEWS_PAGE: MyReviewsPage = {
  items: [],
  pageNumber: 1,
  pageSize: PAGE_SIZE,
  totalCount: 0,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};

const EMPTY_QUESTIONS_PAGE: MyQuestionsPage = {
  items: [],
  pageNumber: 1,
  pageSize: PAGE_SIZE,
  totalCount: 0,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};

function pageStart(pageNumber: number, pageSize: number, totalCount: number) {
  if (totalCount <= 0) return 0;
  return (Math.max(pageNumber, 1) - 1) * Math.max(pageSize, 1) + 1;
}

function pageEnd(pageNumber: number, pageSize: number, totalCount: number) {
  if (totalCount <= 0) return 0;
  return Math.min(pageStart(pageNumber, pageSize, totalCount) + pageSize - 1, totalCount);
}

function Pagination({
  page,
  itemLabel,
  onPrevious,
  onNext,
  disabled,
}: {
  page: MyReviewsPage | MyQuestionsPage;
  itemLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  disabled: boolean;
}) {
  const numberFormatter = new Intl.NumberFormat("fa-IR");
  const start = pageStart(page.pageNumber, page.pageSize, page.totalCount);
  const end = pageEnd(page.pageNumber, page.pageSize, page.totalCount);

  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
          نمایش {numberFormatter.format(start)} تا {numberFormatter.format(end)} از{" "}
          {numberFormatter.format(page.totalCount)} {itemLabel}
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={disabled || !page.hasPreviousPage}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-white"
          >
            <i className="far fa-angle-right me-1" />
            قبلی
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={disabled || !page.hasNextPage}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-white"
          >
            بعدی
            <i className="far fa-angle-left ms-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Comments() {
  const [activeTab, setActiveTab] = useState("my-comments");
  const [summary, setSummary] = useState<CommunitySummary>(EMPTY_SUMMARY);
  const [reviewsPage, setReviewsPage] = useState<MyReviewsPage>(EMPTY_REVIEWS_PAGE);
  const [questionsPage, setQuestionsPage] =
    useState<MyQuestionsPage>(EMPTY_QUESTIONS_PAGE);
  const [reviewsPageNumber, setReviewsPageNumber] = useState(1);
  const [questionsPageNumber, setQuestionsPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);
  const [updatingReviewId, setUpdatingReviewId] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    const nextSummary = await getMyCommunitySummary();
    setSummary(nextSummary);
  }, []);

  const loadReviews = useCallback(async (page: number) => {
    const nextPage = await getMyReviews({ page, pageSize: PAGE_SIZE });
    setReviewsPage(nextPage);
  }, []);

  const loadQuestions = useCallback(async (page: number) => {
    const nextPage = await getMyQuestions({ page, pageSize: PAGE_SIZE });
    setQuestionsPage(nextPage);
  }, []);

  const loadCurrentTab = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([
        loadSummary(),
        activeTab === "my-comments"
          ? loadReviews(reviewsPageNumber)
          : loadQuestions(questionsPageNumber),
      ]);
    } catch (err) {
      console.error("[UserProfileComments] load failed =>", err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [
    activeTab,
    loadQuestions,
    loadReviews,
    loadSummary,
    questionsPageNumber,
    reviewsPageNumber,
  ]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void loadCurrentTab();
  }, [loadCurrentTab]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleDeleteReview = async (reviewId: string) => {
    if (deletingReviewId) return;
    if (!window.confirm("آیا از حذف این نظر مطمئن هستید؟")) return;

    setDeletingReviewId(reviewId);
    try {
      await deleteMyReview(reviewId);
      notify.success("نظر حذف شد");
      await Promise.all([loadSummary(), loadReviews(reviewsPageNumber)]);
    } catch (err) {
      console.error("[UserProfileComments] delete review failed =>", err);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setDeletingReviewId(null);
    }
  };

  const handleUpdateReview = async (
    reviewId: string,
    body: UpdateMyReviewRequest,
  ) => {
    if (updatingReviewId) return;

    setUpdatingReviewId(reviewId);
    try {
      await updateMyReview(reviewId, body);
      notify.success("نظر ویرایش شد");
      await loadReviews(reviewsPageNumber);
    } catch (err) {
      console.error("[UserProfileComments] update review failed =>", err);
      notify.error(getAuthErrorMessage(err));
      throw err;
    } finally {
      setUpdatingReviewId(null);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (deletingQuestionId) return;
    if (!window.confirm("آیا از حذف این پرسش مطمئن هستید؟")) return;

    setDeletingQuestionId(questionId);
    try {
      await deleteMyQuestion(questionId);
      notify.success("پرسش حذف شد");
      await Promise.all([loadSummary(), loadQuestions(questionsPageNumber)]);
    } catch (err) {
      console.error("[UserProfileComments] delete question failed =>", err);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setDeletingQuestionId(null);
    }
  };

  const currentPage =
    activeTab === "my-comments" ? reviewsPage : questionsPage;
  const currentItemLabel = activeTab === "my-comments" ? "نظر" : "پرسش";
  const shouldShowPagination =
    currentPage.totalPages > 1 ||
    currentPage.hasPreviousPage ||
    currentPage.hasNextPage;

  return (
    <div className="lg:col-span-3 space-y-4">
      <CommentsTop
        reviewsCount={summary.reviewsCount}
        questionsCount={summary.questionsCount}
      />

      <TabsSection
        defaultTab="my-comments"
        onChange={setActiveTab}
        tabs={[
          {
            key: "my-comments",
            label: "نظرات من",
            iconClass: "fa fa-star",
          },
          {
            key: "my-questions",
            label: "پرسش‌های من",
            iconClass: "fa-solid fa-question",
          },
        ]}
      />

      {loading ? (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 drop-shadow-lg dark:bg-custom-dark dark:text-gray-400">
          در حال دریافت اطلاعات...
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-red-500 drop-shadow-lg dark:bg-custom-dark">
          {error}
        </div>
      ) : null}

      {!loading && !error && activeTab === "my-comments" ? (
        <CommentSection
          comments={reviewsPage.items}
          deletingId={deletingReviewId}
          updatingId={updatingReviewId}
          onDelete={handleDeleteReview}
          onUpdate={handleUpdateReview}
        />
      ) : null}

      {!loading && !error && activeTab === "my-questions" ? (
        <QuestionsSection
          questions={questionsPage.items}
          deletingId={deletingQuestionId}
          onDelete={handleDeleteQuestion}
        />
      ) : null}

      {!loading && !error && shouldShowPagination ? (
        <Pagination
          page={currentPage}
          itemLabel={currentItemLabel}
          disabled={loading}
          onPrevious={() => {
            if (activeTab === "my-comments") {
              setReviewsPageNumber((page) => Math.max(1, page - 1));
            } else {
              setQuestionsPageNumber((page) => Math.max(1, page - 1));
            }
          }}
          onNext={() => {
            if (activeTab === "my-comments") {
              setReviewsPageNumber((page) => page + 1);
            } else {
              setQuestionsPageNumber((page) => page + 1);
            }
          }}
        />
      ) : null}
    </div>
  );
}
