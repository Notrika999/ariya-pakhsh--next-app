// components/modules/Breadcrumb/Breadcrumb.tsx

import React from "react";
import Link from "next/link";
import { CategoryBreadcrumbItem } from "@/src/lib/types/categories/breadcrumb";

type BreadcrumbItem = CategoryBreadcrumbItem & { link?: string };

const HOME_BREADCRUMB_LABEL = "کارآپ 24";

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="w-full " aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center text-xs font-regular text-gray-700 dark:text-gray-400">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          const itemName =
            item.depth === -1 || item.id === "home"
              ? HOME_BREADCRUMB_LABEL
              : item.name;

          return (
            <li key={item.id}>
              {isLastItem ? (
                <span
                  className="block whitespace-nowrap text-xs font-regular leading-4  xl:leading-6.5"
                  aria-current="page"
                >
                  {itemName}
                </span>
              ) : item.depth > -1 ? (
                <Link
                  className="whitespace-nowrap text-xs font-regular leading-4  xl:leading-6.5"
                  href={`/products/${item.slug}`}
                >
                  {itemName}
                </Link>
              ) : item.depth === -1 ? (
                <Link
                  className="whitespace-nowrap text-xs font-regular leading-4  xl:leading-6.5"
                  href={"/"}
                >
                  {itemName}
                </Link>
              ) : (
                <span className="hover:text-primary transition-colors">
                  {itemName}
                </span>
              )}

              {index < items.length - 1 && (
                <i className="fas fa-angle-left text-gray-400"></i>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
