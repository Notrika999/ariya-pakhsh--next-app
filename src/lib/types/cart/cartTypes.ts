// src/lib/types/cartTypes.ts

export interface CartItem {
  id: string | number;
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