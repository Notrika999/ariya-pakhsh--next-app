"use client";

import React, { useState } from "react";
import {
  FilterState,
  ProductCategory,
  SortOption,
  CATEGORY_LABELS,
} from "@/types/product";
import SortList from "../sortOptions/sortOptions";

interface FilterSortProps {
  filter: FilterState;
  onChange: (next: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ProductCategory[];

export default function FilterSort({
  filter,
  onChange,
  totalCount,
  filteredCount,
}: FilterSortProps) {
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  const handleSortChange = (value: SortOption) => {
    onChange({ ...filter, sort: value });
    setMobileSortOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Desktop Sort */}
      <div className="hidden sm:flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-sliders text-gray-700 dark:text-white" />
          <span className="text-gray-600 dark:text-gray-200">مرتب سازی:</span>
        </div>

        <SortList currentSort={filter.sort} onSortChange={handleSortChange} />

        {/* Count */}
        <p className="ms-auto text-sm text-stone-500">
          نمایش{" "}
          <span className="font-bold text-stone-800">
            {new Intl.NumberFormat("fa-IR").format(filteredCount)}
          </span>{" "}
          از{" "}
          <span className="font-bold text-stone-800">
            {new Intl.NumberFormat("fa-IR").format(totalCount)}
          </span>{" "}
          محصول
        </p>
      </div>

      {/* Mobile Sort Dropdown */}
      <div className="sm:hidden">
        <button
          onClick={() => setMobileSortOpen((p) => !p)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border bg-white dark:bg-custom-dark dark:border-gray-700"
        >
          <span className="text-sm text-gray-700 dark:text-gray-200">
            مرتب‌سازی
          </span>
          <i className="fa-solid fa-chevron-down" />
        </button>

        {mobileSortOpen && (
          <div className="mt-2 border rounded-xl bg-white dark:bg-custom-dark overflow-hidden">
            <SortList
              currentSort={filter.sort}
              onSortChange={handleSortChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
