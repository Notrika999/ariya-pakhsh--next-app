import { useMegaMenuStore } from "@/lib/stores/megaMenu.store";

export const useMegaMenu = () => {
  const { leftMenuItems, megaContent, loading, fetchAll } =
    useMegaMenuStore();

  return {
    leftMenuItems,
    megaContent,
    loading,
    fetchAll,
  };
};
