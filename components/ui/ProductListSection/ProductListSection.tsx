"use client";
// components/ui/ProductListSection/ProductListSection.tsx

import { memo, TransitionStartFunction, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Layers } from "lucide-react";

import ProductCard from "@/components/modules/ProductCard/ProductCard";
import FilterResponsive from "../Categories/FilterResponsive/FilterResponsive";
import Filter from "../Categories/Filter/Filter";
import { ProductCardsSkeletonGrid } from "../Categories/ProductListPageSkeleton";
import ErrorState from "./ErrorState";
import { normalizeProduct } from "@/src/lib/mappers/product.mapper";
import type {
  ProductCardModel,
  ProductListItem,
  ProductListResponse,
} from "@/src/lib/types/productTypes";
import type { SortOption } from "@/src/lib/types/filters/filters";

type ProductListFilters = {
  search: string;
  // color: string;
  categoryId?: string;
  brands: string[];
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  onSaleOnly: boolean;
  sort: SortOption;
};

interface Props {
  filters: ProductListFilters;
  pagination: {
    page: number;
    totalPages: number;
    totalCount: number;
  };
  filterOptions: ProductListResponse["filterOptions"];
  minLimit: number;
  maxLimit: number;
  products: Array<ProductListItem | ProductCardModel>;
  errorMessage?: string | null;
  isLoading?: boolean;
  startTransition: TransitionStartFunction;
  onFilterNavigate?: (params: URLSearchParams) => void;
  timer?: boolean;
  sortOptions?: SortOption[];
  sortQueryParam?: string;
  sortOptionToQuery?: Partial<Record<SortOption, string | null>>;
  clearSortQueryParams?: string[];
}

const SKELETON_COUNT = 8;

const SORT_LABELS: Record<SortOption, string> = {
  Default: "پیش‌فرض",
  BestDiscount: "پرتخفیف",
  Newest: "جدیدترین",
  PriceAsc: "ارزان‌ترین",
  PriceDesc: "گران‌ترین",
  BestSelling: "پرفروش",
  MostViewed: "پربازدید",
  DiscountDesc: "پرتخفیف",
  MostRated: "امتیاز",
};

const DESKTOP_SORT_LABELS: Record<SortOption, string> = {
  Default: "پیش‌فرض",
  BestDiscount: "بیشترین تخفیف",
  Newest: "جدیدترین",
  PriceAsc: "کمترین قیمت",
  PriceDesc: "بیشترین قیمت",
  BestSelling: "پرفروش ترین",
  MostViewed: "پربازدیدترین",
  DiscountDesc: "بیشترین تخفیف",
  MostRated: "بالاترین امتیاز",
};

const DEFAULT_VISIBLE_SORT_OPTIONS: SortOption[] = [
  "BestSelling",
  "PriceDesc",
  "PriceAsc",
  "Newest",
  "DiscountDesc",
  "Default",
];

const SORT_OPTION_TO_QUERY: Record<SortOption, string | null> = {
  Default: null,
  BestDiscount: "bestDiscount",
  Newest: "newest",
  PriceAsc: "priceAsc",
  PriceDesc: "priceDesc",
  BestSelling: "bestSelling",
  MostViewed: "mostViewed",
  DiscountDesc: "discountDesc",
  MostRated: "mostRated",
};

function toCardProduct(
  product: ProductListItem | ProductCardModel,
): ProductCardModel {
  if ("categoryName" in product && "currency" in product) {
    return product as ProductCardModel;
  }

  return normalizeProduct(product);
}

function getProductKey(product: ProductListItem | ProductCardModel): string {
  return "productId" in product ? product.productId : product.id;
}

function isProductOutOfStock(
  product: ProductListItem | ProductCardModel,
): boolean {
  if (product.inStock === false) return true;

  if (
    "availableQuantity" in product &&
    typeof product.availableQuantity === "number"
  ) {
    return product.availableQuantity <= 0;
  }

  return false;
}

function sortOutOfStockLast(
  products: Array<ProductListItem | ProductCardModel>,
) {
  return [...products].sort((a, b) => {
    const aOut = isProductOutOfStock(a);
    const bOut = isProductOutOfStock(b);
    if (aOut === bOut) return 0;
    return aOut ? 1 : -1;
  });
}

function getVisibleSortOptions(options?: SortOption[]) {
  return options ?? DEFAULT_VISIBLE_SORT_OPTIONS;
}

const productCountFormatter = new Intl.NumberFormat("fa-IR");

type FilterPanelProps = {
  filters: ProductListFilters;
  filterOptions: ProductListResponse["filterOptions"];
  minLimit: number;
  maxLimit: number;
  startTransition: TransitionStartFunction;
  onFilterNavigate?: (params: URLSearchParams) => void;
};

const DesktopFilterPanel = memo(function DesktopFilterPanel({
  filters,
  filterOptions,
  minLimit,
  maxLimit,
  startTransition,
  onFilterNavigate,
}: FilterPanelProps) {
  return (
    <aside className="xl:col-span-2 lg:col-span-3 hidden lg:block">
      <div className="custom-scrollbar sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain pe-1 pb-2 ">
        <Filter
          filters={filters}
          availableBrands={filterOptions.brands}
          minLimit={minLimit}
          maxLimit={maxLimit}
          startTransition={startTransition}
          onFilterNavigate={onFilterNavigate}
          filterOptions={filterOptions}
        />
      </div>
    </aside>
  );
});

const MobileFilterPanel = memo(function MobileFilterPanel({
  filters,
  filterOptions,
  minLimit,
  maxLimit,
  startTransition,
  onFilterNavigate,
  isOpen,
  onOpenChange,
}: FilterPanelProps & {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <FilterResponsive
      filters={filters}
      brands={filterOptions.brands}
      minLimit={minLimit}
      maxLimit={maxLimit}
      filterOptions={filterOptions}
      startTransition={startTransition}
      onFilterNavigate={onFilterNavigate}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideTrigger
    />
  );
});

export default function ProductListSection({
  filters,
  pagination,
  minLimit,
  maxLimit,
  products,
  filterOptions,
  errorMessage = null,
  isLoading = false,
  timer,
  startTransition,
  onFilterNavigate,
  sortOptions,
  sortQueryParam = "sort",
  sortOptionToQuery,
  clearSortQueryParams = [],
}: Props) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const visibleSortOptions = getVisibleSortOptions(sortOptions);
  const currentSortLabel = SORT_LABELS[filters.sort] ?? "پیش‌فرض";
  const orderedProducts = useMemo(
    () => sortOutOfStockLast(products),
    [products],
  );

  const handleSortChange = (newSort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    const sortQueryValue =
      sortOptionToQuery?.[newSort] ?? SORT_OPTION_TO_QUERY[newSort];

    if (!sortQueryValue) {
      params.delete(sortQueryParam);
    } else {
      params.set(sortQueryParam, sortQueryValue);
    }
    clearSortQueryParams.forEach((key) => params.delete(key));
    params.delete("page");

    if (onFilterNavigate) {
      onFilterNavigate(params);
      return;
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleMobileSortChange = (newSort: SortOption) => {
    handleSortChange(newSort);
    setMobileSortOpen(false);
  };

  return (
    <>
      <MobileFilterPanel
        filters={filters}
        filterOptions={filterOptions}
        minLimit={minLimit}
        maxLimit={maxLimit}
        startTransition={startTransition}
        onFilterNavigate={onFilterNavigate}
        isOpen={mobileFilterOpen}
        onOpenChange={setMobileFilterOpen}
      />

      <div className="grid grid-cols-12 gap-5 mt-4 md:mt-6">
        {/* <!-- START FILTER SECTION --> */}
        <DesktopFilterPanel
          filters={filters}
          filterOptions={filterOptions}
          minLimit={minLimit}
          maxLimit={maxLimit}
          startTransition={startTransition}
          onFilterNavigate={onFilterNavigate}
        />
        {/* <!-- END FILTER SECTION --> */}

        {/* <!-- START PRODUCT LIST SECTION --> */}
        <section className="xl:col-span-10 lg:col-span-9 col-span-12">
          <div className="flex flex-wrap items-center space-y-3 space-x-3 lg:space-y-0">
            <div className="flex w-full items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="inline-flex md:h-12 h-8 items-center gap-2 rounded-full border border-gray-200 bg-white md:px-5 px-2 text-sm md:font-semibold text-gray-700 shadow-sm transition active:scale-[0.98] dark:border-gray-700 dark:bg-custom-dark dark:text-gray-100"
                aria-label="نمایش فیلترها"
              >
                <span>فیلتر</span>
                <i className="fa-solid fa-sliders text-base" />
              </button>

              <button
                type="button"
                onClick={() => setMobileSortOpen(true)}
                className="inline-flex md:h-12 h-8 items-center gap-2 rounded-full border border-gray-200 bg-white md:px-5 px-2 text-sm md:font-semibold text-gray-700 shadow-sm transition active:scale-[0.98] dark:border-gray-700 dark:bg-custom-dark dark:text-gray-100"
                aria-label="نمایش مرتب‌سازی"
                aria-expanded={mobileSortOpen}
              >
                <span>{currentSortLabel}</span>
                <i className="fa-solid fa-arrow-down-wide-short text-base" />
              </button>
            </div>

            <div className="hidden w-full items-center gap-7 rounded-xl bg-gray-light px-2 py-1.5 text-base font-medium text-gray-950 dark:bg-[#18202b] dark:text-gray-100 lg:flex">
              <div className="flex shrink-0 items-center gap-3">
                <Layers
                  className="icon-order fill-gray-100  w-5 h-5"
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
                <span className=" flex items-center text-sm font-semiBold leading-4 text-gray-800 dark:text-gray-100">
                  ترتیب:
                </span>
              </div>

              <div className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto">
                {visibleSortOptions.map((option) => {
                  const isActive = filters.sort === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSortChange(option)}
                      className={`shrink-0 whitespace-nowrap transition hover:text-primary ${
                        isActive
                          ? "cursor-pointer py-4 text-xs leading-4  font-semiBold text-primary"
                          : "cursor-pointer py-4 text-xs leading-4  font-regular text-gray-800 dark:text-gray-100"
                      }`}
                    >
                      {DESKTOP_SORT_LABELS[option] ??
                        SORT_LABELS[option] ??
                        option}
                    </button>
                  );
                })}
              </div>

              <span className=" text-xs font-regular leading-4 text-gray-800 dark:text-gray-100">
                {productCountFormatter.format(pagination.totalCount)} کالا
              </span>
            </div>
          </div>

          {mobileSortOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="بستن مرتب‌سازی"
                className="absolute inset-0 bg-black/45"
                onClick={() => setMobileSortOpen(false)}
              />

              <div
                className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white px-7 pb-[calc(env(safe-area-inset-bottom)+18px)] pt-4 shadow-2xl dark:bg-[#0d1117]"
                dir="rtl"
              >
                <div className="mx-auto mb-7 h-1.5 w-16 rounded-full bg-gray-300 dark:bg-gray-700" />

                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-950 dark:text-gray-50">
                    مرتب سازی بر اساس
                  </h2>
                  <button
                    type="button"
                    onClick={() => setMobileSortOpen(false)}
                    className="flex size-10 items-center justify-center text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    aria-label="بستن"
                  >
                    <i className="far fa-xmark text-2xl" />
                  </button>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {visibleSortOptions.map((option) => {
                    const isActive = filters.sort === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleMobileSortChange(option)}
                        className="flex w-full items-center justify-between py-5 text-right text-base font-semibold text-gray-700 transition hover:text-primary dark:text-gray-200"
                      >
                        <span>{SORT_LABELS[option] ?? option}</span>
                        {isActive && (
                          <i className="fa-solid fa-check text-lg text-gray-700 dark:text-gray-100" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="[overflow-anchor:none]">
              <ProductCardsSkeletonGrid count={SKELETON_COUNT} />
            </div>
          ) : errorMessage ? (
            <ErrorState
              message={errorMessage}
              onRetry={() => router.refresh()}
            />
          ) : (
            <div className="mt-4 grid grid-cols-12 gap-2 [overflow-anchor:none]">
              {orderedProducts.length === 0 ? (
                <div className="col-span-12 py-16 text-center text-gray-400 dark:text-gray-500">
                  <p className="text-lg">محصولی یافت نشد</p>
                </div>
              ) : (
                orderedProducts.map((product) => (
                  <div
                    key={getProductKey(product)}
                    className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3"
                  >
                    {timer ? (
                      <ProductCard product={toCardProduct(product)} />
                    ) : (
                      <ProductCard product={toCardProduct(product)} noTimer />
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
