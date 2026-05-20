import { useFaqStore } from "@/src/lib/stores/faq.store";

export const useFaq = () => {
  const { tabs, faqs, loading, fetchAll, filterByTab } = useFaqStore();

  return {
    tabs,
    faqs,
    loading,
    fetchAll,
    filterByTab,
  };
};
