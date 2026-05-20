import { ProductResponse } from "@/src/lib/types/productTypes";

export async function getProducts(): Promise<ProductResponse> {
  const res = await fetch("http://localhost:3000/mocks/products.json", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("خطا در دریافت محصولات");
  }

  return res.json();
}
