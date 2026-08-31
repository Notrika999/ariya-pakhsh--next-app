"use client";

import type { MagazineAnalyticsEventType } from "@/src/lib/types/magazine/magazine.types";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isMagazineEntityId(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value.trim());
}

export function trackMagazineArticleEvent({
  articleId,
  eventType,
  productId,
}: {
  articleId: string;
  eventType: MagazineAnalyticsEventType;
  productId?: string;
}): void {
  const safeArticleId = articleId.trim();
  if (!isMagazineEntityId(safeArticleId)) return;

  const body: Record<string, string | number> = {
    eventType,
    occurredAt: new Date().toISOString(),
    revenue: 0,
  };

  if (productId && isMagazineEntityId(productId)) {
    body.productId = productId.trim();
  }

  const url = `/api/v1/magazine/articles/${encodeURIComponent(safeArticleId)}/events`;
  const payload = JSON.stringify(body);

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon(url, blob)) return;
    }
  } catch {
    // Fall through to fetch.
  }

  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: payload,
    credentials: "include",
    keepalive: true,
  }).catch(() => {
    // Analytics must not interrupt reading.
  });
}
