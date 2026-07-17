// src/services/product/product.server.ts
import "server-only";

import { proxyToBackend } from "@/src/lib/http/server-http";
import { mapProductIndex } from "@/src/lib/mappers/product.mapper";
import { ApiResponse } from "@/src/lib/types/common/api-response.types";
import { ProductDetail } from "@/src/lib/types/products/productDetail.types";
import {
  ProductIndexApiResponse,
  ProductListParams,
  ProductListResponse,
  ProductResponse,
} from "@/src/lib/types/productTypes";
import {
  COLOR_PALETTE_PARAM,
  allBrandSlugParams,
  listSearchParamValues,
  mergeColorIntoAttributeFilters,
  parseAttributeFilters,
  resolveBrandSlugsToIds,
  resolveColorPaletteAttributeFilters,
} from "@/src/lib/helper/productListHelpers";

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
      return (
        fieldValue !== undefined && fieldValue !== null && fieldValue !== ""
      );
    }),
  );
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
  const body = removeEmptyValues({
    categoryId: params.CategoryId,
    brandId: params.BrandId,
    categoryIds: params.CategoryIds,
    brandIds: params.BrandIds,
    brandSlug: params.BrandSlug,
    categorySlug: params.CategorySlug,
    page: params.Page ?? 1,
    pageSize: params.PageSize ?? 20,
    minPrice: params.MinPrice,
    maxPrice: params.MaxPrice,
    color: params.Color,
    inStock: params.InStock,
    onSaleOnly: params.OnSaleOnly,
    attributeFilters: params.AttributeFilters,
    sortOrder: params.SortOrder,
  });

  const response = await proxyToBackend<ApiResponse<ProductListResponse>>({
    method: "POST",
    path: "/api/v1/Products/filter",
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(response.data?.message ?? "Failed to fetch product list");
  }

  const isSuccess = response.data.success ?? response.data.isSuccess;
  if (!isSuccess) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

/**
 * Resolves SEO query params (`brand=slug`, `color_palette=displayText`)
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
  const paletteLabels = listSearchParamValues(
    searchParams,
    COLOR_PALETTE_PARAM,
  );
  const queryBrandSlugs = allBrandSlugParams(searchParams);
  const brandSlugs =
    queryBrandSlugs.length > 0
      ? queryBrandSlugs
      : params.PathBrandSlug
        ? [params.PathBrandSlug]
        : typeof params.BrandSlug === "string" && params.BrandSlug
          ? [params.BrandSlug]
          : [];

  const {
    PathBrandSlug: _pathBrandSlug,
    BrandSlug: _incomingBrandSlug,
    ...listParams
  } = params;

  const needsColorResolve = paletteLabels.length > 0;
  const needsBrandResolve = brandSlugs.length > 0;

  let preview: ProductListResponse | null = null;
  if (needsColorResolve || needsBrandResolve) {
    preview = await getProductList({
      ...listParams,
      BrandSlug: undefined,
      BrandIds: undefined,
      AttributeFilters: baseFilters.length > 0 ? baseFilters : undefined,
      Page: 1,
      PageSize: 1,
    });
  }

  let brandSlug: string | undefined;
  let brandIds: string[] | undefined;

  if (brandSlugs.length > 0 && preview) {
    brandIds = resolveBrandSlugsToIds(
      brandSlugs,
      preview.filterOptions?.brands,
    );
    // fallback when facet list misses a slug
    if (brandIds.length === 0 && brandSlugs.length === 1) {
      brandSlug = brandSlugs[0];
    }
  } else if (brandSlugs.length === 1) {
    brandSlug = brandSlugs[0];
  }

  let attributeFilters = baseFilters;
  if (needsColorResolve && preview) {
    const colorFilters = resolveColorPaletteAttributeFilters(
      paletteLabels,
      preview.filterOptions?.attributes,
    );
    attributeFilters = mergeColorIntoAttributeFilters(
      baseFilters,
      colorFilters,
    );
  }

  return getProductList({
    ...listParams,
    BrandSlug: brandIds?.length ? undefined : brandSlug,
    BrandIds: brandIds && brandIds.length > 0 ? brandIds : undefined,
    AttributeFilters:
      attributeFilters.length > 0 ? attributeFilters : undefined,
  });
}

export async function getProductById(productIdOrSlug: string): Promise<ProductDetail> {
  const response = await proxyToBackend<ApiResponse<ProductDetail>>({
    method: "GET",
    path: `/api/v1/Products/${productIdOrSlug}`,
    cache: "no-store",
  });

  console.log("response ProductById => ", response);

  const isSuccess = response.data?.isSuccess ?? response.data?.success;
  if (!response.ok || !isSuccess) {
    throw new Error(response.data?.message ?? "Failed to fetch product");
  }

  return response.data.data;
}
