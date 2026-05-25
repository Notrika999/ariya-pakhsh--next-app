"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type FakeProduct = {
  id: number;
  title: string;
  href: string;
  price?: string;
};

const FAKE_PRODUCTS: FakeProduct[] = [
  { id: 1, title: "گوشی موبایل سامسونگ Galaxy S24", href: "/product/1", price: "42,000,000" },
  { id: 2, title: "گوشی موبایل اپل iPhone 15 Pro", href: "/product/2", price: "79,000,000" },
  { id: 3, title: "هدفون بی‌سیم Sony WH-1000XM5", href: "/product/3", price: "18,500,000" },
  { id: 4, title: "لپ‌تاپ ASUS VivoBook 15", href: "/product/4", price: "28,000,000" },
  { id: 5, title: "ساعت هوشمند Apple Watch Series 9", href: "/product/5", price: "25,000,000" },
  { id: 6, title: "تلویزیون 55 اینچ LG OLED", href: "/product/6", price: "65,000,000" },
  { id: 7, title: "پاوربانک انکر 20000mAh", href: "/product/7", price: "2,300,000" },
  { id: 8, title: "کیبورد مکانیکی Redragon", href: "/product/8", price: "3,900,000" },
];

function normalizeFa(str: string) {
  return str
    .trim()
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ");
}

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // debounce ساده برای حس بهتر تایپ
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 150);
    return () => clearTimeout(t);
  }, [query]);

  const results = useMemo(() => {
    const q = normalizeFa(debounced);
    if (!q) return [];
    return FAKE_PRODUCTS.filter((p) => normalizeFa(p.title).includes(q)).slice(0, 8);
  }, [debounced]);

  useEffect(() => {
    // وقتی نتایج عوض میشن، اندیس انتخاب ریست شه
    setActiveIndex(results.length ? 0 : -1);
  }, [results.length]);

  // بستن با کلیک بیرون
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const showResults = open && query.trim().length > 0;

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showResults) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev + 1;
        return next >= results.length ? 0 : next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? results.length - 1 : next;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) {
        // اگر خواستی به جای Link، با router.push برو:
        // router.push(item.href)
        window.location.href = item.href;
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="lg:col-span-6 lg:block lg:order-2 order-4 hidden col-span-4 w-full">
      <div className="flex items-center w-full justify-between">
        <div className="flex w-full items-center">
          <div ref={rootRef} className="relative flex items-center w-full">
            <input
              ref={inputRef}
              type="text"
              className="w-full appearance-none rounded-xl border border-gray-300 dark:border-gray-700 py-3 ps-4 pe-10 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-custom-dark text-gray-900 dark:text-gray-100 transition-colors duration-300"
              placeholder="جستجوی محصولات ...."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showResults}
              aria-controls="searchResults"
              aria-activedescendant={
                activeIndex >= 0 ? `search-item-${results[activeIndex]?.id}` : undefined
              }
            />

            <button
              type="button"
              className="p-2 rounded-3xl absolute end-1 hover:opacity-90 transition-opacity"
              onClick={() => setOpen(true)}
              aria-label="جستجو"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>

            {/* Results */}
            {showResults && (
              <div
                id="searchResults"
                className="absolute top-[52px] end-0 start-0 z-10 bg-white dark:bg-custom-dark border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] overflow-hidden transition-colors duration-300"
              >
                {results.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    موردی یافت نشد
                  </div>
                ) : (
                  <ul role="listbox" className="max-h-80 overflow-auto">
                    {results.map((item, idx) => {
                      const active = idx === activeIndex;
                      return (
                        <li key={item.id} role="option" aria-selected={active}>
                          <Link
                            id={`search-item-${item.id}`}
                            href={item.href}
                            className={[
                              "flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors",
                              active
                                ? "bg-gray-100 dark:bg-gray-800"
                                : "hover:bg-gray-50 dark:hover:bg-gray-900",
                            ].join(" ")}
                            onMouseEnter={() => setActiveIndex(idx)}
                            onClick={() => setOpen(false)}
                          >
                            <span className="text-gray-800 dark:text-gray-100 line-clamp-1">
                              {item.title}
                            </span>
                            {item.price && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                {item.price} تومان
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
