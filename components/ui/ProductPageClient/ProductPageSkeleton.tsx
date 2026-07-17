// components/ui/ProductPageClient/ProductPageSkeleton.tsx
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import ProductCardSkeleton from "@/components/modules/ProductCard/ProductCardSkeleton";

const pulse = "animate-pulse bg-gray-200 dark:bg-gray-700";
const pulseSoft = "animate-pulse bg-gray-100 dark:bg-gray-800";

function Bone({ className }: { className?: string }) {
  return <div className={[pulse, "rounded-lg", className ?? ""].join(" ")} />;
}

function SoftBone({ className }: { className?: string }) {
  return (
    <div className={[pulseSoft, "rounded-lg", className ?? ""].join(" ")} />
  );
}

function GallerySkeleton() {
  return (
    <section className="col-span-12 mt-7 w-full pb-10 xl:col-span-4">
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-gray-200 px-3 py-2 dark:border-gray-700">
        <Bone className="h-5 w-28" />
        <SoftBone className="size-5 rounded-full" />
      </div>

      <div className="relative mb-12 h-87.5 rounded-[15px] border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-custom-dark">
        <div className="absolute top-1 end-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-2xl bg-gray-100 px-2 dark:bg-zinc-800">
          {Array.from({ length: 4 }).map((_, i) => (
            <SoftBone key={`gallery-action-${i}`} className="m-1 size-8" />
          ))}
        </div>
        <SoftBone className="mt-8 h-70 w-full rounded-xl" />
      </div>

      <div className="mt-3 flex gap-2 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <SoftBone
            key={`gallery-thumb-${i}`}
            className="h-20 w-20 shrink-0 rounded-lg border border-gray-200 dark:border-gray-700"
          />
        ))}
      </div>
    </section>
  );
}

function DescriptionSkeleton() {
  return (
    <section className="col-span-12 mt-7 w-full pb-10 xl:col-span-5">
      <div className="flex items-center gap-2">
        <Bone className="h-4 w-16" />
        <SoftBone className="h-3 w-2" />
        <Bone className="h-4 w-24" />
      </div>

      <div className="mt-2 space-y-2 border-b border-b-gray-300 pb-2 dark:border-b-gray-700">
        <Bone className="h-7 w-full max-w-md" />
        <Bone className="h-4 w-2/3 max-w-xs" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Bone className="h-5 w-28" />
        <Bone className="h-7 w-24 rounded-full" />
        <Bone className="h-7 w-20 rounded-full" />
      </div>

      <div className="mt-6 space-y-4">
        <Bone className="h-6 w-32" />
        <div className="flex items-center gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SoftBone
              key={`color-${i}`}
              className="size-12 rounded-full border border-gray-200 dark:border-gray-700"
            />
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Bone className="h-6 w-40" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SoftBone key={`compat-${i}`} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Bone className="h-6 w-24" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SoftBone key={`attr-${i}`} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
}

function ActionSkeleton() {
  return (
    <section className="col-span-12 mt-7 w-full pb-10 xl:col-span-3">
      <div className="space-y-5 rounded-2xl border border-gray-200 bg-gray-100/90 px-3 py-5 shadow dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mb-3 flex items-center justify-between">
          <Bone className="h-5 w-28" />
          <Bone className="h-4 w-16" />
        </div>

        <div className="space-y-4 rounded-xl px-2 py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`action-row-${i}`} className="flex items-center gap-2">
              <SoftBone className="size-8 rounded-md" />
              <Bone className="h-4 w-24" />
              <Bone className="ms-auto h-4 w-16" />
            </div>
          ))}
          <div className="flex flex-wrap gap-2 pt-2">
            <Bone className="h-6 w-20 rounded-full" />
            <Bone className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>

      <SoftBone className="my-3 h-10 w-full" />

      <div className="mt-4 mb-2 flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Bone className="h-4 w-16" />
          <Bone className="h-7 w-28" />
        </div>
        <Bone className="h-11 w-36 rounded-xl" />
      </div>
    </section>
  );
}

const RELATED_VISIBILITY = [
  "",
  "hidden sm:block",
  "hidden md:block",
  "hidden lg:block",
  "hidden xl:block",
] as const;

function RelatedProductsSkeleton() {
  return (
    <SectionContainer>
      <div className="mb-4">
        <Bone className="h-7 w-40" />
      </div>
      <div className="rounded-2xl bg-linear-to-b from-white to-transparent p-5 dark:from-[#121923]">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {RELATED_VISIBILITY.map((visibility, i) => (
            <div key={`related-${i}`} className={visibility || undefined}>
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}

function ReviewSkeleton() {
  return (
    <SectionContainer>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4 space-y-4 xl:col-span-3">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Bone
                key={`tab-${i}`}
                className="h-9 w-24 rounded-full sm:w-28"
              />
            ))}
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-custom-dark">
            <Bone className="mb-4 h-6 w-40" />
            <div className="space-y-3">
              <SoftBone className="h-4 w-full" />
              <SoftBone className="h-4 w-[92%]" />
              <SoftBone className="h-4 w-[85%]" />
              <SoftBone className="h-4 w-[75%]" />
              <SoftBone className="mt-6 h-40 w-full rounded-xl" />
            </div>
          </div>
        </div>

        <div className="col-span-4 xl:col-span-1">
          <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-custom-dark">
            <Bone className="h-5 w-28" />
            <Bone className="h-8 w-32" />
            <SoftBone className="h-11 w-full rounded-xl" />
            <SoftBone className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

export default function ProductPageSkeleton() {
  return (
    <main className="space-y-5 py-4">
      <SectionContainer>
        <nav className="flex flex-wrap items-center gap-2 py-3" aria-hidden>
          <Bone className="h-4 w-12" />
          <SoftBone className="size-3" />
          <Bone className="h-4 w-20" />
          <SoftBone className="size-3" />
          <Bone className="h-4 w-36" />
        </nav>

        <div className="mt-4 space-y-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200">
          <div className="grid grid-cols-12 gap-4 place-items-start">
            <GallerySkeleton />
            <DescriptionSkeleton />
            <ActionSkeleton />
          </div>
        </div>
      </SectionContainer>

      <RelatedProductsSkeleton />
      <ReviewSkeleton />
    </main>
  );
}
