"use client";
// components/layout/Header/MegaMenu/MenuClient.tsx
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MenuItem from "./MenuItem";
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

function getCategoryRawImage(category: Category | null) {
  const image = category?.image;

  if (!image) {
    return null;
  }

  if (typeof image === "string") {
    return image;
  }

  return (
    image.cardUrl ?? image.thumbUrl ?? image.iconUrl ?? image.url ?? image.path
  );
}

export default function MenuClient({ menu }: { menu: Category[] }) {

  const [megaOpen, setMegaOpen] = useState(false);
  const [activeMegaId, setActiveMegaId] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeCategory =
    menu.find((cat) => cat.id === activeMegaId) ?? menu[0] ?? null;
  const secondLevelItems =
    activeCategory?.children?.filter((category) => !category?.src) ?? [];
  const thumbItem = activeCategory?.children?.find((category) => category?.src);
  const rawBannerSrc =
    activeCategory?.imageUrl ||
    getCategoryRawImage(activeCategory) ||
    thumbItem?.src;
  const bannerSrc = rawBannerSrc ? getProductImage(rawBannerSrc) : null;

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleMegaEnter = () => {
    clearCloseTimer();
    setMegaOpen(true);
    if (menu[0]?.id) {
      setActiveMegaId(menu[0].id);
    }
  };

  const handleMegaLeave = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setMegaOpen(false);
      closeTimerRef.current = null;
    }, 180);
  };

  return (
    <li
      onMouseEnter={handleMegaEnter}
      onMouseLeave={handleMegaLeave}
    >
      <span className="flex items-center relative font-bold hover:text-primary transition cursor-default">
        <i className="fa-solid fa-bars me-1"></i>
        دسته بندی ها
        {/* <i className="fa-solid fa-chevron-down text-sm ms-2"></i> */}
      </span>

      {megaOpen && (
        <div
          onMouseEnter={clearCloseTimer}
          onMouseLeave={handleMegaLeave}
          className="bg-white rounded-2xl dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 container z-50 p-2 top-20 right-0 left-0 drop-shadow-sm dark:shadow-[0_2px_6px_rgba(0,0,0,0.4)] absolute mt-1 transition-colors duration-300"
        >
          <div className="grid grid-cols-[300px_minmax(0,1fr)_300px] gap-3 overflow-hidden">
            {/* right menu */}
            <div className="h-150 w-75 pb-1 rounded-2xl bg-gray-light dark:bg-zinc-900 overflow-y-auto ">
              <ul className="my-2 space-y-1">
                {menu.map((category) => (
                  <MenuItem
                    key={category.id}
                    id={category.id}
                    title={category.name}
                    slug={category.slug}
                    imageSrc={getMenuItemImage(category)}
                    activeMegaId={activeMegaId}
                    setActiveMegaId={setActiveMegaId}
                  />
                ))}
              </ul>
            </div>

            {/* middle menu */}
            <div className="pb-1 overflow-y-auto bg-white dark:bg-zinc-900">
              <ul className="m-3 grid grid-cols-1 xl:grid-cols-2 gap-3">
                {secondLevelItems.map((category) => {
                  const menuItemImage = getMenuItemImage(category);

                  return (
                    <li key={category.id}>
                      <Link
                        href={`/products/${category.slug}`}
                        className="flex min-h-16  items-center  gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition hover:border-primary hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:bg-zinc-900 dark:text-gray-100 dark:hover:bg-zinc-800"
                      >
                        <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-custom-light dark:bg-zinc-800">
                          <Image
                            src={menuItemImage}
                            alt={category.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1 rounded-xl"
                            unoptimized={isSvgImage(menuItemImage)}
                            style={
                              isSvgImage(menuItemImage)
                                ? graySvgIconStyle
                                : undefined
                            }
                          />
                        </span>
                        <span className="min-w-0 truncate font-medium">
                          {category.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* menu thumbnail banner، همیشه در ستون اول */}
            <div className="flex h-150 items-end overflow-hidden rounded-2xl bg-white p-3 dark:bg-zinc-900">
              {bannerSrc && (
                <div className="w-full">
                  <Image
                    width={300}
                    height={520}
                    src={bannerSrc}
                    alt={activeCategory?.name || "banner"}
                    className="max-h-full w-full rounded-2xl object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
