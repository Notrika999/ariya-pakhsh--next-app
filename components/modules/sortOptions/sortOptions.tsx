"use client";

import React from "react";

const sortOptions = [
  { label: "همه", value: "all" },
  { label: "پربازدیدترین", value: "most-visited" },
  { label: "جدیدترین", value: "newest" },
  { label: "پرفروش‌ترین", value: "best-selling" },
  { label: "ارزان‌ترین", value: "cheapest" },
  { label: "گران‌ترین", value: "most-expensive" },
  { label: "منتخب", value: "selected" },
];

interface SortListProps {
  currentSort: string;
  onSortChange: (value: string) => void;
}

export default function SortList({ currentSort, onSortChange }: SortListProps) {
  return (
    <div className="flex items-center overflow-x-scroll hide-scrollbar gap-2 text-gray-600 dark:text-gray-300 text-sm py-2">
      {sortOptions.map((option) => {
        // مقایسه مستقیم با props ورودی
        const isActive = currentSort === option.value;

        return (
          <button
            key={option.value}
            onClick={() => onSortChange(option.value)} // فراخوانی تابع والد
            className={`whitespace-nowrap transition-all duration-200 px-4 py-1 rounded-full ${
              isActive
                ? "bg-gray-900 text-white dark:bg-gray-800 dark:text-white"
                : "hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
