"use client";
// compnents/ui/Search/SearchProductListPage.tsx
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductListSection from "@/components/ui/ProductListSection/ProductListSection";
import { ProductCardsSkeletonGrid } from "@/components/ui/Categories/ProductListPageSkeleton";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import type {
  ProductCardModel,
  ProductListAppliedFilters,
  ProductListResponse,
} from "@/src/lib/types/productTypes";
import type { SortOption } from "@/src/lib/types/filters/filters";
import { normalizeProductSearchParams } from "@/src/lib/helper/productListHelpers";
import { AlertCircle, CheckCircle } from "lucide-react";

type Props = {
  query: string;
  initialProducts: ProductCardModel[];
  pagination: {
    page: number;
    totalPages: number;
    totalCount: number;
  };
  filterOptions: ProductListResponse["filterOptions"];
  appliedFilters: ProductListAppliedFilters;
  errorMessage?: string | null;
  serverSearchKey: string;
};

type LoadedSearchResult = {
  key: string;
  products: ProductCardModel[];
  page: number;
  totalPages: number;
  totalCount: number;
  filterOptions: ProductListResponse["filterOptions"];
  appliedFilters: ProductListAppliedFilters;
  errorMessage: string | null;
};

const HEADER_SEARCH_RESULTS_EVENT = "header-search-results";

const EMPTY_APPLIED_FILTERS: ProductListAppliedFilters = {
  categoryId: null,
  brandIds: [],
  vehicleIds: [],
  colorOptionIds: [],
  minPrice: null,
  maxPrice: null,
  inStock: null,
  onSaleOnly: null,
  attributeFilters: [],
};

const SORT_OPTIONS: SortOption[] = [
  "Default",
  "Newest",
  "PriceAsc",
  "PriceDesc",
  "BestSelling",
  "MostViewed",
  "MostRated",
];

const SORT_QUERY_TO_OPTION: Record<string, SortOption> = {
  default: "Default",
  relevance: "Default",
  newest: "Newest",
  priceAsc: "PriceAsc",
  priceDesc: "PriceDesc",
  bestSelling: "BestSelling",
  mostViewed: "MostViewed",
  mostRated: "MostRated",
  Default: "Default",
  Relevance: "Default",
  Newest: "Newest",
  PriceAsc: "PriceAsc",
  PriceDesc: "PriceDesc",
  BestSelling: "BestSelling",
  MostViewed: "MostViewed",
  MostRated: "MostRated",
};

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

function parseSortOption(value: string | null): SortOption {
  if (value && SORT_QUERY_TO_OPTION[value]) return SORT_QUERY_TO_OPTION[value];
  return SORT_OPTIONS.includes(value as SortOption)
    ? (value as SortOption)
    : "Default";
}

function getFirstParam(searchParams: URLSearchParams, ...keys: string[]) {
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value) return value;
  }

  return null;
}

function getParamValues(searchParams: URLSearchParams, ...keys: string[]) {
  return keys.flatMap((key) => searchParams.getAll(key)).filter(Boolean);
}

function getNumberParam(searchParams: URLSearchParams, ...keys: string[]) {
  const raw = getFirstParam(searchParams, ...keys);
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getBooleanParam(searchParams: URLSearchParams, ...keys: string[]) {
  const raw = getFirstParam(searchParams, ...keys)
    ?.trim()
    .toLowerCase();
  if (raw === "true") return true;
  if (raw === "false") return false;
  return undefined;
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function getProductKey(product: ProductCardModel) {
  return product.id || product.slug || product.title;
}

function appendUniqueProducts(
  currentProducts: ProductCardModel[],
  nextProducts: ProductCardModel[],
) {
  const seen = new Set(currentProducts.map(getProductKey));
  const uniqueNextProducts = nextProducts.filter((product) => {
    const key = getProductKey(product);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return [...currentProducts, ...uniqueNextProducts];
}

export default function SearchProductListPage({
  query,
  initialProducts,
  pagination,
  filterOptions,
  appliedFilters,
  errorMessage = null,
  serverSearchKey,
}: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [clientResult, setClientResult] = useState<LoadedSearchResult | null>(
    null,
  );
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inFlightPageRef = useRef<number | null>(null);

  const currentSearchKey = normalizeProductSearchParams(searchParams);
  const currentQuery = searchParams.get("Q") ?? searchParams.get("q") ?? query;
  const queryKey = useMemo(
    () =>
      JSON.stringify({
        pathname,
        search: currentSearchKey,
      }),
    [currentSearchKey, pathname],
  );
  const hasClientResult = clientResult?.key === queryKey;
  const isServerResultCurrent = serverSearchKey === currentSearchKey;

  const activeProducts = useMemo(
    () =>
      hasClientResult
        ? clientResult.products
        : isServerResultCurrent
          ? initialProducts
          : [],
    [clientResult, hasClientResult, initialProducts, isServerResultCurrent],
  );
  const activeFilterOptions = hasClientResult
    ? clientResult.filterOptions
    : filterOptions;
  const activeAppliedFilters = hasClientResult
    ? clientResult.appliedFilters
    : (appliedFilters ?? EMPTY_APPLIED_FILTERS);
  const activeErrorMessage = hasClientResult
    ? clientResult.errorMessage
    : errorMessage;
  const activePagination = hasClientResult
    ? {
        page: clientResult.page,
        totalPages: clientResult.totalPages,
        totalCount: clientResult.totalCount,
      }
    : pagination;
  const priceLimit = {
    min: activeFilterOptions.minPrice ?? 0,
    max: activeFilterOptions.maxPrice ?? 0,
  };
  const { page: currentPage, totalPages, totalCount } = activePagination;
  const hasCurrentResult = hasClientResult || isServerResultCurrent;
  const hasMore =
    hasCurrentResult && !activeErrorMessage && currentPage < totalPages;
  const activeUrlParams = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );
  const urlBrands = getParamValues(
    activeUrlParams,
    "brand",
    "brandId",
    "brandIds",
    "BrandIds",
  );
  const activeMinPrice =
    getNumberParam(activeUrlParams, "minPrice", "MinPrice") ??
    activeAppliedFilters.minPrice ??
    priceLimit.min;
  const activeMaxPrice =
    getNumberParam(activeUrlParams, "maxPrice", "MaxPrice") ??
    activeAppliedFilters.maxPrice ??
    priceLimit.max;
  const activeInStock =
    getBooleanParam(activeUrlParams, "inStock", "InStock") ??
    activeAppliedFilters.inStock ??
    false;
  const activeOnSaleOnly =
    getBooleanParam(activeUrlParams, "onSaleOnly", "OnSaleOnly") ??
    activeAppliedFilters.onSaleOnly ??
    false;

  const filters = useMemo(
    () => ({
      search: currentQuery,
      categoryId:
        getFirstParam(activeUrlParams, "categoryId", "CategoryId") ??
        activeAppliedFilters.categoryId ??
        undefined,
      brands:
        urlBrands.length > 0
          ? uniqueStrings(urlBrands)
          : uniqueStrings(activeAppliedFilters.brandIds ?? []),
      minPrice: activeMinPrice,
      maxPrice: activeMaxPrice,
      inStock: activeInStock,
      onSaleOnly: activeOnSaleOnly,
      sort: parseSortOption(getFirstParam(activeUrlParams, "sort", "Sort")),
    }),
    [
      activeAppliedFilters.brandIds,
      activeAppliedFilters.categoryId,
      activeInStock,
      activeMaxPrice,
      activeMinPrice,
      activeOnSaleOnly,
      activeUrlParams,
      currentQuery,
      urlBrands,
    ],
  );

  const handleStartTransition = useCallback<typeof startTransition>(
    (callback) => {
      inFlightPageRef.current = null;
      setClientResult(null);
      setLoadMoreError(null);
      setIsFetchingMore(false);
      startTransition(callback);
    },
    [startTransition],
  );

  const handleFilterNavigate = useCallback(
    (params: URLSearchParams) => {
      if (!params.get("Q") && currentQuery) {
        params.set("Q", currentQuery);
      }
      params.delete("q");
      params.delete("search");

      const nextSearch = params.toString();
      const nextSearchKey = normalizeProductSearchParams(params);
      const nextQueryKey = JSON.stringify({
        pathname,
        search: nextSearchKey,
      });
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      inFlightPageRef.current = null;
      setIsFetching(true);
      setIsFetchingMore(false);
      setLoadMoreError(null);

      startTransition(() => {
        router.replace(`${pathname}?${nextSearch}`, { scroll: false });
      });

      void fetch(`/search/api?${nextSearch}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      })
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.errorMessage || "Search request failed");
          }

          if (requestIdRef.current !== requestId) return;
          setClientResult({
            key: nextQueryKey,
            products: data.products ?? [],
            page: data.page ?? 1,
            totalPages: data.totalPages ?? 0,
            totalCount: data.totalCount ?? 0,
            filterOptions: data.filterOptions,
            appliedFilters: data.appliedFilters ?? EMPTY_APPLIED_FILTERS,
            errorMessage: null,
          });
        })
        .catch((error) => {
          if (requestIdRef.current !== requestId) return;
          console.error("[SearchProductListPage] filter failed =>", error);
          setClientResult({
            key: nextQueryKey,
            products: [],
            page: 1,
            totalPages: 0,
            totalCount: 0,
            filterOptions: activeFilterOptions,
            appliedFilters: activeAppliedFilters,
            errorMessage:
              error instanceof Error
                ? error.message
                : "خطا در دریافت نتایج جستجو",
          });
        })
        .finally(() => {
          if (requestIdRef.current === requestId) {
            setIsFetching(false);
          }
        });
    },
    [
      activeAppliedFilters,
      activeFilterOptions,
      currentQuery,
      pathname,
      router,
      startTransition,
    ],
  );

  const fetchNextPage = useCallback(
    async (forceRetry = false) => {
      const nextPage = currentPage + 1;

      if (
        !hasCurrentResult ||
        nextPage > totalPages ||
        isFetching ||
        isFetchingMore ||
        (!forceRetry && loadMoreError) ||
        inFlightPageRef.current === nextPage
      ) {
        return;
      }

      inFlightPageRef.current = nextPage;
      setIsFetchingMore(true);
      setLoadMoreError(null);

      try {
        const params = new URLSearchParams(searchParams.toString());

        if (!params.get("Q") && currentQuery) {
          params.set("Q", currentQuery);
        }

        params.delete("q");
        params.delete("search");
        params.set("page", String(nextPage));

        const response = await fetch(`/search/api?${params.toString()}`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.errorMessage || "Search request failed");
        }

        if (inFlightPageRef.current !== nextPage) return;

        setClientResult((prev) => {
          const currentProducts =
            prev?.key === queryKey ? prev.products : activeProducts;

          return {
            key: queryKey,
            products: appendUniqueProducts(
              currentProducts,
              data.products ?? [],
            ),
            page: data.page ?? nextPage,
            totalPages: data.totalPages ?? totalPages,
            totalCount: data.totalCount ?? totalCount,
            filterOptions: data.filterOptions ?? activeFilterOptions,
            appliedFilters: data.appliedFilters ?? activeAppliedFilters,
            errorMessage: null,
          };
        });
      } catch (error) {
        console.error("[SearchProductListPage] load more failed =>", error);
        setLoadMoreError(
          error instanceof Error
            ? error.message
            : "خطا در بارگذاری نتایج بیشتر",
        );
      } finally {
        if (inFlightPageRef.current === nextPage) {
          inFlightPageRef.current = null;
        }
        setIsFetchingMore(false);
      }
    },
    [
      activeAppliedFilters,
      activeFilterOptions,
      activeProducts,
      currentPage,
      currentQuery,
      hasCurrentResult,
      isFetching,
      isFetchingMore,
      loadMoreError,
      queryKey,
      searchParams,
      totalCount,
      totalPages,
    ],
  );

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(HEADER_SEARCH_RESULTS_EVENT, {
        detail: {
          query: currentQuery,
          totalCount: activePagination.totalCount,
        },
      }),
    );
  }, [activePagination.totalCount, currentQuery]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasMore]);

  return (
    <SectionContainer>
      <ProductListSection
        filters={filters}
        pagination={activePagination}
        filterOptions={activeFilterOptions}
        minLimit={priceLimit.min}
        maxLimit={priceLimit.max}
        products={activeProducts}
        errorMessage={activeErrorMessage}
        isLoading={isFetching || (isPending && !hasClientResult)}
        startTransition={handleStartTransition}
        onFilterNavigate={handleFilterNavigate}
        sortOptions={SORT_OPTIONS}
        sortQueryParam="sort"
        sortOptionToQuery={SORT_OPTION_TO_QUERY}
      />

      {hasMore && <div ref={sentinelRef} className="h-1" />}

      {isFetchingMore && (
        <div className="mt-4 grid grid-cols-12 gap-5">
          <div className="hidden lg:col-span-3 lg:block" aria-hidden />
          <div className="col-span-12 lg:col-span-9">
            <ProductCardsSkeletonGrid count={4} />
          </div>
        </div>
      )}

      {loadMoreError && !isFetchingMore && (
        <div className="py-6">
          <button
            type="button"
            onClick={() => fetchNextPage(true)}
            className="mx-auto flex w-150 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
          >
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              {loadMoreError} برای تلاش مجدد کلیک کنید
            </span>
          </button>
        </div>
      )}

      {!hasMore && !isFetchingMore && activeProducts.length > 0 && (
        <div className="py-6">
          <div className="mx-auto flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">همه نتایج نمایش داده شد</span>
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
