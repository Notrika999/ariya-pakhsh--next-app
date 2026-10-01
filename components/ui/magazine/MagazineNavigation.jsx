"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getBlogHomeHref } from "@/components/ui/magazine/magazineHomeUtils";

export default function MagazineNavigation({ categories = [] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const activeCategory =
    pathname === "/mag" ? searchParams.get("category") || "all" : "";
  const items = [{ slug: "all", title: "همه مطالب" }, ...categories];

  return (
    <nav
      aria-label="دسته‌بندی مجله"
<<<<<<< HEAD
      className="border-b border-slate-200 bg-white dark:border-zinc-800 dark:bg-custom-dark"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex gap-1.5 overflow-x-auto overscroll-x-contain py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
=======
      className="border-b border-gray-200 bg-white dark:border-zinc-800 dark:bg-custom-dark"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto overscroll-x-contain py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
          {items.map((item) => {
            const isActive = item.slug === activeCategory;

            return (
              <Link
                key={item.slug}
                href={getBlogHomeHref({ category: item.slug, q: query })}
                aria-current={isActive ? "page" : undefined}
<<<<<<< HEAD
                className={`shrink-0 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? "bg-primary/10 font-semibold text-primary shadow-[inset_0_-2px_0_rgba(239,92,57,0.55)]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-gray-300 dark:hover:bg-zinc-800 dark:hover:text-white"
=======
                className={`shrink-0 rounded-md px-3 py-2 text-sm whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-zinc-800 dark:hover:text-white"
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
