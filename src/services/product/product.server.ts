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

  console.log("response => ", response);

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

  console.log(response)

  if (!response.ok) {
    throw new Error(response.data?.message ?? "Failed to fetch product list");
  }

  const isSuccess = response.data.success ?? response.data.isSuccess;
  if (!isSuccess) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export async function getProductById(slug: string): Promise<ProductDetail> {
  const response = await proxyToBackend<ApiResponse<ProductDetail>>({
    method: "GET",
    path: `/api/v1/Products/${slug}`,
    cache: "no-store",
  });

  console.log("getProductById response => ", response);

  if (!response.ok || !response.data.isSuccess) {
    throw new Error(response.data?.message ?? "Failed to fetch product");
  }

  return response.data.data;
}
