"use client";

import { getIsAuthenticated } from "@/src/lib/stores/auth/auth.store";
import { apiClient } from "@/src/lib/http/api-client";

export async function createHomeLayoutItemView(itemId: string): Promise<void> {
  const normalizedItemId = String(itemId ?? "").trim();

  if (!normalizedItemId || !getIsAuthenticated()) return;

  await apiClient.post(
    `/Home/items/${encodeURIComponent(normalizedItemId)}/views`,
  );
}

export function trackHomeLayoutItemView(itemId: string): void {
  void createHomeLayoutItemView(itemId).catch((error) => {
    console.warn("[home-layout] item view tracking failed", {
      itemId,
      error,
    });
  });
}
