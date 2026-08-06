"use client";
// components/ui/ProductPageClient/Review/Comments.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  createProductReview,
  deleteProductReview,
  getProductReviews,
  getProductReviewsSummary,
  reportProductReview,
  voteProductReview,
} from "@/src/services/product/review.client";
import type {
  ProductReview,
  ProductReviewsSummary,
  ReviewRecommendStatus,
  ReviewVoteType,
} from "@/src/lib/types/products/review.types";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";
import { notify } from "@/src/utils/toast";

type CommentsProps = {
  productId: string;
  averageRating?: number | null;
  reviewCount?: number | null;
};

const PAGE_SIZE = 10;
const DEFAULT_REVIEW_RATING = 5;

const REPORT_REASONS = [
  "محتوای نامناسب",
  "اسپم یا تبلیغات",
  "اطلاعات نادرست",
  "توهین یا تمسخر",
  "سایر",
];

function formatReviewDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function StarRow({ rating, size = "text-sm" }: { rating: number; size?: string }) {
  const filled = Math.round(rating);
  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, index) => (
        <i
          key={index}
          className={`fa fa-star ms-1 ${size} ${
            index < filled
              ? "text-orange-400"
              : "text-gray-300 dark:text-gray-500"
          }`}
        />
      ))}
    </div>
  );
}

function TagInput({
  label,
  placeholder,
  values,
  onChange,
  tone,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (next: string[]) => void;
  tone: "green" | "red";
}) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const value = draft.trim();
    if (!value || values.includes(value)) return;
    onChange([...values, value]);
    setDraft("");
  };

  return (
    <div>
      <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex min-h-[50px] flex-wrap items-center gap-2 rounded-lg border border-gray-300 bg-custom-light p-2 dark:border-gray-700 dark:bg-zinc-800">
        {values.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
              tone === "green"
                ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"
            }`}
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(values.filter((item) => item !== tag))}
              className="opacity-70 hover:opacity-100"
              aria-label={`حذف ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          className="grow bg-transparent px-3 py-2 text-gray-800 outline-none placeholder:text-gray-500 dark:text-gray-200"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function ReviewCard({
  review,
  currentUserId,
  onChanged,
  onDeleted,
}: {
  review: ProductReview;
  currentUserId?: string | null;
  onChanged: (reviewId: string, patch: Partial<ProductReview>) => void;
  onDeleted: (reviewId: string) => void;
}) {
  const [voting, setVoting] = useState(false);
  const [userVote, setUserVote] = useState<ReviewVoteType | null>(
    review.userVote ?? null,
  );
  const [deleting, setDeleting] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportDescription, setReportDescription] = useState("");
  const [reporting, setReporting] = useState(false);

  const isOwner = Boolean(
    currentUserId && review.userId && currentUserId === review.userId,
  );

  const handleVote = async (voteType: ReviewVoteType) => {
    if (voting) return;
    if (userVote === voteType) return;

    setVoting(true);
    try {
      const previousVote = userVote;

      await voteProductReview(review.id, voteType);
      setUserVote(voteType);
      onChanged(review.id, {
        userVote: voteType,
        likesCount:
          review.likesCount +
          (voteType === "like" ? 1 : 0) -
          (previousVote === "like" ? 1 : 0),
        dislikesCount:
          review.dislikesCount +
          (voteType === "dislike" ? 1 : 0) -
          (previousVote === "dislike" ? 1 : 0),
      });
      notify.success(
        voteType === "like" ? "رأی مثبت ثبت شد" : "رأی منفی ثبت شد",
      );

    } catch (error) {
      console.error("[Comments] vote failed =>", error);
      notify.error(getAuthErrorMessage(error));
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    if (!window.confirm("آیا از حذف این نظر مطمئن هستید؟")) return;

    setDeleting(true);
    try {
      await deleteProductReview(review.id);
      onDeleted(review.id);
      notify.success("نظر حذف شد");
    } catch (error) {
      console.error("[Comments] delete failed =>", error);
      notify.error(getAuthErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  const handleReport = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!reportReason.trim()) {
      notify.error("دلیل گزارش را انتخاب کنید");
      return;
    }

    setReporting(true);
    try {
      await reportProductReview(review.id, {
        reason: reportReason.trim(),
        description: reportDescription.trim(),
      });
      notify.success("گزارش شما ثبت شد");
      setReportOpen(false);
      setReportDescription("");
    } catch (error) {
      console.error("[Comments] report failed =>", error);
      notify.error(getAuthErrorMessage(error));
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-zinc-800">
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              {(review.userDisplayName || "ک").charAt(0)}
            </div>
            <div>
              <div className="font-bold text-gray-800 dark:text-gray-200">
                {review.userDisplayName || "کاربر"}
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {formatReviewDate(review.createdAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {review.isBuyer && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                خریدار
              </span>
            )}
            {isOwner && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg px-2 py-1 text-xs text-red-500 hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-950/30"
              >
                {deleting ? "در حال حذف..." : "حذف"}
              </button>
            )}
          </div>
        </div>

        <div className="mb-3">
          <StarRow rating={review.rating} />
        </div>

        {review.title && (
          <h4 className="mb-2 font-bold text-gray-800 dark:text-gray-100">
            {review.title}
          </h4>
        )}

        <p className="mb-5 text-justify leading-7 text-gray-700 dark:text-gray-300">
          {review.body}
        </p>

        {(review.advantages.length > 0 || review.disadvantages.length > 0) && (
          <div className="mb-5 space-y-1">
            {review.advantages.map((item) => (
              <div key={`adv-${item}`} className="flex items-center rounded-lg p-2">
                <i className="far fa-check me-3 text-green-600 dark:text-green-400" />
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
            {review.disadvantages.map((item) => (
              <div key={`dis-${item}`} className="flex items-center rounded-lg p-2">
                <i className="far fa-x me-3 text-red-500 dark:text-red-400" />
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        )}

        {review.replies?.length > 0 && (
          <div className="mb-5 space-y-3 rounded-xl bg-custom-light p-4 dark:bg-zinc-900">
            {review.replies.map((reply) => (
              <div
                key={reply.id}
                className="border-b border-gray-200 pb-3 last:border-0 last:pb-0 dark:border-gray-700"
              >
                <div className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                  {reply.userDisplayName || "پاسخ"}
                  {reply.isOfficial && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      رسمی
                    </span>
                  )}
                </div>
                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {reply.body}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {review.recommendStatus === "recommended"
              ? "پیشنهاد می‌کند"
              : review.recommendStatus === "notRecommended"
                ? "پیشنهاد نمی‌کند"
                : "نظری درباره پیشنهاد ندارد"}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              آیا این دیدگاه برایتان مفید بود؟
            </span>
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
                {new Intl.NumberFormat("fa-IR").format(review.likesCount)}
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
                {new Intl.NumberFormat("fa-IR").format(review.dislikesCount)}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setReportOpen((open) => !open)}
              className="text-sm text-gray-500 transition hover:text-primary dark:text-gray-400"
            >
              گزارش
            </button>
          </div>
        </div>

        {reportOpen && (
          <form
            onSubmit={handleReport}
            className="mt-4 space-y-3 rounded-xl border border-gray-200 bg-custom-light p-4 dark:border-gray-700 dark:bg-zinc-900"
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
    </div>
  );
}

export default function Comments({
  productId,
  averageRating,
  reviewCount,
}: CommentsProps) {
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?.userId ?? currentUser?.id ?? null;

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [summary, setSummary] = useState<ProductReviewsSummary | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(reviewCount ?? 0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState(DEFAULT_REVIEW_RATING);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [advantages, setAdvantages] = useState<string[]>([]);
  const [disadvantages, setDisadvantages] = useState<string[]>([]);
  const [recommendStatus, setRecommendStatus] =
    useState<ReviewRecommendStatus>("neutral");

  const ratingDistribution = useMemo(() => {
    const total = summary?.totalReviews || 1;
    const counts = [
      summary?.rating5Count ?? 0,
      summary?.rating4Count ?? 0,
      summary?.rating3Count ?? 0,
      summary?.rating2Count ?? 0,
      summary?.rating1Count ?? 0,
    ];

    return counts.map((count, index) => ({
      stars: 5 - index,
      count,
      percent: Math.round((count / total) * 100),
    }));
  }, [summary]);

  const computedAverage =
    summary?.averageRating ??
    (typeof averageRating === "number" ? averageRating : 0);

  const displayTotal =
    summary?.totalReviews ?? totalCount ?? reviewCount ?? reviews.length;

  const loadSummary = useCallback(async () => {
    if (!productId) return;
    try {
      const result = await getProductReviewsSummary(productId);
      setSummary(result);
      setTotalCount(result.totalReviews);
    } catch (err) {
      console.error("[Comments] loadSummary failed =>", err);
    }
  }, [productId]);

  const loadReviews = useCallback(
    async (pageNumber: number, append: boolean) => {
      if (!productId) return;

      if (append) setLoadingMore(true);
      else setLoading(true);

      setError(null);

      try {
        const result = await getProductReviews(productId, {
          page: pageNumber,
          pageSize: PAGE_SIZE,
          sort,
        });

        setReviews((prev) =>
          append ? [...prev, ...result.items] : result.items,
        );
        setPage(result.pageNumber || pageNumber);
        setTotalCount(result.totalCount);
        setHasNextPage(
          result.hasNextPage || result.pageNumber < result.totalPages,
        );
      } catch (err) {
        console.error("[Comments] loadReviews failed =>", err);
        const message = getAuthErrorMessage(err);
        setError(message);
        if (!append) setReviews([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [productId, sort],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadReviews(1, false);
      void loadSummary();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadReviews, loadSummary]);

  const handleLoadMore = () => {
    if (!hasNextPage || loadingMore) return;
    void loadReviews(page + 1, true);
  };

  const resetForm = () => {
    setRating(DEFAULT_REVIEW_RATING);
    setTitle("");
    setBody("");
    setAdvantages([]);
    setDisadvantages([]);
    setRecommendStatus("neutral");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!productId) {
      notify.error("شناسه محصول نامعتبر است");
      return;
    }
    if (rating < 1 || rating > 5) {
      notify.error("امتیاز خود را انتخاب کنید");
      return;
    }
    if (!body.trim()) {
      notify.error("متن نظر الزامی است");
      return;
    }

    setSubmitting(true);
    try {
      await createProductReview(productId, {
        rating,
        title: title.trim(),
        body: body.trim(),
        advantages,
        disadvantages,
        recommendStatus,
      });
      notify.success("نظر شما با موفقیت ثبت شد");
      resetForm();
      await Promise.all([loadReviews(1, false), loadSummary()]);
    } catch (err) {
      console.error("[Comments] create review failed =>", err);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewChanged = (
    reviewId: string,
    patch: Partial<ProductReview>,
  ) => {
    setReviews((prev) =>
      prev.map((item) => (item.id === reviewId ? { ...item, ...patch } : item)),
    );
  };

  const handleReviewDeleted = (reviewId: string) => {
    setReviews((prev) => prev.filter((item) => item.id !== reviewId));
    void loadSummary();
  };

  return (
    <>
      <div className="space-y-4">
        <h2 className="relative pb-3 md:text-2xl text-lg font-black text-zinc-800 before:absolute before:bottom-0 before:right-0 before:h-1 before:w-22 before:rounded before:bg-secondary-500 dark:text-white">
          نظرت در مورد این محصول چیه؟
        </h2>
        <p className="text-sm text-neutral-700 dark:text-gray-300">
          برای ثبت نظر، فرم زیر را تکمیل کنید.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-6 gap-6">
        <div className="col-span-6 lg:col-span-2">
          <div className="sticky top-0 space-y-4">
            <div className="space-y-6 rounded border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-zinc-800">
              <h4 className="text-2xl dark:text-white">متوسط امتیاز ها</h4>
              <h5 className="text-3xl dark:text-white">
                {computedAverage.toFixed(2)}
              </h5>
              <div className="flex items-center justify-center rounded bg-custom-light p-2 dark:bg-zinc-700">
                <StarRow rating={computedAverage} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                از {new Intl.NumberFormat("fa-IR").format(displayTotal)} نظر
              </p>
              {summary && (
                <div className="space-y-1 border-t border-gray-200 pt-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  <p>
                    پیشنهاد می‌کنند:{" "}
                    {new Intl.NumberFormat("fa-IR").format(
                      summary.recommendedCount,
                    )}
                  </p>
                  <p>
                    پیشنهاد نمی‌کنند:{" "}
                    {new Intl.NumberFormat("fa-IR").format(
                      summary.notRecommendedCount,
                    )}
                  </p>
                  <p>
                    نظرات خریداران:{" "}
                    {new Intl.NumberFormat("fa-IR").format(
                      summary.buyerReviewCount,
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="w-full space-y-2 rounded border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-zinc-800">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center space-x-2">
                  <span className="w-12 whitespace-nowrap text-right dark:text-gray-300">
                    {item.stars} ستاره
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-left dark:text-gray-300">
                    {new Intl.NumberFormat("fa-IR").format(item.count)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-6 lg:col-span-4">
          <form
            onSubmit={handleSubmit}
            className="w-full border-b border-gray-300 pb-4 dark:border-gray-700"
          >
            <div className="mb-4">
              <label className="mb-3 inline-block dark:text-gray-300">
                عنوان نظر:
              </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="عنوان نظر را وارد کنید"
                disabled={submitting}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-4 text-gray-800 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-200"
              />
            </div>

            <div className="mb-4">
              <label className="mb-4 block dark:text-gray-300">امتیاز شما:</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    disabled={submitting}
                    className="cursor-pointer"
                    aria-label={`${value} ستاره`}
                  >
                    <i
                      className={`text-lg ${
                        value <= rating
                          ? "fas fa-star text-orange-400"
                          : "far fa-star text-gray-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <label className="mb-3 inline-block dark:text-gray-300">نظر:</label>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="متن نظر!"
              disabled={submitting}
              className="mb-4 h-32 w-full rounded-lg border border-gray-300 bg-white px-3 py-4 text-gray-800 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-200"
              required
            />

            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <TagInput
                label="نقاط قوت:"
                placeholder="نقاط قوت را وارد کنید و Enter بزنید"
                values={advantages}
                onChange={setAdvantages}
                tone="green"
              />
              <TagInput
                label="نقاط ضعف:"
                placeholder="نقاط ضعف را وارد کنید و Enter بزنید"
                values={disadvantages}
                onChange={setDisadvantages}
                tone="red"
              />
            </div>

            <div className="mb-4">
              <label className="mb-3 block dark:text-gray-300">
                پیشنهاد خرید:
              </label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: "recommended", label: "پیشنهاد می‌کنم" },
                    { id: "neutral", label: "نظری ندارم" },
                    { id: "notRecommended", label: "پیشنهاد نمی‌کنم" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setRecommendStatus(option.id)}
                    disabled={submitting}
                    className={`rounded-lg px-4 py-2 text-sm transition ${
                      recommendStatus === option.id
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 dark:bg-zinc-700 dark:text-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary px-20 py-3 text-white hover:bg-primary-600 disabled:opacity-60"
            >
              {submitting ? "در حال ثبت..." : "ثبت نظر"}
            </button>
          </form>

          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-4 gap-4 py-5">
              <div className="col-span-4 md:col-span-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-bars-staggered" />
                    <span className="text-sm">مرتب سازی:</span>
                  </div>
                  <nav>
                    <ul className="flex items-center space-x-3 text-sm">
                      <li>
                        <button
                          type="button"
                          onClick={() => setSort("newest")}
                          className={
                            sort === "newest" ? "text-primary" : "text-gray-600"
                          }
                        >
                          جدیدترین
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="col-span-4 md:col-span-1">
                <div className="md:text-left">
                  <span className="text-sm text-neutral-600 dark:text-white">
                    {new Intl.NumberFormat("fa-IR").format(displayTotal)} نظر
                    تایید شده
                  </span>
                </div>
              </div>
            </div>

            {loading && (
              <p className="py-8 text-center text-sm text-gray-500">
                در حال بارگذاری نظرات...
              </p>
            )}

            {!loading && error && (
              <p className="py-8 text-center text-sm text-red-500">{error}</p>
            )}

            {!loading && !error && reviews.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">
                هنوز نظری برای این محصول ثبت نشده است.
              </p>
            )}

            {!loading &&
              reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  currentUserId={currentUserId}
                  onChanged={handleReviewChanged}
                  onDeleted={handleReviewDeleted}
                />
              ))}

            {!loading && hasNextPage && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="rounded-lg border border-primary px-8 py-3 text-primary transition hover:bg-primary hover:text-white disabled:opacity-60"
                >
                  {loadingMore ? "در حال بارگذاری..." : "مشاهده بیشتر"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
