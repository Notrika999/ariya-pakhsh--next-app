// src/services/product/product.server.ts
import "server-only";

import { proxyToBackend } from "@/src/lib/http/server-http";
import { mapProductIndex } from "@/src/lib/mappers/product.mapper";
import { ApiResponse } from "@/src/lib/types/common/api-response.types";
import { ProductDetail } from "@/src/lib/types/products/productDetail.types";
import {
  ProductIndexApiResponse,
  ProductFilterColorOption,
  ProductFilterOptions,
  ProductListParams,
  ProductListResponse,
  ProductResponse,
} from "@/src/lib/types/productTypes";
import {
  allBrandSlugParams,
  colorPaletteParams,
  colorOptionIdParams,
  listSearchParamValues,
  parseAttributeFilters,
  resolveBrandSlugsToIds,
  resolveColorPaletteAttributeFilters,
} from "@/src/lib/helper/productListHelpers";

export class ProductServiceError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ProductServiceError";
  }
}

export interface GetProductsParams {
  FeaturedCount?: number;
  NewestCount?: number;
  BestSellingCount?: number;
  OnSaleCount?: number;
  TopCategoriesCount?: number;
  TopBrandsCount?: number;
  CacheKey?: string;
  SlidingExpiration?: string;
  AbsoluteExpiration?: string;
}

const DEFAULT_PRODUCTS_PARAMS: GetProductsParams = {
  FeaturedCount: 8,
  NewestCount: 8,
  BestSellingCount: 8,
  OnSaleCount: 8,
  TopCategoriesCount: 6,
  TopBrandsCount: 6,
};

function removeEmptyValues<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => {
      if (
        fieldValue === undefined ||
        fieldValue === null ||
        fieldValue === ""
      ) {
        return false;
      }

      if (Array.isArray(fieldValue)) {
        return fieldValue.length > 0;
      }

      return true;
    }),
  );
}

function nonEmptyStringArray(
  values: Array<string | null | undefined> | undefined,
) {
  const normalized = (values ?? [])
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

  return normalized.length > 0 ? [...new Set(normalized)] : undefined;
}

const EMPTY_FILTER_OPTIONS: ProductFilterOptions = {
  brands: [],
  categories: [],
  attributes: [],
  colors: [],
  vehicles: [],
  minPrice: 0,
  maxPrice: 0,
};

export function createEmptyProductListResponse(page = 1): ProductListResponse {
  return {
    items: [],
    totalCount: 0,
    page,
    pageSize: 20,
    totalPages: 0,
    filterOptions: EMPTY_FILTER_OPTIONS,
  };
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

function warnOptionalProductRequest(endpoint: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(
    `[product.server] Optional ${endpoint} request failed: ${message}`,
  );
}

type RawFilterAttribute = {
  attributeId: string;
  attributeName: string;
  attributeType?: number;
  options?: RawFilterAttributeOption[];
};

type RawFilterAttributeOption = {
  optionId: string;
  value: string;
  displayText?: string;
  colorCodes?: string;
  hex?: string;
  count?: number;
};

type RawBrandFilterOption = {
  brandId: string;
  name: string;
  slug: string;
  count?: number;
};

type RawProductFilterOptions = Partial<
  Omit<ProductFilterOptions, "brands" | "attributes">
> & {
  brands?: RawBrandFilterOption[];
  attributes?: RawFilterAttribute[];
  filterOptions?: RawProductFilterOptions;
};

function unwrapFilterOptions(
  data: RawProductFilterOptions | null | undefined,
): RawProductFilterOptions | null | undefined {
  return data?.filterOptions ?? data;
}

function normalizeBrandOption(option: RawBrandFilterOption) {
  return {
    ...option,
    count: option.count ?? 0,
  };
}

function normalizeAttributeOption(
  option: RawFilterAttributeOption,
): ProductFilterOptions["attributes"][number]["options"][number] {
  return {
    ...option,
    count: option.count ?? 0,
  };
}

function mergeColorsIntoAttributes(
  attributes: RawFilterAttribute[],
  colors: ProductFilterColorOption[],
): ProductFilterOptions["attributes"] {
  const nextAttributes: ProductFilterOptions["attributes"] = attributes.map(
    (attribute) => ({
      ...attribute,
      options: (attribute.options ?? []).map(normalizeAttributeOption),
    }),
  );

  if (!colors.length) return nextAttributes;

  for (const color of colors) {
    const attributeId = color.attributeId;
    const attributeName = color.attributeName;
    const option: ProductFilterOptions["attributes"][number]["options"][number] =
      normalizeAttributeOption({
        optionId: color.optionId,
        value: color.value,
        displayText: color.displayText,
        colorCodes: color.colorCodes,
      });

    const existingAttribute = nextAttributes.find(
      (attribute) =>
        attribute.attributeId === attributeId ||
        attribute.attributeName === attributeName,
    );

    if (existingAttribute) {
      const hasOption = existingAttribute.options.some(
        (item) => item.optionId === option.optionId,
      );
      if (!hasOption) existingAttribute.options.push(option);
      continue;
    }

    nextAttributes.push({
      attributeId,
      attributeName,
      options: [option],
    });
  }

  return nextAttributes;
}

function normalizeFilterOptions(
  data: RawProductFilterOptions | null | undefined,
): ProductFilterOptions {
  const filterOptions = unwrapFilterOptions(data);
  const colors = filterOptions?.colors ?? [];
  const attributes = mergeColorsIntoAttributes(
    filterOptions?.attributes ?? [],
    colors,
  );

  return {
    categoryId: filterOptions?.categoryId,
    categoryName: filterOptions?.categoryName,
    categorySlug: filterOptions?.categorySlug,
    brands: (filterOptions?.brands ?? []).map(normalizeBrandOption),
    categories: filterOptions?.categories ?? [],
    attributes,
    colors,
    vehicles: filterOptions?.vehicles ?? [],
    minPrice: filterOptions?.minPrice ?? 0,
    maxPrice: filterOptions?.maxPrice ?? 0,
  };
}

function isColorAttribute(
  attribute: ProductFilterOptions["attributes"][number],
) {
  const attributeId = String(attribute.attributeId ?? "")
    .trim()
    .toLowerCase();
  const attributeName = String(attribute.attributeName ?? "")
    .trim()
    .toLowerCase();

  return (
    attributeId === "color" ||
    attributeName === "رنگ" ||
    attributeName === "color" ||
    attributeName.includes("رنگ") ||
    attributeName.includes("color")
  );
}

function countColorOptions(filterOptions: ProductFilterOptions) {
  const optionIds = new Set<string>();

  for (const color of filterOptions.colors ?? []) {
    if (color.optionId) optionIds.add(color.optionId);
  }

  for (const attribute of filterOptions.attributes.filter(isColorAttribute)) {
    for (const option of attribute.options ?? []) {
      if (option.optionId) optionIds.add(option.optionId);
    }
  }

  return optionIds.size;
}

function hasUsefulFilterOptions(filterOptions: ProductFilterOptions): boolean {
  return (
    filterOptions.brands.length > 0 ||
    filterOptions.categories.length > 0 ||
    filterOptions.attributes.length > 0 ||
    (filterOptions.colors?.length ?? 0) > 0 ||
    (filterOptions.vehicles?.length ?? 0) > 0 ||
    filterOptions.minPrice > 0 ||
    filterOptions.maxPrice > 0
  );
}

function mergeFullColorOptions(
  base: ProductFilterOptions,
  fullOptions: ProductFilterOptions | null,
): ProductFilterOptions {
  if (
    !fullOptions ||
    countColorOptions(fullOptions) <= countColorOptions(base)
  ) {
    return base;
  }

  return {
    ...base,
    colors: fullOptions.colors,
    attributes: [
      ...base.attributes.filter((attribute) => !isColorAttribute(attribute)),
      ...fullOptions.attributes.filter(isColorAttribute),
    ],
  };
}

export async function getProducts(
  params?: GetProductsParams,
): Promise<ProductResponse> {
  const requestParams = {
    ...DEFAULT_PRODUCTS_PARAMS,
    ...params,
  };

  const response = await proxyToBackend<ProductIndexApiResponse>({
    method: "GET",
    path: "/api/v1/Products/index",
    params: requestParams,
    cache: "no-store",
  });


  if (!response.ok || !response.data.isSuccess) {
    throw new Error("Failed to fetch products");
  }

  const mapped = mapProductIndex(response.data.data);
  return {
    ...mapped,
    topCategories: response.data.data.topCategories ?? [],
    brands: response.data.data.topBrands.map((b) => ({
      id: b.brandId,
      name: b.name,
      slug: b.slug,
      productCount: b.productCount,
    })),
  };
}

export async function getProductList(
  params: ProductListParams,
): Promise<ProductListResponse> {
  const brandIds = nonEmptyStringArray([
    ...(params.BrandIds ?? []),
    params.BrandId,
  ]);
  const colorOptionIds = nonEmptyStringArray(params.ColorOptionIds);
  const shouldSendVehicleIds = Array.isArray(params.VehicleIds);
  const vehicleIds = nonEmptyStringArray(params.VehicleIds);
  const attributeFilters = params.AttributeFilters?.map((filter) =>
    removeEmptyValues({
      attributeId: filter.attributeId,
      optionIds: nonEmptyStringArray(filter.optionIds),
      value: filter.value,
      boolValue: filter.boolValue,
    }),
  ).filter((filter) => {
    return (
      typeof filter.attributeId === "string" && filter.attributeId.length > 0
    );
  });

  const body = removeEmptyValues({
    categoryId: params.CategoryId ?? params.CategoryIds?.[0],
    brandIds,
    page: params.Page ?? 1,
    pageSize: params.PageSize ?? 20,
    minPrice: params.MinPrice,
    maxPrice: params.MaxPrice,
    inStock: params.InStock,
    onSaleOnly: params.OnSaleOnly,
    colorOptionIds,
    attributeFilters,
    sortOrder: params.SortOrder,
  });

  if (shouldSendVehicleIds) {
    body.vehicleIds = vehicleIds ?? [];
  }

  const response = await proxyToBackend<ApiResponse<ProductListResponse>>({
    method: "POST",
    path: "/api/v1/Products/filter",
    body,
    cache: "no-store",
    timeout: 8_000,
    retries: 0,
  });


  if (!response.ok) {
    throw new ProductServiceError(
      response.status,
      getApiMessage(response.data, "Failed to fetch product list"),
      response.data,
    );
  }

  const isSuccess = response.data.success ?? response.data.isSuccess;
  if (!isSuccess) {
    throw new ProductServiceError(
      response.status,
      getApiMessage(response.data, "Failed to fetch product list"),
      response.data,
    );
  }

  if (!response.data.data) {
    throw new ProductServiceError(
      response.status,
      "Product list response is empty",
      response.data,
    );
  }

  return {
    ...response.data.data,
    filterOptions: normalizeFilterOptions(response.data.data.filterOptions),
  };
}

export async function getProductFilterOptions(
  params: {
    CategoryId?: string | null;
  } = {},
): Promise<ProductFilterOptions> {
  const body = params.CategoryId
    ? removeEmptyValues({
        categoryId: params.CategoryId,
      })
    : {};
  const method = "POST";

  const response = await proxyToBackend<ApiResponse<RawProductFilterOptions>>({
    method,
    path: "/api/v1/Products/filter-options",
    body,
    cache: "no-store",
    timeout: 5_000,
    retries: 0,
  });

  if (!response.ok) {
    throw new ProductServiceError(
      response.status,
      getApiMessage(response.data, "Failed to fetch filter options"),
      response.data,
    );
  }

  const isSuccess = response.data.success ?? response.data.isSuccess;
  if (!isSuccess) {
    throw new ProductServiceError(
      response.status,
      getApiMessage(response.data, "Failed to fetch filter options"),
      response.data,
    );
  }

  return normalizeFilterOptions(response.data.data);
}

/**
 * Resolves SEO query params (`brand=slug`, `color_palettes=displayText`)
 * into the Products/filter body (brandIds / attributeFilters).
 */
export async function getProductListFromSearchParams(
  params: Omit<ProductListParams, "AttributeFilters" | "BrandIds"> & {
    /** /products/[slug] brand page when no ?brand= query */
    PathBrandSlug?: string;
  },
  searchParams: Record<string, string | string[] | undefined>,
): Promise<ProductListResponse> {
  const baseFilters = parseAttributeFilters(searchParams);
  const vehicleIds = listSearchParamValues(searchParams, "vehicleId");
  const shouldSendAllVehicles =
    searchParams.vehicleMode === "all" ||
    searchParams.allVehicles === "true" ||
    (Array.isArray(searchParams.vehicleMode) &&
      searchParams.vehicleMode.includes("all")) ||
    (Array.isArray(searchParams.allVehicles) &&
      searchParams.allVehicles.includes("true"));
  const queryColorOptionIds = colorOptionIdParams(searchParams);
  const paletteLabels = colorPaletteParams(searchParams);
  const queryBrandSlugs = allBrandSlugParams(searchParams);
  const brandSlugs =
    queryBrandSlugs.length > 0
      ? queryBrandSlugs
      : params.PathBrandSlug
        ? [params.PathBrandSlug]
        : typeof params.BrandSlug === "string" && params.BrandSlug
          ? [params.BrandSlug]
          : [];

  const listParams = { ...params };
  delete listParams.PathBrandSlug;
  delete listParams.BrandSlug;

  const needsColorResolve = paletteLabels.length > 0;
  const needsBrandResolve = brandSlugs.length > 0;

  let filterOptions: ProductFilterOptions = EMPTY_FILTER_OPTIONS;
  let filterOptionsPromise: Promise<ProductFilterOptions> | null = null;

  if (listParams.CategoryId && (needsColorResolve || needsBrandResolve)) {
    filterOptionsPromise = getProductFilterOptions({
      CategoryId: listParams.CategoryId,
    });
  }

  if (needsColorResolve || needsBrandResolve) {
    try {
      filterOptions = filterOptionsPromise
        ? await filterOptionsPromise
        : await getProductFilterOptions({
            CategoryId: listParams.CategoryId ?? undefined,
          });
    } catch (error) {
      warnOptionalProductRequest("filter-options", error);
      filterOptions = EMPTY_FILTER_OPTIONS;
    }
  }

  let brandSlug: string | undefined;
  let brandIds: string[] | undefined;

  if (brandSlugs.length > 0 && filterOptions.brands.length > 0) {
    brandIds = resolveBrandSlugsToIds(brandSlugs, filterOptions.brands);
    // fallback when facet list misses a slug
    if (brandIds.length === 0 && brandSlugs.length === 1) {
      brandSlug = brandSlugs[0];
    }
  } else if (brandSlugs.length === 1) {
    brandSlug = brandSlugs[0];
  }

  let colorOptionIds = queryColorOptionIds;
  const attributeFilters = baseFilters;
  if (needsColorResolve && filterOptions.attributes.length > 0) {
    const resolvedColorOptionIds = resolveColorPaletteAttributeFilters(
      paletteLabels,
      filterOptions.attributes,
    ).flatMap((filter) => filter.optionIds);
    colorOptionIds = [
      ...new Set([...queryColorOptionIds, ...resolvedColorOptionIds]),
    ];
  }

  const fullColorOptionsPromise = Promise.resolve<ProductFilterOptions | null>(
    null,
  );

  const safeFilterOptionsPromise =
    filterOptionsPromise ??
    (needsColorResolve || needsBrandResolve
      ? Promise.resolve(filterOptions)
      : Promise.resolve(null));

  const [productList, resolvedFilterOptions, fullColorOptions] =
    await Promise.all([
      getProductList({
        ...listParams,
        BrandSlug: brandIds?.length ? undefined : brandSlug,
        BrandIds: brandIds && brandIds.length > 0 ? brandIds : undefined,
        ColorOptionIds: colorOptionIds.length > 0 ? colorOptionIds : undefined,
        VehicleIds: shouldSendAllVehicles
          ? []
          : vehicleIds.length > 0
            ? vehicleIds
            : undefined,
        AttributeFilters:
          attributeFilters.length > 0 ? attributeFilters : undefined,
      }),
      safeFilterOptionsPromise.catch((error) => {
        warnOptionalProductRequest("filter-options", error);
        return null;
      }),
      fullColorOptionsPromise,
    ]);

  let effectiveFilterOptions =
    resolvedFilterOptions ?? productList.filterOptions;

  if (
    !resolvedFilterOptions &&
    !needsColorResolve &&
    !needsBrandResolve &&
    !hasUsefulFilterOptions(effectiveFilterOptions)
  ) {
    try {
      effectiveFilterOptions = await getProductFilterOptions({
        CategoryId: listParams.CategoryId ?? undefined,
      });
    } catch (error) {
      warnOptionalProductRequest("filter-options", error);
    }
  }

  return {
    ...productList,
    filterOptions: mergeFullColorOptions(
      effectiveFilterOptions,
      fullColorOptions,
    ),
  };
}

export async function getProductById(
  productIdOrSlug: string,
): Promise<ProductDetail> {
  const response = await proxyToBackend<ApiResponse<ProductDetail>>({
    method: "GET",
    path: `/api/v1/Products/${productIdOrSlug}`,
    cache: "no-store",
  });


  const isSuccess = response.data?.isSuccess ?? response.data?.success;
  if (!response.ok || !isSuccess) {
    throw new Error(response.data?.message ?? "Failed to fetch product");
  }

  return response.data.data;
}
