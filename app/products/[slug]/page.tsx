// app/products/[slug]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata } from "next";

import CategoryProductListPage from "@/components/ui/Categories/ProductListPage";
import { ApiError } from "@/src/lib/http/client-http";
import {
  getCategoryBreadcrumb,
  getCategoryBySlug,
} from "@/src/services/category/category.service";
import { getProductList } from "@/src/services/product/product.service";

import type { Category as CategoryType } from "@/src/lib/types/categories/menuType";
import type { ProductListResponse } from "@/src/lib/types/productTypes";
import {
  createFallbackBreadcrumb,
  firstValue,
  parseAttributeFilters,
  parseNumber,
  parseSortOrder,
} from "@/src/lib/helper/productListHelpers";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    brandId?: string | string[];
    color?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    inStock?: string;
    onSaleOnly?: string;
    [key: string]: string | string[] | undefined;
  }>;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

async function CategoryPage({ params, searchParams }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  if (!slug) notFound();

  const {
    page = "1",
    brandId,
    minPrice,
    maxPrice,
    sort,
    inStock,
    onSaleOnly,
  } = await searchParams;

  // ── Category ──────────────────────────────────────────────────────────────
  let category: CategoryType | null = null;

  try {
    category = await getCategoryBySlug(slug);
  } catch {
    // اگه category پیدا نشد (404) یا هر خطای دیگه‌ای،
    // فرض میکنیم slug مربوط به برند است
    category = null;
  }

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  const breadcrumbRaw = category
    ? await getCategoryBreadcrumb({ slug, includeHome: true })
    : null;

  const breadcrumb = breadcrumbRaw ?? createFallbackBreadcrumb(slug);

  // ── Products ──────────────────────────────────────────────────────────────
  let productLists: ProductListResponse;

  try {
    productLists = await getProductList({
      CategoryId: category?.id,
      BrandId: firstValue(brandId),
      CategorySlug: category ? slug : undefined,
      BrandSlug: category ? undefined : slug,

      Page: parseNumber(page) ?? 1,

      AttributeFilters: parseAttributeFilters(await searchParams),

      MinPrice: parseNumber(minPrice),
      MaxPrice: parseNumber(maxPrice),

      SortOrder: parseSortOrder(sort),

      InStock: inStock === "true" ? true : undefined,
      OnSaleOnly: onSaleOnly === "true" ? true : undefined,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <CategoryProductListPage
      category={category}
      breadcrumb={breadcrumb}
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

export default CategoryPage;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let category: CategoryType | null = null;

  try {
    category = await getCategoryBySlug(slug);
  } catch {
    // slug ممکنه برند باشه — metadata پیش‌فرض برمیگردونیم
    category = null;
  }

  const displayName = category?.name ?? decodeURIComponent(slug);

  const title = category?.seoTitle
    ? `${category.seoTitle} | خرید آنلاین`
    : `${displayName} | خرید آنلاین`;

  const description = category?.seoDescription
    ? `خرید ${category.seoDescription} با بهترین قیمت و تنوع کالا از فروشگاه آنلاین ما.`
    : `خرید محصولات ${displayName} با بهترین قیمت از فروشگاه آنلاین ما.`;

  const keywords = category?.seoKeywords ?? undefined;

  return {
    title,
    description,
    ...(keywords && { keywords }),
    alternates: {
      canonical: `https://carup24.com/products/${encodeURIComponent(slug)}`,
    },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}
