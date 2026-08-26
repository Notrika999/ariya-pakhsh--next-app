// components/ui/UserProfile/Comments/CommentSection.tsx

import type {
  MyReviewItem,
  UpdateMyReviewRequest,
} from "@/src/lib/types/userpanel/comments";
import { getProductImage } from "@/src/utils/product-image";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
  comments: MyReviewItem[];
  deletingId: string | null;
  updatingId: string | null;
  onDelete: (reviewId: string) => void;
  onUpdate: (reviewId: string, body: UpdateMyReviewRequest) => Promise<void>;
}

function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function statusColor(status: string) {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
    default:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
  }
}

function getProductHref(productCode: string, productSlug: string) {
  const code = productCode?.trim();
  const slug = productSlug?.trim();
  if (!code || !slug) return "";

  return `/product/${encodeURIComponent(code)}/${encodeURIComponent(slug)}`;
}

function tagsToText(tags: string[]) {
  return tags.join("، ");
}

function textToTags(value: string) {
  return value
    .split(/[،,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function EditReviewForm({
  comment,
  saving,
  onCancel,
  onSave,
}: {
  comment: MyReviewItem;
  saving: boolean;
  onCancel: () => void;
  onSave: (body: UpdateMyReviewRequest) => void;
}) {
  const [rating, setRating] = useState(comment.rating || 5);
  const [title, setTitle] = useState(comment.title);
  const [body, setBody] = useState(comment.body);
  const [advantages, setAdvantages] = useState(tagsToText(comment.advantages));
  const [disadvantages, setDisadvantages] = useState(
    tagsToText(comment.disadvantages),
  );

  return (
    <form
      className="mt-4 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-zinc-800"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({
          rating,
          title: title.trim(),
          body: body.trim(),
          advantages: textToTags(advantages),
          disadvantages: textToTags(disadvantages),
          recommendStatus: comment.recommendStatus,
        });
      }}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          امتیاز
          <select
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-zinc-900"
          >
            {[5, 4, 3, 2, 1].map((item) => (
              <option key={item} value={item}>
                {new Intl.NumberFormat("fa-IR").format(item)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          عنوان
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-zinc-900"
          />
        </label>
      </div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        متن نظر
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-zinc-900"
        />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          نقاط قوت
          <input
            value={advantages}
            onChange={(event) => setAdvantages(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-zinc-900"
            placeholder="با ویرگول جدا کنید"
          />
        </label>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          نقاط ضعف
          <input
            value={disadvantages}
            onChange={(event) => setDisadvantages(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-zinc-900"
            placeholder="با ویرگول جدا کنید"
          />
        </label>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-zinc-700"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={saving || !body.trim()}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-white transition hover:bg-primary/90 disabled:opacity-60"
        >
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </div>
    </form>
  );
}

export default function CommentSection({
  comments,
  deletingId,
  updatingId,
  onDelete,
  onUpdate,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (comments.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 drop-shadow-lg dark:bg-custom-dark dark:text-gray-400">
        هنوز نظری ثبت نکرده‌اید.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
      {comments.map((comment) => {
        const isEditing = editingId === comment.id;
        const productHref = getProductHref(
          comment.productCode,
          comment.productSlug,
        );

        return (
          <div
            key={comment.id}
            className="bg-white rounded-2xl drop-shadow-lg px-3 py-2 dark:bg-custom-dark dark:border dark:border-gray-700"
          >
            <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
              <div className="shrink-0">
                <Image
                  width={80}
                  height={80}
                  src={getProductImage(comment.productImageUrl)}
                  className="size-20 rounded-lg object-cover"
                  alt={comment.productName}
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      {productHref ? (
                        <Link
                          href={productHref}
                          className="transition hover:text-primary"
                        >
                          {comment.productName}
                        </Link>
                      ) : (
                        comment.productName
                      )}
                    </h3>
                    {comment.productCode ? (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        کد محصول: {comment.productCode}
                      </p>
                    ) : null}

                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fa-solid fa-star w-5 h-5 ${
                              i < comment.rating
                                ? "text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>

                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Intl.NumberFormat("fa-IR").format(comment.rating)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 md:mt-0">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs text-nowrap font-semibold ${statusColor(comment.status)}`}
                    >
                      {comment.statusLabel}
                    </span>
                  </div>
                </div>

                <div className="mt-4 bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
                  {comment.title ? (
                    <h4 className="mb-2 text-sm font-bold text-gray-900 dark:text-gray-100">
                      {comment.title}
                    </h4>
                  ) : null}
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {comment.body}
                  </p>
                </div>

                {isEditing ? (
                  <EditReviewForm
                    comment={comment}
                    saving={updatingId === comment.id}
                    onCancel={() => setEditingId(null)}
                    onSave={(body) => {
                      void onUpdate(comment.id, body)
                        .then(() => setEditingId(null))
                        .catch(() => undefined);
                    }}
                  />
                ) : null}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-2 sm:space-y-0">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ارسال شده در: {formatDate(comment.createdAt)}
                    </span>

                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Intl.NumberFormat("fa-IR").format(comment.likesCount)} نفر
                      مفید دانستند
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {comment.canEdit ? (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingId((current) =>
                            current === comment.id ? null : comment.id,
                          )
                        }
                        className="text-primary hover:text-primary/80 transition duration-150 text-sm font-medium flex items-center"
                      >
                        <i className="fa-regular fa-pen-to-square ml-1" />
                        ویرایش
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => onDelete(comment.id)}
                      disabled={deletingId === comment.id}
                      className="text-red-600 hover:text-red-800 transition duration-150 text-sm font-medium flex items-center disabled:opacity-60"
                    >
                      <i className="fa-regular fa-trash-can ml-1" />
                      {deletingId === comment.id ? "در حال حذف..." : "حذف"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
