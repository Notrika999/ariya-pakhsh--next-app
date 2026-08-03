// app/products/[slug]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata } from "next";

import CategoryProductListPage from "@/components/ui/Categories/ProductListPage";
import {
  CategoryServiceError,
  getCategoryBreadcrumb,
  getCategoryBySlug,
  getMegaMenu,
} from "@/src/services/category/category.server";
import {
  createEmptyProductListResponse,
  getProductListFromSearchParams,
  ProductServiceError,
} from "@/src/services/product/product.server";

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

function getCategoryId(category: CategoryType | null): string | undefined {
  return (category?.id ?? category?.categoryId)?.trim() || undefined;
}

function getProductListErrorMessage(error: unknown): string {
  if (error instanceof CategoryServiceError) {
    return error.message;
  }

  if (error instanceof ProductServiceError) {
    return error.message;
  }

  return "امکان دریافت محصولات این دسته‌بندی وجود ندارد.";
}

function normalizeSlug(rawSlug: string): string {
  return decodeURIComponent(rawSlug).trim();
}

function shouldFallbackToMegaMenu(error: unknown): boolean {
  return !(error instanceof CategoryServiceError) || error.status === 404;
}

function findCategoryBySlug(
  categories: CategoryType[],
  slug: string,
): CategoryType | null {
  for (const category of categories) {
    if (category.slug === slug) {
      return category;
    }

    const child = findCategoryBySlug(category.children ?? [], slug);
    if (child) {
      return child;
    }
  }

  return null;
}

async function getCategoryFromMegaMenu(
  slug: string,
): Promise<CategoryType | null> {
  try {
    const categories = await getMegaMenu();
    return findCategoryBySlug(categories, slug);
  } catch {
    return null;
  }
}

async function CategoryPage({ params, searchParams }: Props) {
  const { slug: rawSlug } = await params;
  const slug = normalizeSlug(rawSlug);

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
  let categoryLookupError: unknown = null;
  let shouldBlockBrandFallback = false;

  try {
    category = await getCategoryBySlug(slug);

  } catch (error) {
    categoryLookupError = error;

    if (shouldFallbackToMegaMenu(error)) {
      category = await getCategoryFromMegaMenu(slug);
    } else {
      shouldBlockBrandFallback = true;
    }
  }

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  const breadcrumbPromise = category
    ? getCategoryBreadcrumb({ slug, includeHome: true })
    : Promise.resolve(null);

  // ── Products ──────────────────────────────────────────────────────────────
  let productLists: ProductListResponse;
  let productListError: string | null = null;

  const queryBrands = allBrandSlugParams(resolvedSearchParams);
  const selectedCategoryId = Array.isArray(categoryId)
    ? categoryId[0]
    : categoryId;
  const effectiveCategoryId = selectedCategoryId || getCategoryId(category);

  const productListsPromise = shouldBlockBrandFallback && !category
    ? Promise.reject(categoryLookupError)
    : getProductListFromSearchParams(
      {
        CategoryId: effectiveCategoryId,
        CategorySlug: effectiveCategoryId ? undefined : category ? slug : undefined,
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

  const [breadcrumbRaw, productListsResult] = await Promise.all([
    breadcrumbPromise,
    productListsPromise.then(
      (value) => ({ ok: true as const, value }),
      (error: unknown) => ({ ok: false as const, error }),
    ),
  ]);

  const breadcrumb = breadcrumbRaw ?? createFallbackBreadcrumb(slug);

  if (productListsResult.ok) {
    productLists = productListsResult.value;
  } else {
    if (
      productListsResult.error instanceof ProductServiceError &&
      productListsResult.error.status === 404
    ) {
      notFound();
    }

    console.error("[products/category] product list failed", {
      slug,
      categoryId: effectiveCategoryId,
      error: productListsResult.error,
    });

    productListError = getProductListErrorMessage(productListsResult.error);
    productLists = createEmptyProductListResponse(parseNumber(page) ?? 1);
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
      errorMessage={productListError}
    />
  );
}

export default CategoryPage;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = normalizeSlug(rawSlug);

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
