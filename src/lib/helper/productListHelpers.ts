// src/lib/helpers/productListHelpers.ts

import type { SortOrder } from "@/src/lib/types/productTypes";
import type { CategoryBreadcrumbItem } from "@/src/lib/types/categories/breadcrumb";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductPageSearchParams = {
  page?: string;
  brand?: string | string[]; // SEO: brand=slug
  brandSlug?: string | string[]; // legacy
  brandId?: string | string[]; // legacy
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

/** SEO-friendly brand query key (`brand=slug`). */
export const BRAND_PARAM = "brand";

/** Prefer `brand`, then legacy brandSlug / brandId. */
export function resolveBrandSlugParam(
  searchParams: Pick<
    ProductPageSearchParams,
    "brand" | "brandSlug" | "brandId"
  >,
): string | undefined {
  return (
    firstValue(searchParams.brand) ??
    firstValue(searchParams.brandSlug) ??
    firstValue(searchParams.brandId)
  );
}

export function allBrandSlugParams(
  searchParams:
    | URLSearchParams
    | Pick<ProductPageSearchParams, "brand" | "brandSlug" | "brandId">,
): string[] {
  if (searchParams instanceof URLSearchParams) {
    const fromBrand = searchParams.getAll(BRAND_PARAM).filter(Boolean);
    if (fromBrand.length > 0) return fromBrand;
    const fromSlug = searchParams.getAll("brandSlug").filter(Boolean);
    if (fromSlug.length > 0) return fromSlug;
    return searchParams.getAll("brandId").filter(Boolean);
  }

  const fromBrand = searchParams.brand;
  if (fromBrand) {
    return (Array.isArray(fromBrand) ? fromBrand : [fromBrand]).filter(Boolean);
  }

  const fromSlug = searchParams.brandSlug;
  if (fromSlug) {
    return (Array.isArray(fromSlug) ? fromSlug : [fromSlug]).filter(Boolean);
  }

  const fromId = searchParams.brandId;
  if (fromId) {
    return (Array.isArray(fromId) ? fromId : [fromId]).filter(Boolean);
  }

  return [];
}

/** For product API brandSlug field (string only). Prefer BrandIds for multi. */
export function resolveBrandSlugForApi(
  searchParams:
    | URLSearchParams
    | Pick<ProductPageSearchParams, "brand" | "brandSlug" | "brandId">,
): string | undefined {
  const slugs = allBrandSlugParams(searchParams);
  return slugs.length === 1 ? slugs[0] : undefined;
}

export function resolveBrandSlugsToIds(
  slugs: string[],
  brands:
    | Array<{
        brandId: string | number;
        slug?: string | null;
        name?: string | null;
      }>
    | undefined,
): string[] {
  if (!slugs.length || !brands?.length) return [];

  return brands
    .filter((brand) => brandMatchesParam(brand, slugs))
    .map((brand) => String(brand.brandId))
    .filter(Boolean);
}

export function brandMatchesParam(
  brand: {
    brandId?: string | number | null;
    slug?: string | null;
    name?: string | null;
  },
  param: string | string[],
): boolean {
  const params = Array.isArray(param) ? param : [param];
  if (!params.length) return false;

  const normalize = (value: string) => value.trim().toLowerCase();
  const slug = normalize(String(brand.slug ?? ""));
  const name = normalize(String(brand.name ?? ""));
  const id = normalize(String(brand.brandId ?? ""));

  return params.some((raw) => {
    const p = normalize(raw);
    return p === slug || p === name || p === id;
  });
}

/** Map URL brand value to canonical slug for SEO query. */
export function normalizeBrandParamToSlug(
  param: string,
  brands: Array<{
    brandId: string | number;
    slug?: string | null;
    name?: string | null;
  }>,
): string {
  const trimmed = param.trim();
  if (!trimmed) return trimmed;

  const found = brands.find((brand) => brandMatchesParam(brand, trimmed));
  return found
    ? String(found.slug ?? found.brandId).trim()
    : trimmed;
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

/** Query key for SEO-friendly color filter values (`displayText`). */
export const COLOR_PALETTE_PARAM = "color_palette";

export function listSearchParamValues(
  searchParams:
    | URLSearchParams
    | Record<string, string | string[] | undefined>,
  key: string,
): string[] {
  if (searchParams instanceof URLSearchParams) {
    return searchParams
      .getAll(key)
      .map((value) => value.trim())
      .filter(Boolean);
  }

  const raw = searchParams[key];
  if (!raw) return [];
  return (Array.isArray(raw) ? raw : [raw])
    .map((value) => value.trim())
    .filter(Boolean);
}

export function getColorOptionLabel(option: {
  displayText?: string | null;
  value?: string | null;
}): string {
  return String(option.displayText ?? option.value ?? "").trim();
}

export function resolveColorPaletteAttributeFilters(
  paletteLabels: string[],
  attributes:
    | Array<{
        attributeId: string;
        attributeName: string;
        options?: Array<{
          optionId: string;
          value?: string;
          displayText?: string;
        }>;
      }>
    | undefined,
): Array<{ attributeId: string; optionIds: string[] }> {
  if (paletteLabels.length === 0 || !attributes?.length) return [];

  const colorAttrs = attributes.filter(
    (attr) => attr.attributeName === "رنگ" || attr.attributeId === "color",
  );
  if (!colorAttrs.length) return [];

  const normalize = (value: string) => value.trim().toLowerCase();
  const wanted = new Set(paletteLabels.map(normalize));

  const result: Array<{ attributeId: string; optionIds: string[] }> = [];

  for (const attr of colorAttrs) {
    const optionIds = (attr.options ?? [])
      .filter((option) => wanted.has(normalize(getColorOptionLabel(option))))
      .map((option) => option.optionId)
      .filter(Boolean);

    if (optionIds.length > 0) {
      result.push({
        attributeId: attr.attributeId,
        optionIds: [...new Set(optionIds)],
      });
    }
  }

  return result;
}

/** @deprecated use resolveColorPaletteAttributeFilters */
export function resolveColorPaletteAttributeFilter(
  paletteLabels: string[],
  attributes: Parameters<typeof resolveColorPaletteAttributeFilters>[1],
): { attributeId: string; optionIds: string[] } | null {
  const filters = resolveColorPaletteAttributeFilters(paletteLabels, attributes);
  if (filters.length === 0) return null;

  return {
    attributeId: filters[0].attributeId,
    optionIds: [...new Set(filters.flatMap((filter) => filter.optionIds))],
  };
}

export function mergeColorIntoAttributeFilters(
  base: Array<{ attributeId: string; optionIds: string[] }>,
  colorFilters:
    | Array<{ attributeId: string; optionIds: string[] }>
    | { attributeId: string; optionIds: string[] }
    | null,
): Array<{ attributeId: string; optionIds: string[] }> {
  const resolved = Array.isArray(colorFilters)
    ? colorFilters
    : colorFilters
      ? [colorFilters]
      : [];

  if (!resolved.length) return base;

  const colorAttrIds = new Set(resolved.map((filter) => filter.attributeId));
  const withoutColor = base.filter((item) => !colorAttrIds.has(item.attributeId));

  return [...withoutColor, ...resolved];
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
