"use client";

// components/amazing-deals/EmptyState.tsx
interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
      <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-stone-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016 15.803z"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-stone-700">محصولی یافت نشد</h3>
        <p className="text-stone-400 text-sm max-w-xs">
          با فیلتر انتخاب‌شده محصولی وجود ندارد. دسته‌بندی دیگری را امتحان کنید.
        </p>
      </div>
      <button
        onClick={onReset}
        className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-bold hover:bg-amber-500 transition-colors"
      >
        نمایش همه محصولات
      </button>
    </div>
  );
}
