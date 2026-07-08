import Link from "next/link";
import React from "react";

export default function UserProfileEmptyState({
  title = "اطلاعاتی برای نمایش وجود ندارد",
  description = "هنوز موردی در این بخش ثبت نشده است.",
  actionLabel,
  actionHref = "/products",
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-zinc-800/40">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm dark:bg-zinc-900">
        <i className="far fa-inbox text-lg" />
      </div>
      <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      {actionLabel ? (
        <div className="mt-5">
          <Link
            href={actionHref}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/60"
          >
            {actionLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
