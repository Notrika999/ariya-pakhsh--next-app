import { notFound } from "next/navigation";
import {
  getProductById,
  ProductServiceError,
} from "@/src/services/product/product.server";
import type { ProductDetail } from "@/src/lib/types/products/productDetail.types";

export function getProductIdentifier(params: string[]) {
  const [publicCodeOrProductId = "", slug = ""] = params;
  return decodeURIComponent(slug || publicCodeOrProductId);
}

export async function loadProduct(
  productIdentifier: string,
): Promise<ProductDetail> {
  if (!productIdentifier.trim()) {
    notFound();
  }

  try {
    return await getProductById(productIdentifier);
  } catch (error) {
    if (error instanceof ProductServiceError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
