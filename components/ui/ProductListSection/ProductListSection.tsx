// components/ui/ProductListSection/ProductListSection.tsx
"use client";

import { TransitionStartFunction } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ProductCard from "@/components/modules/ProductCard/ProductCard";
import FilterResponsive from "../Categories/FilterResponsive/FilterResponsive";
import Filter from "../Categories/Filter/Filter";
import SortList from "@/components/modules/sortOptions/sortOptions";
import { ProductCardsSkeletonGrid } from "../Categories/ProductListPageSkeleton";
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
  isLoading?: boolean;
  startTransition: TransitionStartFunction;
}

const SKELETON_COUNT = 8;

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

export default function ProductListSection({
  filters,
  minLimit,
  maxLimit,
  products,
  filterOptions,
  isLoading = false,
  startTransition,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (newSort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.delete("page");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <>
      <FilterResponsive
        filters={filters}
        brands={filterOptions.brands}
        minLimit={minLimit}
        maxLimit={maxLimit}
        filterOptions={filterOptions}
        startTransition={startTransition}
      />

      <div className="grid grid-cols-12 gap-5 mt-6">

        {/* <!-- START FILTER SECTION --> */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-6">
            <Filter
              filters={filters}
              availableBrands={filterOptions.brands}
              minLimit={minLimit}
              maxLimit={maxLimit}
              startTransition={startTransition}
              filterOptions={filterOptions}
            />
          </div>
        </aside>
        {/* <!-- END FILTER SECTION --> */}

        {/* <!-- START PRODUCT LIST SECTION --> */}
        <section className="lg:col-span-9 col-span-12">
          <div className="flex flex-wrap items-center sm:space-y-0 space-y-3 space-x-3">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-sliders w-5 h-5 dark:text-white text-gray-700" />
              <span className="text-gray-700 dark:text-gray-200">
                مرتب سازی:
              </span>
            </div>
            <SortList
              currentSort={filters.sort}
              onSortChange={handleSortChange}
            />
          </div>

          {isLoading ? (
            <ProductCardsSkeletonGrid count={SKELETON_COUNT} />
          ) : (
            <div className="mt-4 grid grid-cols-12 gap-4">
              {products.length === 0 ? (
                <div className="col-span-12 py-16 text-center text-gray-400 dark:text-gray-500">
                  <p className="text-lg">محصولی یافت نشد</p>
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={getProductKey(product)}
                    className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3"
                  >
                    <ProductCard product={toCardProduct(product)} />
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
