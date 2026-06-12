import Link from "next/link";
import React from "react";

export default function Breadcrumb({ items }) {
  return (
    <nav className="w-full py-3" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center text-sm font-medium text-gray-700 dark:text-gray-400">
        {items.map((item, index) => (
          <li key={item.id}>
            {item.link ? (
              <Link href={item.link}>{item.name}</Link>
            ) : item.depth === -1 ? (
              <Link href={"/"}>{item.name}</Link>
            ) : (
              <span className="hover:text-primary transition-colors">
                {item.name}
              </span>
            )}

            {index < items.length - 1 && (
              <i className="fas fa-angle-left text-gray-400"></i>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
