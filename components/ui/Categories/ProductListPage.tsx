"use client";
// components/ui/Categories/ProductListPage.tsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import DescriptionCategory from "./DescriptionCategory/DescriptionCategory";
import CategoriesSlider, {
  type SliderCategory,
} from "@/components/modules/CategoriesSlider/CategoriesSlider";
import SectionTitle from "@/components/modules/SectionTitle/SectionTitle";
import Breadcrumb from "@/components/modules/Breadcrumb/Breadcrumb";
import ProductListSection from "../ProductListSection/ProductListSection";
import { ProductCardsSkeletonGrid } from "./ProductListPageSkeleton";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";

import type { Category as MenuCategory } from "@/src/lib/types/categories/menuType";
import type { CategoryBreadcrumbItem } from "@/src/lib/types/categories/breadcrumb";
import type {
  ProductListItem,
  ProductListResponse,
} from "@/src/lib/types/productTypes";
import type { SortOption } from "@/src/lib/types/filters/filters";
import { getCategoryImage } from "@/src/utils/product-image";
import { normalizeProductSearchParams } from "@/src/lib/helper/productListHelpers";

import { CheckCircle, AlertCircle } from "lucide-react";

type BreadcrumbItem = CategoryBreadcrumbItem & { link?: string };
type CategoryImageInput = Parameters<typeof getCategoryImage>[0];
type SidebarCategoryOption =
  ProductListResponse["filterOptions"]["categories"][number] & {
    children?: SidebarCategoryOption[];
  };

const SORT_OPTIONS: SortOption[] = [
  "Default",
  "Newest",
  "PriceAsc",
  "PriceDesc",
  "BestSelling",
  "MostViewed",
  "DiscountDesc",
  "MostRated",
];

const SORT_QUERY_TO_OPTION: Record<string, SortOption> = {
  default: "Default",
  newest: "Newest",
  oldest: "Default",
  priceAsc: "PriceAsc",
  priceDesc: "PriceDesc",
  bestSelling: "BestSelling",
  mostViewed: "MostViewed",
  discountDesc: "DiscountDesc",
  mostRated: "MostRated",
  Default: "Default",
  Newest: "Newest",
  PriceAsc: "PriceAsc",
  PriceDesc: "PriceDesc",
  BestSelling: "BestSelling",
  MostViewed: "MostViewed",
  DiscountDesc: "DiscountDesc",
  MostRated: "MostRated",
};

const PRODUCT_LIST_API_PATH = "/products/api";

function parseSortOption(value: string | null): SortOption {
  if (value && SORT_QUERY_TO_OPTION[value]) return SORT_QUERY_TO_OPTION[value];

  return SORT_OPTIONS.includes(value as SortOption)
    ? (value as SortOption)
    : "Default";
}

function mapCategoryToFilterOption(
  category: MenuCategory,
): SidebarCategoryOption {
  const categoryId = category.id ?? category.categoryId;

  return {
    categoryId,
    name: category.name,
    slug: category.slug,
    count: 0,
    children: category.children?.map(mapCategoryToFilterOption) ?? [],
  };
}

function getCategoryId(category: MenuCategory | null): string | undefined {
  return (category?.id ?? category?.categoryId)?.trim() || undefined;
}

function getProductListItemKey(product: ProductListItem): string {
  return (
    product.productId ||
    product.defaultVariantId ||
    product.publicCode ||
    product.slug ||
    product.name
  );
}

interface Props {
  category: MenuCategory | null;
  breadcrumb: BreadcrumbItem[];
  initialProducts: ProductListItem[];
  pagination: {
    page: number;
    totalPages: number;
    totalCount: number;
  };
  filterOptions: ProductListResponse["filterOptions"];
  errorMessage?: string | null;
  serverSearchKey: string;
}

type LoadedProductList = {
  key: string;
  items: ProductListItem[];
  page: number;
  totalPages: number;
  totalCount: number;
};

type ClientFilterResult = {
  key: string;
  filterOptions: ProductListResponse["filterOptions"];
  errorMessage: string | null;
};

export default function CategoryProductListPage({
  category,
  breadcrumb,
  initialProducts,
  pagination,
  filterOptions,
  errorMessage = null,
  serverSearchKey,
}: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchKey = searchParams.toString();
  const currentSearchKey = normalizeProductSearchParams(searchParams);
  const isServerResultCurrent = serverSearchKey === currentSearchKey;
  const queryKey = useMemo(
    () =>
      JSON.stringify({
        pathname,
        search: currentSearchKey,
      }),
    [pathname, currentSearchKey],
  );

  const [clientFilterResult, setClientFilterResult] =
    useState<ClientFilterResult | null>(null);
  const [isFilterFetching, setIsFilterFetching] = useState(false);
  const filterRequestIdRef = useRef(0);
  const activeFilterOptions =
    clientFilterResult?.key === queryKey
      ? clientFilterResult.filterOptions
      : filterOptions;
  const activeErrorMessage =
    clientFilterResult?.key === queryKey
      ? clientFilterResult.errorMessage
      : errorMessage;

  const priceLimit = useMemo(
    () => ({
      min: activeFilterOptions.minPrice ?? 0,
      max: activeFilterOptions.maxPrice ?? 0,
    }),
    [activeFilterOptions.minPrice, activeFilterOptions.maxPrice],
  );

  const sidebarFilterOptions = useMemo(() => {
    if ((activeFilterOptions.categories?.length ?? 0) > 0) {
      return activeFilterOptions;
    }

    if (!category?.children?.length) {
      return activeFilterOptions;
    }

    return {
      ...activeFilterOptions,
      categories: category.children.map(mapCategoryToFilterOption),
    };
  }, [category, activeFilterOptions]);

  const listKey = useMemo(
    () =>
      JSON.stringify({
        pathname,
        search: currentSearchKey,
        page: pagination.page,
        totalCount: pagination.totalCount,
        products: isServerResultCurrent
          ? initialProducts.map(getProductListItemKey)
          : [],
      }),
    [
      pathname,
      currentSearchKey,
      pagination.page,
      pagination.totalCount,
      initialProducts,
      isServerResultCurrent,
    ],
  );

  const [loadedList, setLoadedList] = useState<LoadedProductList | null>(null);

  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const inFlightPageRef = useRef<number | null>(null);
  const routeCategoryId = getCategoryId(category);
  const categoryId = searchParams.get("categoryId") ?? routeCategoryId;

  const slug = useMemo(() => {
    return decodeURIComponent(pathname.split("/").filter(Boolean).pop() ?? "");
  }, [pathname]);

  const serverList: LoadedProductList = {
    key: queryKey,
    items: isServerResultCurrent ? initialProducts : [],
    page: isServerResultCurrent ? pagination.page : 1,
    totalPages: isServerResultCurrent ? pagination.totalPages : 0,
    totalCount: isServerResultCurrent ? pagination.totalCount : 0,
  };

  const hasClientList = loadedList?.key === queryKey;
  const activeList = hasClientList ? loadedList : serverList;

  const hasCurrentResult = isServerResultCurrent || hasClientList;

  const handleStartTransition = useCallback<typeof startTransition>(
    (callback) => {
      inFlightPageRef.current = null;
      setLoadedList(null);
      setLoadMoreError(null);
      setIsFetchingMore(false);
      startTransition(callback);
    },
    [startTransition],
  );

  const handleCategoryNavigate = useCallback(
    (href: string) => {
      handleStartTransition(() => {
        router.push(href);
      });
    },
    [handleStartTransition, router],
  );

  const handleFilterNavigate = useCallback(
    (params: URLSearchParams) => {
      const nextSearch = params.toString();
      const nextSearchKey = normalizeProductSearchParams(params);
      const nextQueryKey = JSON.stringify({
        pathname,
        search: nextSearchKey,
      });
      const requestId = filterRequestIdRef.current + 1;
      filterRequestIdRef.current = requestId;
      inFlightPageRef.current = null;
      setLoadedList(null);
      setLoadMoreError(null);
      setIsFetchingMore(false);
      setIsFilterFetching(true);

      startTransition(() => {
        router.replace(`${pathname}?${nextSearch}`, { scroll: false });
      });

      const requestParams = new URLSearchParams(nextSearch);
      requestParams.set("page", "1");
      requestParams.set("slug", slug);

      if (categoryId) {
        requestParams.set("categoryId", categoryId);
      }

      void fetch(`${PRODUCT_LIST_API_PATH}?${requestParams.toString()}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch filtered products");
          }

          const data: {
            items: ProductListItem[];
            page: number;
            totalPages: number;
            totalCount: number;
            filterOptions: ProductListResponse["filterOptions"];
          } = await res.json();

          if (filterRequestIdRef.current !== requestId) return;

          setLoadedList({
            key: nextQueryKey,
            items: data.items,
            page: data.page,
            totalPages: data.totalPages,
            totalCount: data.totalCount,
          });
          setClientFilterResult({
            key: nextQueryKey,
            filterOptions: data.filterOptions,
            errorMessage: null,
          });
        })
        .catch((error) => {
          console.error("Filter products error:", error);

          if (filterRequestIdRef.current !== requestId) return;

          setLoadedList({
            key: nextQueryKey,
            items: [],
            page: 1,
            totalPages: 0,
            totalCount: 0,
          });
          setClientFilterResult({
            key: nextQueryKey,
            filterOptions: activeFilterOptions,
            errorMessage: "خطا در دریافت محصولات فیلتر شده",
          });
        })
        .finally(() => {
          if (filterRequestIdRef.current === requestId) {
            setIsFilterFetching(false);
          }
        });
    },
    [activeFilterOptions, categoryId, pathname, router, slug, startTransition],
  );

  const {
    items: products,
    page: currentPage,
    totalPages,
    totalCount,
  } = activeList;

  const fetchNextPage = useCallback(async (forceRetry = false) => {
    const nextPage = currentPage + 1;

    if (
      !hasCurrentResult ||
      nextPage > totalPages ||
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
      const params = new URLSearchParams(searchKey);
      params.set("page", String(nextPage));
      params.set("slug", slug);

      if (categoryId) {
        params.set("categoryId", categoryId);
      }

      const res = await fetch(`${PRODUCT_LIST_API_PATH}?${params.toString()}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data: {
        items: ProductListItem[];
        page: number;
        totalPages: number;
        totalCount: number;
      } = await res.json();

      setLoadedList((prev) => {
        const prevItems = prev?.key === queryKey ? prev.items : initialProducts;

        return {
          key: queryKey,
          items: [...prevItems, ...data.items],
          page: data.page,
          totalPages: data.totalPages,
          totalCount: data.totalCount,
        };
      });
    } catch (error) {
      console.error("Load more products error:", error);
      setLoadMoreError("خطا در بارگذاری محصولات بیشتر");
    } finally {
      inFlightPageRef.current = null;
      setIsFetchingMore(false);
    }
  }, [
    currentPage,
    totalPages,
    isFetchingMore,
    loadMoreError,
    hasCurrentResult,
    searchKey,
    slug,
    categoryId,
    queryKey,
    initialProducts,
  ]);

  const hasMore = hasCurrentResult && currentPage < totalPages;

  const sliderCategories = useMemo<SliderCategory[]>(() => {
    if (category?.children?.length) {
      return category.children.map((item) => ({
        id: item.id,
        categoryId: item.id,
        name: item.name,
        slug: item.slug,
        src: getCategoryImage(item.image),
      }));
    }

    if (category) {
      return [];
    }

    return (activeFilterOptions.categories ?? []).map((item) => ({
      id: item.categoryId,
      categoryId: item.categoryId,
      name: item.name,
      slug: item.slug,
      src: getCategoryImage(
        ("image" in item ? item.image : null) as CategoryImageInput,
      ),
    }));
  }, [category, activeFilterOptions.categories]);

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

  const filters = {
    search: "",
    categoryId,
    brands:
      searchParams.getAll("brand").length > 0
        ? searchParams.getAll("brand")
        : searchParams.getAll("brandSlug").length > 0
          ? searchParams.getAll("brandSlug")
          : searchParams.getAll("brandId"),
    minPrice: Number(searchParams.get("minPrice") ?? priceLimit.min),
    maxPrice: Number(searchParams.get("maxPrice") ?? priceLimit.max),
    inStock: searchParams.get("inStock") === "true",
    onSaleOnly: searchParams.get("onSaleOnly") === "true",
    sort: parseSortOption(searchParams.get("sort")),
  };

  return (
    <SectionContainer>
      <Breadcrumb items={breadcrumb} />

      {sliderCategories.length > 0 && (
        <>
          <SectionTitle title="دسته بندی ها" />
          <div className="pb-10">
            <CategoriesSlider
              categories={sliderCategories}
              onNavigate={handleCategoryNavigate}
            />
          </div>
        </>
      )}

      <ProductListSection
        key={listKey}
        filters={filters}
        pagination={{ page: currentPage, totalPages, totalCount }}
        filterOptions={sidebarFilterOptions}
        minLimit={priceLimit.min}
        maxLimit={priceLimit.max}
        products={products}
        errorMessage={activeErrorMessage}
        isLoading={isFilterFetching || (isPending && !hasClientList)}
        startTransition={handleStartTransition}
        onFilterNavigate={handleFilterNavigate}
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
            className="flex w-150 mx-auto items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
          >
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              {loadMoreError} برای تلاش مجدد کلیک کنید
            </span>
          </button>
        </div>
      )}

      {!hasMore && !isFetchingMore && products.length > 0 && (
        <div className="py-6">
          <div className=" mx-auto flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              همه محصولات نمایش داده شد
            </span>
          </div>
        </div>
      )}

      <DescriptionCategory />
    </SectionContainer>
  );
}
