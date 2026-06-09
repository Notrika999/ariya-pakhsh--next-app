// src/services/product/product.service.ts

import { apiClient } from "@/src/lib/http/client-http";
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

// GET INDEX DATA
export async function getProducts(
  params?: GetProductsParams,
): Promise<ProductResponse> {
  const res = await apiClient.get<ProductIndexApiResponse>("/Products/index", {
    params: {
      ...DEFAULT_PRODUCTS_PARAMS,
      ...params,
    },
  });

  if (!res.data.isSuccess) {
    throw new Error("Failed to fetch products");
  }

  console.log("Products response:", res);

  const mapped = mapProductIndex(res.data.data);

  return {
    ...mapped,
    brands: res.data.data.topBrands.map((b) => ({
      id: b.brandId,
      name: b.name,
      slug: b.slug,
      productCount: b.productCount,
    })),
  };
}

// GET CATEGORAY PRODUCT lIST
// export async function getProductList(
//   params: ProductListParams,
// ): Promise<ProductListResponse> {
//   const query = buildProductListParams(params);

//   const res = await apiClient.get<ApiResponse<ProductListResponse>>(
//     `/Products/list?${query.toString()}`,
//   );

//   if (!res.data.isSuccess) {
//     throw new Error(res.data.message);
//   }

//   console.log("Get Product List", res);

//   return res.data.data;
// }

// GET CATEGORY PRODUCT LIST (POST /Products/filter)
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
    inStock: params.InStock,
    onSaleOnly: params.OnSaleOnly,
    attributeFilters: params.AttributeFilters,
    sortOrder: params.SortOrder,
  });

  const res = await apiClient.post<ApiResponse<ProductListResponse>>(
    "/Products/filter",
    body,
  );
  console.log("Products Data => ", res);
  console.log("Category Slug => ", params.CategorySlug);
  const isSuccess = res.data.success ?? res.data.isSuccess;

  if (!isSuccess) {
    throw new Error(res.data.message);
  }

  return res.data.data;
}

// GET PRODUCT BY ID
export async function getProductById(
  productId: string,
): Promise<ProductDetail> {
  const url = `Products/${productId}`;
  const res = await apiClient.get<ApiResponse<ProductDetail>>(url);

  console.log("getProductById => ", res);

  if (!res.data.isSuccess) {
    throw new Error(res.data.message ?? "Failed to fetch product");
  }

  return res.data.data;
}
