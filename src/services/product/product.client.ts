"use client";

import { apiClient } from "@/src/lib/http/api-client";

export async function createProductView(slug: string): Promise<void> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) return;

  await apiClient.post(
    `/Products/${encodeURIComponent(normalizedSlug)}/views`,
  );
}
