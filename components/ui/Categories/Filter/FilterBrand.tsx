"use client";

import React, { useState } from "react";

type Brand = {
  id: string | number;
  brandId: string;
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
    <section className="dark:bg-custom-dark dark:border-gray-700 dark:text-white bg-white rounded-lg drop-shadow-lg border-gray-300 border p-4">
      <h2 className="font-bold text-base mb-4 relative pb-4 before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary after:absolute after:w-40 after:h-2 after:bottom-0 after:inset-s-4 after:bg-primary after:rounded-lg">
        برندها
      </h2>

      {/* باکس جستجو مشابه دیجی‌کالا */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="جستجوی نام برند..."
          className="w-full p-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-zinc-800 outline-none focus:border-cyan-500 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* لیست برندها با قابلیت اسکرول اگر تعداد زیاد بود */}
      <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
        {filteredBrands.length > 0 ? (
          <div className="flex items-center">
            {filteredBrands.map((brand) => (
              <label
                key={brand.brandId}
                className="inline-flex items-center w-full cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="hidden peer"
                  checked={safeSelected.includes(brand.brandId)}
                  onChange={() => onToggle(brand.brandId)}
                />

                <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                  {brand.name}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-center text-xs text-gray-400 py-2">
            برندی یافت نشد
          </p>
        )}
      </div>
    </section>
  );
}
