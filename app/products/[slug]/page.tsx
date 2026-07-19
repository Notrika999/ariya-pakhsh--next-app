// app/products/[slug]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata } from "next";

import CategoryProductListPage from "@/components/ui/Categories/ProductListPage";
import { ApiError } from "@/src/lib/http/api-client";
import {
  getCategoryBreadcrumb,
  getCategoryBySlug,
} from "@/src/services/category/category.server";
import { getProductListFromSearchParams } from "@/src/services/product/product.server";

import type { Category as CategoryType } from "@/src/lib/types/categories/menuType";
import type { ProductListResponse } from "@/src/lib/types/productTypes";
import {
  createFallbackBreadcrumb,
  allBrandSlugParams,
  parseNumber,
  parseSortOrder,
} from "@/src/lib/helper/productListHelpers";
import { absoluteUrl } from "@/src/lib/seo/site";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    brand?: string | string[];
    brandSlug?: string | string[];
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

  // ── Category ──────────────────────────────────────────────────────────────
  let category: CategoryType | null = null;

  try {
    category = await getCategoryBySlug(slug);

    console.log("category", category);
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

  const queryBrands = allBrandSlugParams(resolvedSearchParams);
  const selectedCategoryId = Array.isArray(categoryId)
    ? categoryId[0]
    : categoryId;

  try {
    productLists = await getProductListFromSearchParams(
      {
        CategoryId: selectedCategoryId ?? category?.id,
        CategorySlug: selectedCategoryId ? undefined : category ? slug : undefined,
        // صفحه برند (بدون دسته): slug مسیر فقط وقتی ?brand= نداریم
        PathBrandSlug: category || queryBrands.length > 0 ? undefined : slug,
        Page: parseNumber(page) ?? 1,
        MinPrice: parseNumber(minPrice),
        MaxPrice: parseNumber(maxPrice),
        SortOrder: parseSortOrder(sort),
        InStock: inStock === "true" ? true : undefined,
        OnSaleOnly: onSaleOnly === "true" ? true : undefined,
      },
      resolvedSearchParams,
    );
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
      canonical: absoluteUrl(`/products/${encodeURIComponent(slug)}`),
    },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}
