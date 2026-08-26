import type { AmazingFilterParams } from "@/src/services/promotion/promotion.server";

export type AmazingPageSearchParams = Record<
  string,
  string | string[] | undefined
>;

function firstParam(
  searchParams: AmazingPageSearchParams,
  key: string,
): string | undefined {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function listParam(searchParams: AmazingPageSearchParams, key: string): string[] {
  const value = searchParams[key];
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function numberParam(
  searchParams: AmazingPageSearchParams,
  key: string,
): number | undefined {
  const value = firstParam(searchParams, key);
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function booleanParam(
  searchParams: AmazingPageSearchParams,
  key: string,
): boolean | undefined {
  const value = firstParam(searchParams, key);
  if (value === undefined) return undefined;
  return value === "true";
}

function sortByParam(value?: string): AmazingFilterParams["SortBy"] {
  switch (value) {
    case "bestDiscount":
    case "priceAsc":
    case "priceDesc":
    case "newest":
    case "bestSelling":
      return value;
    case "discountDesc":
    case "default":
    case "Default":
      return "bestDiscount";
    default:
      return "bestDiscount";
  }
}

function defaultVariantByParam(
  value?: string,
): AmazingFilterParams["DefaultVariantBy"] {
  return value === "basePrice" ? "basePrice" : "finalPrice";
}

export function searchParamsToRecord(
  searchParams: URLSearchParams,
): AmazingPageSearchParams {
  const record: AmazingPageSearchParams = {};

  searchParams.forEach((value, key) => {
    const existing = record[key];
    if (existing === undefined) {
      record[key] = value;
      return;
    }
    if (Array.isArray(existing)) {
      existing.push(value);
      return;
    }
    record[key] = [existing, value];
  });

  return record;
}

export function toAmazingFilterParams(
  searchParams: AmazingPageSearchParams,
  options?: {
    colorOptionIds?: string[];
    brandIds?: string[];
  },
): AmazingFilterParams {
  const sortBy =
    firstParam(searchParams, "SortBy") ?? firstParam(searchParams, "sort");
  const defaultVariantBy = firstParam(searchParams, "DefaultVariantBy");
  const resolvedColorOptionIds = [
    ...(options?.colorOptionIds ?? []),
    ...listParam(searchParams, "ColorOptionIds"),
    ...listParam(searchParams, "attr_color"),
  ];
  const resolvedBrandIds = [
    ...(options?.brandIds ?? []),
    ...listParam(searchParams, "BrandIds"),
    ...listParam(searchParams, "brandId"),
  ];

  return {
    Page:
      numberParam(searchParams, "Page") ??
      numberParam(searchParams, "page") ??
      1,
    PageSize:
      numberParam(searchParams, "PageSize") ??
      numberParam(searchParams, "pageSize") ??
      24,
    BrandIds: [...new Set(resolvedBrandIds)],
    ColorOptionIds: [...new Set(resolvedColorOptionIds)],
    CategoryId: firstParam(searchParams, "CategoryId"),
    InStockOnly:
      booleanParam(searchParams, "InStockOnly") ??
      booleanParam(searchParams, "inStock"),
    MinPrice:
      numberParam(searchParams, "MinPrice") ??
      numberParam(searchParams, "minPrice"),
    MaxPrice:
      numberParam(searchParams, "MaxPrice") ??
      numberParam(searchParams, "maxPrice"),
    SortBy: sortByParam(sortBy),
    DefaultVariantBy: defaultVariantByParam(defaultVariantBy),
  };
}
