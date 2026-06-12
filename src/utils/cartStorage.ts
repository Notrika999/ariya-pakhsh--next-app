// src/lib/utils/cartStorage.ts

import { CartItem } from "../lib/types/cart/cartTypes";


const CART_KEY = "cart_items";

export const cartStorage = {
  get(): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  },

  set(items: CartItem[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // storage full or unavailable — fail silently
    }
  },

  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CART_KEY);
  },
};