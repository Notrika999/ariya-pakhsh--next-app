"use client";

import React from "react";
import { SortOption, SORT_LABELS } from "@/types/product";

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "پیش‌فرض", value: "default" },
  { label: "جدیدترین", value: "newest" },
  { label: "ارزان‌ترین", value: "priceAsc" },
  { label: "گران‌ترین", value: "priceDesc" },
  { label: "پرفروش", value: "bestSelling" },
  { label: "پربازدید", value: "mostRated" },
  { label: "پرتخفیف", value: "discountDesc" },
];

interface Props {
  currentSort: SortOption;
  onSortChange: (value: SortOption) => void;
}

export default function SortList({ currentSort, onSortChange }: Props) {

  console.log("Sort => ", currentSort)
  return (
    <div className="flex items-center overflow-x-auto  text-sm py-2">
      {sortOptions.map((option) => {
        const isActive = currentSort === option.value;

        return (
          <button
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={`whitespace-nowrap px-2 py-1 rounded-full transition ${
              isActive
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
