"use client";

// components/ui/Categories/Filter/Filter.tsx
import React, {
  ReactNode,
  TransitionStartFunction,
  useCallback,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import FilterColor from "./FilterColor";
import PriceRangeFilter from "./PriceRangeFilter";
import FilterBrand from "./FilterBrand";

type FilterState = {
  search?: string;
  minPrice: number;
  maxPrice: number;
  brands?: (string | number)[];
};

type BrandOption = {
  id?: string | number;
  brandId: string | number;
  name: string;
};

type RawBrandOption = BrandOption | string;

type ColorOption = {
  optionId: string;
  value: string;
  count: number;
};

type FilterAttribute = {
  attributeId: string;
  attributeName: string;
  options?: ColorOption[];
};

type FilterOptions = {
  attributes?: FilterAttribute[];
  brands?: BrandOption[];
};

type Props = {
  filters: FilterState;
  availableBrands?: RawBrandOption[];
  minLimit: number;
  maxLimit: number;
  startTransition?: TransitionStartFunction;
  filterOptions?: FilterOptions;
  setFilters?: unknown;
  availableCategories?: unknown[];
  availableBadges?: unknown[];
};

type FilterDropdownProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

function FilterDropdown({
  title,
  children,
  defaultOpen = false,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="dark:bg-custom-dark dark:border-gray-700 dark:text-white bg-white rounded-lg drop-shadow-lg border-gray-300 border overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 p-4 text-start"
      >
        <span className="font-bold text-base">{title}</span>
        <i
          className={`far fa-chevron-down text-sm text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {children}
        </div>
      )}
    </section>
  );
}

export default function Filter({
  filters,
  availableBrands = [],
  minLimit,
  maxLimit,
  startTransition,
  filterOptions,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigate = useCallback(
    (params: URLSearchParams) => {
      const replaceUrl = () => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      };

      if (startTransition) {
        startTransition(replaceUrl);
        return;
      }

      replaceUrl();
    },
    [pathname, router, startTransition],
  );

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", value);
    params.set("page", "1");
    navigate(params);
  };

  const priceDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handlePriceChange = useCallback(
    (range: { min: number; max: number }) => {
      if (priceDebounce.current) clearTimeout(priceDebounce.current);
      priceDebounce.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("minPrice", String(range.min));
        params.set("maxPrice", String(range.max));
        params.set("page", "1");
        navigate(params);
      }, 400);
    },
    [searchParams, navigate],
  );

  const handleBrandToggle = useCallback(
    (id: string | number) => {
      const idString = String(id);
      const params = new URLSearchParams(searchParams.toString());
      const current = params.getAll("brandId");

      if (current.includes(idString)) {
        const next = current.filter((x) => x !== idString);
        params.delete("brandId");
        next.forEach((v) => params.append("brandId", v));
      } else {
        params.append("brandId", idString);
      }

      params.set("page", "1");
      navigate(params);
    },
    [searchParams, navigate],
  );

  const colorAttribute = filterOptions?.attributes?.find(
    (attr) => attr.attributeName === "رنگ",
  );

  const selectedBrands = Array.isArray(filters.brands) ? filters.brands : [];
  const normalizedBrands: BrandOption[] = availableBrands.map((brand) =>
    typeof brand === "string" ? { brandId: brand, name: brand } : brand,
  );

  const hasAttributeFilters = Array.from(searchParams.keys()).some((key) =>
    key.startsWith("attr_"),
  );

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    filters.minPrice > minLimit ||
    filters.maxPrice < maxLimit ||
    hasAttributeFilters ||
    (filters.search && filters.search.trim() !== "");

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", "1");
    navigate(params);
  }, [navigate]);

  return (
    <section className="space-y-5 sticky top-0">
      {/* دکمه حذف فیلترها */}
      {hasActiveFilters && (
        <div
          className="dark:bg-custom-dark bg-white rounded-lg border p-4"
          dir="rtl"
        >
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors group"
          >
            <span>حذف فیلترها</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:rotate-90"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Search */}
      <section className="hidden">
        <div className="dark:bg-custom-dark bg-white rounded-lg border p-4">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="جستجوی محصولات ...."
          />
        </div>
      </section>

      {/* Color */}
      {colorAttribute?.options && (
        <FilterDropdown title="رنگ ها">
          <FilterColor
            attributeId={colorAttribute.attributeId} // ← این اضافه بشه
            options={colorAttribute.options}
          />
        </FilterDropdown>
      )}

      {/* Price */}
      <FilterDropdown title="محدوده قیمت" defaultOpen>
        <PriceRangeFilter
          min={minLimit}
          max={maxLimit}
          value={{
            min: filters.minPrice,
            max: filters.maxPrice,
          }}
          onChange={handlePriceChange}
        />
      </FilterDropdown>

      {/* Brand */}
      <FilterDropdown title="برندها">
        <FilterBrand
          brands={normalizedBrands}
          selectedBrands={selectedBrands}
          onToggle={handleBrandToggle}
        />
      </FilterDropdown>
    </section>
  );
}
