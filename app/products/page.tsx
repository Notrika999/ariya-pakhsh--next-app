// app/products/page.tsx

import CategoryProductListPage from "@/components/ui/Categories/ProductListPage";
import {
  ALL_PRODUCTS_BREADCRUMB,
  parseNumber,
  parseSortOrder,
  ProductPageSearchParams,
  normalizeProductSearchParams,
} from "@/src/lib/helper/productListHelpers";
import { getProductListFromSearchParams } from "@/src/services/product/product.server";

import type { Metadata } from "next";
import { buildPaginatedCanonical } from "@/src/lib/seo/canonical";

const PRODUCTS_METADATA = {
  title: "همه محصولات | خرید آنلاین",
  description: "خرید آنلاین انواع محصولات با بهترین قیمت از فروشگاه ما.",
  openGraph: {
    title: "همه محصولات | خرید آنلاین",
    description: "خرید آنلاین انواع محصولات با بهترین قیمت از فروشگاه ما.",
    type: "website" as const,
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "همه محصولات | خرید آنلاین",
    description: "خرید آنلاین انواع محصولات با بهترین قیمت از فروشگاه ما.",
  },
  robots: { index: true, follow: true },
};

type Props = {
  searchParams: Promise<ProductPageSearchParams>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;

  return {
    ...PRODUCTS_METADATA,
    alternates: {
      canonical: buildPaginatedCanonical("/products", resolvedSearchParams.page),
    },
  };
}

export default async function StorePage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const {
    page = "1",
    minPrice,
    maxPrice,
    sort,
    inStock,
    onSaleOnly,
    categoryId,
  } = resolvedSearchParams;

  const productLists = await getProductListFromSearchParams(
    {
      CategoryId: Array.isArray(categoryId)
        ? categoryId[0]
        : categoryId ?? null,
      Page: parseNumber(page) ?? 1,
      MinPrice: parseNumber(minPrice),
      MaxPrice: parseNumber(maxPrice),
      SortOrder: parseSortOrder(sort),
      InStock: inStock === "true" ? true : undefined,
      OnSaleOnly: onSaleOnly === "true" ? true : undefined,
    },
    resolvedSearchParams,
  );

  return (
    <CategoryProductListPage
      category={null}
      breadcrumb={ALL_PRODUCTS_BREADCRUMB}
      initialProducts={productLists.items}
      pagination={{
        page: productLists.page,
        totalPages: productLists.totalPages,
        totalCount: productLists.totalCount,
      }}
      filterOptions={productLists.filterOptions}
      serverSearchKey={normalizeProductSearchParams(resolvedSearchParams)}
    />
  );
}
