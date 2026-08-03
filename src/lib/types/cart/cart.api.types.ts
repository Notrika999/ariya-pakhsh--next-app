// src/lib/types/cart/cart.api.types.ts

export type CartApiItem = {
  id: string;
  variantId: string;
  productId: string;
  productTitle: string;
  variantTitle: string;
  imageUrl: string | null;
  quantity: number;
  unitPriceSnapshot: number;
  campaignPriceSnapshot: number | null;
  unitPrice?: number;
  campaignPrice?: number | null;
  lineTotal: number;
  addedAt: string;
  updatedAt: string;
};

export type CartDto = {
  id: string;
  customerId: string | null;
  sessionId: string | null;
  isConverted: boolean;
  expiresAt: string | null;
  itemCount: number;
  totalQuantity: number;
  subtotalAmount: number;
  items: CartApiItem[];
};

export type AddCartItemPayload = {
  variantId: string;
  quantity: number;
};

export type UpdateCartItemPayload = {
  quantity: number;
};

export type MergeCartPayload = {
  guestSessionId: string;
  strategy: string;
};

export type CartApiEnvelope<T> = {
  success?: boolean;
  isSuccess?: boolean;
  message?: string;
  code?: string;
  data?: T;
};
