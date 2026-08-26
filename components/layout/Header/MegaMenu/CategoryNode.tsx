import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Category } from "@/src/lib/types/categories/menuType";
import { getCategoryImage, getProductImage } from "@/src/utils/product-image";

function getMenuItemImage(category: Category) {
  if (category.svgIcon) {
    return getProductImage(category.svgIcon);
  }

  if (category.imageUrl) {
    return getProductImage(category.imageUrl);
  }

  return getCategoryImage(category.image);
}

function isSvgImage(src: string) {
  return src.split("?")[0].toLowerCase().endsWith(".svg");
}

const graySvgIconStyle = {
  filter:
    "brightness(0) saturate(100%) invert(46%) sepia(9%) saturate(395%) hue-rotate(176deg) brightness(91%) contrast(88%)",
};

function CategoryImage({
  category,
  sizeClassName,
}: {
  category: Category;
  sizeClassName: string;
}) {
  const imageSrc = getMenuItemImage(category);

  return (
    <span
      className={`relative shrink-0 overflow-hidden rounded-lg bg-white dark:bg-zinc-900 ${sizeClassName}`}
    >
      <Image
        src={imageSrc}
        alt={category.name}
        fill
        sizes="40px"
        className="object-contain p-1"
        unoptimized={isSvgImage(imageSrc)}
        style={isSvgImage(imageSrc) ? graySvgIconStyle : undefined}
      />
    </span>
  );
}

export default function CategoryNode({
  category,
  onNavigate,
}: {
  category: Category;
  onNavigate?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  // برای مسیر دهی یکپارچه
  const href = `/products/${category.slug}`;

  // اگر عمق 0 باشد -> دراپ‌دان
  if (category.depth === 0) {
    const toggleSubmenu = () => {
      if (hasChildren) setIsOpen((open) => !open);
    };

    return (
      <li className="list-none my-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-custom-dark p-2 ">
        {/* لینک جدا از دکمه باز و بسته کننده */}
        <div
          className={`flex items-center justify-between gap-2 ${hasChildren ? "cursor-pointer" : ""}`}
          onClick={toggleSubmenu}
        >
          <Link
            href={href}
            className="inline-flex min-w-0 items-center gap-2"
            onClick={(event) => {
              event.stopPropagation();
              onNavigate?.();
            }}
          >
            <CategoryImage category={category} sizeClassName="size-9" />
            <span className="min-w-0 truncate">{category.name}</span>
          </Link>

          {hasChildren && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleSubmenu();
              }}
              className="p-2 "
              aria-expanded={isOpen}
            >
              <i
                className={`fas fa-angle-down transition-transform ${isOpen ? "rotate-180" : ""}`}
              ></i>
            </button>
          )}
        </div>

        {isOpen && hasChildren && (
          <ul className="mt-2 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-2">
            {category.children?.map((child) => (
              <CategoryNode
                key={child.id}
                category={child}
                onNavigate={onNavigate}
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
      <div className="py-1 text-sm font-bold text-gray-700 dark:text-gray-300">
        <Link
          href={href}
          onClick={onNavigate}
          className="inline-flex min-w-0 items-center gap-2"
        >
          <CategoryImage category={category} sizeClassName="size-8" />
          <span className="min-w-0 truncate">{category.name}</span>
        </Link>
      </div>
      {hasChildren && (
        <ul className="space-y-1 mb-2">
          {category.children?.map((child) => (
            <li
              key={child.id}
              className="pr-4 text-sm text-gray-600 dark:text-gray-400"
            >
              <Link
                href={`/products/${child.slug}`}
                onClick={onNavigate}
                className="inline-flex min-w-0 items-center gap-2 py-1"
              >
                <CategoryImage category={child} sizeClassName="size-7" />
                <span className="min-w-0 truncate">{child.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
