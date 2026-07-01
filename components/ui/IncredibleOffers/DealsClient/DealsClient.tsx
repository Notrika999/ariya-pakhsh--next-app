"use client";

import { useMemo, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCardModel, ProductListResponse } from "@/src/lib/types/productTypes";
import type { SortOption } from "@/src/lib/types/filters/filters";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import ProductListSection from "../../ProductListSection/ProductListSection";
import IncredibleOffersDay from "../IncredibleOffersDay/IncredibleOffersDay";
import IncredibleOffersBaner from "../IncredibleOffersBaner/IncredibleOffersBaner";
import SliderProduct from "@/components/modules/SliderProduct/SliderProduct";

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
}

const SORT_OPTIONS: SortOption[] = [
  "default",
  "newest",
  "priceAsc",
  "priceDesc",
  "bestSelling",
  "mostRated",
  "discountDesc",
];

function parseSort(value: string | null): SortOption {
  return SORT_OPTIONS.includes(value as SortOption)
    ? (value as SortOption)
    : "discountDesc";
}

export default function DealsClient({
  products,
  specialProducts,
  pagination,
  filterOptions,
  minLimit,
  maxLimit,
}: DealsClientProps) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      brands: searchParams.getAll("brandId"),
      minPrice: Number(searchParams.get("minPrice") ?? minLimit),
      maxPrice: Number(searchParams.get("maxPrice") ?? maxLimit),
      sort: parseSort(searchParams.get("sort")),
    }),
    [maxLimit, minLimit, searchParams],
  );

  return (
    <SectionContainer className="flex flex-col gap-8">
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
        pagination={pagination}
        filterOptions={filterOptions}
        minLimit={minLimit}
        maxLimit={maxLimit}
        products={products}
        isLoading={isPending}
        startTransition={startTransition}
      />
    </SectionContainer>
  );
}
