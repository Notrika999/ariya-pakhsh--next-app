import "server-only";

import { buildBackendUrl } from "@/src/lib/http/server-http";
import {
  colorOptionIdParams,
  colorPaletteParams,
  isVehicleIdToken,
  listVehicleParams,
  listSearchParamValues,
  parseAttributeFilters,
  resolveVehicleParamsToIds,
} from "@/src/lib/helper/productListHelpers";
import { getMegaMenu } from "@/src/services/category/category.server";
import { lookupVehiclesByNames } from "@/src/services/product/product.server";
import type {
  ProductCardModel,
  ProductListAppliedFilters,
  ProductFilterOptions,
  ProductListResponse,
} from "@/src/lib/types/productTypes";
import type { Category as MenuCategory } from "@/src/lib/types/categories/menuType";
import { getProductImage } from "@/src/utils/product-image";

export type SearchPageParams = Record<string, string | string[] | undefined>;

type SearchFacet = {
  id?: string;
  value?: string;
  name?: string;
  brandId?: string;
  categoryId?: string;
  vehicleId?: string;
  optionId?: string;
  colorOptionId?: string;
  attributeOptionId?: string;
  key?: string;
  label?: string;
  count?: number;
  colorCode?: string | null;
  colorCodes?: string;
  hex?: string;
};

type SearchAttributeFacet = {
  attributeKey?: string;
  attributeId?: string;
  attributeName?: string;
  attributeType?: number;
  options?: SearchFacet[];
};

type SearchProduct = {
  productId?: string;
  title?: string;
  slug?: string;
  publicCode?: string;
  brandId?: string;
  brand?: string;
  categoryId?: string;
  category?: string;
  price?: number;
  discountPrice?: number | null;
  inStock?: boolean;
  stock?: number;
  rating?: number;
  salesCount?: number;
  viewCount?: number;
  thumbnailUrl?: string;
};

type SearchProductsData = {
  products?: SearchProduct[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
  suggestions?: Array<string | SearchFacet>;
  appliedFilters?: ProductListAppliedFilters;
  facets?: {
    brands?: SearchFacet[];
    categories?: SearchFacet[];
    vehicles?: SearchFacet[];
    colors?: SearchFacet[];
    attributes?: SearchAttributeFacet[];
    minPrice?: number;
    maxPrice?: number;
  };
};

type SearchProductsApiResponse = {
  success?: boolean;
  isSuccess?: boolean;
  message?: string;
  data?: SearchProductsData;
} & Partial<SearchProductsData>;

export type SearchProductsResult = ProductListResponse & {
  products: ProductCardModel[];
  suggestions: string[];
  appliedFilters: ProductListAppliedFilters;
};

const DEFAULT_PAGE_SIZE = 24;
const COMPACT_UUID_PATTERN = /^[0-9a-f]{32}$/i;

const EMPTY_FILTER_OPTIONS: ProductFilterOptions = {
  brands: [],
  categories: [],
  attributes: [],
  colors: [],
  vehicles: [],
  minPrice: 0,
  maxPrice: 0,
};

const SORT_QUERY_TO_API: Record<string, string> = {
  default: "relevance",
  relevance: "relevance",
  bestDiscount: "relevance",
  newest: "newest",
  priceAsc: "priceAsc",
  priceDesc: "priceDesc",
  bestSelling: "bestSelling",
  mostViewed: "mostViewed",
  mostRated: "mostRated",
  discountDesc: "relevance",
  Default: "relevance",
  Relevance: "relevance",
  BestDiscount: "relevance",
  Newest: "newest",
  PriceAsc: "priceAsc",
  PriceDesc: "priceDesc",
  BestSelling: "bestSelling",
  MostViewed: "mostViewed",
  MostRated: "mostRated",
  DiscountDesc: "relevance",
};

function firstValue(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function firstNonEmptyString(
  ...values: Array<string | number | null | undefined>
): string | undefined {
  for (const value of values) {
    const normalized = String(value ?? "").trim();
    if (normalized) return normalized;
  }

  return undefined;
}

function parseNumber(value?: string | string[]): number | undefined {
  const raw = firstValue(value);
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseBoolean(value?: string | string[]): boolean | undefined {
  const raw = firstValue(value)?.trim().toLowerCase();
  if (raw === "true") return true;
  if (raw === "false") return false;
  return undefined;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value.trim(),
  );
}

function isApiId(value: string): boolean {
  const normalized = value.trim();
  return isUuid(normalized) || COMPACT_UUID_PATTERN.test(normalized);
}

function firstDefined<T>(...values: Array<T | undefined>): T | undefined {
  return values.find((value) => value !== undefined);
}

function getSearchProductsData(
  payload: SearchProductsApiResponse,
): SearchProductsData {
  if (payload.data && typeof payload.data === "object") return payload.data;

  return {
    products: payload.products,
    totalCount: payload.totalCount,
    page: payload.page,
    pageSize: payload.pageSize,
    suggestions: payload.suggestions,
    appliedFilters: payload.appliedFilters,
    facets: payload.facets,
  };
}

async function readSearchProductsPayload(
  response: Response,
): Promise<SearchProductsApiResponse> {
  const text = await response.text();
  if (!text.trim()) {
    return {
      success: response.ok,
      message: response.ok
        ? ""
        : `Search products request failed (${response.status})`,
    };
  }

  try {
    return JSON.parse(text) as SearchProductsApiResponse;
  } catch {
    return {
      success: false,
      message: text.slice(0, 300) || "Invalid search products response",
    };
  }
}

function getAppliedFilters(
  appliedFilters: ProductListAppliedFilters | undefined,
): ProductListAppliedFilters {
  return {
    categoryId: appliedFilters?.categoryId ?? null,
    brandIds: appliedFilters?.brandIds ?? [],
    vehicleIds: appliedFilters?.vehicleIds ?? [],
    colorOptionIds: appliedFilters?.colorOptionIds ?? [],
    minPrice: appliedFilters?.minPrice ?? null,
    maxPrice: appliedFilters?.maxPrice ?? null,
    inStock: appliedFilters?.inStock ?? null,
    onSaleOnly: appliedFilters?.onSaleOnly ?? null,
    attributeFilters: appliedFilters?.attributeFilters ?? [],
  };
}

function getFacetKey(facet: SearchFacet): string {
  return String(
    facet.key ?? facet.id ?? facet.value ?? facet.label ?? "",
  ).trim();
}

function getFacetLabel(facet: SearchFacet): string {
  return String(
    facet.label ?? facet.name ?? facet.key ?? facet.value ?? "",
  ).trim();
}

function getBrandFacetId(facet: SearchFacet): string | undefined {
  return firstNonEmptyString(facet.brandId, facet.id, facet.value);
}

function getCategoryFacetId(facet: SearchFacet): string | undefined {
  return firstNonEmptyString(facet.categoryId, facet.id, facet.value);
}

function getVehicleFacetId(facet: SearchFacet): string | undefined {
  return firstNonEmptyString(facet.vehicleId, facet.id, facet.value);
}

function getColorFacetOptionId(facet: SearchFacet): string | undefined {
  return firstNonEmptyString(
    facet.colorOptionId,
    facet.optionId,
    facet.attributeOptionId,
    facet.id,
    facet.value,
  );
}

function getAttributeFacetId(attribute: SearchAttributeFacet): string {
  return firstNonEmptyString(attribute.attributeId, attribute.attributeKey) ?? "";
}

const PERSIAN_COLOR_HEX: Record<string, string> = {
  "\u0622\u0628\u06cc": "#2563eb",
  "\u0627\u0628\u06cc": "#2563eb",
  "\u0642\u0631\u0645\u0632": "#dc2626",
  "\u0632\u0631\u0634\u06a9\u06cc": "#881337",
  "\u0633\u0628\u0632": "#16a34a",
  "\u0632\u0631\u062f": "#facc15",
  "\u0646\u0627\u0631\u0646\u062c\u06cc": "#f97316",
  "\u0633\u0641\u06cc\u062f": "#ffffff",
  "\u0645\u0634\u06a9\u06cc": "#111827",
  "\u0633\u06cc\u0627\u0647": "#111827",
  "\u0637\u0648\u0633\u06cc": "#9ca3af",
  "\u062e\u0627\u06a9\u0633\u062a\u0631\u06cc": "#9ca3af",
  "\u0646\u0642\u0631\u0647\u200c\u0627\u06cc": "#d1d5db",
  "\u0646\u0642\u0631\u0647 \u0627\u06cc": "#d1d5db",
  "\u06a9\u0631\u0645": "#f5e6c8",
  "\u0633\u062f\u0631\u06cc": "#8a8f5a",
  "\u0645\u0627\u0631\u0648\u0646": "#7f1d1d",
  "\u062f\u0648\u062f\u06cc": "#4b5563",
  "\u0637\u0644\u0627\u06cc\u06cc": "#d4af37",
  "\u0642\u0647\u0648\u0647\u200c\u0627\u06cc": "#7c2d12",
  "\u0642\u0647\u0648\u0647 \u0627\u06cc": "#7c2d12",
  "\u0628\u0646\u0641\u0634": "#7c3aed",
  "\u0635\u0648\u0631\u062a\u06cc": "#ec4899",
};

function getColorHex(label: string): string | undefined {
  const normalizedLabel = label.trim();
  const exact = PERSIAN_COLOR_HEX[normalizedLabel];
  if (exact) return exact;

  const matchedName = Object.keys(PERSIAN_COLOR_HEX).find((name) =>
    normalizedLabel.includes(name),
  );

  return matchedName ? PERSIAN_COLOR_HEX[matchedName] : undefined;
}

function getColorCodes(label: string): string | undefined {
  const normalizedLabel = label.trim();
  const exact = getColorHex(normalizedLabel);
  if (exact && PERSIAN_COLOR_HEX[normalizedLabel]) return exact;

  const codes = Object.entries(PERSIAN_COLOR_HEX)
    .filter(([name]) => normalizedLabel.includes(name))
    .map(([, hex]) => hex)
    .filter((hex, index, array) => array.indexOf(hex) === index)
    .slice(0, 4);

  return codes.length > 0 ? codes.join(",") : exact;
}

function normalizeLookupText(value: string): string {
  return value.trim().toLowerCase().replace(/ي/g, "ی").replace(/ك/g, "ک");
}

function buildFacetIdLookup(products: SearchProduct[] | undefined) {
  const brandIdsByLabel = new Map<string, string>();
  const categoryIdsByLabel = new Map<string, string>();

  for (const product of products ?? []) {
    const brand = String(product.brand ?? "").trim();
    const brandId = String(product.brandId ?? "").trim();
    if (brand && brandId && !brandIdsByLabel.has(brand)) {
      brandIdsByLabel.set(brand, brandId);
    }

    const category = String(product.category ?? "").trim();
    const categoryId = String(product.categoryId ?? "").trim();
    if (category && categoryId && !categoryIdsByLabel.has(category)) {
      categoryIdsByLabel.set(category, categoryId);
    }
  }

  return { brandIdsByLabel, categoryIdsByLabel };
}

function mapSearchCategoryFacetOptions(
  facets: SearchProductsData["facets"] | undefined,
  products?: SearchProduct[],
): ProductFilterOptions["categories"] {
  if (!facets) return [];

  const { categoryIdsByLabel } = buildFacetIdLookup(products);

  return (facets.categories ?? [])
    .map((facet) => {
      const key = getFacetKey(facet);
      if (!key) return null;
      const label = getFacetLabel(facet);
      const facetId = getCategoryFacetId(facet);
      const categoryId =
        facetId && isUuid(facetId)
          ? facetId
          : isUuid(key)
            ? key
            : (categoryIdsByLabel.get(label) ?? "");

      return {
        categoryId,
        name: label,
        slug: label || key,
        count: Number(facet.count ?? 0),
      };
    })
    .filter((item): item is ProductFilterOptions["categories"][number] =>
      Boolean(item),
    );
}

function getCategoryNodeId(category: MenuCategory): string {
  return String(category.id ?? category.categoryId ?? "").trim();
}

function categoryMatchesFacet(
  category: MenuCategory,
  facetCounts: Map<string, number>,
): number | null {
  const candidates = [
    getCategoryNodeId(category),
    category.categoryId,
    category.name,
    category.slug,
  ]
    .map((value) => normalizeLookupText(String(value ?? "")))
    .filter(Boolean);

  for (const candidate of candidates) {
    const count = facetCounts.get(candidate);
    if (typeof count === "number") return count;
  }

  return null;
}

function filterCategoryTreeByFacets(
  categories: MenuCategory[],
  facetCounts: Map<string, number>,
): ProductFilterOptions["categories"] {
  const result: ProductFilterOptions["categories"] = [];

  for (const category of categories) {
    const children = filterCategoryTreeByFacets(
      category.children ?? [],
      facetCounts,
    );
    const ownCount = categoryMatchesFacet(category, facetCounts);

    if (ownCount === null && children.length === 0) continue;

    const categoryId = getCategoryNodeId(category);
    if (!categoryId) continue;

    result.push({
      categoryId,
      parentId: category.parentId ?? null,
      parentCategoryId: category.parentId ?? null,
      name: category.name,
      slug: category.slug,
      count:
        ownCount ??
        children.reduce((total, child) => total + Number(child.count ?? 0), 0),
      children,
    });
  }

  return result;
}

async function resolveSearchCategoryOptions(
  facets: SearchProductsData["facets"] | undefined,
  products?: SearchProduct[],
): Promise<ProductFilterOptions["categories"]> {
  const fallback = mapSearchCategoryFacetOptions(facets, products);
  const facetCounts = new Map<string, number>();

  for (const facet of facets?.categories ?? []) {
    const count = Number(facet.count ?? 0);
    [
      getFacetKey(facet),
      getFacetLabel(facet),
      getCategoryFacetId(facet),
    ].forEach((value) => {
      const key = normalizeLookupText(String(value ?? ""));
      if (key) facetCounts.set(key, count);
    });
  }

  if (facetCounts.size === 0) return fallback;

  try {
    const categoryTree = await getMegaMenu();
    const resolved = filterCategoryTreeByFacets(categoryTree, facetCounts);
    return resolved.length > 0 ? resolved : fallback;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[search] category tree request failed: ${message}`);
    return fallback;
  }
}

function mapFacetsToFilterOptions(
  facets: SearchProductsData["facets"] | undefined,
  products?: SearchProduct[],
  categories: ProductFilterOptions["categories"] = [],
): ProductFilterOptions {
  if (!facets) return EMPTY_FILTER_OPTIONS;

  const { brandIdsByLabel } = buildFacetIdLookup(products);

  const brands = (facets.brands ?? [])
    .map((facet) => {
      const key = getFacetKey(facet);
      if (!key) return null;
      const label = getFacetLabel(facet);
      const facetId = getBrandFacetId(facet);
      const brandId =
        facetId && isUuid(facetId)
          ? facetId
          : isUuid(key)
            ? key
            : (brandIdsByLabel.get(label) ?? "");

      return {
        brandId,
        name: label,
        slug: label || key,
        count: Number(facet.count ?? 0),
      };
    })
    .filter((item): item is ProductFilterOptions["brands"][number] =>
      Boolean(item),
    );

  const vehicles: NonNullable<ProductFilterOptions["vehicles"]> = (
    facets.vehicles ?? []
  )
    .map((facet) => {
      const key = getFacetKey(facet);
      if (!key) return null;
      const label = getFacetLabel(facet);
      const facetId = getVehicleFacetId(facet);

      return {
        id: facetId && isUuid(facetId) ? facetId : key,
        name: label,
        isLeaf: true,
        hasChildren: false,
        children: [],
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const colors = (facets.colors ?? [])
    .map((facet) => {
      const key = getFacetKey(facet);
      if (!key) return null;
      const label = getFacetLabel(facet);
      const optionId = getColorFacetOptionId(facet);

      return {
        optionId: optionId && isUuid(optionId) ? optionId : key,
        attributeId: "color",
        attributeName: "رنگ",
        value: label,
        displayText: label,
        count: Number(facet.count ?? 0),
        colorCodes: facet.colorCodes ?? facet.colorCode ?? getColorCodes(label),
        hex: facet.hex ?? facet.colorCode ?? getColorHex(label),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const attributes: ProductFilterOptions["attributes"] = (
    facets.attributes ?? []
  )
    .filter((attribute) => {
      const key = getAttributeFacetId(attribute)
        .trim()
        .toLowerCase();
      const name = String(attribute.attributeName ?? "")
        .trim()
        .toLowerCase();
      const type = Number(attribute.attributeType);

      return (
        type !== 7 &&
        key !== "color" &&
        name !== "رنگ" &&
        name !== "color"
      );
    })
    .map((attribute) => {
      const attributeId = getAttributeFacetId(attribute).trim();
      if (!attributeId) return null;

      return {
        attributeId,
        attributeName: String(attribute.attributeName ?? attributeId),
        attributeType: attribute.attributeType,
        options: (attribute.options ?? [])
          .map((option) => {
            const optionId = getFacetKey(option);
            if (!optionId) return null;
            const label = getFacetLabel(option);
            const facetOptionId = getColorFacetOptionId(option);

            return {
              optionId:
                facetOptionId && isUuid(facetOptionId)
                  ? facetOptionId
                  : optionId,
              value: label,
              displayText: label,
              count: Number(option.count ?? 0),
            };
          })
          .filter((item): item is NonNullable<typeof item> => Boolean(item)),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return {
    brands,
    categories,
    vehicles,
    colors,
    attributes,
    minPrice: Number(facets.minPrice ?? 0),
    maxPrice: Number(facets.maxPrice ?? 0),
  };
}

function mapSearchProduct(product: SearchProduct): ProductCardModel {
  const productId = String(
    product.productId ?? product.slug ?? product.title ?? "",
  );
  const price = Number(product.discountPrice ?? product.price ?? 0);
  const oldPrice = Number(product.price ?? price);
  const slug = String(product.slug ?? productId);

  return {
    id: productId,
    title: String(product.title ?? "محصول"),
    slug,
    publicCode: product.publicCode,
    image: getProductImage(product.thumbnailUrl),
    imageSlider: [],
    brandId: product.brandId,
    primaryBrandName: product.brand,
    categoryName: String(product.category ?? ""),
    currency: "IRR",
    price,
    oldPrice,
    originalPrice: oldPrice,
    discountedPrice: price,
    rating: Number(product.rating ?? 0),
    reviewCount: 0,
    count: 0,
    colors: [],
    quantity: Number(product.stock ?? 0),
    soldCount: Number(product.salesCount ?? 0),
    inStock: Boolean(product.inStock),
    isOnSale: oldPrice > price && price > 0,
    offer: oldPrice > price && price > 0,
    href: product.publicCode
      ? `/product/${product.publicCode}/${slug}`
      : `/product/${slug}`,
  };
}

function getSearchProductKey(product: SearchProduct): string {
  return String(
    product.productId ?? product.slug ?? product.title ?? "",
  ).trim();
}

function uniqueSearchProducts(products: SearchProduct[]): SearchProduct[] {
  const seen = new Set<string>();

  return products.filter((product) => {
    const key = getSearchProductKey(product);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

type SearchProductsRequestBody = {
  categoryId: string | null;
  brandIds: string[];
  vehicleIds: string[];
  colorOptionIds: string[];
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean | null;
  onSaleOnly: boolean | null;
  attributeFilters: Array<{
    attributeId: string;
    optionIds?: string[];
    value?: string;
    values?: string[];
    boolValue?: boolean;
  }>;
};

function appendArray(params: URLSearchParams, key: string, values: string[]) {
  values.filter(Boolean).forEach((value) => params.append(key, value));
}

function normalizeAttributeFiltersForApi(
  filters: ReturnType<typeof parseAttributeFilters>,
): SearchProductsRequestBody["attributeFilters"] {
  return filters.flatMap((filter) => {
    const optionIds = [...new Set(filter.optionIds ?? [])].filter(isApiId);
    const optionValues = [...new Set(filter.optionIds ?? [])].filter(
      (value) => !isApiId(value),
    );
    const next: SearchProductsRequestBody["attributeFilters"] = [];

    if (optionIds.length > 0) {
      next.push({
        attributeId: filter.attributeId,
        optionIds,
      });
    }

    optionValues.forEach((value) => {
      next.push({
        attributeId: filter.attributeId,
        value,
      });
    });

    if (filter.value) {
      next.push({
        attributeId: filter.attributeId,
        value: filter.value,
      });
    }

    if (filter.values && filter.values.length > 0) {
      next.push({
        attributeId: filter.attributeId,
        values: [...new Set(filter.values)].filter(Boolean),
      });
    }

    if (typeof filter.boolValue === "boolean") {
      next.push({
        attributeId: filter.attributeId,
        boolValue: filter.boolValue,
      });
    }

    return next;
  });
}

function buildSearchApiParams(
  searchParams: SearchPageParams,
  filterOptions?: ProductFilterOptions,
  extraVehicles: NonNullable<ProductFilterOptions["vehicles"]> = [],
) {
  const params = new URLSearchParams();
  const query = firstValue(searchParams.Q) ?? firstValue(searchParams.q) ?? "";
  const page = parseNumber(searchParams.page ?? searchParams.Page) ?? 1;
  const pageSize =
    parseNumber(searchParams.pageSize ?? searchParams.PageSize) ??
    DEFAULT_PAGE_SIZE;
  const sortRaw = firstValue(searchParams.sort ?? searchParams.Sort);
  const sort = sortRaw ? (SORT_QUERY_TO_API[sortRaw] ?? sortRaw) : undefined;
  const brandIds = [
    ...listSearchParamValues(searchParams, "brand"),
    ...listSearchParamValues(searchParams, "brandId"),
    ...listSearchParamValues(searchParams, "brandIds"),
    ...listSearchParamValues(searchParams, "BrandIds"),
    ...resolveBrandLabelsToIds(
      [
        ...listSearchParamValues(searchParams, "brand"),
        ...listSearchParamValues(searchParams, "brandSlug"),
      ],
      filterOptions,
    ),
  ];
  const validBrandIds = [...new Set(brandIds)].filter(isApiId);
  const vehicleIds = resolveVehicleParamsToIds(
    listVehicleParams(searchParams),
    filterOptions?.vehicles,
    extraVehicles,
  );
  const validVehicleIds = [...new Set(vehicleIds)].filter(Boolean);
  const colorIds = [
    ...colorOptionIdParams(searchParams),
    ...resolveColorLabelsToIds(colorPaletteParams(searchParams), filterOptions),
  ];
  const uniqueColorValues = [...new Set(colorIds)];
  const colorOptionIds = uniqueColorValues.filter(isApiId);
  const attributeFilters = parseAttributeFilters(searchParams);

  params.set("q", query);
  params.set("Page", String(page));
  params.set("PageSize", String(pageSize));

  if (sort && sort !== "relevance") params.set("Sort", sort);
  const categoryId = firstDefined(
    firstValue(searchParams.categoryId),
    firstValue(searchParams.CategoryId),
  );
  const minPrice = firstDefined(
    parseNumber(searchParams.minPrice),
    parseNumber(searchParams.MinPrice),
  );
  const maxPrice = firstDefined(
    parseNumber(searchParams.maxPrice),
    parseNumber(searchParams.MaxPrice),
  );
  const inStock = firstDefined(
    parseBoolean(searchParams.inStock),
    parseBoolean(searchParams.InStock),
  );
  const onSaleOnly = firstDefined(
    parseBoolean(searchParams.onSaleOnly),
    parseBoolean(searchParams.OnSaleOnly),
  );

  const normalizedCategoryId = String(categoryId ?? "").trim();
  const body: SearchProductsRequestBody = {
    categoryId:
      normalizedCategoryId && isApiId(normalizedCategoryId)
        ? normalizedCategoryId
        : null,
    brandIds: validBrandIds,
    vehicleIds: validVehicleIds,
    colorOptionIds,
    minPrice: minPrice ?? null,
    maxPrice: maxPrice ?? null,
    inStock: inStock ?? null,
    onSaleOnly: onSaleOnly ?? null,
    attributeFilters: normalizeAttributeFiltersForApi(attributeFilters),
  };

  return { params, body };
}

function buildLegacySearchApiParams(
  params: URLSearchParams,
  body: SearchProductsRequestBody,
) {
  const legacyParams = new URLSearchParams(params);

  if (body.categoryId) legacyParams.set("CategoryId", body.categoryId);
  if (body.minPrice !== null) legacyParams.set("MinPrice", String(body.minPrice));
  if (body.maxPrice !== null) legacyParams.set("MaxPrice", String(body.maxPrice));
  if (body.inStock !== null) legacyParams.set("InStock", String(body.inStock));
  if (body.onSaleOnly !== null) {
    legacyParams.set("OnSaleOnly", String(body.onSaleOnly));
  }

  appendArray(legacyParams, "BrandIds", body.brandIds);
  appendArray(legacyParams, "VehicleIds", body.vehicleIds);
  appendArray(legacyParams, "ColorOptionIds", body.colorOptionIds);

  if (body.attributeFilters.length > 0) {
    legacyParams.set("AttributeFilters", JSON.stringify(body.attributeFilters));
  }

  return legacyParams;
}

function resolveBrandLabelsToIds(
  labels: string[],
  filterOptions?: ProductFilterOptions,
) {
  if (!labels.length || !filterOptions?.brands?.length) return [];

  const wanted = new Set(labels.map((label) => label.trim().toLowerCase()));
  return filterOptions.brands
    .filter((brand) => {
      const brandId = String(brand.brandId ?? "")
        .trim()
        .toLowerCase();
      const slug = String(brand.slug ?? "")
        .trim()
        .toLowerCase();
      const name = String(brand.name ?? "")
        .trim()
        .toLowerCase();

      return wanted.has(brandId) || wanted.has(slug) || wanted.has(name);
    })
    .map((brand) => String(brand.brandId ?? ""))
    .filter(Boolean);
}

function resolveColorLabelsToIds(
  labels: string[],
  filterOptions?: ProductFilterOptions,
) {
  if (!labels.length || !filterOptions?.colors?.length) return [];

  const wanted = new Set(labels.map((label) => label.trim().toLowerCase()));
  return filterOptions.colors
    .filter((color) =>
      wanted.has(
        String(color.displayText ?? color.value ?? "")
          .trim()
          .toLowerCase(),
      ),
    )
    .map((color) => color.optionId)
    .filter(isApiId)
    .filter(Boolean);
}

async function fetchSearchProducts(
  searchParams: SearchPageParams,
  filterOptions?: ProductFilterOptions,
): Promise<ProductListResponse> {
  const vehicleParams = listVehicleParams(searchParams);
  const unresolvedVehicleNames = vehicleParams.filter((param) => {
    if (isVehicleIdToken(param)) return false;
    return (
      resolveVehicleParamsToIds([param], filterOptions?.vehicles).length === 0
    );
  });
  const extraVehicles =
    unresolvedVehicleNames.length > 0
      ? await lookupVehiclesByNames(unresolvedVehicleNames)
      : [];
  const { params, body } = buildSearchApiParams(
    searchParams,
    filterOptions,
    extraVehicles,
  );
  const url = new URL(buildBackendUrl("/api/v1/Search/products"));
  params.forEach((value, key) => url.searchParams.append(key, value));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  let payload = await readSearchProductsPayload(response);
  let responseOk = response.ok;

  if (
    (!response.ok || !payload.data) &&
    [400, 404, 405, 415, 500].includes(response.status)
  ) {
    const fallbackUrl = new URL(buildBackendUrl("/api/v1/Search/products"));
    buildLegacySearchApiParams(params, body).forEach((value, key) => {
      fallbackUrl.searchParams.append(key, value);
    });

    const fallbackResponse = await fetch(fallbackUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const fallbackPayload = await readSearchProductsPayload(fallbackResponse);

    if (fallbackResponse.ok || !response.ok) {
      payload = fallbackPayload;
      responseOk = fallbackResponse.ok;
    }
  }

  const hasEnvelopeStatus =
    typeof payload.success === "boolean" ||
    typeof payload.isSuccess === "boolean";
  const isSuccess = payload.success ?? payload.isSuccess ?? responseOk;

  if (!responseOk || (hasEnvelopeStatus && !isSuccess)) {
    throw new Error(payload.message || "Search products request failed");
  }

  const data = getSearchProductsData(payload);
  const page = Number(data.page ?? parseNumber(searchParams.page) ?? 1);
  const pageSize = Number(data.pageSize ?? DEFAULT_PAGE_SIZE);
  const totalCount = Number(data.totalCount ?? 0);
  const suggestions = (data.suggestions ?? [])
    .map((suggestion) =>
      typeof suggestion === "string"
        ? suggestion
        : (suggestion.label ?? suggestion.name ?? suggestion.value ?? ""),
    )
    .map((suggestion) => String(suggestion).trim())
    .filter(Boolean);
  const categories = await resolveSearchCategoryOptions(
    data.facets,
    data.products,
  );

  return {
    items: [],
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / Math.max(pageSize, 1)),
    filterOptions: mapFacetsToFilterOptions(
      data.facets,
      data.products,
      categories,
    ),
    products: uniqueSearchProducts(data.products ?? []).map(mapSearchProduct),
    suggestions,
    appliedFilters: getAppliedFilters(data.appliedFilters ?? body),
  } satisfies SearchProductsResult;
}

export async function getSearchProductsFromSearchParams(
  searchParams: SearchPageParams,
): Promise<SearchProductsResult> {
  const brandLabelParams = [
    ...listSearchParamValues(searchParams, "brand"),
    ...listSearchParamValues(searchParams, "brandSlug"),
  ].filter((value) => !isUuid(value));
  const needsColorResolution =
    colorPaletteParams(searchParams).length > 0 &&
    colorOptionIdParams(searchParams).length === 0;
  const needsBrandResolution =
    brandLabelParams.length > 0 &&
    listSearchParamValues(searchParams, "BrandIds").length === 0 &&
    listSearchParamValues(searchParams, "brandIds").length === 0;

  if (!needsColorResolution && !needsBrandResolution) {
    return fetchSearchProducts(searchParams) as Promise<SearchProductsResult>;
  }

  const withoutUnresolvedFilters = { ...searchParams };
  delete withoutUnresolvedFilters.color_palettes;
  delete withoutUnresolvedFilters.color_palette;
  delete withoutUnresolvedFilters.brand;
  delete withoutUnresolvedFilters.brandSlug;

  const base = await fetchSearchProducts(withoutUnresolvedFilters);
  return fetchSearchProducts(
    searchParams,
    base.filterOptions,
  ) as Promise<SearchProductsResult>;
}
