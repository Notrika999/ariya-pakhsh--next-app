export interface WishlistProductStatus {
  productId: string;
  isInWishlist: boolean;
}

export interface WishlistItem {
  wishlistItemId: string;
  productId: string;
  name: string;
  slug: string;
  publicCode: string;
  priceWhenAdded: number;
  currentPrice: number;
  salePrice: number | null;
  isOnSale: boolean;
  currencyCode: string;
  inStock: boolean;
  isActive: boolean;
  thumbnailPath: string | null;
  mediumPath: string | null;
  addedAt: string;
  hasPriceDropped: boolean;
}

export interface WishlistPage {
  items: WishlistItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetMyWishlistParams {
  pageNumber?: number;
  pageSize?: number;
}
