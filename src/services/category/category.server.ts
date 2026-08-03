// src/services/category/category.server.ts
import "server-only";

import { cache } from "react";
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
  errorMessage?: string;
  error?: string;
  title?: string;
}

export class CategoryServiceError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "CategoryServiceError";
  }
}

function getApiMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;

  const record = data as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : undefined;

  for (const source of [record, nested]) {
    if (!source) continue;
    for (const key of ["message", "errorMessage", "error", "title"]) {
      const value = source[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }

  return fallback;
}

export type CategoryFilterType = "all" | "recommended" | "featured";

export interface PromotedParams {
  filter?: CategoryFilterType;
  maxCount?: number;
}

export const getMegaMenu = cache(async function getMegaMenu(): Promise<Category[]> {
  const response = await proxyToBackend<MegaMenuResponse>({
    method: "GET",
    path: "/api/v1/Categories/mega-menu",
    cache: "no-store",
    timeout: 5_000,
    retries: 0,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch mega menu");
  }

  const payload = response.data as MegaMenuResponse & {
    rootCategories?: Category[];
  };

  return payload.data?.rootCategories ?? payload.rootCategories ?? [];
});

export const getCategoryBySlug = cache(async function getCategoryBySlug(
  slug: string,
): Promise<Category> {
  const response = await proxyToBackend<ApiResponse<Category>>({
    method: "GET",
    path: `/api/v1/Categories/${slug}`,
    cache: "no-store",
    timeout: 5_000,
    retries: 0,
  });

  if (!response.ok) {
    throw new CategoryServiceError(
      response.status,
      getApiMessage(response.data, "Failed to fetch category"),
      response.data,
    );
  }

  const payload = response.data as ApiResponse<Category> & Category;

  return payload.data ?? payload;
});

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
      timeout: 4_000,
      retries: 0,
    });

    if (!response.ok) return null;
    return response.data.success ? response.data.data.items : null;
  } catch {
    return null;
  }
}
