"use client";

import { useEffect, useMemo, useState } from "react";
import type { TicketCategoryDefinition } from "@/src/lib/types/tickets/ticket.types";
import { getTicketCategories } from "@/src/services/ticket/ticket.client";
import {
  fallbackTicketCategoryDefinitions,
  resolveTicketCategoryLabel,
  ticketCategoryRequiresOrder,
} from "@/src/lib/tickets/ticket-labels";

let cachedCategories: TicketCategoryDefinition[] | null = null;
let inflight: Promise<TicketCategoryDefinition[]> | null = null;

function loadTicketCategories() {
  if (cachedCategories) return Promise.resolve(cachedCategories);
  if (!inflight) {
    inflight = getTicketCategories()
      .then((items) => {
        if (items.length) cachedCategories = items;
        return items;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function useTicketCategories() {
  const [categories, setCategories] = useState<TicketCategoryDefinition[]>(
    () => cachedCategories ?? fallbackTicketCategoryDefinitions(),
  );
  const [loading, setLoading] = useState(!cachedCategories);

  useEffect(() => {
    let cancelled = false;

    void loadTicketCategories()
      .then((items) => {
        if (!cancelled && items.length) setCategories(items);
      })
      .catch(() => {
        if (!cancelled) setCategories(fallbackTicketCategoryDefinitions());
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const options = useMemo(
    () =>
      categories.map((item) => ({
        value: item.category,
        label: resolveTicketCategoryLabel(item.category, item.categoryLabel),
      })),
    [categories],
  );

  const getLabel = (category: string) => {
    const item = categories.find((entry) => entry.category === category);
    return resolveTicketCategoryLabel(category, item?.categoryLabel);
  };

  const requiresOrder = (category: string) => {
    const item = categories.find((entry) => entry.category === category);
    return ticketCategoryRequiresOrder(item, category);
  };

  return { categories, options, loading, getLabel, requiresOrder };
}
