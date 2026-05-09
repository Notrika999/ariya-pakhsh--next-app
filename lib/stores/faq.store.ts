"use client";

import { create } from "zustand";
import { fetchFaqs } from "@/lib/api/faqApi";

export const useFaqStore = create((set, get) => ({
  tabs: [],
  faqs: [],
  loading: false,
  
  fetchAll: async () => {
    set({ loading: true });

    const res = await fetchFaqs();

    if (res.error) {
      set({ loading: false });
      return res;
    }

    set({
      tabs: res.tabs,
      faqs: res.faqs,
      loading: false
    });

    return res;
  },

  // مثال: فیلتر کردن
  filterByTab: (tabId) => {
    const faqs = get().faqs;
    if (!tabId) return faqs;
    return faqs.filter(f => f.category === tabId);
  }
}));
