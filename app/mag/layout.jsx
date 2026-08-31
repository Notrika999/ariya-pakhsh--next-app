import { Suspense } from "react";
import MagazineHeader from "@/components/ui/magazine/MagazineHeader";
import MagazineNavigation from "@/components/ui/magazine/MagazineNavigation";
import MagazineFooter from "@/components/ui/magazine/MagazineFooter";
import { composeMagazineCategories } from "@/components/ui/magazine/magazineView";
import { getMagazineHome } from "@/src/services/magazine/magazine.server";
import { BackToTopButton } from "@/components/modules/BackToTopButton/BackToTopButton";

export default async function MagazineLayout({ children }) {
  const home = await getMagazineHome();
  const categories = composeMagazineCategories(home.categories);

  return (
    <div className="flex min-h-dvh flex-col bg-[#f7f8fa] dark:bg-[#0d1117]">
      <MagazineHeader />
      <Suspense
        fallback={
          <div className="h-12 border-b border-gray-200 bg-white dark:border-zinc-800 dark:bg-custom-dark" />
        }
      >
        <MagazineNavigation categories={categories} />
      </Suspense>
      <div className="flex-1">{children}</div>
      <MagazineFooter categories={categories} />
      <BackToTopButton />
    </div>
  );
}
