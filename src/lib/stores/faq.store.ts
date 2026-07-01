"use client";

import { create } from "zustand";
import { fetchFaqs } from "@/src/lib/api/faqApi";
import { Faq, FaqTab } from "../types/faqTypes";

interface FaqStore {
  tabs: FaqTab[];
  faqs: Faq[];
  loading: boolean;

  fetchAll: () => Promise<unknown>;
  filterByTab: (tabId: string) => Faq[];
}

export const useFaqStore = create<FaqStore>((set, get) => ({
  tabs: [],
  faqs: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });

    const res = await fetchFaqs();

    if ("error" in res) {
      set({ loading: false });
      return res;
    }

    set({
      tabs: res.tabs,
      faqs: res.faqs,
      loading: false,
    });

    return res;
  },

  // مثال: فیلتر کردن
  filterByTab: (tabId: string) => {
    const faqs = get().faqs;

    if (tabId === "all") return faqs;

    return faqs.filter((f: Faq) => f.category === tabId);
  },
}));
