"use client";

import React from "react";
import { SortOption, SORT_LABELS } from "@/types/product";

const sortOptions: { label: string; value: SortOption }[] = [
  { label: SORT_LABELS.default, value: "default" },
  { label: SORT_LABELS.price_asc, value: "price_asc" },
  { label: SORT_LABELS.price_desc, value: "price_desc" },
  { label: SORT_LABELS.discount_desc, value: "discount_desc" },
  { label: SORT_LABELS.rating_desc, value: "rating_desc" },
  { label: SORT_LABELS.most_reviewed, value: "most_reviewed" },
];

interface Props {
  currentSort: SortOption;
  onSortChange: (value: SortOption) => void;
}

export default function SortList({ currentSort, onSortChange }: Props) {
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
