// app/products/page.tsx

import CategoryProductListPage from "@/components/ui/Categories/ProductListPage";
import {
  ALL_PRODUCTS_BREADCRUMB,
  parseNumber,
  parseSortOrder,
  ProductPageSearchParams,
} from "@/src/lib/helper/productListHelpers";
import { getProductListFromSearchParams } from "@/src/services/product/product.server";

import type { Metadata } from "next";
import { absoluteUrl } from "@/src/lib/seo/site";

export const metadata: Metadata = {
  title: "همه محصولات | خرید آنلاین",
  description: "خرید آنلاین انواع محصولات با بهترین قیمت از فروشگاه ما.",
  alternates: {
    canonical: absoluteUrl("/products"),
  },
  openGraph: {
    title: "همه محصولات | خرید آنلاین",
    description: "خرید آنلاین انواع محصولات با بهترین قیمت از فروشگاه ما.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "همه محصولات | خرید آنلاین",
    description: "خرید آنلاین انواع محصولات با بهترین قیمت از فروشگاه ما.",
  },
  robots: { index: true, follow: true },
};

type Props = {
  searchParams: Promise<ProductPageSearchParams>;
};

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
    />
  );
}
