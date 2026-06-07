// components/amazing-deals/ProductSkeleton.tsx

export default function ProductCardSkeleton() {
  return (
    <article className="relative bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
      {/* Wishlist placeholder */}
      <div className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-stone-100 animate-pulse" />

      {/* Badge placeholder */}
      <div className="absolute top-3 right-3 z-20 w-10 h-6 rounded-lg bg-stone-100 animate-pulse" />

      {/* Image */}
      <div className="w-full h-48 bg-gradient-to-br from-stone-100 to-stone-200 animate-pulse" />

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Title */}
        <div className="flex flex-col gap-1.5 min-h-10">
          <div className="h-3.5 bg-stone-100 rounded-full animate-pulse w-full" />
          <div className="h-3.5 bg-stone-100 rounded-full animate-pulse w-3/4" />
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 rounded-sm bg-stone-100 animate-pulse"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
          <div className="h-3 w-16 bg-stone-100 rounded-full animate-pulse ml-1" />
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1 pt-1 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 bg-stone-100 rounded-full animate-pulse" />
            <div className="h-6 w-28 bg-stone-100 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <div className="flex-1 h-9 rounded-xl bg-stone-100 animate-pulse" />
          <div className="flex-1 h-9 rounded-xl bg-stone-100 animate-pulse" />
        </div>
      </div>
    </article>
  );
}

// استفاده برای نمایش چند کارت اسکلتون
export function ProductCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
