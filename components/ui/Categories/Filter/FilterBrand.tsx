// components/ui/Categories/Filter/FilterBrand.tsx
"use client";

import React, { useMemo, useState } from "react";
import { brandMatchesParam } from "@/src/lib/helper/productListHelpers";

type Brand = {
  id?: string | number;
  brandId: string | number;
  name: string;
  slug?: string;
};

type Props = {
  brands: Brand[];
  selectedBrands: string[];
  onToggle: (brandSlug: string) => void;
};

function brandKey(brand: Brand) {
  return String(brand.slug || brand.brandId);
}

function formatSlugLabel(slug: string) {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function BrandRow({
  brand,
  isChecked,
  onToggle,
}: {
  brand: Brand;
  isChecked: boolean;
  onToggle: (slug: string) => void;
}) {
  const slug = brandKey(brand);
  const secondary = brand.slug ? formatSlugLabel(brand.slug) : "";

  return (
    <button
      type="button"
      onClick={() => onToggle(slug)}
      className="flex w-full items-center gap-3 py-3 text-start cursor-pointer group"
      aria-pressed={isChecked}
    >
      <span
        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          isChecked
            ? "bg-red-600 border-red-600"
            : "border-gray-400 dark:border-gray-500 bg-transparent group-hover:border-gray-500"
        }`}
        aria-hidden
      >
        {isChecked ? (
          <svg
            className="w-3 h-3 text-white"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 6L5 9L10 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>

      <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <span
          className={`text-sm font-medium truncate ${
            isChecked
              ? "text-gray-900 dark:text-white"
              : "text-gray-700 dark:text-gray-200"
          }`}
        >
          {brand.name}
        </span>
        {secondary ? (
          <span className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[45%] text-end">
            {secondary}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export default function FilterBrand({
  brands,
  selectedBrands,
  onToggle,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const safeBrands = brands ?? [];
  const safeSelected = selectedBrands ?? [];

  const isBrandSelected = (brand: Brand) =>
    safeSelected.some((param) => brandMatchesParam(brand, param));

  const selectedBrandItems = useMemo(
    () => safeBrands.filter((brand) => isBrandSelected(brand)),
    [safeBrands, safeSelected],
  );

  const term = searchTerm.trim().toLowerCase();

  const matchesSearch = (brand: Brand) => {
    if (!term) return true;
    const name = (brand.name ?? "").toLowerCase();
    const slug = (brand.slug ?? "").toLowerCase();
    return name.includes(term) || slug.includes(term);
  };

  const filteredSelected = selectedBrandItems.filter(matchesSearch);
  const filteredOthers = safeBrands.filter(
    (brand) => !isBrandSelected(brand) && matchesSearch(brand),
  );

  const hasAnyVisible =
    filteredSelected.length > 0 || filteredOthers.length > 0;

  return (
    <div>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="جستجو برند ..."
          className="w-full py-2 px-3 pe-9 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-zinc-800 outline-none focus:border-cyan-500 transition-colors text-right"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          dir="rtl"
        />
        <i className="far fa-search absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
        {searchTerm ? (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-400 text-white text-xs hover:bg-gray-500 transition-colors"
            aria-label="پاک کردن جستجو"
          >
            ✕
          </button>
        ) : null}
      </div>

      <div className="max-h-72 overflow-y-auto custom-scrollbar" dir="rtl">
        {!hasAnyVisible ? (
          <p className="text-center text-xs text-gray-400 py-4">برندی یافت نشد</p>
        ) : (
          <>
            {filteredSelected.length > 0 ? (
              <div className="mb-2">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                  انتخاب شما
                </p>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredSelected.map((brand) => (
                    <BrandRow
                      key={brandKey(brand)}
                      brand={brand}
                      isChecked
                      onToggle={onToggle}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {filteredSelected.length > 0 && filteredOthers.length > 0 ? (
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
            ) : null}

            {filteredOthers.length > 0 ? (
              <div>
                {filteredSelected.length > 0 ? (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                    همه‌ی برندها
                  </p>
                ) : null}
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredOthers.map((brand) => (
                    <BrandRow
                      key={brandKey(brand)}
                      brand={brand}
                      isChecked={false}
                      onToggle={onToggle}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
