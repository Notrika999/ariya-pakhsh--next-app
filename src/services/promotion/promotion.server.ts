import "server-only";

import { proxyToBackend } from "@/src/lib/http/server-http";
import { ProductCardModel } from "@/src/lib/types/productTypes";

interface AmazingPromotion {
  campaignId: string;
  promotionVariantId: string;
  variantId: string;
  promotionType: number;
  typeLabel: string;
  basePrice: number;
  finalPrice: number;
  discountAmount: number;
  discountPercent: number;
  promotionStock: number;
  soldCount: number;
  remainingStock: number;
  soldPercent: number;
  isLowStock: boolean;
  promotionEndAt: string;
  remainingSeconds: number;
}

interface AmazingColor {
  optionId: string;
  title: string;
  hexCodes: string[];
}

interface AmazingProductDto {
  productId: string;
  productName: string;
  slug: string;
  brandId: string;
  brandName: string;
  defaultVariantId: string;
  promotion: AmazingPromotion;
  colors: AmazingColor[];
  imageUrl?: string;
  thumbnailUrl?: string;
  thumbnailPath?: string;
  image?: string;
}

interface AmazingProductsResponse {
  success: boolean;
  message?: string;
  code?: string;
  data: AmazingProductDto[];
}

export interface AmazingFilterParams {
  Page?: number;
  PageSize?: number;
  BrandIds?: string[];
  ColorOptionIds?: string[];
  CategoryId?: string;
  InStockOnly?: boolean;
  MinPrice?: number;
  MaxPrice?: number;
  SortBy?: "bestDiscount" | "priceAsc" | "priceDesc" | "newest" | "bestSelling";
  DefaultVariantBy?: "finalPrice" | "basePrice";
}

export interface AmazingFilterResult {
  products: ProductCardModel[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  brands: Array<{
    brandId: string;
    name: string;
    slug: string;
    isSelected: boolean;
  }>;
  selectedColorOptionIds: string[];
  colorFilterOptions: Array<{
    optionId: string;
    value: string;
    count: number;
    colorCodes: string;
  }>;
}

interface AmazingFilterResponse {
  success: boolean;
  data: {
    products: {
      items: AmazingProductDto[];
      pageNumber: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
    brands: AmazingFilterResult["brands"];
    selectedColorOptionIds: string[];
  };
}

function pickImage(item: AmazingProductDto): string {
  return (
    item.thumbnailUrl ??
    item.imageUrl ??
    item.thumbnailPath ??
    item.image ??
    "/images/default.png"
  );
}

function mapAmazingProduct(
  item: AmazingProductDto,
  options?: { includeDealTimer?: boolean },
): ProductCardModel {
  const promotion = item.promotion;

  return {
    id: item.productId,
    title: item.productName,
    slug: item.slug,
    image: pickImage(item),
    imageSlider: [],
    brandId: item.brandId,
    primaryBrandName: item.brandName,
    categoryName: promotion.typeLabel ?? "",
    currency: "IRR",
    price: promotion.finalPrice,
    oldPrice: promotion.basePrice,
    originalPrice: promotion.basePrice,
    discountedPrice: promotion.finalPrice,
    rating: 0,
    reviewCount: 0,
    colors: item.colors.flatMap((color) => color.hexCodes ?? []),
    quantity: promotion.remainingStock,
    soldCount: promotion.soldCount,
    inStock: promotion.remainingStock > 0,
    isOnSale: promotion.discountPercent > 0,
    href: `/product/${item.slug}`,
    discount: promotion.discountPercent,
    discountPercent: promotion.discountPercent,
    isFeatured: true,
    specialSale: true,
    offer: true,
    ...(options?.includeDealTimer
      ? { dealEndsAt: promotion.promotionEndAt }
      : {}),
  };
}

function toQueryParams(params?: AmazingFilterParams): Record<string, string> {
  const query: Record<string, string> = {};
  if (!params) return query;

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      if (value.length > 0) query[key] = value.join(",");
      continue;
    }
    query[key] = String(value);
  }

  return query;
}

export async function getAmazingProducts(options?: {
  includeDealTimer?: boolean;
}): Promise<ProductCardModel[]> {
  const response = await proxyToBackend<AmazingProductsResponse>({
    method: "GET",
    path: "/api/v1/Promotion/amazing",
    cache: "no-store",
  });

  if (!response.ok || !response.data.success) return [];

  return (response.data.data ?? []).map((item) =>
    mapAmazingProduct(item, options),
  );
}

export async function getAmazingFilteredProducts(
  params?: AmazingFilterParams,
): Promise<AmazingFilterResult> {
  const response = await proxyToBackend<AmazingFilterResponse>({
    method: "GET",
    path: "/api/v1/Promotion/amazing-filter",
    params: toQueryParams(params),
    cache: "no-store",
  });

  const empty: AmazingFilterResult = {
    products: [],
    totalCount: 0,
    pageNumber: params?.Page ?? 1,
    pageSize: params?.PageSize ?? 20,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    brands: [],
    selectedColorOptionIds: [],
    colorFilterOptions: [],
  };

  if (!response.ok || !response.data.success) return empty;

  const products = response.data.data.products;

  const colorMap = new Map<
    string,
    { optionId: string; value: string; count: number; colorCodes: string }
  >();

  for (const item of products.items ?? []) {
    for (const color of item.colors ?? []) {
      const previous = colorMap.get(color.optionId);
      colorMap.set(color.optionId, {
        optionId: color.optionId,
        value: color.title,
        count: (previous?.count ?? 0) + 1,
        colorCodes: (color.hexCodes ?? []).join(","),
      });
    }
  }

  return {
    products: (products.items ?? []).map((item) =>
      mapAmazingProduct(item, { includeDealTimer: true }),
    ),
    totalCount: products.totalCount,
    pageNumber: products.pageNumber,
    pageSize: products.pageSize,
    totalPages: products.totalPages,
    hasPreviousPage: products.hasPreviousPage,
    hasNextPage: products.hasNextPage,
    brands: response.data.data.brands ?? [],
    selectedColorOptionIds: response.data.data.selectedColorOptionIds ?? [],
    colorFilterOptions: Array.from(colorMap.values()),
  };
}

export async function getSpecialPromotionProducts(): Promise<ProductCardModel[]> {
  const response = await proxyToBackend<AmazingProductsResponse>({
    method: "GET",
    path: "/api/v1/Promotion/special",
    cache: "no-store",
  });

  if (!response.ok || !response.data.success) return [];

  return (response.data.data ?? []).map((item) =>
    mapAmazingProduct(item, { includeDealTimer: true }),
  );
}
