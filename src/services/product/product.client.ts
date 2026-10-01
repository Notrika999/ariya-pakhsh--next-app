"use client";
// src/services/product/product.client.ts
import { apiClient } from "@/src/lib/http/api-client";

<<<<<<< HEAD
export type ProductCompatibilityResult = {
  productId: string;
  vehicleId: string | null;
  isCompatible: boolean;
  isCompatibleWithAllVehicles: boolean;
};

type ProductCompatibilityResponse = {
  data?: ProductCompatibilityResult | null;
};

=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
export async function createProductView(slug: string): Promise<void> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) return;

  await apiClient.post(
    `/Products/${encodeURIComponent(normalizedSlug)}/views`,
  );
}

export async function getProductShare(slug: string): Promise<unknown> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    throw new Error("شناسه محصول نامعتبر است.");
  }

  const response = await apiClient.post(
    `/Products/${encodeURIComponent(normalizedSlug)}/share`,
  );

  return response.data;
}
<<<<<<< HEAD

export async function getProductCompatibility(
  slug: string,
  vehicleId: string,
): Promise<ProductCompatibilityResult | null> {
  const normalizedSlug = slug.trim();
  const normalizedVehicleId = vehicleId.trim();

  if (!normalizedSlug || !normalizedVehicleId) return null;

  const response = await apiClient.post<ProductCompatibilityResponse>(
    `/Products/${encodeURIComponent(normalizedSlug)}/compatibility`,
    { vehicleId: normalizedVehicleId },
  );

  return response.data?.data ?? null;
}
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
