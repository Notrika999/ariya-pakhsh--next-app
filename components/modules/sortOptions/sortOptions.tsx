"use client";
// components/modules/sortOptions/sortOptions.tsx
import { SortOption } from "@/src/lib/types/filters/filters";
import React from "react";

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "پیش‌فرض", value: "Default" },
  { label: "جدیدترین", value: "Newest" },
  { label: "ارزان‌ترین", value: "PriceAsc" },
  { label: "گران‌ترین", value: "PriceDesc" },
  { label: "پرفروش", value: "BestSelling" },
  { label: "پربازدید", value: "MostViewed" },
  { label: "پرتخفیف", value: "DiscountDesc" },
  { label: "امتیاز", value: "MostRated" },
];

interface Props {
  currentSort: SortOption | null;
  onSortChange: (value: SortOption) => void;
  options?: SortOption[];
}

function resolveSortOption(value: SortOption) {
  const option = sortOptions.find((item) => item.value === value);
  if (option) return option;

  if (value === "BestDiscount") {
    const discountOption = sortOptions.find(
      (item) => item.value === "DiscountDesc",
    );

    return discountOption
      ? { ...discountOption, value: "BestDiscount" as const }
      : null;
  }

  return null;
}

export default function SortList({
  currentSort,
  onSortChange,
  options,
}: Props) {
  const visibleOptions = options
    ? options
        .map(resolveSortOption)
        .filter((option): option is NonNullable<typeof option> => option !== null)
    : sortOptions;

  return (
    <div className="flex items-center overflow-x-auto  text-sm py-2">
      {visibleOptions.map((option) => {
        const isActive = currentSort === option.value;

        return (
          <button
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={`whitespace-nowrap rounded-full px-2 py-1 transition ${
              isActive
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
