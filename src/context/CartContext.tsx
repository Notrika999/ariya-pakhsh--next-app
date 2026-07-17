// src/context/CartContext.tsx

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  AddCartProductInput,
  CartItem,
  CartState,
} from "../lib/types/cart/cartTypes";
import { cartStorage } from "../utils/cartStorage";
import { guestSession } from "../utils/guestSession";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";
import {
  addCartItem,
  CART_MERGE_STRATEGY,
  clearCartApi,
  getCart,
  mapCartDtoToItems,
  mergeCart,
  removeCartItem,
  updateCartItem,
} from "@/src/services/cart/cart.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { notify } from "@/src/utils/toast";

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: CartItem["id"] } }
  | { type: "UPDATE_QTY"; payload: { id: CartItem["id"]; quantity: number } }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: CartItem[] };

function normalizeId(item: Pick<CartItem, "id" | "variantId">): string {
  return String(item.variantId ?? item.id);
}

function mergeLocalCartItems(...sources: CartItem[][]): CartItem[] {
  const map = new Map<string, CartItem>();

  for (const source of sources) {
    for (const item of source) {
      const id = normalizeId(item);
      if (!id) continue;
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const existing = map.get(id);
      if (!existing) {
        map.set(id, { ...item, id, variantId: id, quantity });
        continue;
      }
      map.set(id, {
        ...existing,
        ...item,
        id,
        variantId: id,
        quantity: Math.max(existing.quantity, quantity),
      });
    }
  }

  return Array.from(map.values());
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.payload };

    case "ADD_ITEM": {
      const id = normalizeId(action.payload);
      const addQty = Math.max(1, Number(action.payload.quantity) || 1);
      const exists = state.items.find((i) => normalizeId(i) === id);
      const items = exists
        ? state.items.map((i) =>
            normalizeId(i) === id
              ? { ...i, ...action.payload, id, quantity: i.quantity + addQty }
              : i,
          )
        : [
            ...state.items,
            {
              ...action.payload,
              id,
              variantId: id,
              quantity: addQty,
            },
          ];
      return { items };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (i) => normalizeId(i) !== String(action.payload.id),
        ),
      };

    case "UPDATE_QTY": {
      if (action.payload.quantity < 1) {
        return {
          items: state.items.filter(
            (i) => normalizeId(i) !== String(action.payload.id),
          ),
        };
      }
      return {
        items: state.items.map((i) =>
          normalizeId(i) === String(action.payload.id)
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

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  syncing: boolean;
  addItem: (product: AddCartProductInput) => Promise<void>;
  removeItem: (id: CartItem["id"]) => Promise<void>;
  updateQty: (id: CartItem["id"], quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const hydratedLocalRef = useRef(false);
  const prevAuthRef = useRef<boolean | null>(null);
  const mergeInFlightRef = useRef(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAuthBootstrapping = useAuthStore((s) => s.isAuthBootstrapping);

  const hydrateFromApi = useCallback(async () => {
    const cart = await getCart();
    const items = mapCartDtoToItems(cart);
    dispatch({ type: "HYDRATE", payload: items });
    cartStorage.clear();
    return items;
  }, []);

  /**
   * همسان‌سازی بدون دوبرابر شدن:
   * فقط آیتم‌های غایب را اضافه می‌کند و اگر تعداد محلی بیشتر بود، quantity را با PUT تنظیم می‌کند.
   * هرگز برای کالای موجود دوباره POST /cart/items نمی‌زند.
   */
  const reconcileLocalToServer = useCallback(async (localItems: CartItem[]) => {
    if (localItems.length === 0) return;

    let serverByVariant: Map<string, { quantity: number }>;
    try {
      const serverCart = await getCart();
      serverByVariant = new Map(
        serverCart.items.map((item) => [
          item.variantId,
          { quantity: item.quantity },
        ]),
      );
    } catch (error) {
      console.error("[Cart] reconcile: getCart failed =>", error);
      return;
    }

    for (const item of localItems) {
      const variantId = normalizeId(item);
      if (!variantId) continue;
      const localQty = Math.max(1, Number(item.quantity) || 1);
      const serverItem = serverByVariant.get(variantId);

      try {
        if (!serverItem) {
          await addCartItem({ variantId, quantity: localQty });
        } else if (localQty > serverItem.quantity) {
          await updateCartItem(variantId, { quantity: localQty });
        }
      } catch (error) {
        console.error("[Cart] reconcile item failed =>", variantId, error);
      }
    }
  }, []);

  const mergeGuestCart = useCallback(async () => {
    if (mergeInFlightRef.current) return;
    mergeInFlightRef.current = true;
    setSyncing(true);

    try {
      const localItems = mergeLocalCartItems(state.items, cartStorage.get());
      cartStorage.set(localItems);

      const guestSessionId = guestSession.peek() || guestSession.get();

      console.log("[Cart] merge start =>", {
        guestSessionId,
        localCount: localItems.length,
        strategy: CART_MERGE_STRATEGY,
      });

      try {
        await mergeCart({
          guestSessionId,
          strategy: CART_MERGE_STRATEGY,
        });
      } catch (error) {
        console.error("[Cart] merge endpoint failed =>", error);
      }

      // فقط همسان‌سازی؛ بدون re-add همه آیتم‌ها
      await reconcileLocalToServer(localItems);
      await hydrateFromApi();
      cartStorage.clear();
      guestSession.rotate();
    } catch (error) {
      console.error("[Cart] mergeGuestCart failed =>", error);
      notify.error(getAuthErrorMessage(error));
    } finally {
      setSyncing(false);
      mergeInFlightRef.current = false;
    }
  }, [hydrateFromApi, reconcileLocalToServer, state.items]);

  // Initial local hydrate (guest / before auth resolves)
  useEffect(() => {
    if (hydratedLocalRef.current) return;
    hydratedLocalRef.current = true;
    const saved = cartStorage.get();
    if (saved.length > 0) {
      dispatch({ type: "HYDRATE", payload: saved });
    }
    // Ensure guest session exists for later merge
    guestSession.get();
    setLoading(false);
  }, []);

  // Persist local cart only while guest
  useEffect(() => {
    if (isAuthenticated) return;
    cartStorage.set(state.items);
  }, [state.items, isAuthenticated]);

  // Auth transitions: login merge / session restore / logout
  useEffect(() => {
    if (isAuthBootstrapping) return;

    const timer = window.setTimeout(() => {
      void (async () => {
        const prev = prevAuthRef.current;

        if (isAuthenticated) {
          if (prev === false) {
            // Just logged in — merge whatever HeaderCart / guest had
            await mergeGuestCart();
          } else if (prev === null) {
            // Session restore on refresh
            setLoading(true);
            try {
              await hydrateFromApi();
            } catch (error) {
              console.error("[Cart] hydrate on restore failed =>", error);
            } finally {
              setLoading(false);
            }
          }
        } else if (prev === true) {
          // Logged out — show local guest cart (usually empty after merge)
          const saved = cartStorage.get();
          dispatch({ type: "HYDRATE", payload: saved });
        }

        prevAuthRef.current = isAuthenticated;
      })();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [
    isAuthenticated,
    isAuthBootstrapping,
    mergeGuestCart,
    hydrateFromApi,
  ]);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: "HYDRATE", payload: cartStorage.get() });
      return;
    }
    setLoading(true);
    try {
      await hydrateFromApi();
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [hydrateFromApi, isAuthenticated]);

  const addItem = useCallback(
    async (product: AddCartProductInput) => {
      const variantId = String(product.variantId ?? product.id ?? "").trim();
      if (!variantId) {
        notify.error("شناسه تنوع محصول برای افزودن به سبد موجود نیست");
        return;
      }

      const quantity = Math.max(1, Number(product.quantity) || 1);
      const localPayload: CartItem = {
        ...product,
        id: variantId,
        variantId,
        quantity,
      };

      if (!isAuthenticated) {
        const existing = state.items.find((i) => normalizeId(i) === variantId);
        dispatch({ type: "ADD_ITEM", payload: localPayload });
        // Sync guest cart to backend so /cart/merge can find it on login
        try {
          if (existing) {
            await updateCartItem(variantId, {
              quantity: existing.quantity + quantity,
            });
          } else {
            await addCartItem({ variantId, quantity });
          }
        } catch (error) {
          console.warn("[Cart] guest add sync failed (kept local) =>", error);
        }
        notify.success("به سبد خرید اضافه شد");
        return;
      }

      try {
        const existing = state.items.find((i) => normalizeId(i) === variantId);
        if (existing) {
          const cart = await updateCartItem(variantId, {
            quantity: existing.quantity + quantity,
          });
          dispatch({ type: "HYDRATE", payload: mapCartDtoToItems(cart) });
        } else {
          const cart = await addCartItem({ variantId, quantity });
          dispatch({ type: "HYDRATE", payload: mapCartDtoToItems(cart) });
        }
        notify.success("به سبد خرید اضافه شد");
      } catch (error) {
        console.error("[Cart] addItem failed =>", error);
        notify.error(getAuthErrorMessage(error));
      }
    },
    [isAuthenticated, state.items],
  );

  const removeItem = useCallback(
    async (id: CartItem["id"]) => {
      const variantId = String(id);

      if (!isAuthenticated) {
        dispatch({ type: "REMOVE_ITEM", payload: { id: variantId } });
        try {
          await removeCartItem(variantId);
        } catch (error) {
          console.warn("[Cart] guest remove sync failed =>", error);
        }
        return;
      }

      try {
        const cart = await removeCartItem(variantId);
        if (cart) {
          dispatch({ type: "HYDRATE", payload: mapCartDtoToItems(cart) });
        } else {
          await hydrateFromApi();
        }
      } catch (error) {
        console.error("[Cart] removeItem failed =>", error);
        notify.error(getAuthErrorMessage(error));
      }
    },
    [hydrateFromApi, isAuthenticated],
  );

  const updateQty = useCallback(
    async (id: CartItem["id"], quantity: number) => {
      const variantId = String(id);

      if (!isAuthenticated) {
        dispatch({ type: "UPDATE_QTY", payload: { id: variantId, quantity } });
        try {
          if (quantity < 1) {
            await removeCartItem(variantId);
          } else {
            await updateCartItem(variantId, { quantity });
          }
        } catch (error) {
          console.warn("[Cart] guest qty sync failed =>", error);
        }
        return;
      }

      try {
        if (quantity < 1) {
          await removeItem(variantId);
          return;
        }
        const cart = await updateCartItem(variantId, { quantity });
        dispatch({ type: "HYDRATE", payload: mapCartDtoToItems(cart) });
      } catch (error) {
        console.error("[Cart] updateQty failed =>", error);
        notify.error(getAuthErrorMessage(error));
      }
    },
    [isAuthenticated, removeItem],
  );

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: "CLEAR" });
      cartStorage.clear();
      try {
        await clearCartApi();
      } catch (error) {
        console.warn("[Cart] guest clear sync failed =>", error);
      }
      return;
    }

    try {
      await clearCartApi();
      dispatch({ type: "CLEAR" });
      cartStorage.clear();
    } catch (error) {
      console.error("[Cart] clearCart failed =>", error);
      notify.error(getAuthErrorMessage(error));
    }
  }, [isAuthenticated]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
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
        loading,
        syncing,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
