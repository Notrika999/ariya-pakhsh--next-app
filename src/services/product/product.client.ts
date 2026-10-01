"use client";
// src/services/product/product.client.ts
import { apiClient } from "@/src/lib/http/api-client";

export type ProductCompatibilityResult = {
  productId: string;
  vehicleId: string | null;
  isCompatible: boolean;
  isCompatibleWithAllVehicles: boolean;
};

type ProductCompatibilityResponse = {
  data?: ProductCompatibilityResult | null;
};

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
