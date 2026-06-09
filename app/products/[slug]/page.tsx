// app/products/[slug]/page.tsx

import { notFound } from "next/navigation";

import CategoryProductListPage from "@/components/ui/Categories/ProductListPage";
import { ApiError } from "@/src/lib/http/client-http";
import {
  getCategoryBreadcrumb,
  getCategoryBySlug,
} from "@/src/services/category/category.service";

import type { Category as CategoryType } from "@/src/lib/types/categories/menuType";
import type {
  ProductListResponse,
  SortOrder,
} from "@/src/lib/types/productTypes";
import type { CategoryBreadcrumbItem } from "@/src/lib/types/categories/breadcrumb";
import { getProductList } from "@/src/services/product/product.service";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    page?: string;
    brandId?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    inStock?: string;
    onSaleOnly?: string;
  }>;
};

const SORT_ORDERS: SortOrder[] = [
  "newest",
  "oldest",
  "price_asc",
  "price_desc",
  "best_selling",
  "popular",
];

type BreadcrumbItem = CategoryBreadcrumbItem & {
  link?: string;
};

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function parseNumber(value?: string) {
  if (!value) return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseSortOrder(value?: string): SortOrder | undefined {
  return SORT_ORDERS.includes(value as SortOrder)
    ? (value as SortOrder)
    : undefined;
}

function createFallbackBreadcrumb(slug: string): BreadcrumbItem[] {
  const title = decodeURIComponent(slug);

  return [
    {
      id: "home",
      name: "خانه",
      slug: "",
      link: "/",
      depth: -1,
      position: 0,
      isActive: false,
    },
    {
      id: slug,
      name: title,
      slug,
      depth: 0,
      position: 1,
      isActive: true,
    },
  ];
}

async function CategorayPage({ params, searchParams }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  if (!slug) {
    notFound();
  }

  const {
    page = "1",
    brandId,
    minPrice,
    maxPrice,
    sort,
    inStock,
    onSaleOnly,
  } = await searchParams;

  let category: CategoryType | null = null;

  try {
    category = await getCategoryBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      category = null;
    } else {
      throw error;
    }
  }

  const breadcrumbRaw = category
    ? await getCategoryBreadcrumb({
        slug,
        includeHome: true,
      })
    : null;

  const breadcrumb = breadcrumbRaw ?? createFallbackBreadcrumb(slug);

  let productLists: ProductListResponse;

  try {
    productLists = await getProductList({
      CategoryId: category?.id,
      
      CategorySlug: category ? slug : undefined,
      BrandSlug: category ? undefined : slug,

      Page: parseNumber(page) ?? 1,

      BrandId: firstValue(brandId),

      MinPrice: parseNumber(minPrice),

      MaxPrice: parseNumber(maxPrice),

      SortOrder: parseSortOrder(sort),

      InStock: inStock === "true" ? true : undefined,
      OnSaleOnly: onSaleOnly === "true" ? true : undefined,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <CategoryProductListPage
      category={category}
      breadcrumb={breadcrumb}
      products={productLists.items}
      pagination={{
        page: productLists.page,
        totalPages: productLists.totalPages,
        totalCount: productLists.totalCount,
      }}
      filterOptions={productLists.filterOptions}
    />
  );
}

export default CategorayPage;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let category: CategoryType;

  try {
    category = await getCategoryBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const title = category?.name
    ? `${category.name} | خرید آنلاین`
    : "دسته‌بندی | خرید آنلاین";

  // اگر از بک‌اند description/keywords ندارید، حداقل یک description قابل‌قبول بسازید.
  const description = category?.name
    ? `خرید ${category.name} با بهترین قیمت و تنوع کالا از فروشگاه آنلاین ما.`
    : "خرید آنلاین انواع محصولات در دسته‌بندی‌های مختلف.";
  console.log(category);
  return {
    title,
    description,
    alternates: {
      canonical: `https://yourdomain.com/categories/${encodeURIComponent(slug)}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}
