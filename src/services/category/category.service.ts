// src/lib/services/category/category.service.ts

import {
  Category,
  MegaMenuResponse,
} from "@/src/lib/types/categories/menuType";
import { apiClient } from "../../lib/http/client-http";
import { PromotedCategory } from "@/src/lib/types/categories/category";

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

  console.log("categories mega-menu raw response:", res);
  console.log("categories mega-menu res.data:", res.data);
  console.log("categories mega-menu res.data.data:", res.data?.data);

  return res.data.data.rootCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const res = await apiClient.get<ApiResponse<Category>>(`/Categories/${slug}`);

  console.log("categories slug:", slug);
  console.log("categories raw response:", res);
  console.log("categories res.data:", res.data);
  console.log("categories res.data.data:", res.data?.data);

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
  console.log("category promoted params:", params);
  console.log("category promoted raw response:", res);
  console.log("category promoted res.data:", res.data);
  console.log("category promoted res.data.data:", res.data?.data);
  return res.data.data;
}
