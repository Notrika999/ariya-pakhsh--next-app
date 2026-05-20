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
