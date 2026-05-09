import React, { useState } from "react";
import MenuItem from "./MenuItem";
import MegaSubmenu from "./MegaSubmenu";

export default function Menu() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeMegaId, setActiveMegaId] = useState("1");

  const leftMenuItems = [
    { menuID: "1", title: "محصولات دیجیتال" },
    { menuID: "2", title: "اکسسوری" },
    { menuID: "3", title: "خانه و آشپز خانه" },
  ];

  // megaContent.js (یا داخل پرنت، هرجا مناسب)
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
          { label: "لپ‌تاپ‌های اداری", href: "#" },
        ],
      },
      {
        title: "دوربین دیجیتال",
        items: [
          { label: "دوربین عکاسی حرفه‌ای", href: "#" },
          { label: "دوربین‌های ورزشی", href: "#" },
        ],
      },
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
          { label: "لپ‌تاپ‌های اداری", href: "#" },
        ],
      },
      {
        title: "دوربین دیجیتال",
        items: [
          { label: "دوربین عکاسی حرفه‌ای", href: "#" },
          { label: "دوربین‌های ورزشی", href: "#" },
        ],
      },
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
          { label: "لپ‌تاپ‌های اداری", href: "#" },
        ],
      },
      {
        title: "دوربین دیجیتال",
        items: [
          { label: "دوربین عکاسی حرفه‌ای", href: "#" },
          { label: "دوربین‌های ورزشی", href: "#" },
        ],
      },
      {
        src: "images/banner/banner-1.webp",
      },
    ],
    2: [
      // ساختار زیرمنو برای منوی دوم
      { title: "لوازم صوتی", items: [{ label: "هدفون بی‌سیم", href: "#" }] },
      { title: "سخت‌افزار", items: [{ label: "کارت گرافیک", href: "#" }] },
      { title: "لوازم جانبی", items: [] },
      { src: "images/banner/banner-4.webp" },
    ],
    3: [
      // ساختار زیرمنو برای منوی سوم
      {
        title: "خانه و آشپزخانه",
        items: [{ label: "مایع شیشه‌ای", href: "#" }],
      },
      { title: "ورزشی", items: [] },
      { title: "DSLR", items: [] },
      { src: "images/banner/banner-3.webp" },
    ],
  };

  return (
    <li
      onMouseEnter={() => setMegaOpen(true)}
      onMouseLeave={() => setMegaOpen(false)}
      className="border-e-2 pe-3 border-e-gray-300"
    >
      <a
        href=""
        className="flex relative font-bold hover:text-primary transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6 me-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        فروشگاه
        <span className="absolute end-0 block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </span>
      </a>

      {megaOpen && (
        <div className="bg-white dark:bg-custom-dark dark:border dark:border-gray-700  container z-50  top-[95%] left-0 right-0 drop-shadow-sm dark:shadow-[0_2px_6px_rgba(0,0,0,0.4)] absolute mt-1 me-10 rounded-b-md transition-colors duration-300">
          <div className="grid grid-cols-12">
            {/* left menu */}
            <div className="col-span-2 h-[400px] overflow-y-scroll border-e border-gray-400">
              <ul className="my-2 space-y-1">
                {leftMenuItems.map((m) => (
                  <MenuItem
                    key={m.menuID}
                    menuID={m.menuID}
                    title={m.title}
                    activeMegaId={activeMegaId}
                    setActiveMegaId={setActiveMegaId}
                  />
                ))}
              </ul>
            </div>

            {/* right menu */}
            <div className="col-span-10 bg-white dark:bg-zinc-900">
              {activeMegaId && megaContent[activeMegaId] && (
                <MegaSubmenu sections={megaContent[activeMegaId]} />
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
