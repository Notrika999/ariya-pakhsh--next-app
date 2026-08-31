"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getBlogHomeHref } from "@/components/ui/Blog/blogHomeUtils";

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
      className="border-b border-gray-200 bg-white dark:border-zinc-800 dark:bg-custom-dark"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto overscroll-x-contain py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const isActive = item.slug === activeCategory;

            return (
              <Link
                key={item.slug}
                href={getBlogHomeHref({ category: item.slug, q: query })}
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 rounded-md px-3 py-2 text-sm whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-zinc-800 dark:hover:text-white"
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
