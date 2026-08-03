// components/ui/Categories/ProductListPage.tsx

"use client";

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
}

export default function CategoryProductListPage({
  category,
  breadcrumb,
  initialProducts,
  pagination,
  filterOptions,
  errorMessage = null,
}: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchKey = searchParams.toString();

  // وضعیت لودینگ برای فیلتر/مرتب‌سازی: از لحظه شروع ناوبری تا رسیدن داده جدید سرور
  const handleStartTransition = useCallback<typeof startTransition>(
    (callback) => {
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

  const priceLimit = useMemo(
    () => ({
      min: filterOptions?.minPrice ?? 0,
      max: filterOptions?.maxPrice ?? 0,
    }),
    [filterOptions?.minPrice, filterOptions?.maxPrice],
  );

  const sidebarFilterOptions = useMemo(() => {
    if ((filterOptions.categories?.length ?? 0) > 0) {
      return filterOptions;
    }

    if (!category?.children?.length) {
      return filterOptions;
    }

    return {
      ...filterOptions,
      categories: category.children.map(mapCategoryToFilterOption),
    };
  }, [category, filterOptions]);

  const listKey = useMemo(
    () =>
      JSON.stringify({
        pathname,
        search: searchKey,
        page: pagination.page,
        totalCount: pagination.totalCount,
        products: initialProducts.map(getProductListItemKey),
      }),
    [
      pathname,
      searchKey,
      pagination.page,
      pagination.totalCount,
      initialProducts,
    ],
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

  // همگام‌سازی لیست با داده سرور
  // پایان transition ناوبری → خاموش کردن لودینگ (حتی اگر totalCount تغییر نکرده باشد)
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const inFlightPageRef = useRef<number | null>(null);
  const routeCategoryId = getCategoryId(category);
  const categoryId = searchParams.get("categoryId") ?? routeCategoryId;

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
      const params = new URLSearchParams(searchKey);
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
    searchKey,
    slug,
    categoryId,
    listKey,
    initialProducts,
  ]);

  const hasMore = currentPage < totalPages;

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

    return (filterOptions.categories ?? []).map((item) => ({
      id: item.categoryId,
      categoryId: item.categoryId,
      name: item.name,
      slug: item.slug,
      src: getCategoryImage(
        ("image" in item ? item.image : null) as CategoryImageInput,
      ),
    }));
  }, [category, filterOptions.categories]);

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
        errorMessage={errorMessage}
        isLoading={isPending}
        startTransition={handleStartTransition}
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

      <DescriptionCategory />
    </SectionContainer>
  );
}
