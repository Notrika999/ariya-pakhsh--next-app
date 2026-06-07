// app/categories/[slug]/page.tsx

import { notFound } from "next/navigation";

import CategoryProductListPage from "@/components/ui/Categories/ProductListPage";
import { ApiError } from "@/src/lib/http/client-http";
import {
  getCategoryBreadcrumb,
  getCategoryBySlug,
} from "@/src/services/category/category.service";

import type { Category as CategoryType } from "@/src/lib/types/categories/category";
import { Metadata } from "next";
import { getProductList } from "@/src/services/product/product.service";

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
  }>;
};

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

async function CategorayPage({ params, searchParams }: Props) {
  const { slug } = await params;

  const {
    page = "1",
    brandId,
    minPrice,
    maxPrice,
    sort,
    inStock,
  } = await searchParams;

  let category: CategoryType;

  try {
    category = await getCategoryBySlug(slug);

    console.log("cat: ", category);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const breadcrumbRaw = await getCategoryBreadcrumb({
    // categoryId: "a06d63d5-1d64-4e3e-a34b-9c7db0b163f3",
    slug: slug,
    includeHome: true,
  });

  const breadcrumb = breadcrumbRaw ?? [];

  const productLists = await getProductList({
    CategoryId: category.id,

    Page: Number(page),

    BrandId: Array.isArray(brandId) ? brandId[0] : brandId,

    MinPrice: minPrice ? Number(minPrice) : undefined,

    MaxPrice: maxPrice ? Number(maxPrice) : undefined,

     SortOrder: sort && sort !== "default" ? sort : undefined,

    InStock: inStock === "true" ? true : undefined,
  });

  console.log("Category Product List = > ", productLists);

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