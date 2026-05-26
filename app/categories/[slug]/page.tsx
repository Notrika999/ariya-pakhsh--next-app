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

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ categoryId?: string }>;
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
  const { categoryId } = await searchParams;

  // const category = await getCategoryBySlug(slug);

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

  return (
    <CategoryProductListPage category={category} breadcrumb={breadcrumb} />
  );
}

export default CategorayPage;
