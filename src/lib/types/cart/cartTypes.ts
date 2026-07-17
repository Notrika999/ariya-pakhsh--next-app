// src/lib/types/cart/cartTypes.ts

export interface CartItem {
  /** Always the variantId used by cart APIs */
  id: string;
  variantId?: string;
  productId?: string;
  title: string;
  image: string;
  price: number;
  oldPrice?: number;
  href: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export type AddCartProductInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};
