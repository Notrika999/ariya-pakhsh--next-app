// component/layout/Header/MegaMenu/MenuItem.tsx

import Link from "next/link";
import Image from "next/image";
import React from "react";

const graySvgIconStyle = {
  filter:
    "brightness(0) saturate(100%) invert(46%) sepia(9%) saturate(395%) hue-rotate(176deg) brightness(91%) contrast(88%)",
};

type Props = {
  id: string;
  title: string;
  slug: string;
  imageSrc: string;
  activeMegaId: string | null;
  setActiveMegaId: (id: string) => void;
};
export default function MenuItem({
  id,
  title,
  slug,
  imageSrc,
  activeMegaId,
  setActiveMegaId,
}: Props) {
  const isActive = activeMegaId === id;
  const isSvgImage = imageSrc.split("?")[0].toLowerCase().endsWith(".svg");

  return (
    <li
      onMouseEnter={() => setActiveMegaId(id)}
      className={`px-3 py-2 cursor-pointer ${
        isActive ? "bg-gray-100 dark:bg-zinc-800" : ""
      }`}
    >
      <Link
        href={`/products/${slug}`}
        className="flex items-center justify-between py-2"
      >
        <div className="flex items-center">
          <span className="relative size-5 shrink-0 overflow-hidden  ">
            <Image
              src={imageSrc}
              alt={title}
              fill
              sizes="28px"
              className="object-contain p-0.5 "
              unoptimized={isSvgImage}
              style={isSvgImage ? graySvgIconStyle : undefined}
            />
          </span>
          <div className="ms-1">
            <p
              className={` text-gray-900 dark:text-gray-100  ${isActive && "text-primary font-semibold"}`}
            >
              {title}
            </p>
          </div>
        </div>
        <i className="fa-solid fa-chevron-left text-sm ms-2 text-gray-500"></i>
      </Link>
    </li>
  );
}
