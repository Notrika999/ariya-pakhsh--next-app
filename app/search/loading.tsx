import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import { ProductCardsSkeletonGrid } from "@/components/ui/Categories/ProductListPageSkeleton";

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
      <div className="sticky top-20 space-y-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`search-filter-skeleton-${index}`}
            className="overflow-hidden rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-custom-dark"
          >
            <div className="flex items-center justify-between p-4">
              <Bone className="h-5 w-24" />
              <SoftBone className="size-4" />
            </div>
            {index < 2 ? (
              <div className="space-y-3 border-t border-gray-200 p-4 dark:border-gray-700">
                <SoftBone className="h-3 w-full" />
                <SoftBone className="h-8 w-full rounded-full" />
                <div className="flex justify-between">
                  <Bone className="h-4 w-16" />
                  <Bone className="h-4 w-16" />
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </aside>
  );
}

function SortSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-3 space-x-3">
      <Bone className="size-5" />
      <Bone className="h-5 w-24" />
      {Array.from({ length: 6 }).map((_, index) => (
        <Bone
          key={`search-sort-skeleton-${index}`}
          className="h-8 w-20 rounded-full"
        />
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <SectionContainer>
      <MobileFilterSkeleton />

      <div className="mt-6 grid grid-cols-12 gap-5">
        <FilterSidebarSkeleton />

        <section className="col-span-12 lg:col-span-9">
          <SortSkeleton />
          <ProductCardsSkeletonGrid count={8} />
        </section>
      </div>
    </SectionContainer>
  );
}
