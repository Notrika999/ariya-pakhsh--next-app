import { useEffect } from "react";
import { useProductStore } from "@/lib/stores/product.store";

export const useProducts = () => {
  const { products, brands, loading, error, fetchAll } = useProductStore();

  useEffect(() => {
    // فقط اگر دیتا خالی بود فتچ کن (Cache ساده)
    if (products.length === 0) {
      fetchAll();
    }
  }, [fetchAll, products.length]);

  return { products, brands, loading, error };
};
