export type Category = {
  id: string;
  categoryId?: string;
  parentId?: string;
  name: string;
  slug: string;
  depth: number;
  sortOrder: number;
  isFeatured: boolean;
  isRecommended: boolean;
  isLeaf: boolean;
  children: Category[];
  image?: string | {
    iconUrl?: string | null;
    thumbUrl?: string | null;
    cardUrl?: string | null;
    url?: string | null;
    path?: string | null;
  } | null;
  imageUrl?: string | null;
  src?: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
};

export type MegaMenu = {
  rootCategories: Category[];
};

export type MegaMenuResponse = {
  data: MegaMenu;
  success: boolean;
  message: string;
  timestamp: string;
};
