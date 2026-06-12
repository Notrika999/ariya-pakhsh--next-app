export type Category = {
  id: string;
  parentId?: string;
  name: string;
  slug: string;
  depth: number;
  sortOrder: number;
  isFeatured: boolean;
  isRecommended: boolean;
  isLeaf: boolean;
  children: Category[];
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
