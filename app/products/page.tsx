// app/products/page.tsx

import CategoryProductListPage from "@/components/ui/Categories/ProductListPage";
import {
  ALL_PRODUCTS_BREADCRUMB,
  firstValue,
  parseAttributeFilters,
  parseNumber,
  parseSortOrder,
  ProductPageSearchParams,
} from "@/src/lib/helper/productListHelpers";
import { getProductList } from "@/src/services/product/product.service";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "همه محصولات | خرید آنلاین",
  description: "خرید آنلاین انواع محصولات با بهترین قیمت از فروشگاه ما.",
  alternates: {
    canonical: "https://carup24.com/products",
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
  const {
    page = "1",
    brandId,
    minPrice,
    maxPrice,
    sort,
    inStock,
    onSaleOnly,
  } = await searchParams;

  const productLists = await getProductList({
    Page: parseNumber(page) ?? 1,
    BrandId: firstValue(brandId),
    AttributeFilters: parseAttributeFilters(await searchParams),
    MinPrice: parseNumber(minPrice),
    MaxPrice: parseNumber(maxPrice),
    SortOrder: parseSortOrder(sort),
    InStock: inStock === "true" ? true : undefined,
    OnSaleOnly: onSaleOnly === "true" ? true : undefined,
  });

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
