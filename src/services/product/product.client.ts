"use client";
// src/services/product/product.client.ts
import { apiClient } from "@/src/lib/http/api-client";

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
