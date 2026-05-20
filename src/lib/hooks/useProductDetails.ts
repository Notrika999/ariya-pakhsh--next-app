"use client";

import { useEffect } from "react";
import { useProductDetailsStore } from "@/src/lib/stores/productDetailsStore";

export const useProductDetails = (id: string) => {
  const { product, loading, error, getProduct } = useProductDetailsStore();

  useEffect(() => {
    if (id) {
      getProduct(id);
    }
  }, [id]);

  return {
    product,
    loading,
    error,
  };
};
