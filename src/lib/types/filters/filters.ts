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
  parentId?: string | null;
  parentCategoryId?: string | null;
  name: string;
  slug: string;
  count: number;
  children?: CategoryFilterOption[];
}

export interface ProductFilterState {
  categoryId?: string;

  brandSlug?: string;

  minPrice: number;
  maxPrice: number;

  inStock: boolean;
  onSaleOnly: boolean;

  attributes: Record<string, string[]>;

  sortOrder: SortOrder;

  page: number;
}

export interface AttributeOption {
  optionId?: string | null;
  value: string;
  /** Human-readable label for UI / SEO query (`color_palettes`) */
  displayText?: string;
  count?: number;
  colorCodes?: string;
  hex?: string;
}

export interface AttributeFilter {
  attributeId: string;
  attributeName: string;
  attributeType?: number;
  options: AttributeOption[];
}

export type SortOption =
  | "Default"
  | "BestDiscount"
  | "Newest"
  | "PriceAsc"
  | "PriceDesc"
  | "BestSelling"
  | "MostViewed"
  | "DiscountDesc"
  | "MostRated";
