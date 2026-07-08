import React from "react";

function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-custom-dark">
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-3 h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

export default function UserProfileLoading() {
  return (
    <div className="lg:col-span-3 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-custom-dark">
        <div className="h-8 w-52 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <StatSkeleton key={`stat-${idx}`} />
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-custom-dark">
        <div className="mb-4 h-6 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={`row-${idx}`}
              className="h-14 animate-pulse rounded-xl bg-gray-100 dark:bg-zinc-800"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
