// src/lib/types/productDetail.types.ts

export interface ProductDetailCategory {
  categoryId: string;
  name: string;
  slug: string;
  isPrimary: boolean;
}

export interface ProductDetailBrand {
  brandId: string;
  name: string;
  slug: string;
  isPrimary: boolean;
}

export interface ProductDetailImage {
  thumbnailPath: string;
  mediumPath: string;
  largePath: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductDetailAttribute {
  attributeId: string;
  attributeName: string;
  optionId: string;
  value: string;
}

export interface ProductDetailVariant {
  variantId: string;
  name: string;
  isDefault: boolean;
  sortOrder: number;
  price: number;
  isOnSale: boolean;
  currencyCode: string;
  availableQuantity: number;
  inStock: boolean;
  allowBackorder: boolean;
  isVirtual: boolean;
  images: ProductDetailImage[];
  attributes: ProductDetailAttribute[];
}

export interface ProductDetailCompatibility {
  carId: string;
  name: string;
  model: string;
  isIranianCar: boolean;
}

export interface ProductDetail {
  productId: string;
  name: string;
  slug: string;
  publicCode: string;
  description: string;
  shortDescription: string;
  warrantyInfo: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  viewCount: number;
  averageRating: number;
  reviewCount: number;
  soldCount: number;
  maxQuantityPerOrder: number;
  maxQuantityPerUser: number;
  categories: ProductDetailCategory[];
  brands: ProductDetailBrand[];
  variants: ProductDetailVariant[];
  attributes: ProductDetailAttribute[];
  relatedProducts: ProductDetail[];
  compatibilities: ProductDetailCompatibility[];
}

export interface ProductDetailApiResponse {
  isSuccess: boolean;
  data: ProductDetail;
  errors: string[];
}