// components/amazing-deals/ProductSkeleton.tsx

function SkeletonBox({ className }: { className?: string }) {
  return (
    <div className={`bg-stone-200 rounded animate-pulse ${className ?? ""}`} />
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
      {/* Image */}
      <SkeletonBox className="w-full h-48 rounded-none" />

      <div className="p-4 flex flex-col gap-3">
        {/* Brand */}
        <SkeletonBox className="h-3 w-16 rounded-full" />
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <SkeletonBox className="h-4 w-full rounded" />
          <SkeletonBox className="h-4 w-3/4 rounded" />
        </div>
        {/* Stars */}
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-3.5 w-24 rounded-full" />
          <SkeletonBox className="h-3.5 w-20 rounded-full" />
        </div>
        {/* Badges */}
        <div className="flex gap-1.5">
          <SkeletonBox className="h-5 w-20 rounded-full" />
          <SkeletonBox className="h-5 w-16 rounded-full" />
        </div>
        {/* Timer */}
        <SkeletonBox className="h-9 w-full rounded-xl" />
        {/* Prices */}
        <div className="flex flex-col gap-1 pt-1 border-t border-stone-100">
          <SkeletonBox className="h-3.5 w-32 rounded" />
          <SkeletonBox className="h-6 w-40 rounded" />
        </div>
        {/* CTA */}
        <SkeletonBox className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
