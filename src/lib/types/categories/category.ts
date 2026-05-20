export interface Category {
  id: number
  title: string
  slug: string
  description?: string
  image?: string
}

export interface CategoryImage {
  iconUrl: string;
  thumbUrl: string;
  cardUrl: string;
}

export interface PromotedCategory {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  productCount: number;
  isFeatured: boolean;
  isRecommended: boolean;
  isLeaf: boolean;
  image?: CategoryImage;
}
