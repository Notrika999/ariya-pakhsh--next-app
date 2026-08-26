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

type SearchParamsLike = {
  forEach: (callback: (value: string, key: string) => void) => void;
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
  "mostViewed",
  "mostRated",
  "discountDesc",
];

const SORT_ORDER_ALIASES: Record<string, SortOrder> = {
  Newest: "newest",
  Oldest: "oldest",
  PriceAsc: "priceAsc",
  PriceDesc: "priceDesc",
  BestSelling: "bestSelling",
  MostViewed: "mostViewed",
  MostRated: "mostRated",
  DiscountDesc: "discountDesc",
  priceAsc: "priceAsc",
  priceDesc: "priceDesc",
  bestSelling: "bestSelling",
  mostViewed: "mostViewed",
  mostRated: "mostRated",
  discountDesc: "discountDesc",
};

// ─── Parse Helpers ────────────────────────────────────────────────────────────

export function firstValue(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function normalizeProductSearchParams(
  searchParams: ProductPageSearchParams | URLSearchParams | SearchParamsLike,
): string {
  const entries: Array<[string, string]> = [];

  if ("forEach" in searchParams && typeof searchParams.forEach === "function") {
    searchParams.forEach((value, key) => {
      entries.push([key, value]);
    });
  } else {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => entries.push([key, item]));
        return;
      }

      if (value !== undefined) {
        entries.push([key, value]);
      }
    });
  }

  entries.sort(([leftKey, leftValue], [rightKey, rightValue]) => {
    if (leftKey === rightKey) return leftValue.localeCompare(rightValue);
    return leftKey.localeCompare(rightKey);
  });

  const normalized = new URLSearchParams();
  entries.forEach(([key, value]) => {
    normalized.append(key, value);
  });

  return normalized.toString();
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
        nameInEnglish?: string | null;
        englishName?: string | null;
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
    nameInEnglish?: string | null;
    englishName?: string | null;
  },
  param: string | string[],
): boolean {
  const params = Array.isArray(param) ? param : [param];
  if (!params.length) return false;

  const normalize = (value: string) => value.trim().toLowerCase();
  const slug = normalize(String(brand.slug ?? ""));
  const name = normalize(String(brand.name ?? ""));
  const nameInEnglish = normalize(String(brand.nameInEnglish ?? ""));
  const englishName = normalize(String(brand.englishName ?? ""));
  const id = normalize(String(brand.brandId ?? ""));

  return params.some((raw) => {
    const p = normalize(raw);
    return (
      p === slug ||
      p === name ||
      p === nameInEnglish ||
      p === englishName ||
      p === id
    );
  });
}

/** Map URL brand value to canonical slug for SEO query. */
export function normalizeBrandParamToSlug(
  param: string,
  brands: Array<{
    brandId: string | number;
    slug?: string | null;
    name?: string | null;
    nameInEnglish?: string | null;
    englishName?: string | null;
  }>,
): string {
  const trimmed = param.trim();
  if (!trimmed) return trimmed;

  const found = brands.find((brand) => brandMatchesParam(brand, trimmed));
  return found ? String(found.slug ?? found.brandId).trim() : trimmed;
}

export function parseNumber(value?: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseSortOrder(value?: string): SortOrder | undefined {
  if (value === "default") return undefined;
  if (value && SORT_ORDER_ALIASES[value]) {
    return SORT_ORDER_ALIASES[value];
  }
  return SORT_ORDERS.includes(value as SortOrder)
    ? (value as SortOrder)
    : undefined;
}

export function parseAttributeFilters(
  searchParams: Record<string, string | string[] | undefined>,
): Array<{
  attributeId: string;
  optionIds?: string[];
  value?: string;
  values?: string[];
  boolValue?: boolean;
}> {
  const filtersByAttribute = new Map<
    string,
    {
      attributeId: string;
      optionIds?: string[];
      value?: string;
      values?: string[];
      boolValue?: boolean;
    }
  >();

  const getFilter = (attributeId: string) => {
    const normalizedAttributeId = attributeId.trim();
    const existing = filtersByAttribute.get(normalizedAttributeId);
    if (existing) return existing;

    const next: {
      attributeId: string;
      optionIds?: string[];
      value?: string;
      values?: string[];
      boolValue?: boolean;
    } = { attributeId: normalizedAttributeId };
    filtersByAttribute.set(normalizedAttributeId, next);
    return next;
  };

  for (const [key, value] of Object.entries(searchParams)) {
    if (key.startsWith("attr_values_")) {
      const attributeId = key.replace("attr_values_", "");
      const values = (Array.isArray(value) ? value : value ? [value] : [])
        .map((item) => item.trim())
        .filter(Boolean);

      if (attributeId && values.length > 0) {
        getFilter(attributeId).values = [...new Set(values)];
      }
      continue;
    }

    if (key.startsWith("attr_value_")) {
      const attributeId = key.replace("attr_value_", "");
      const textValue = (Array.isArray(value) ? value[0] : value)?.trim();
      if (attributeId && textValue) {
        getFilter(attributeId).value = textValue;
      }
      continue;
    }

    if (key.startsWith("attr_bool_")) {
      const attributeId = key.replace("attr_bool_", "");
      const rawValue = (Array.isArray(value) ? value[0] : value)
        ?.trim()
        .toLowerCase();
      if (attributeId && (rawValue === "true" || rawValue === "false")) {
        getFilter(attributeId).boolValue = rawValue === "true";
      }
      continue;
    }

    if (!key.startsWith("attr_")) continue;
    const attributeId = key.replace("attr_", "");
    if (!attributeId || attributeId === "color") continue;

    const optionIds = (Array.isArray(value) ? value : value ? [value] : [])
      .map((item) => item.trim())
      .filter(Boolean);

    if (optionIds.length > 0) {
      getFilter(attributeId).optionIds = [...new Set(optionIds)];
    }
  }

  return Array.from(filtersByAttribute.values()).filter(
    (filter) =>
      Boolean(filter.attributeId) &&
      ((filter.optionIds?.length ?? 0) > 0 ||
        Boolean(filter.value) ||
        (filter.values?.length ?? 0) > 0 ||
        typeof filter.boolValue === "boolean"),
  );
}

/** Query key for SEO-friendly color filter values (`displayText`). */
export const COLOR_PALETTES_PARAM = "color_palettes";
export const LEGACY_COLOR_PALETTE_PARAM = "color_palette";
export const COLOR_PALETTE_PARAM = COLOR_PALETTES_PARAM;
export const COLOR_OPTION_ID_PARAM = "colorOptionId";

function expandSearchParamValue(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      return [trimmed];
    }
  }

  return [trimmed];
}

export function listSearchParamValues(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  key: string,
): string[] {
  if (searchParams instanceof URLSearchParams) {
    return searchParams
      .getAll(key)
      .flatMap(expandSearchParamValue)
      .filter(Boolean);
  }

  const raw = searchParams[key];
  if (!raw) return [];
  return (Array.isArray(raw) ? raw : [raw])
    .flatMap(expandSearchParamValue)
    .filter(Boolean);
}

export function colorOptionIdParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
): string[] {
  return [
    ...listSearchParamValues(searchParams, COLOR_OPTION_ID_PARAM),
    ...listSearchParamValues(searchParams, "colorOptionIds"),
    ...listSearchParamValues(searchParams, "ColorOptionIds"),
  ].filter((value, index, array) => value && array.indexOf(value) === index);
}

export function colorPaletteParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
): string[] {
  return [
    ...listSearchParamValues(searchParams, COLOR_PALETTES_PARAM),
    ...listSearchParamValues(searchParams, LEGACY_COLOR_PALETTE_PARAM),
  ].filter((value, index, array) => value && array.indexOf(value) === index);
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
          optionId?: string | null;
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
      .map((option) => String(option.optionId ?? "").trim())
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
  const filters = resolveColorPaletteAttributeFilters(
    paletteLabels,
    attributes,
  );
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
  const withoutColor = base.filter(
    (item) => !colorAttrIds.has(item.attributeId),
  );

  return [...withoutColor, ...resolved];
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

export function createFallbackBreadcrumb(slug: string): BreadcrumbItem[] {
  const title = decodeURIComponent(slug);
  return [
    {
      id: "home",
      name: "کارآپ 24",
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

/** SEO-friendly vehicle query key (`vehicle=name`). */
export const VEHICLE_PARAM = "vehicle";
export const LEGACY_VEHICLE_ID_PARAM = "vehicleId";

const VEHICLE_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type VehicleUrlNode = {
  id: string;
  parentId?: string | null;
  name: string;
  englishName?: string;
  children?: VehicleUrlNode[] | string[];
};

export function isVehicleIdToken(value: string): boolean {
  return VEHICLE_ID_PATTERN.test(value.trim());
}

export function slugifyVehicleName(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeVehicleKey(value: string): string {
  let decoded = value.trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // already decoded
  }

  return slugifyVehicleName(decoded).toLowerCase();
}

export function flattenVehicleNodes(
  nodes: VehicleUrlNode[] | undefined,
  parent?: VehicleUrlNode,
  acc: VehicleUrlNode[] = [],
): VehicleUrlNode[] {
  if (!nodes?.length) return acc;

  for (const node of nodes) {
    if (!node?.id) continue;

    const current: VehicleUrlNode = {
      ...node,
      parentId: node.parentId ?? parent?.id ?? null,
    };
    acc.push(current);

    const children = Array.isArray(node.children)
      ? node.children.filter(
          (child): child is VehicleUrlNode =>
            typeof child === "object" && child !== null && "id" in child,
        )
      : [];

    flattenVehicleNodes(children, current, acc);
  }

  return acc;
}

function buildVehicleLookup(
  vehicles?: VehicleUrlNode[],
  extraVehicles: VehicleUrlNode[] = [],
) {
  const lookup = new Map<string, VehicleUrlNode>();
  flattenVehicleNodes(vehicles).forEach((vehicle) => {
    lookup.set(vehicle.id, vehicle);
  });
  extraVehicles.forEach((vehicle) => {
    lookup.set(vehicle.id, vehicle);
  });
  return lookup;
}

export function getVehicleUrlValue(
  vehicle: VehicleUrlNode,
  lookup: Map<string, VehicleUrlNode>,
): string {
  const ownName = (vehicle.name || vehicle.englishName || "").trim();
  const ownKey = normalizeVehicleKey(ownName);
  const sameNameCount = [...lookup.values()].filter(
    (item) =>
      normalizeVehicleKey(item.name || item.englishName || "") === ownKey,
  ).length;

  if (ownName && sameNameCount <= 1) {
    return slugifyVehicleName(ownName);
  }

  const names: string[] = [];
  const visited = new Set<string>();
  let current: VehicleUrlNode | undefined = vehicle;

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    const label = (current.name || current.englishName || "").trim();
    if (label) names.unshift(label);
    const parentId: string | undefined = current.parentId?.trim();
    current = parentId ? lookup.get(parentId) : undefined;
  }

  return slugifyVehicleName(names.join("-") || ownName || vehicle.id);
}

export function listVehicleParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
): string[] {
  return [
    ...listSearchParamValues(searchParams, VEHICLE_PARAM),
    ...listSearchParamValues(searchParams, LEGACY_VEHICLE_ID_PARAM),
    ...listSearchParamValues(searchParams, "vehicleIds"),
    ...listSearchParamValues(searchParams, "VehicleIds"),
  ].filter((value, index, array) => value && array.indexOf(value) === index);
}

export function resolveVehicleParamsToIds(
  params: string[],
  vehicles?: VehicleUrlNode[],
  extraVehicles: VehicleUrlNode[] = [],
): string[] {
  if (!params.length) return [];

  const lookup = buildVehicleLookup(vehicles, extraVehicles);
  const ids = new Set<string>();

  for (const param of params) {
    const trimmed = param.trim();
    if (!trimmed) continue;

    if (isVehicleIdToken(trimmed)) {
      ids.add(trimmed);
      continue;
    }

    const key = normalizeVehicleKey(trimmed);
    if (!key) continue;

    for (const vehicle of lookup.values()) {
      const tokenKey = normalizeVehicleKey(getVehicleUrlValue(vehicle, lookup));
      const nameKey = normalizeVehicleKey(vehicle.name || "");
      const englishKey = normalizeVehicleKey(vehicle.englishName || "");

      if (key === tokenKey || key === nameKey || key === englishKey) {
        ids.add(vehicle.id);
      }
    }
  }

  return [...ids];
}

export function writeVehicleParams(
  params: URLSearchParams,
  selectedIds: string[],
  vehicles?: VehicleUrlNode[],
  extraVehicles: VehicleUrlNode[] = [],
) {
  const lookup = buildVehicleLookup(vehicles, extraVehicles);

  params.delete(VEHICLE_PARAM);
  params.delete(LEGACY_VEHICLE_ID_PARAM);
  params.delete("vehicleIds");
  params.delete("VehicleIds");

  selectedIds.filter(Boolean).forEach((id) => {
    const vehicle = lookup.get(id);
    params.append(
      VEHICLE_PARAM,
      vehicle ? getVehicleUrlValue(vehicle, lookup) : id,
    );
  });
}

export const ALL_PRODUCTS_BREADCRUMB: BreadcrumbItem[] = [
  {
    id: "home",
    name: "کارآپ 24",
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
