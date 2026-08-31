// app/search/page.tsx
import type { Metadata } from "next";
import SearchProductListPage from "@/components/ui/Search/SearchProductListPage";
import { normalizeProductSearchParams } from "@/src/lib/helper/productListHelpers";
import { getSearchProductsFromSearchParams } from "@/src/services/search/search-products.server";
import { absoluteUrl } from "@/src/lib/seo/site";

export const metadata: Metadata = {
  title: "جستجوی محصولات",
  description: "جستجو و فیلتر محصولات فروشگاه کارآپ 24.",
  alternates: {
    canonical: absoluteUrl("/search"),
  },
  robots: { index: false, follow: true },
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const searchKey = normalizeProductSearchParams(resolvedSearchParams);
  const query =
    (Array.isArray(resolvedSearchParams.Q)
      ? resolvedSearchParams.Q[0]
      : resolvedSearchParams.Q) ??
    (Array.isArray(resolvedSearchParams.q)
      ? resolvedSearchParams.q[0]
      : resolvedSearchParams.q) ??
    "";

  let result;
  let errorMessage: string | null = null;

  try {
    result = await getSearchProductsFromSearchParams(resolvedSearchParams);
  } catch (error) {
    console.error("[SearchPage] search failed =>", error);
    errorMessage =
      error instanceof Error ? error.message : "خطا در دریافت نتایج جستجو";
    result = {
      products: [],
      suggestions: [],
      appliedFilters: {
        categoryId: null,
        brandIds: [],
        vehicleIds: [],
        colorOptionIds: [],
        minPrice: null,
        maxPrice: null,
        inStock: null,
        onSaleOnly: null,
        attributeFilters: [],
      },
      page: 1,
      totalPages: 0,
      totalCount: 0,
      filterOptions: {
        brands: [],
        categories: [],
        attributes: [],
        colors: [],
        vehicles: [],
        minPrice: 0,
        maxPrice: 0,
      },
    };
  }

  return (
    <SearchProductListPage
      key={searchKey}
      query={query}
      initialProducts={result.products}
      pagination={{
        page: result.page,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
      }}
      filterOptions={result.filterOptions}
      appliedFilters={result.appliedFilters}
      errorMessage={errorMessage}
      serverSearchKey={searchKey}
    />
  );
}
