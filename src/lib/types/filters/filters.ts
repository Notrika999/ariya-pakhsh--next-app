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

