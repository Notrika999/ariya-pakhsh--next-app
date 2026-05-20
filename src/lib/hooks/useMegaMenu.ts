import { useMegaMenuStore } from "@/src/lib/stores/megaMenu.store";

export const useMegaMenu = () => {
  const { leftMenuItems, megaContent, loading, fetchAll } = useMegaMenuStore();

  return {
    leftMenuItems,
    megaContent,
    loading,
    fetchAll,
  };
};
