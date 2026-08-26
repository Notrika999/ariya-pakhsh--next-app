// components/ui/Categories/ProductListPageSkeleton.tsx
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

/** Product cards grid matching ProductListSection column spans */
export function ProductCardsSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="mt-4 grid grid-cols-12 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={`product-skeleton-${i}`}
          className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3"
        >
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
}

function BreadcrumbSkeleton() {
  return (
    <nav className="flex flex-wrap items-center gap-2 py-3" aria-hidden>
      <Bone className="h-4 w-12" />
      <SoftBone className="size-3" />
      <Bone className="h-4 w-24" />
      <SoftBone className="size-3" />
      <Bone className="h-4 w-32" />
    </nav>
  );
}

function CategoriesSliderSkeleton() {
  return (
    <div className="pb-10">
      <Bone className="mb-4 h-7 w-36" />
      <div className="flex gap-4 overflow-hidden rounded-xl bg-[#f3f5f9] px-3 py-3 dark:bg-[#18202b] md:px-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`cat-skel-${i}`}
            className="flex h-[124px] w-[142px] shrink-0 flex-col items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 dark:bg-custom-dark md:h-[136px] md:w-[190px] md:gap-3 md:px-4 lg:w-[214px]"
          >
            <SoftBone className="h-[58px] w-22 rounded-xl md:h-[68px]" />
            <Bone className="h-4 w-24 md:h-6 md:w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileFilterSkeleton() {
  return (
    <div className="lg:hidden">
      <div className="fixed bottom-28 start-3 z-20">
        <Bone className="size-14 rounded-lg" />
      </div>
    </div>
  );
}

function FilterSidebarSkeleton() {
  return (
    <aside className="hidden lg:col-span-3 lg:block">
      <div className="sticky top-6 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`filter-block-${i}`}
            className="overflow-hidden rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-custom-dark"
          >
            <div className="flex items-center justify-between p-4">
              <Bone className="h-5 w-24" />
              <SoftBone className="size-4" />
            </div>
            {i === 0 && (
              <div className="space-y-3 border-t border-gray-200 p-4 dark:border-gray-700">
                <SoftBone className="h-3 w-full" />
                <SoftBone className="h-8 w-full rounded-full" />
                <div className="flex justify-between">
                  <Bone className="h-4 w-16" />
                  <Bone className="h-4 w-16" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

function SortSkeleton() {
  return (
    <>
      <div className="flex w-full items-center gap-2 lg:hidden">
        <Bone className="h-8 w-20 rounded-full md:h-12 md:w-28" />
        <Bone className="h-8 w-24 rounded-full md:h-12 md:w-32" />
      </div>

      <div className="hidden w-full items-center gap-7 rounded-xl bg-[#eef1f6] px-6 py-4 dark:bg-[#18202b] lg:flex">
        <SoftBone className="size-7 rounded-lg" />
        <Bone className="h-6 w-16" />

        <div className="flex min-w-0 flex-1 items-center gap-8 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Bone key={`sort-${i}`} className="h-6 w-24 shrink-0" />
          ))}
        </div>

        <Bone className="h-6 w-20 shrink-0" />
      </div>
    </>
  );
}

type ProductListPageSkeletonProps = {
  /** زیردسته‌ها برای depth 0/1 — در /products معمولاً نیست */
  showCategorySlider?: boolean;
  cardCount?: number;
};

export default function ProductListPageSkeleton({
  showCategorySlider = true,
  cardCount = 8,
}: ProductListPageSkeletonProps) {
  return (
    <SectionContainer>
      <BreadcrumbSkeleton />

      {showCategorySlider && <CategoriesSliderSkeleton />}

      <MobileFilterSkeleton />

      <div className="mt-6 grid grid-cols-12 gap-5">
        <FilterSidebarSkeleton />

        <section className="col-span-12 lg:col-span-9">
          <SortSkeleton />
          <ProductCardsSkeletonGrid count={cardCount} />
        </section>
      </div>
    </SectionContainer>
  );
}
