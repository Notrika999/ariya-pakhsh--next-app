"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];

  addItem: (item: CartItem) => void;

  removeItem: (id: number) => void;

  increase: (id: number) => void;

  decrease: (id: number) => void;

  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;

        const existing = items.find((i) => i.id === item.id);

        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            items: [...items, item],
          });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((i) => i.id !== id),
        });
      },

      increase: (id) => {
        set({
          items: get().items.map((i) =>
            i.id === id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        });
      },

      decrease: (id) => {
        set({
          items: get()
            .items.map((i) =>
              i.id === id
                ? { ...i, quantity: i.quantity - 1 }
                : i
            )
            .filter((i) => i.quantity > 0),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",

      storage: createJSONStorage(() => localStorage),
    }
  )
);
