import { create } from "zustand";
import { fetchProducts } from "@/lib/api/productApi";
import { Product, Brand } from "@/lib/types/productTypes";

interface ProductStore {
  products: Product[];
  brands: Brand[];
  loading: boolean;
  error: string | null;
  
  fetchAll: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  brands: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    const res = await fetchProducts();

    if ("error" in res) {
      set({ error: res.message, loading: false });
    } else {
      set({
        products: res.products,
        brands: res.brands,
        loading: false,
      });
    }
  },
}));
