"use client";
// components/ui/IncredibleOffers/DealsClient/DealsClient.tsx
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ProductCardModel,
  ProductListResponse,
} from "@/src/lib/types/productTypes";
import type { SortOption } from "@/src/lib/types/filters/filters";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import ProductListSection from "../../ProductListSection/ProductListSection";
import IncredibleOffersDay from "../IncredibleOffersDay/IncredibleOffersDay";
import IncredibleOffersBaner from "../IncredibleOffersBaner/IncredibleOffersBaner";
import SliderProduct from "@/components/modules/SliderProduct/SliderProduct";
import { ProductCardsSkeletonGrid } from "../../Categories/ProductListPageSkeleton";
import { normalizeProductSearchParams } from "@/src/lib/helper/productListHelpers";
import { AlertCircle, CheckCircle } from "lucide-react";

interface DealsClientProps {
  products: ProductCardModel[];
  specialProducts: ProductCardModel[];
  pagination: {
    page: number;
    totalPages: number;
    totalCount: number;
  };
  filterOptions: ProductListResponse["filterOptions"];
  minLimit: number;
  maxLimit: number;
  serverSearchKey: string;
}

type LoadedDealsList = {
  key: string;
  products: ProductCardModel[];
  page: number;
  totalPages: number;
  totalCount: number;
};

const SORT_OPTIONS: SortOption[] = [
  "BestDiscount",
  "PriceAsc",
  "PriceDesc",
  "Newest",
  "BestSelling",
];

const SORT_OPTION_TO_API_QUERY: Partial<Record<SortOption, string | null>> = {
  BestDiscount: "bestDiscount",
  PriceAsc: "priceAsc",
  PriceDesc: "priceDesc",
  Newest: "newest",
  BestSelling: "bestSelling",
};

const SORT_QUERY_TO_OPTION: Record<string, SortOption> = {
  bestDiscount: "BestDiscount",
  default: "BestDiscount",
  newest: "Newest",
  priceAsc: "PriceAsc",
  priceDesc: "PriceDesc",
  bestSelling: "BestSelling",
  mostViewed: "MostViewed",
  mostRated: "MostRated",
  discountDesc: "BestDiscount",
  BestDiscount: "BestDiscount",
  Default: "BestDiscount",
  Newest: "Newest",
  PriceAsc: "PriceAsc",
  PriceDesc: "PriceDesc",
  BestSelling: "BestSelling",
  MostViewed: "MostViewed",
  MostRated: "MostRated",
  DiscountDesc: "BestDiscount",
};

function parseSort(value: string | null): SortOption {
  if (value && SORT_QUERY_TO_OPTION[value]) return SORT_QUERY_TO_OPTION[value];

  return SORT_OPTIONS.includes(value as SortOption)
    ? (value as SortOption)
    : "BestDiscount";
}

function getProductKey(product: ProductCardModel): string {
  return product.id || product.variantId || product.slug || product.title;
}

function appendUniqueProducts(
  currentProducts: ProductCardModel[],
  nextProducts: ProductCardModel[],
): ProductCardModel[] {
  const seen = new Set(currentProducts.map(getProductKey));
  const uniqueNextProducts = nextProducts.filter((product) => {
    const key = getProductKey(product);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return [...currentProducts, ...uniqueNextProducts];
}

export default function DealsClient({
  products,
  specialProducts,
  pagination,
  filterOptions,
  minLimit,
  maxLimit,
  serverSearchKey,
}: DealsClientProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadedList, setLoadedList] = useState<LoadedDealsList | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inFlightPageRef = useRef<number | null>(null);
  const sentinelReadyRef = useRef(true);
  const currentSearchKey = normalizeProductSearchParams(searchParams);
  const queryKey = useMemo(
    () =>
      JSON.stringify({
        pathname,
        search: currentSearchKey,
      }),
    [currentSearchKey, pathname],
  );
  const hasClientList = loadedList?.key === queryKey;
  const isServerResultCurrent = serverSearchKey === currentSearchKey;
  const activeList = useMemo<LoadedDealsList>(
    () =>
      hasClientList && loadedList
        ? loadedList
        : {
            key: queryKey,
            products: isServerResultCurrent ? products : [],
            page: isServerResultCurrent ? pagination.page : 1,
            totalPages: isServerResultCurrent ? pagination.totalPages : 0,
            totalCount: isServerResultCurrent ? pagination.totalCount : 0,
          },
    [
      hasClientList,
      isServerResultCurrent,
      loadedList,
      pagination.page,
      pagination.totalCount,
      pagination.totalPages,
      products,
      queryKey,
    ],
  );
  const hasCurrentResult = hasClientList || isServerResultCurrent;
  const hasMore = hasCurrentResult && activeList.page < activeList.totalPages;

  const handleStartTransition = useCallback<typeof startTransition>(
    (callback) => {
      inFlightPageRef.current = null;
      sentinelReadyRef.current = true;
      setLoadedList(null);
      setLoadMoreError(null);
      setIsFetchingMore(false);
      setIsNavigating(true);
      startTransition(callback);
    },
    [startTransition],
  );

  useEffect(() => {
    if (isPending) return;

    const timer = window.setTimeout(() => {
      setIsNavigating(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isPending]);

  const fetchNextPage = useCallback(
    async (forceRetry = false) => {
      const nextPage = activeList.page + 1;

      if (
        !hasCurrentResult ||
        nextPage > activeList.totalPages ||
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
        params.set("Page", String(nextPage));
        params.delete("page");

        const response = await fetch(
          `/incredible-offers/api?${params.toString()}`,
          {
            headers: { Accept: "application/json" },
            cache: "no-store",
          },
        );
        const data: {
          products?: ProductCardModel[];
          page?: number;
          totalPages?: number;
          totalCount?: number;
          error?: string;
        } = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch amazing products");
        }

        if (inFlightPageRef.current !== nextPage) return;

        setLoadedList((prev) => {
          const currentProducts =
            prev?.key === queryKey ? prev.products : activeList.products;
          const resolvedPage = Number.isFinite(data.page)
            ? Number(data.page)
            : nextPage;

          return {
            key: queryKey,
            products: appendUniqueProducts(
              currentProducts,
              data.products ?? [],
            ),
            page: Math.max(resolvedPage, nextPage),
            totalPages: data.totalPages ?? activeList.totalPages,
            totalCount: data.totalCount ?? activeList.totalCount,
          };
        });
      } catch (error) {
        console.error("Load more amazing products error:", error);
        setLoadMoreError("خطا در بارگذاری محصولات بیشتر");
      } finally {
        if (inFlightPageRef.current === nextPage) {
          inFlightPageRef.current = null;
        }
        setIsFetchingMore(false);
      }
    },
    [
      activeList,
      hasCurrentResult,
      isFetchingMore,
      loadMoreError,
      queryKey,
      searchParams,
    ],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          sentinelReadyRef.current = true;
          return;
        }

        const pageCanScroll =
          document.documentElement.scrollHeight > window.innerHeight + 1;

        if (!sentinelReadyRef.current && pageCanScroll) return;

        sentinelReadyRef.current = false;
        fetchNextPage();
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasMore]);

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      brands:
        searchParams.getAll("brand").length > 0
          ? searchParams.getAll("brand")
          : searchParams.getAll("brandSlug").length > 0
            ? searchParams.getAll("brandSlug")
            : searchParams.getAll("brandId"),
      minPrice: Number(searchParams.get("minPrice") ?? minLimit),
      maxPrice: Number(searchParams.get("maxPrice") ?? maxLimit),
      inStock: searchParams.get("inStock") === "true",
      onSaleOnly: searchParams.get("onSaleOnly") === "true",
      sort: parseSort(searchParams.get("SortBy") ?? searchParams.get("sort")),
    }),
    [maxLimit, minLimit, searchParams],
  );

  return (
    <>
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-l from-blue-600 via-red-500 to-rose-600 px-4 py-5 text-center text-white shadow-sm">
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18px 18px, rgba(255,255,255,.75) 2px, transparent 2.5px), linear-gradient(45deg, transparent 46%, rgba(255,255,255,.5) 47%, rgba(255,255,255,.5) 53%, transparent 54%)",
            backgroundSize: "72px 72px, 96px 96px",
          }}
        />
        <h1 className="relative text-2xl font-black leading-tight md:text-3xl">
          پیشنهادهای شگفت انگیز
        </h1>
      </section>
      <SectionContainer className="flex flex-col gap-8 mt-0 pt-0">
        {specialProducts.length > 0 && (
          <section>
            <SliderProduct
              products={specialProducts}
              loop={false}
              title="پیشنهادهای ویژه"
              href={false}
            />
          </section>
        )}

        <IncredibleOffersDay products={products} />
        <IncredibleOffersBaner />

        <ProductListSection
          filters={filters}
          pagination={{
            page: activeList.page,
            totalPages: activeList.totalPages,
            totalCount: activeList.totalCount,
          }}
          filterOptions={filterOptions}
          minLimit={minLimit}
          maxLimit={maxLimit}
          products={activeList.products}
          isLoading={isPending || isNavigating}
          startTransition={handleStartTransition}
          timer={true}
          sortOptions={SORT_OPTIONS}
          sortQueryParam="SortBy"
          sortOptionToQuery={SORT_OPTION_TO_API_QUERY}
          clearSortQueryParams={["sort"]}
        />

        {hasMore && (
          <div ref={sentinelRef} className="h-1 [overflow-anchor:none]" />
        )}

        {isFetchingMore && (
          <div className="mt-4 grid grid-cols-12 gap-5 [overflow-anchor:none]">
            <div className="hidden lg:col-span-3 lg:block" aria-hidden />
            <div className="col-span-12 lg:col-span-9">
              <ProductCardsSkeletonGrid count={4} />
            </div>
          </div>
        )}

        {loadMoreError && !isFetchingMore && (
          <div className="py-6 [overflow-anchor:none]">
            <button
              type="button"
              onClick={() => fetchNextPage(true)}
              className="flex  mx-auto items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
            >
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {loadMoreError} برای تلاش مجدد کلیک کنید
              </span>
            </button>
          </div>
        )}

        {!hasMore && !isFetchingMore && activeList.products.length > 0 && (
          <div className="py-6 [overflow-anchor:none]">
            <div className=" mx-auto flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                همه محصولات نمایش داده شد
              </span>
            </div>
          </div>
        )}
      </SectionContainer>
    </>
  );
}
