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

export interface Brand {
  id: number | string;
  name: string;
  slug?: string;
  productCount?: number;
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

export interface ProductIndexApiResponse {
  isSuccess: boolean;
  data: ProductIndexData;
  errors: unknown[];
}

export interface ApiError {
  error: true;
  message: string;
}
