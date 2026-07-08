// components/modules/ProductCard/ProductCardSkeleton.tsx

const SKELETON_BAR =
  "bg-stone-100 dark:bg-zinc-800 animate-pulse";

export default function ProductCardSkeleton() {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm dark:border-stone-800 dark:bg-gray-900">
      {/* Wishlist placeholder */}
      <div
        className={`absolute top-3 left-3 z-20 h-8 w-8 rounded-full ${SKELETON_BAR}`}
      />

      {/* Badge placeholder */}
      <div
        className={`absolute top-3 right-3 z-20 h-6 w-10 rounded-lg ${SKELETON_BAR}`}
      />

      {/* Image */}
      <div
        className={`h-48 w-full animate-pulse bg-gradient-to-br from-stone-100 to-stone-200 dark:from-zinc-800 dark:to-zinc-700`}
      />

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        {/* Title */}
        <div className="flex min-h-10 flex-col gap-1.5">
          <div className={`h-3.5 w-full rounded-full ${SKELETON_BAR}`} />
          <div className={`h-3.5 w-3/4 rounded-full ${SKELETON_BAR}`} />
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`h-3.5 w-3.5 rounded-sm ${SKELETON_BAR}`}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
          <div className={`ml-1 h-3 w-16 rounded-full ${SKELETON_BAR}`} />
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1 border-t border-stone-100 pt-1 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <div className={`h-3 w-24 rounded-full ${SKELETON_BAR}`} />
            <div className={`h-6 w-28 rounded-full ${SKELETON_BAR}`} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <div className={`h-9 flex-1 rounded-xl ${SKELETON_BAR}`} />
          <div className={`h-9 flex-1 rounded-xl ${SKELETON_BAR}`} />
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
