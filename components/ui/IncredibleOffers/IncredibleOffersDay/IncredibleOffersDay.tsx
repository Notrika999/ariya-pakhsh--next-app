"use client";
// components/ui/IncredibleOffers/IncredibleOffersDay/IncredibleOffersDay.tsx
import { useMemo } from "react";
import AmazingProducts from "@/components/ui/Home/AmazingProducts/AmazingProducts";
import { ProductCardModel } from "@/src/lib/types/productTypes";

interface IncredibleOffersDayProps {
  products: ProductCardModel[];
}

export default function IncredibleOffersDay({
  products,
}: IncredibleOffersDayProps) {
  const limitedProducts = useMemo(() => products.slice(0, 10), [products]);

  if (limitedProducts.length === 0) return null;

  return <AmazingProducts products={limitedProducts} noTimer={true} noFirstSlide={true} />;
}
