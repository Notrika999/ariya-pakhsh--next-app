// src/services/product/product.service.ts

import { apiClient } from "@/src/lib/http/client-http";
import { mapProductIndex } from "@/src/lib/mappers/product.mapper";
import {
  Product,
  ProductIndexApiResponse,
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

function mergeProductGroups(groups: Product[][]): Product[] {
  const seen = new Set<string>();
  const products: Product[] = [];

  groups.flat().forEach((product) => {
    const key = String(product.id);
    if (seen.has(key)) return;

    seen.add(key);
    products.push(product);
  });

  return products;
}

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
