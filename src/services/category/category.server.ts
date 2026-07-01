// src/services/category/category.server.ts
import "server-only";

import { proxyToBackend } from "@/src/lib/http/server-http";
import {
  Category,
  MegaMenuResponse,
} from "@/src/lib/types/categories/menuType";
import { PromotedCategory } from "@/src/lib/types/categories/category";
import {
  BreadcrumbResponse,
  CategoryBreadcrumbItem,
} from "@/src/lib/types/categories/breadcrumb";

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export type CategoryFilterType = "all" | "recommended" | "featured";

export interface PromotedParams {
  filter?: CategoryFilterType;
  maxCount?: number;
}

export async function getMegaMenu(): Promise<Category[]> {
  const response = await proxyToBackend<MegaMenuResponse>({
    method: "GET",
    path: "/api/v1/Categories/mega-menu",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch mega menu");
  }

  return response.data.data.rootCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const response = await proxyToBackend<ApiResponse<Category>>({
    method: "GET",
    path: `/api/v1/Categories/${slug}`,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }

  return response.data.data;
}

export async function getPromotedCategories(
  params: PromotedParams = {},
): Promise<PromotedCategory[]> {
  const { filter, maxCount = 12 } = params;

  const response = await proxyToBackend<ApiResponse<PromotedCategory[]>>({
    method: "GET",
    path: "/api/v1/Categories/promoted",
    params: { filter, maxCount },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch promoted categories");
  }

  return response.data.data;
}

export interface CategoryBreadcrumbParams {
  categoryId?: string;
  slug?: string;
  includeHome?: boolean;
}

export async function getCategoryBreadcrumb(
  params: CategoryBreadcrumbParams,
): Promise<CategoryBreadcrumbItem[] | null> {
  try {
    const response = await proxyToBackend<BreadcrumbResponse>({
      method: "GET",
      path: "/api/v1/Categories/breadcrumb",
      params: {
        categoryId: params.categoryId,
        slug: params.slug ? decodeURIComponent(params.slug) : undefined,
        includeHome: params.includeHome ?? true,
      },
      cache: "no-store",
    });

    if (!response.ok) return null;
    return response.data.success ? response.data.data.items : null;
  } catch {
    return null;
  }
}
