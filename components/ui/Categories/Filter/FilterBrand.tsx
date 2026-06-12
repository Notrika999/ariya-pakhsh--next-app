// components/Categories/Filter/FilterBrand.tsx
"use client";

import React, { useState } from "react";

type Brand = {
  id?: string | number;
  brandId: string | number;
  name: string;
};

type Props = {
  brands: Brand[];
  selectedBrands: (string | number)[];
  onToggle: (brandId: string | number) => void;
};

export default function FilterBrand({
  brands,
  selectedBrands,
  onToggle,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const safeBrands = brands ?? [];
  const safeSelected = selectedBrands ?? [];

  const filteredBrands = safeBrands.filter(
    (brand) =>
      (brand.name ?? "").includes(searchTerm) ||
      (brand.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      {/* باکس جستجو */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="جستجو برند ..."
          className="w-full py-2 px-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-zinc-800 outline-none focus:border-cyan-500 transition-colors text-right"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          dir="rtl"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-400 text-white text-xs hover:bg-gray-500 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* لیست برندها */}
      <div className="max-h-72 overflow-y-auto custom-scrollbar" dir="rtl">
        {filteredBrands.length > 0 ? (
          filteredBrands.map((brand, index) => {
            const isChecked = safeSelected.includes(brand.brandId);
            return (
              <React.Fragment key={brand.brandId}>
                <label className={`flex items-center gap-2 w-full py-3 group ${isChecked ? "cursor-default" : "cursor-pointer"}`}>
                  {/* چک‌باکس سفارشی */}
                  <div className="flex items-center gap-3 ">
                    <div
                      onClick={() => !isChecked && onToggle(brand.brandId)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isChecked
                          ? "bg-indigo-600 border-indigo-600 cursor-default"
                          : "border-gray-300 dark:border-gray-500 bg-white dark:bg-zinc-800 cursor-pointer"
                      }`}
                    >
                      {isChecked && (
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
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isChecked}
                      onChange={() => onToggle(brand.brandId)}
                    />
                  </div>

                  {/* نام برند */}
                  <span
                    onClick={() => !isChecked && onToggle(brand.brandId)}
                    className={`text-sm font-medium transition-colors ${
                      isChecked
                        ? "text-indigo-600 dark:text-indigo-400 cursor-default"
                        : "text-gray-700 dark:text-gray-200 cursor-pointer"
                    }`}
                  >
                    {brand.name}
                  </span>
                </label>
                {index < filteredBrands.length - 1 && (
                  <div className="h-px bg-gray-100 dark:bg-gray-700" />
                )}
              </React.Fragment>
            );
          })
        ) : (
          <p className="text-center text-xs text-gray-400 py-4">
            برندی یافت نشد
          </p>
        )}
      </div>
    </div>
  );
}