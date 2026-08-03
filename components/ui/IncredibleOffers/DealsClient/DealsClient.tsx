"use client";
// components/ui/IncredibleOffers/DealsClient/DealsClient.tsx
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
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
  const [isNavigating, setIsNavigating] = useState(false);

  const handleStartTransition = useCallback<typeof startTransition>(
    (callback) => {
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
        isLoading={isPending || isNavigating}
        startTransition={handleStartTransition}
        timer={true}
        sortOptions={SORT_OPTIONS}
        sortQueryParam="SortBy"
        sortOptionToQuery={SORT_OPTION_TO_API_QUERY}
        clearSortQueryParams={["sort"]}
      />
    </SectionContainer>
  );
}
