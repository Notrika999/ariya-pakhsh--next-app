import React, { useEffect, useState } from "react";
import HeaderLogo from "./HeaderLogo";
import HeaderSearch from "./HeaderSearch";
import HeaderSetting from "./HeaderSetting";
import OffcanvasRight from "../MegaMenu/OffcanvasRight";
import Link from "next/link";

const leftMenuItems = [
  { menuID: "1", title: "محصولات دیجیتال" },
  { menuID: "2", title: "اکسسوری" },
  { menuID: "3", title: "خانه و آشپز خانه" },
];

const megaContent = {
  1: [
    {
      title: "گوشی موبایل",
      items: [
        { label: "گوشی موبایل هوشمند", href: "#" },
        { label: "گوشی‌های اقتصادی", href: "#" },
      ],
    },
    {
      title: "لپ‌تاپ",
      items: [
        { label: "لپ‌تاپ‌های گیمینگ", href: "#" },
        { label: "لپ‌ تاپ‌های اداری", href: "#" },
      ],
    },
    {
      title: "دوربین دیجیتال",
      items: [
        { label: "دوربین عکاسی حرفه‌ای", href: "#" },
        { label: "دوربین‌های ورزشی", href: "#" },
      ],
    },
  ],
  2: [
    { title: "لوازم صوتی", items: [{ label: "هدفون بی‌سیم", href: "#" }] },
    { title: "سخت‌افزار", items: [{ label: "کارت گرافیک", href: "#" }] },
    { title: "لوازم جانبی", items: [] },
  ],
  3: [
    { title: "خانه و آشپزخانه", items: [{ label: "مایع شیشه‌ای", href: "#" }] },
    { title: "ورزشی", items: [] },
  ],
};

export default function HeaderTop() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="grid place-items-center gap-3 grid-cols-12">
      {/* respnsive menu  */}

      <div className="lg:hidden col-span-4 w-full">
        <button onClick={() => setIsOpen(true)} className="px-4 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 dark:text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
            />
          </svg>
        </button>
        <OffcanvasRight
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          leftMenuItems={leftMenuItems}
          megaContent={megaContent}
        />
      </div>

      {/* <div className="lg:hidden col-span-4 w-full">
        <a
          to="javascript:void(0)"
          onClick="toggleOffcanvas('offcanvas-right')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 dark:text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
            />
          </svg>
        </a>
      </div> */}

      {/* logo  */}
      <HeaderLogo />

      {/* search and filter  */}
      <HeaderSearch />

      {/* login and basket and favorite and dark mode  */}
      <HeaderSetting />
    </div>
  );
}
