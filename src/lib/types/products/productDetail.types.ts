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
  optionId?: string;
  value: string;
  displayText?: string;
  /** Hex color — API may send either key */
  colorCode?: string | null;
  colorHexCodes?: string | string[] | null;
}

export interface ProductDetailCategoryPathItem {
  categoryId: string;
  name: string;
  slug: string;
  depth: number;
}

export interface ProductDetailPromotion {
  campaignId: string;
  promotionVariantId: string;
  variantId: string;
  promotionType: number;
  typeLabel?: string;
  promotionTypeValue?: string;
  promotionTypeDisplayName?: string;
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

export interface ProductDetailVariant {
  variantId: string;
  name: string;
  karmaProductId?: string;
  isDefault: boolean;
  sortOrder: number;
  price: number;
  compareAtPrice?: number | null;
  salePrice?: number | null;
  isOnSale: boolean;
  currencyCode: string;
  availableQuantity: number;
  inStock: boolean;
  allowBackorder: boolean;
  isVirtual: boolean;
  isAmazingOffer?: boolean;
  images: ProductDetailImage[];
  attributes: ProductDetailAttribute[];
}

export interface RelatedProduct {
  productId: string;
  name: string;
  slug: string;
  publicCode: string;
  price?: number;
  compareAtPrice?: number;
  salePrice?: number | null;
  isOnSale?: boolean;
  currencyCode?: string;
  inStock?: boolean;
  availableQuantity?: number;
  thumbnailPath?: string | null;
  mediumPath?: string | null;
  soldCount?: number;
  averageRating?: number;
  reviewCount?: number;
  primaryCategoryName?: string;
  primaryBrandName?: string;
  primaryBrandSlug?: string;
  variants?: ProductDetailVariant[];
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
  description?: string;
  shortDescription?: string;
  warrantyInfo?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  viewCount: number;
  averageRating: number;
  reviewCount: number;
  soldCount: number;
  maxQuantityPerOrder: number;
  maxQuantityPerUser: number;
  categories: ProductDetailCategory[];
  categoryPath?: ProductDetailCategoryPathItem[];
  brands: ProductDetailBrand[];
  isInWishlist?: boolean;
  isAmazingOffer?: boolean;
  promotion?: ProductDetailPromotion | null;
  variants: ProductDetailVariant[];
  attributes: ProductDetailAttribute[];
  relatedProducts: RelatedProduct[];
  crossSellProducts: RelatedProduct[]; // Cross-sell products are products that are related to the current product and are displayed on the product page
  upsellProducts: RelatedProduct[]; // Upsell products are products that are related to the current product and are displayed on the product page
  compatibilities: ProductDetailCompatibility[];
}

export interface ProductDetailApiResponse {
  isSuccess: boolean;
  data: ProductDetail;
  errors: string[];
}
