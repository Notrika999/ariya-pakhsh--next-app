// src/context/CartContext.tsx

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { CartItem, CartState } from "../lib/types/cart/cartTypes";
import { cartStorage } from "../utils/cartStorage";

// ─── Actions ──────────────────────────────────────────────────────────────────

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: { id: CartItem["id"] } }
  | { type: "UPDATE_QTY"; payload: { id: CartItem["id"]; quantity: number } }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: CartItem[] };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.payload };

    case "ADD_ITEM": {
      const exists = state.items.find((i) => i.id === action.payload.id);
      const items = exists
        ? state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [...state.items, { ...action.payload, quantity: 1 }];
      return { items };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter((i) => i.id !== action.payload.id),
      };

    case "UPDATE_QTY": {
      if (action.payload.quantity < 1) {
        return {
          items: state.items.filter((i) => i.id !== action.payload.id),
        };
      }
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i,
        ),
      };
    }

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: CartItem["id"]) => void;
  updateQty: (id: CartItem["id"], quantity: number) => void;
  clearCart: () => void;
  /** Call this right after a successful login to sync guest cart to backend */
  syncAfterLogin: (apiEndpoint: string, authToken: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Hydrate from localStorage on mount (SSR-safe)
  useEffect(() => {
    const saved = cartStorage.get();
    if (saved.length > 0) {
      dispatch({ type: "HYDRATE", payload: saved });
    }
  }, []);

  // Persist every change to localStorage silently
  useEffect(() => {
    cartStorage.set(state.items);
  }, [state.items]);

  const addItem = useCallback((product: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  }, []);

  const removeItem = useCallback((id: CartItem["id"]) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  }, []);

  const updateQty = useCallback((id: CartItem["id"], quantity: number) => {
    dispatch({ type: "UPDATE_QTY", payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
    cartStorage.clear();
  }, []);

  /**
   * Called once after successful authentication.
   * Sends the guest cart to the backend, then clears local storage.
   * All errors are caught silently so login flow is never interrupted.
   */
  const syncAfterLogin = useCallback(
    async (apiEndpoint: string, authToken: string) => {
      const guestItems = cartStorage.get();
      if (guestItems.length === 0) return;

      try {
        const res = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ items: guestItems }),
        });

        if (res.ok) {
          // Backend merged the cart — wipe local storage
          cartStorage.clear();
          dispatch({ type: "CLEAR" });
        }
        // If the request fails, local cart stays intact for the next attempt
      } catch {
        // Network error — cart stays in localStorage, will be retried next login
      }
    },
    [],
  );

  const totalItems = state.items.length;
  // const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        syncAfterLogin,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
