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
  discount: string;
  price: number;
  oldPrice: number;
  rating: number;
  count: number;
  colors: string[];
  href: string;
  offer?: boolean;
  dealEndsAt?: string;
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
  CategoryId?: string;
  BrandId?: string;

  MinPrice?: number;
  MaxPrice?: number;

  InStock?: boolean;
  OnSaleOnly?: boolean;

  AttributeFilters?: Record<string, string[]>;

  SortOrder?: SortOrder;

  Page?: number;
  PageSize?: number;
}

export interface ProductListItem {
  productId: string;
  name: string;
  slug: string;
  publicCode: string;

  price: number;
  compareAtPrice?: number;

  isOnSale: boolean;

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
}

export type SortOrder =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "best_selling"
  | "popular";

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
}

export interface ProductListItem {
  productId: string;
  name: string;
  slug: string;
  publicCode: string;
  price: number;
  compareAtPrice: number;
  isOnSale: boolean;
  currencyCode: string;
  inStock: boolean;
  availableQuantity: number;
  thumbnailPath: string;
  mediumPath: string;
  soldCount: number;
  averageRating: number;
  reviewCount: number;
  primaryBrandName: string;
  primaryBrandSlug: string;
  primaryCategoryName: string;
}

export interface ProductCardModel {
  id: string;
  title: string;
  slug?: string;
  image: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  href: string;
  discountPercent?: number;
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

  filterOptions: {
    brands: BrandFilterOption[];

    categories: CategoryFilterOption[];

    attributes: AttributeFilter[];

    minPrice: number;
    maxPrice: number;
  };
}

export interface ApiError {
  error: true;
  message: string;
}
