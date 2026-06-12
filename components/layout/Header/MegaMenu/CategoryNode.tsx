import Link from "next/link";
import { useState } from "react";

export default function CategoryNode({ category }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  // برای مسیر دهی یکپارچه
  const href = `/products/${category.slug}`;

  // اگر عمق 0 باشد -> دراپ‌دان
  if (category.depth === 0) {
    return (
      <li className="list-none my-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-custom-dark p-2 ">
        {/* لینک جدا از دکمه باز و بسته کننده */}
        <div className="flex justify-between">
          <Link
            href={href}
            className="flex-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {category.name}
          </Link>

          {hasChildren && (
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 ">
              <i
                className={`fas fa-angle-down transition-transform ${isOpen ? "rotate-180" : ""}`}
              ></i>
            </button>
          )}
        </div>

        {isOpen && hasChildren && (
          <ul className="mt-2 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-2">
            {category.children.map((child) => (
              <CategoryNode
                key={child.id}
                category={child}
                onClick={() => setIsOpen(!isOpen)}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  // اگر عمق 1 باشد -> تایتل (بدون دراپ‌دان) و نمایش فرزندان
  return (
    <li className="list-none">
      <div className="font-bold text-sm text-gray-700 dark:text-gray-300 py-1">
        <Link href={href}>{category.name}</Link>
      </div>
      {hasChildren && (
        <ul className="space-y-1 mb-2">
          {category.children.map((child) => (
            <li
              key={child.id}
              className="pr-4 text-sm text-gray-600 dark:text-gray-400"
            >
              <Link
                href={`/products/${child.slug}`}
                onClick={() => setIsOpen(!isOpen)}
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
