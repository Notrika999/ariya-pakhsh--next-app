"use client";

import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";

function BlockSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={[
        "animate-pulse rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-custom-dark",
        className ?? "",
      ].join(" ")}
    >
      <div className="mb-3 h-6 w-44 rounded-lg bg-gray-200 dark:bg-gray-700" />
      <div className="grid grid-cols-12 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`item-${i}`}
            className="col-span-6 h-32 rounded-xl bg-gray-100 dark:bg-gray-800 sm:col-span-4 lg:col-span-2"
          />
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="space-y-5 py-4">
      <SectionContainer>
        <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-custom-dark">
          <div className="h-44 w-full rounded-xl bg-gray-200 dark:bg-gray-700 sm:h-56 lg:h-92" />
        </div>
      </SectionContainer>

      <SectionContainer>
        <BlockSkeleton />
      </SectionContainer>

      <SectionContainer>
        <BlockSkeleton />
      </SectionContainer>

      <SectionContainer>
        <BlockSkeleton />
      </SectionContainer>
    </main>
  );
}
