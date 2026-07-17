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
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`cat-skel-${i}`}
            className="flex w-50 shrink-0 flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-custom-dark"
          >
            <SoftBone className="size-20 rounded-xl" />
            <Bone className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileFilterSkeleton() {
  return (
    <div className="flex gap-2 lg:hidden">
      <Bone className="h-10 w-28 rounded-xl" />
      <Bone className="h-10 w-24 rounded-xl" />
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
    <div className="flex flex-wrap items-center gap-3 space-x-3">
      <Bone className="h-5 w-5" />
      <Bone className="h-5 w-24" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Bone key={`sort-${i}`} className="h-8 w-20 rounded-full" />
      ))}
    </div>
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
