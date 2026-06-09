import Link from "next/link";
import React from "react";

type Props = {
  id: string;
  title: string;
  slug: string;
  activeMegaId: string | null;
  setActiveMegaId: (id: string) => void;
};
export default function MenuItem({
  id,
  title,
  slug,
  activeMegaId,
  setActiveMegaId,
}: Props) {
  const isActive = activeMegaId === id;

  return (
    <li
      onMouseEnter={() => setActiveMegaId(id)}
      className={`px-3 py-2 cursor-pointer ${
        isActive ? "bg-gray-100 dark:bg-zinc-800" : ""
      }`}
    >
      <Link
        href={`/products/${slug}`}
        className="flex items-center justify-between py-3"
      >
        <div className="flex items-center">
          <i className="fas fa-home text-gray-500"></i>
          <div className="ms-1">
            <p className="text-xs">{title}</p>
          </div>
        </div>
        <i className="fa-solid fa-chevron-left  text-sm ms-2 text-gray-500"></i>
      </Link>
    </li>
  );
}
