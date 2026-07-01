"use client";
// components/layout/Header/MegaMenu/MenuClient.tsx
import React, { useState } from "react";
import MenuItem from "./MenuItem";
import MegaSubmenu from "./MegaSubmenu";
import { Category } from "@/src/lib/types/categories/menuType";

export default function MenuClient({ menu }: { menu: Category[] }) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeMegaId, setActiveMegaId] = useState<string | null>(null);

  const activeCategory =
    menu.find((cat) => cat.id === activeMegaId) ?? menu[0] ?? null;

  const handleMegaEnter = () => {
    setMegaOpen(true);
    if (menu[0]?.id) {
      setActiveMegaId(menu[0].id);
    }
  };

  return (
    <li
      onMouseEnter={handleMegaEnter}
      onMouseLeave={() => setMegaOpen(false)}
      className="border-e-2 pe-3 border-e-gray-300"
    >
      <span className="flex items-center relative font-bold hover:text-primary transition cursor-default">
        <i className="fa-solid fa-bars me-1"></i>
        فروشگاه
        <i className="fa-solid fa-chevron-down text-sm ms-2"></i>
      </span>

      {megaOpen && (
        <div className="bg-white dark:bg-custom-dark dark:border dark:border-gray-700 container z-50 top-[95%] left-0 right-0 drop-shadow-sm dark:shadow-[0_2px_6px_rgba(0,0,0,0.4)] absolute mt-1 me-10 rounded-b-md transition-colors duration-300">
          <div className="grid grid-cols-12">
            {/* left menu */}
            <div className="col-span-2 h-100 overflow-y-scroll border-e border-gray-400">
              <ul className="my-2 space-y-1">
                {menu.map((category) => (
                  <MenuItem
                    key={category.id}
                    id={category.id}
                    title={category.name}
                    slug={category.slug}
                    activeMegaId={activeMegaId}
                    setActiveMegaId={setActiveMegaId}
                  />
                ))}
              </ul>
            </div>

            {/* right menu */}
            <div className="col-span-10 bg-white dark:bg-zinc-900">
              {activeCategory && (
                <MegaSubmenu sections={activeCategory.children} />
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
