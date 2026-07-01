"use client";

import { create } from "zustand";
import { fetchMegaMenu } from "@/src/lib/api/megaMenuApi";

interface MegaMenuStore {
  leftMenuItems: unknown[];
  megaContent: Record<string, unknown>;
  loading: boolean;
  fetchAll: () => Promise<unknown>;
}

export const useMegaMenuStore = create<MegaMenuStore>((set) => ({
  leftMenuItems: [],
  megaContent: {},
  loading: false,

  fetchAll: async () => {
    set({ loading: true });

    const res = await fetchMegaMenu();

    if ("error" in res) {
      set({ loading: false });
      return res;
    }

    set({
      leftMenuItems: res.leftMenuItems,
      megaContent: res.megaContent,
      loading: false,
    });

    return res;
  },
}));
