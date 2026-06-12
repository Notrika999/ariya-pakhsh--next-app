"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

import DescriptionCategory from "./DescriptionCategory/DescriptionCategory";
import CategoriesSlider from "@/components/modules/CategoriesSlider/CategoriesSlider";
import SectionTitle from "@/components/modules/SectionTitle/SectionTitle";
import Breadcrumb from "@/components/modules/Breadcrumb/Breadcrumb";
import ProductListSection from "../ProductListSection/ProductListSection";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";

import type { Category as MenuCategory } from "@/src/lib/types/categories/menuType";
import type { CategoryBreadcrumbItem } from "@/src/lib/types/categories/breadcrumb";
import type {
  ProductListItem,
  ProductListResponse,
} from "@/src/lib/types/productTypes";
import type { SortOption } from "@/types/product";

import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type BreadcrumbItem = CategoryBreadcrumbItem & { link?: string };

const SORT_OPTIONS: SortOption[] = [
  "default",
  "newest",
  "priceAsc",
  "priceDesc",
  "bestSelling",
  "mostRated",
  "discountDesc",
];

function parseSortOption(value: string | null): SortOption {
  return SORT_OPTIONS.includes(value as SortOption)
    ? (value as SortOption)
    : "default";
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
}

export default function CategoryProductListPage({
  category,
  breadcrumb,
  initialProducts,
  pagination,
  filterOptions,
}: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [priceLimit] = useState({
    min: filterOptions?.minPrice ?? 0,
    max: filterOptions?.maxPrice ?? 0,
  });

  const listKey = useMemo(
    () =>
      JSON.stringify({
        pathname,
        search: searchParams.toString(),
        page: pagination.page,
      }),
    [pathname, searchParams, pagination.page],
  );

  const [loadedList, setLoadedList] = useState<{
    key: string;
    items: ProductListItem[];
    page: number;
    totalPages: number;
    totalCount: number;
  }>(() => ({
    key: listKey,
    items: initialProducts,
    page: pagination.page,
    totalPages: pagination.totalPages,
    totalCount: pagination.totalCount,
  }));

  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const inFlightPageRef = useRef<number | null>(null);
  const categoryId = category?.id ? String(category.id) : undefined;

  const slug = useMemo(() => {
    return decodeURIComponent(pathname.split("/").filter(Boolean).pop() ?? "");
  }, [pathname]);

  const activeList =
    loadedList.key === listKey
      ? loadedList
      : {
          key: listKey,
          items: initialProducts,
          page: pagination.page,
          totalPages: pagination.totalPages,
          totalCount: pagination.totalCount,
        };

  const {
    items: products,
    page: currentPage,
    totalPages,
    totalCount,
  } = activeList;

  const fetchNextPage = useCallback(async () => {
    const nextPage = currentPage + 1;

    if (
      nextPage > totalPages ||
      isFetchingMore ||
      inFlightPageRef.current === nextPage
    ) {
      return;
    }

    inFlightPageRef.current = nextPage;
    setIsFetchingMore(true);
    setLoadMoreError(null);

    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(nextPage));
      params.set("slug", slug);

      if (categoryId) {
        params.set("categoryId", categoryId);
      }

      const res = await fetch(`/api/products?${params.toString()}`);

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
        const prevItems = prev.key === listKey ? prev.items : initialProducts;

        return {
          key: listKey,
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
    searchParams,
    slug,
    categoryId,
    listKey,
    initialProducts,
  ]);

  const hasMore = currentPage < totalPages;

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
    // color: searchParams.get("color") ?? "",
    brands: searchParams.getAll("brandId"),
    minPrice: Number(searchParams.get("minPrice") ?? priceLimit.min),
    maxPrice: Number(searchParams.get("maxPrice") ?? priceLimit.max),
    sort: parseSortOption(searchParams.get("sort")),
  };

  return (
    <SectionContainer>
      <Breadcrumb items={breadcrumb} />

      {category && category.children.length > 0 && (
        <>
          <SectionTitle title="دسته بندی ها" />
          <div className="pb-10">
            <CategoriesSlider categories={category.children} />
          </div>
        </>
      )}

      <ProductListSection
        filters={filters}
        pagination={{ page: currentPage, totalPages, totalCount }}
        filterOptions={filterOptions}
        minLimit={priceLimit.min}
        maxLimit={priceLimit.max}
        products={products}
        isLoading={isPending}
        startTransition={startTransition}
      />

      {hasMore && <div ref={sentinelRef} className="h-1" />}

      {isFetchingMore && (
        <div className="py-6">
          <div className="w-150 mx-auto flex items-center justify-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">
              در حال بارگذاری محصولات بیشتر...
            </span>
          </div>
        </div>
      )}

      {loadMoreError && !isFetchingMore && (
        <div className="py-6">
          <button
            type="button"
            onClick={fetchNextPage}
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
          <div className="w-150 mx-auto flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              همه محصولات نمایش داده شد
            </span>
          </div>
        </div>
      )}

      {category && <DescriptionCategory />}
    </SectionContainer>
  );
}
