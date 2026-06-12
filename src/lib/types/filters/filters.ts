import { SortOrder } from "../productTypes";

//
export interface DealsFilters {
  search: string;

  categories: string[];

  brands: string[];

  minPrice: number;
  maxPrice: number;

  minDiscount: number | null;

  onlyAvailable: boolean;

  badges: string[];
}

//
export interface BrandFilterOption {
  brandId: string;
  name: string;
  slug: string;
  count: number;
}

export interface CategoryFilterOption {
  categoryId: string;
  name: string;
  slug: string;
  count: number;
}

export interface ProductFilterState {
  categoryId?: string;

  brandId?: string;

  minPrice: number;
  maxPrice: number;

  inStock: boolean;
  onSaleOnly: boolean;

  attributes: Record<string, string[]>;

  sortOrder: SortOrder;

  page: number;
}

export interface AttributeOption {
  optionId: string;
  value: string;
  count: number;
}

export interface AttributeFilter {
  attributeId: string;
  attributeName: string;
  options: AttributeOption[];
}

export type SortOption =
  | "default"
  | "newest"
  | "priceAsc"
  | "priceDesc"
  | "bestSelling"
  | "mostRated"
  | "discountDesc";

