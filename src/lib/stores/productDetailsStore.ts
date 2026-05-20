import { create } from "zustand";
import { fetchProductById } from "@/src/lib/api/product/getProductById";
import { Product } from "@/src/lib/types/productTypes";

interface ProductDetailsState {
  product: Product | null;
  loading: boolean;
  error: string | null;
  getProduct: (id: string) => Promise<void>;
}

export const useProductDetailsStore = create<ProductDetailsState>((set) => ({
  product: null,
  loading: false,
  error: null,

  getProduct: async (id: string) => {
    set({ loading: true, error: null });

    const result = await fetchProductById(id);

    if ("error" in result) {
      set({
        error: result.message,
        loading: false,
      });
      return;
    }

    set({
      product: result,
      loading: false,
    });
  },
}));
