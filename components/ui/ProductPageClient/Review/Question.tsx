"use client";
// components/ui/ProductPageClient/Review/Question.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  createProductQuestion,
  createQuestionAnswer,
  getProductQuestions,
  reportProductQuestion,
  voteQuestionAnswer,
} from "@/src/services/product/question.client";
import type {
  ProductQuestion,
  ProductQuestionAnswer,
  QuestionVoteType,
} from "@/src/lib/types/products/question.types";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { notify } from "@/src/utils/toast";

type QuestionProps = {
  productId: string;
};

const PAGE_SIZE = 10;

const REPORT_REASONS = [
  "محتوای نامناسب",
  "اسپم یا تبلیغات",
  "اطلاعات نادرست",
  "توهین یا تمسخر",
  "سایر",
];

function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function AnswerCard({
  answer,
  onVoted,
}: {
  answer: ProductQuestionAnswer;
  onVoted: (answerId: string, patch: Partial<ProductQuestionAnswer>) => void;
}) {
  const [voting, setVoting] = useState(false);
  const [userVote, setUserVote] = useState<QuestionVoteType | null>(
    answer.userVote ?? null,
  );

  const handleVote = async (voteType: QuestionVoteType) => {
    if (voting) return;
    if (userVote === voteType) return;

    setVoting(true);
    try {
      const previousVote = userVote;

      await voteQuestionAnswer(answer.id, voteType);
      setUserVote(voteType);
      onVoted(answer.id, {
        userVote: voteType,
        likesCount:
          answer.likesCount +
          (voteType === "like" ? 1 : 0) -
          (previousVote === "like" ? 1 : 0),
        dislikesCount:
          answer.dislikesCount +
          (voteType === "dislike" ? 1 : 0) -
          (previousVote === "dislike" ? 1 : 0),
      });
      notify.success(
        voteType === "like" ? "رأی مثبت ثبت شد" : "رأی منفی ثبت شد",
      );
    } catch (error) {
      console.error("[Question] vote answer failed =>", error);
      notify.error(getAuthErrorMessage(error));
    } finally {
      setVoting(false);
    }
  };

  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${
        answer.isOfficial
          ? "border-green-200 bg-white dark:border-green-800 dark:bg-zinc-800"
          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-zinc-800"
      }`}
    >
      <div className="mb-3 flex items-start gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${
            answer.isOfficial
              ? "bg-gradient-to-br from-green-500 to-emerald-500"
              : "bg-gradient-to-br from-primary to-primary-600"
          }`}
        >
          {(answer.userDisplayName || "ک").charAt(0)}
        </div>
        <div className="flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-gray-800 dark:text-white">
              {answer.userDisplayName || "کاربر"}
            </span>
            {answer.isOfficial && (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900 dark:text-green-200">
                رسمی
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {answer.body}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(answer.createdAt)}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleVote("like")}
            disabled={voting || userVote === "like"}
            aria-pressed={userVote === "like"}
            className={`flex items-center gap-1 transition hover:text-green-500 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-green-400 ${
              userVote === "like"
                ? "text-green-600 dark:text-green-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <i className="far fa-thumbs-up" />
            <span className="text-sm font-medium">
              {new Intl.NumberFormat("fa-IR").format(answer.likesCount)}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleVote("dislike")}
            disabled={voting || userVote === "dislike"}
            aria-pressed={userVote === "dislike"}
            className={`flex items-center gap-1 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-red-400 ${
              userVote === "dislike"
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <i className="far fa-thumbs-down" />
            <span className="text-sm font-medium">
              {new Intl.NumberFormat("fa-IR").format(answer.dislikesCount)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  onAnswerAdded,
  onAnswerVoted,
}: {
  question: ProductQuestion;
  onAnswerAdded: (questionId: string) => void;
  onAnswerVoted: (
    questionId: string,
    answerId: string,
    patch: Partial<ProductQuestionAnswer>,
  ) => void;
}) {
  const [showAnswers, setShowAnswers] = useState(true);
  const [answerBody, setAnswerBody] = useState("");
  const [answering, setAnswering] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportDescription, setReportDescription] = useState("");
  const [reporting, setReporting] = useState(false);
  const [usefulVoting, setUsefulVoting] = useState(false);

  const usefulCount = question.answers.reduce(
    (sum, answer) => sum + answer.likesCount,
    0,
  );
  const usefulVoteAnswer =
    question.answers.find((answer) => answer.isOfficial) ??
    question.answers[0] ??
    null;
  const hasUsefulVote = question.answers.some(
    (answer) => answer.userVote === "like",
  );

  const handleUsefulVote = async () => {
    if (usefulVoting || !usefulVoteAnswer || hasUsefulVote) return;

    setUsefulVoting(true);
    try {
      const previousVote = usefulVoteAnswer.userVote ?? null;

      await voteQuestionAnswer(usefulVoteAnswer.id, "like");
      onAnswerVoted(question.id, usefulVoteAnswer.id, {
        userVote: "like",
        likesCount:
          usefulVoteAnswer.likesCount + (previousVote === "like" ? 0 : 1),
        dislikesCount:
          usefulVoteAnswer.dislikesCount -
          (previousVote === "dislike" ? 1 : 0),
      });
      notify.success("رأی مثبت ثبت شد");
    } catch (error) {
      console.error("[Question] useful vote failed =>", error);
      notify.error(getAuthErrorMessage(error));
    } finally {
      setUsefulVoting(false);
    }
  };

  const handleAnswer = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!answerBody.trim()) {
      notify.error("متن پاسخ الزامی است");
      return;
    }

    setAnswering(true);
    try {
      await createQuestionAnswer(question.id, { body: answerBody.trim() });
      notify.success("پاسخ شما ثبت شد");
      setAnswerBody("");
      onAnswerAdded(question.id);
    } catch (error) {
      console.error("[Question] create answer failed =>", error);
      notify.error(getAuthErrorMessage(error));
    } finally {
      setAnswering(false);
    }
  };

  const handleReport = async (event: React.FormEvent) => {
    event.preventDefault();
    setReporting(true);
    try {
      await reportProductQuestion(question.id, {
        reason: reportReason.trim(),
        description: reportDescription.trim(),
      });
      notify.success("گزارش شما ثبت شد");
      setReportOpen(false);
      setReportDescription("");
    } catch (error) {
      console.error("[Question] report failed =>", error);
      notify.error(getAuthErrorMessage(error));
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-zinc-800">
      <div className="p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-sm font-bold text-white">
              {(question.userDisplayName || "ک").charAt(0)}
            </div>
            <div>
              <div className="font-bold text-gray-800 dark:text-white">
                {question.userDisplayName || "کاربر"}
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <i className="far fa-clock" />
                {formatDate(question.createdAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                question.answers.length > 0
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                  : "bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-300"
              }`}
            >
              {question.answers.length > 0 ? "پاسخ داده شده" : "بدون پاسخ"}
            </span>
            <button
              type="button"
              onClick={() => setReportOpen((open) => !open)}
              className="text-sm text-gray-500 hover:text-primary dark:text-gray-400"
            >
              گزارش
            </button>
          </div>
        </div>

        <h3 className="mb-3 text-base font-semibold leading-relaxed text-gray-800 dark:text-white">
          {question.body}
        </h3>

        <div className="mb-4 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <i className="far fa-comments" />
            {new Intl.NumberFormat("fa-IR").format(question.answers.length)} پاسخ
          </div>
          <button
            type="button"
            onClick={handleUsefulVote}
            disabled={usefulVoting || !usefulVoteAnswer || hasUsefulVote}
            aria-pressed={hasUsefulVote}
            className={`flex items-center gap-1 transition hover:text-green-500 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-green-400 ${
              hasUsefulVote
                ? "text-green-600 dark:text-green-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
            title={
              !usefulVoteAnswer
                ? "برای ثبت رأی، ابتدا باید پاسخی وجود داشته باشد"
                : hasUsefulVote
                  ? "شما قبلا این پاسخ را مفید دانسته‌اید"
                  : "ثبت رأی مفید"
            }
          >
            <i className="far fa-thumbs-up" />
            {new Intl.NumberFormat("fa-IR").format(usefulCount)} مفید
          </button>
          <button
            type="button"
            onClick={() => setShowAnswers((open) => !open)}
            className="text-primary hover:opacity-80"
          >
            {showAnswers ? "بستن پاسخ‌ها" : "مشاهده پاسخ‌ها"}
          </button>
        </div>

        {reportOpen && (
          <form
            onSubmit={handleReport}
            className="mb-4 space-y-3 rounded-xl border border-gray-200 bg-custom-light p-4 dark:border-gray-700 dark:bg-zinc-900"
          >
            <div>
              <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                دلیل گزارش
              </label>
              <select
                value={reportReason}
                onChange={(event) => setReportReason(event.target.value)}
                disabled={reporting}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-200"
              >
                {REPORT_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                توضیحات
              </label>
              <textarea
                value={reportDescription}
                onChange={(event) => setReportDescription(event.target.value)}
                disabled={reporting}
                rows={3}
                placeholder="توضیح بیشتر (اختیاری)"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-200"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={reporting}
                className="rounded-lg bg-primary px-4 py-2 text-sm text-white disabled:opacity-60"
              >
                {reporting ? "در حال ارسال..." : "ارسال گزارش"}
              </button>
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                disabled={reporting}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 dark:bg-zinc-700 dark:text-gray-200"
              >
                انصراف
              </button>
            </div>
          </form>
        )}
      </div>

      {showAnswers && (
        <div className="border-t border-gray-200 bg-custom-light dark:border-gray-700 dark:bg-zinc-900/40">
          <div className="space-y-4 p-6">
            {question.answers.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                هنوز پاسخی ثبت نشده است.
              </p>
            )}

            {question.answers.map((answer) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
                onVoted={(answerId, patch) =>
                  onAnswerVoted(question.id, answerId, patch)
                }
              />
            ))}

            <form onSubmit={handleAnswer} className="space-y-3">
              <textarea
                value={answerBody}
                onChange={(event) => setAnswerBody(event.target.value)}
                disabled={answering}
                rows={3}
                placeholder="پاسخ خود را بنویسید..."
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-800 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-200"
              />
              <button
                type="submit"
                disabled={answering}
                className="rounded-lg bg-primary px-5 py-2 text-sm text-white hover:bg-primary-600 disabled:opacity-60"
              >
                {answering ? "در حال ثبت..." : "ثبت پاسخ"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Question({ productId }: QuestionProps) {
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionBody, setQuestionBody] = useState("");

  const loadQuestions = useCallback(
    async (pageNumber: number, append: boolean) => {
      if (!productId) return;

      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        const result = await getProductQuestions(productId, {
          page: pageNumber,
          pageSize: PAGE_SIZE,
          sort,
        });

        setQuestions((prev) =>
          append ? [...prev, ...result.items] : result.items,
        );
        setPage(result.pageNumber || pageNumber);
        setTotalCount(result.totalCount);
        setHasNextPage(
          result.hasNextPage || result.pageNumber < result.totalPages,
        );
      } catch (err) {
        console.error("[Question] loadQuestions failed =>", err);
        setError(getAuthErrorMessage(err));
        if (!append) setQuestions([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [productId, sort],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadQuestions(1, false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadQuestions]);

  const filteredQuestions = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return questions;
    return questions.filter(
      (item) =>
        item.body.toLowerCase().includes(term) ||
        item.userDisplayName.toLowerCase().includes(term) ||
        item.answers.some((answer) =>
          answer.body.toLowerCase().includes(term),
        ),
    );
  }, [questions, search]);

  const handleSubmitQuestion = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!productId) {
      notify.error("شناسه محصول نامعتبر است");
      return;
    }
    if (!questionBody.trim()) {
      notify.error("متن سوال الزامی است");
      return;
    }

    setSubmitting(true);
    try {
      await createProductQuestion(productId, { body: questionBody.trim() });
      notify.success("سوال شما ثبت شد");
      setQuestionBody("");
      await loadQuestions(1, false);
    } catch (err) {
      console.error("[Question] create question failed =>", err);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswerAdded = async () => {
    await loadQuestions(1, false);
  };

  const handleAnswerVoted = (
    questionId: string,
    answerId: string,
    patch: Partial<ProductQuestionAnswer>,
  ) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers: question.answers.map((answer) =>
                answer.id === answerId ? { ...answer, ...patch } : answer,
              ),
            }
          : question,
      ),
    );
  };

  return (
    <>
      <div className="space-y-4">
        <h2 className="relative pb-3 md:text-2xl text-lg font-black text-zinc-800 before:absolute before:bottom-0 before:start-0 before:h-1 before:w-22 before:rounded before:bg-primary-500 dark:text-white">
          سوالی داری در مورد این محصول؟
        </h2>
        <p className="text-sm text-neutral-700 dark:text-white">
          سوال خود را ثبت کنید تا فروشنده یا سایر کاربران پاسخ دهند.
        </p>
      </div>

      <div className="my-5 w-full border-b border-b-gray-300 pb-4 dark:border-b-gray-700">
        <form onSubmit={handleSubmitQuestion}>
          <div>
            <label htmlFor="questionBody" className="mb-3 inline-block">
              سوال شما:
            </label>
            <textarea
              id="questionBody"
              value={questionBody}
              onChange={(event) => setQuestionBody(event.target.value)}
              placeholder="متن سوال را بنویسید..."
              disabled={submitting}
              className="mb-4 h-32 w-full rounded-lg border border-gray-300 bg-white px-3 py-4 text-gray-800 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-20 py-3 text-white hover:bg-primary-600 disabled:opacity-60"
          >
            {submitting ? "در حال ثبت..." : "ثبت سوال"}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-custom-light p-6 dark:border-zinc-700 dark:bg-zinc-800 md:flex-row md:items-center md:justify-between hidden">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <i className="fas fa-arrow-down-short-wide" />
              <span className="text-sm font-medium">مرتب‌سازی:</span>
            </div>
            <div className="flex gap-2 overflow-x-scroll whitespace-nowrap pb-2 hide-scrollbar">
              {(
                [
                  { id: "newest", label: "جدیدترین" },
                  { id: "popular", label: "محبوب‌ترین" },
                  { id: "answered", label: "دارای پاسخ" },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSort(option.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    sort === option.id
                      ? "bg-primary text-white shadow-sm hover:bg-primary/90"
                      : "border border-gray-300 bg-white text-gray-700 hover:border-primary hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-primary">
                {new Intl.NumberFormat("fa-IR").format(totalCount)}
              </span>{" "}
              سوال
            </div>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="جستجو در سوالات..."
                className="rounded-lg border border-gray-300 bg-white py-2 pe-10 ps-4 text-sm text-gray-800 placeholder-gray-500 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-200 dark:placeholder-gray-400"
              />
              <i className="fa fa-search absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>

        {loading && (
          <p className="py-8 text-center text-sm text-gray-500">
            در حال بارگذاری سوالات...
          </p>
        )}

        {!loading && error && (
          <p className="py-8 text-center text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && filteredQuestions.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            هنوز سوالی برای این محصول ثبت نشده است.
          </p>
        )}

        <div className="space-y-6">
          {!loading &&
            filteredQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onAnswerAdded={handleAnswerAdded}
                onAnswerVoted={handleAnswerVoted}
              />
            ))}
        </div>

        {!loading && hasNextPage && (
          <div className="pt-6 text-center">
            <button
              type="button"
              onClick={() => loadQuestions(page + 1, true)}
              disabled={loadingMore}
              className="rounded-xl border border-gray-300 px-8 py-3 font-medium text-gray-600 transition-all duration-200 hover:border-primary hover:text-primary disabled:opacity-60 dark:border-gray-600 dark:text-gray-400"
            >
              {loadingMore ? "در حال بارگذاری..." : "مشاهده سوالات بیشتر"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
