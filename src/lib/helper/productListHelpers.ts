// src/lib/helpers/productListHelpers.ts

import type { SortOrder } from "@/src/lib/types/productTypes";
import type { CategoryBreadcrumbItem } from "@/src/lib/types/categories/breadcrumb";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductPageSearchParams = {
  page?: string;
  brandId?: string | string[];
  color?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  inStock?: string;
  onSaleOnly?: string;
  [key: string]: string | string[] | undefined;
};

export type BreadcrumbItem = CategoryBreadcrumbItem & {
  link?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const SORT_ORDERS: SortOrder[] = [
  "newest",
  "oldest",
  "priceAsc",
  "priceDesc",
  "bestSelling",
  "mostRated",
];

const SORT_ORDER_ALIASES: Record<string, SortOrder> = {
  priceAsc: "priceAsc",
  priceDesc: "priceDesc",
  bestSelling: "bestSelling",
  mostRated: "mostRated",
};

// ─── Parse Helpers ────────────────────────────────────────────────────────────

export function firstValue(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseNumber(value?: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseSortOrder(value?: string): SortOrder | undefined {
  if (value && SORT_ORDER_ALIASES[value]) {
    return SORT_ORDER_ALIASES[value];
  }
  return SORT_ORDERS.includes(value as SortOrder)
    ? (value as SortOrder)
    : undefined;
}

export function parseAttributeFilters(
  searchParams: Record<string, string | string[] | undefined>,
): Array<{ attributeId: string; optionIds: string[] }> {
  const result: Array<{ attributeId: string; optionIds: string[] }> = [];

  for (const [key, value] of Object.entries(searchParams)) {
    if (!key.startsWith("attr_")) continue;
    const attributeId = key.replace("attr_", "");
    const optionIds = Array.isArray(value) ? value : value ? [value] : [];
    if (optionIds.length > 0) {
      result.push({ attributeId, optionIds });
    }
  }

  return result;
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

export function createFallbackBreadcrumb(slug: string): BreadcrumbItem[] {
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

export const ALL_PRODUCTS_BREADCRUMB: BreadcrumbItem[] = [
  {
    id: "home",
    name: "خانه",
    slug: "",
    depth: 0,
    position: 0,
    isActive: false,
    link: "/",
  },
  {
    id: "products",
    name: "همه محصولات",
    slug: "",
    depth: 1,
    position: 1,
    isActive: true,
  },
];
