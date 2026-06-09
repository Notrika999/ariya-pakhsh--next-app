// src/lib/services/category/category.service.ts

import {
  Category,
  MegaMenuResponse,
} from "@/src/lib/types/categories/menuType";
import { apiClient } from "../../lib/http/client-http";
import { PromotedCategory } from "@/src/lib/types/categories/category";
import {
  BreadcrumbResponse,
  CategoryBreadcrumbItem,
} from "@/src/lib/types/categories/breadcrumb";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// تایپ برای فیلترهای مجاز (Type Safety)
export type CategoryFilterType = "all" | "recommended" | "featured";

export interface PromotedParams {
  filter?: CategoryFilterType;
  maxCount?: number;
}

/* -------------------------------------------------------------------------- */
/*                                   APIs                                     */
/* -------------------------------------------------------------------------- */

export async function getMegaMenu(): Promise<Category[]> {
  const res = await apiClient.get<MegaMenuResponse>("/Categories/mega-menu");

  // console.log("categories mega-menu raw response:", res);

  return res.data.data.rootCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const res = await apiClient.get<ApiResponse<Category>>(`/Categories/${slug}`);

  // console.log("categories slug:", slug);

  return res.data.data;
}

/**
 * دریافت دسته‌بندی‌های ارتقا یافته (Promoted) بر اساس فیلتر و تعداد
 * @param params { filter: 'all' | 'recommended' | 'featured', maxCount: number }
 */
export async function getPromotedCategories(
  params: PromotedParams = {},
): Promise<PromotedCategory[]> {
  // مقداردهی پیش‌فرض طبق مستنداتی که فرستادی
  const { filter, maxCount = 12 } = params;

  const res = await apiClient.get<ApiResponse<PromotedCategory[]>>(
    "/Categories/promoted",
    {
      params: {
        filter,
        maxCount,
      },
    },
  );

  console.log("category promoted raw response:", res);
  return res.data.data;
}

/**
 * دریافت لیست Breadcrumb برای یک دسته بندی خاص
 * @param params { categoryId, slug, includeHome }
 */

export async function getCategoryBreadcrumb(
  params: CategoryBreadcrumbParams,
): Promise<CategoryBreadcrumbItem[] | null> {
  const response = await apiClient.get<BreadcrumbResponse>(
    "/Categories/breadcrumb",
    {
      params: {
        categoryId: params.categoryId,
        slug: params.slug ? decodeURIComponent(params.slug) : undefined, // جلوگیری از double-encoding
        includeHome: params.includeHome ?? true,
      },
      validateStatus: (status) => {
        return status === 200 || status === 404;
      },
    },
  );

  console.log("getCategoryBreadcrumb => ", response);

  // اگر 404 بود → null برگردان
  if (response.status === 404) {
    return null;
  }

  if (response.data.success) {
    return response.data.data.items;
  }

  return null;
}
