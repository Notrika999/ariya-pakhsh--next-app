import {
  AttributeFilter,
  BrandFilterOption,
  CategoryFilterOption,
} from "./filters/filters";

export interface Product {
  id: number | string;
  title: string;
  image: string;
  imageSlider: [];
  brandId: number | string;
  discount: string | null;
  price: number;
  oldPrice: number;
  rating: number;
  count: number;
  colors: string[];
  href: string;
  offer?: boolean;
  dealEndsAt?: string;
  inStock?: boolean | null;
  [key: string]: unknown;
}

export interface ProductResponse {
  products: Product[];
  brands: Brand[];
  featuredProducts?: Product[];
  newestProducts?: Product[];
  bestSellingProducts?: Product[];
  onSaleProducts?: Product[];
  topCategories?: ProductIndexCategory[];
  topBrands?: ProductIndexBrand[];
}

export interface ProductIndexCategory {
  categoryId: string;
  name: string;
  slug: string;
  productCount: number;
  mediaId?: string | null;
  iconUrl?: string | null;
  thumbUrl?: string | null;
}

export interface ProductIndexBrand {
  brandId: string;
  name: string;
  slug: string;
  productCount: number;
}

export interface ProductIndexData {
  featuredProducts: Product[];
  newestProducts: Product[];
  bestSellingProducts: Product[];
  onSaleProducts: Product[];
  topCategories: ProductIndexCategory[];
  topBrands: ProductIndexBrand[];
}

// Products List Category
export interface ProductListParams {
  CategoryId?: string | null;
  BrandId?: string;
  CategoryIds?: string[];
  BrandIds?: string[];
  ColorOptionIds?: string[];
  VehicleIds?: string[];

  CategorySlug?: string;
  /** Single brand slug only — use BrandIds for multi-select */
  BrandSlug?: string;

  MinPrice?: number;
  MaxPrice?: number;
  Color?: string;

  InStock?: boolean;
  OnSaleOnly?: boolean;

  AttributeFilters?: ProductAttributeFilter[];

  SortOrder?: SortOrder;

  Page?: number;
  PageSize?: number;
}

export interface ProductAttributeFilter {
  attributeId: string;
  optionIds?: string[];
  value?: string;
  values?: string[];
  boolValue?: boolean;
}

export interface ProductListItem {
  productId: string;
  name: string;
  slug: string;
  publicCode: string;

  price: number;
  compareAtPrice?: number;
  salePrice?: number;
  finalPrice?: number;
  basePrice?: number;
  originalPrice?: number;

  isOnSale: boolean;
  discountPercent?: number | null;
  discountAmount?: number | null;
  campaignId?: string | null;
  campaignLabel?: string | null;
  campaignTitle?: string | null;
  campaignName?: string | null;
  campaignEndAt?: string | null;
  campaignRemainingSeconds?: number | null;
  isAmazingOffer?: boolean;
  promotion?: {
    campaignId?: string | null;
    promotionType?: number;
    promotionTypeValue?: string | null;
    promotionTypeDisplayName?: string | null;
    typeLabel?: string | null;
    basePrice?: number;
    finalPrice?: number;
    discountPercent?: number | null;
    promotionEndAt?: string | null;
    remainingSeconds?: number | null;
    remainingStock?: number;
    soldCount?: number;
    variantId?: string | null;
  } | null;

  currencyCode: string;

  inStock: boolean;
  availableQuantity: number;

  thumbnailPath?: string;
  mediumPath?: string;

  soldCount: number;

  averageRating: number;
  reviewCount: number;

  primaryBrandName?: string;
  primaryBrandSlug?: string;

  primaryCategoryName?: string;

  defaultVariantId?: string;
  DefaultVariantId?: string;
  defaultVariantID?: string;
  DefaultVariantID?: string;
  variantId?: string;
  VariantId?: string;
  variantID?: string;
  VariantID?: string;
  variants?: Array<{
    variantId?: string;
    VariantId?: string;
    variantID?: string;
    VariantID?: string;
  }>;
}

export type SortOrder =
  | "newest"
  | "oldest"
  | "priceAsc"
  | "priceDesc"
  | "bestSelling"
  | "mostViewed"
  | "mostRated"
  | "discountDesc";

export interface Brand {
  id: number | string;
  name: string;
  slug?: string;
  productCount?: number;
}

export interface HomeProduct {
  id: string;
  title: string;
  image: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: number;
  count: number;
  href: string;
  offer: boolean;
  inStock: boolean;
}

export interface ProductCardModel {
  id: string;
  title: string;
  slug?: string;
  publicCode?: string;
  image: string;
  imageSlider?: unknown[];
  brandId?: number | string;
  primaryBrandName?: number | string;
  primaryBrandSlug?: number | string;
  categoryName: string;
  currency: string;
  price: number;
  oldPrice: number;
  originalPrice?: number;
  discountedPrice?: number | null;
  rating: number;
  reviewCount: number;
  count?: number;
  colors?: string[];
  quantity: number;
  soldCount: number;
  inStock?: boolean;
  isOnSale: boolean;
  href: string;
  discount?: string | number;
  discountPercent?: number;
  showSaleBadge?: {
    label: string;
    promotionType?: number;
    promotionTypeValue?: string;
    discountPercent?: number;
    endsAt?: string;
    remainingSeconds?: number;
  };
  isFeatured?: boolean;
  specialSale?: boolean;
  dealEndsAt?: string | Date;
  offer?: boolean;
  /** Default/sellable variant for add-to-cart API */
  variantId?: string;
}

export interface ProductIndexApiResponse {
  isSuccess: boolean;
  data: ProductIndexData;
  errors: unknown[];
}

export interface ProductListResponse {
  items: ProductListItem[];

  totalCount: number;

  page: number;
  pageSize: number;

  totalPages: number;

  filterOptions: ProductFilterOptions;

  products?: ProductCardModel[];
  suggestions?: string[];
  appliedFilters?: ProductListAppliedFilters;
}

export interface ProductListAppliedFilters {
  categoryId?: string | null;
  brandIds?: string[];
  vehicleIds?: string[];
  colorOptionIds?: string[];
  minPrice?: number | null;
  maxPrice?: number | null;
  inStock?: boolean | null;
  onSaleOnly?: boolean | null;
  attributeFilters?: ProductAttributeFilter[];
}

export interface ProductFilterOptions {
  categoryId?: string;
  categoryName?: string;
  categorySlug?: string;

  brands: BrandFilterOption[];

  categories: CategoryFilterOption[];

  attributes: AttributeFilter[];

  colors?: ProductFilterColorOption[];

  vehicles?: ProductFilterVehicleOption[];

  minPrice: number;
  maxPrice: number;
}

export interface ProductFilterColorOption {
  optionId: string;
  attributeId: string;
  attributeName: string;
  value: string;
  displayText?: string;
  colorCodes?: string;
}

export interface ProductFilterVehicleOption {
  id: string;
  parentId?: string | null;
  name: string;
  englishName?: string;
  company?: string;
  depth?: number;
  sortOrder?: number;
  isLeaf?: boolean;
  hasChildren?: boolean;
  children?: ProductFilterVehicleOption[] | string[];
}

export interface ApiError {
  error: true;
  message: string;
}
