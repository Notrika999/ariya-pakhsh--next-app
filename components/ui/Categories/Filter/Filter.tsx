"use client";

// components/ui/Categories/Filter/Filter.tsx
import React, {
  ReactNode,
  TransitionStartFunction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import FilterColor from "./FilterColor";
import PriceRangeFilter from "./PriceRangeFilter";
import FilterBrand from "./FilterBrand";
import {
  BRAND_PARAM,
  COLOR_PALETTE_PARAM,
  normalizeBrandParamToSlug,
} from "@/src/lib/helper/productListHelpers";
import { isColorFilterAttribute } from "@/src/lib/helper/filterColorHelpers";

type FilterState = {
  search?: string;
  minPrice: number;
  maxPrice: number;
  brands?: string[];
  categoryId?: string;
};

type BrandOption = {
  id?: string | number;
  brandId: string | number;
  name: string;
  slug?: string;
};

type RawBrandOption = BrandOption | string;

type ColorOption = {
  optionId: string;
  value: string;
  displayText?: string;
  count: number;
  colorCodes?: string;
  hex?: string;
};

type FilterAttribute = {
  attributeId: string;
  attributeName: string;
  options?: ColorOption[];
};

type CategoryOption = {
  categoryId: string;
  parentId?: string | null;
  parentCategoryId?: string | null;
  name: string;
  slug: string;
  count: number;
  children?: CategoryOption[];
};

type CategoryTreeNode = CategoryOption & {
  children: CategoryTreeNode[];
};

type FilterOptions = {
  attributes?: FilterAttribute[];
  brands?: BrandOption[];
  categories?: CategoryOption[];
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
  isActive?: boolean;
};

function FilterDropdown({
  title,
  children,
  defaultOpen = false,
  isActive = false,
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
        <span className="font-bold text-base inline-flex items-center gap-2">
          {title}
          {isActive ? (
            <span
              className="inline-block w-2 h-2 rounded-full bg-blue-500 shrink-0"
              aria-label="فیلتر فعال"
            />
          ) : null}
        </span>
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

function getCategoryParentId(category: CategoryOption): string | null {
  return category.parentCategoryId ?? category.parentId ?? null;
}

function buildCategoryTree(categories: CategoryOption[]): CategoryTreeNode[] {
  const nodes = new Map<string, CategoryTreeNode>();

  for (const category of categories) {
    const children = category.children?.length
      ? buildCategoryTree(category.children)
      : [];

    nodes.set(category.categoryId, {
      ...category,
      children,
    });
  }

  const roots: CategoryTreeNode[] = [];

  for (const node of nodes.values()) {
    const parentId = getCategoryParentId(node);
    const parent = parentId ? nodes.get(parentId) : null;

    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function CategoryTree({
  nodes,
  selectedCategoryId,
  onToggle,
  level = 0,
}: {
  nodes: CategoryTreeNode[];
  selectedCategoryId?: string;
  onToggle: (categoryId: string) => void;
  level?: number;
}) {
  return (
    <ul className={level === 0 ? "space-y-1" : "mt-1 space-y-1"}>
      {nodes.map((node) => {
        const isSelected = selectedCategoryId === node.categoryId;

        return (
          <li key={node.categoryId}>
            <button
              type="button"
              onClick={() => onToggle(node.categoryId)}
              className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-start text-sm transition ${
                isSelected
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
              style={{ paddingInlineStart: 12 + level * 14 }}
            >
              <span className="min-w-0 truncate">{node.name}</span>
              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {node.count}
              </span>
            </button>

            {node.children.length > 0 ? (
              <CategoryTree
                nodes={node.children}
                selectedCategoryId={selectedCategoryId}
                onToggle={onToggle}
                level={level + 1}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
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

  const normalizedBrands: BrandOption[] = availableBrands
    .map((brand) =>
      typeof brand === "string"
        ? { brandId: brand, name: brand, slug: brand }
        : brand,
    )
    .filter((brand) => Boolean(brand.slug || brand.brandId));

  const handleBrandToggle = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const canonicalSlug = normalizeBrandParamToSlug(slug, normalizedBrands);
      const current = [
        ...params.getAll(BRAND_PARAM),
        ...params.getAll("brandSlug"),
      ]
        .map((value) => normalizeBrandParamToSlug(value, normalizedBrands))
        .filter(Boolean);

      params.delete("brandId");
      params.delete("brandSlug");
      params.delete(BRAND_PARAM);

      const uniqueCurrent = [...new Set(current)];

      if (uniqueCurrent.includes(canonicalSlug)) {
        uniqueCurrent
          .filter((value) => value !== canonicalSlug)
          .forEach((value) => params.append(BRAND_PARAM, value));
      } else {
        [...uniqueCurrent, canonicalSlug].forEach((value) =>
          params.append(BRAND_PARAM, value),
        );
      }

      params.set("page", "1");
      navigate(params);
    },
    [searchParams, navigate, normalizedBrands],
  );

  const categoryTree = useMemo(
    () => buildCategoryTree(filterOptions?.categories ?? []),
    [filterOptions?.categories],
  );

  const selectedCategoryId =
    searchParams.get("categoryId") ?? filters.categoryId ?? undefined;

  const handleCategoryToggle = useCallback(
    (categoryId: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (params.get("categoryId") === categoryId) {
        params.delete("categoryId");
      } else {
        params.set("categoryId", categoryId);
      }

      params.set("page", "1");
      navigate(params);
    },
    [searchParams, navigate],
  );

  const colorAttributes =
    filterOptions?.attributes?.filter((attr) => isColorFilterAttribute(attr)) ??
    [];
  const hasColorOptions = colorAttributes.some(
    (attr) => (attr.options?.length ?? 0) > 0,
  );

  const selectedBrands = Array.isArray(filters.brands) ? filters.brands : [];

  const hasColorFilter =
    searchParams.getAll(COLOR_PALETTE_PARAM).length > 0 ||
    Array.from(searchParams.keys()).some(
      (key) => key.startsWith("attr_") || key === "ColorOptionIds",
    );

  const hasBrandFilter = selectedBrands.length > 0;
  const hasCategoryFilter = Boolean(selectedCategoryId);

  const hasPriceFilter =
    filters.minPrice > minLimit || filters.maxPrice < maxLimit;

  const hasActiveFilters =
    hasBrandFilter ||
    hasCategoryFilter ||
    hasPriceFilter ||
    hasColorFilter ||
    (filters.search && filters.search.trim() !== "");

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", "1");
    navigate(params);
  }, [navigate]);

  return (
    <section className="space-y-5 sticky top-0">
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

      {hasColorOptions ? (
        <FilterDropdown title="رنگ ها" isActive={hasColorFilter}>
          <FilterColor
            colorAttributes={colorAttributes}
            startTransition={startTransition}
          />
        </FilterDropdown>
      ) : null}

      <FilterDropdown title="محدوده قیمت" defaultOpen isActive={hasPriceFilter}>
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

      <FilterDropdown title="برند" isActive={hasBrandFilter}>
        <FilterBrand
          brands={normalizedBrands}
          selectedBrands={selectedBrands}
          onToggle={handleBrandToggle}
        />
      </FilterDropdown>


      {categoryTree.length > 0 ? (
        <FilterDropdown title="دسته‌بندی" defaultOpen isActive={hasCategoryFilter}>
          <CategoryTree
            nodes={categoryTree}
            selectedCategoryId={selectedCategoryId}
            onToggle={handleCategoryToggle}
          />
        </FilterDropdown>
      ) : null}
    </section>
  );
}
