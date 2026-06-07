// types/product.ts

export type ProductBadge =
  | "limited_stock"
  | "send_today"
  | "special_sale"
  | "bestseller"
  | "new"
  | "exclusive";

export type ProductCategory =
  | "all"
  | "steering"
  | "audio"
  | "lighting"
  | "seats"
  | "fragrance"
  | "floor_mats"
  | "accessories";

export type SortOption =
  | "default"
  | "newest"
  | "priceAsc"
  | "priceDesc"
  | "bestSelling"
  | "mostRated"
  | "discountDesc";

export interface ProductReview {
  rating: number; // 1-5
  count: number;
}

export interface Product {
  id: string;

  name: string;
  slug: string;

  brand: string;
  category: ProductCategory;

  description: string;
  image: string;

  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;

  review: ProductReview;

  badges: ProductBadge[];

  stockCount: number;

  isAvailable: boolean;

  dealEndsAt: Date; // countdown timer target
  isFeatured?: boolean;

  specialSale?: boolean;

  sku: string;

  soldCount: number;

  tags: string[];

  createdAt: Date;
}

export interface FilterState {
  search: string;
  category: ProductCategory;
  sort: SortOption;
  minPrice: number;
  maxPrice: number;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  all: "همه محصولات",
  steering: "فرمان و پدال",
  seats: "صندلی و روکش",
  audio: "صوتی و تصویری",
  lighting: "روشنایی",
  accessories: "اکسسوری",
  fragrance: "خوشبو کننده",
  floor_mats: "کفپوش و روکش",
};

export const SORT_LABELS: Record<SortOption, string> = {
  default: "پیشنهادی",
  price_asc: "ارزان‌ترین",
  price_desc: "گران‌ترین",
  discount_desc: "بیشترین تخفیف",
  rating_desc: "بهترین امتیاز",
  most_reviewed: "بیشترین نظر",
};

export const BADGE_LABELS: Record<ProductBadge, string> = {
  limited_stock: "موجودی محدود",
  send_today: "ارسال امروز",
  special_sale: "فروش ویژه",
  bestseller: "پرفروش",
  new: "جدید",
  exclusive: "انحصاری",
};
