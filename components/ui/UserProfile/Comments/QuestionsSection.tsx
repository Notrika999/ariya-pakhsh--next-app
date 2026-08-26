// components/ui/UserProfile/Comments/QuestionsSection.tsx

import type { MyQuestionItem } from "@/src/lib/types/userpanel/comments";
import { getProductImage } from "@/src/utils/product-image";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  questions: MyQuestionItem[];
  deletingId: string | null;
  onDelete: (questionId: string) => void;
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
    case "answered":
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

export default function QuestionsSection({
  questions,
  deletingId,
  onDelete,
}: Props) {
  if (questions.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 drop-shadow-lg dark:bg-custom-dark dark:text-gray-400">
        هنوز پرسشی ثبت نکرده‌اید.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
      {questions.map((q) => (
        <div
          key={q.id}
          className="bg-white rounded-2xl drop-shadow-lg p-3 py-2 dark:bg-custom-dark dark:border dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
            <div className="shrink-0">
              <Image
                width={80}
                height={80}
                src={getProductImage(q.productImageUrl)}
                className="size-20 rounded-lg object-cover"
                alt={q.productName}
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    {getProductHref(q.productCode, q.productSlug) ? (
                      <Link
                        href={getProductHref(q.productCode, q.productSlug)}
                        className="transition hover:text-primary"
                      >
                        {q.productName}
                      </Link>
                    ) : (
                      q.productName
                    )}
                  </h3>
                  {q.productCode ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      کد محصول: {q.productCode}
                    </p>
                  ) : null}
                </div>

                <div className="mt-2 md:mt-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-nowrap ${statusColor(q.displayStatus || q.status)}`}
                  >
                    {q.displayStatusLabel}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                    پرسش شما:
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {q.body}
                  </p>
                </div>

                {q.officialAnswer ? (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                      پاسخ ادمین:
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {q.officialAnswer.body}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      پاسخ داده شده در: {formatDate(q.officialAnswer.createdAt)}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ارسال شده در: {formatDate(q.createdAt)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => onDelete(q.id)}
                    disabled={deletingId === q.id}
                    className="text-red-600 hover:text-red-800 transition duration-150 text-sm font-medium flex items-center disabled:opacity-60"
                  >
                    <i className="fa-regular fa-trash-can ml-1" />
                    {deletingId === q.id ? "در حال حذف..." : "حذف"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
