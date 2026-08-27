"use client";
// components/modules/BackToTopButton/BackToTopButton.tsx
import { useEffect, useState } from "react";

function CarIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="h-8 w-8"
      fill="currentColor"
      aria-hidden
    >
      <path d="M6.2 12.2c-.7 0-1.3.5-1.3 1.2v1.1c0 .4.3.7.7.7h1.1v-3H6.2Z" />
      <path d="M25.8 12.2c.7 0 1.3.5 1.3 1.2v1.1c0 .4-.3.7-.7.7h-1.1v-3h.5Z" />
      <path
        fillRule="evenodd"
        d="M10.2 6.2c.6-1.6 3-2.7 5.8-2.7s5.2 1.1 5.8 2.7l1.6 4.2c.1.2.2.5.2.8v11.2c0 2.8-2.7 5.1-7.6 5.1s-7.6-2.3-7.6-5.1V11.2c0-.3.1-.6.2-.8l1.6-4.2Zm2.3 2.4 1.1-2.4c.4-.8 1.7-1.4 3.4-1.4s3 .6 3.4 1.4l1.1 2.4H12.5Zm.3 3.2h6.4c.4 0 .7.3.7.7v2.1c0 .4-.3.7-.7.7h-6.4c-.4 0-.7-.3-.7-.7v-2.1c0-.4.3-.7.7-.7Z"
      />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 19V5m0 0-6 6m6-6 6 6"
      />
    </svg>
  );
}

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const getScrollY = () =>
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const onScroll = () => setVisible(getScrollY() > 500);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="بازگشت به بالا"
      className="
        group 
        fixed z-50
        bottom-16 left-5
        md:bottom-15 md:left-4
        h-11 w-11
        overflow-hidden rounded-full
        border border-gray-200 dark:border-gray-700
        bg-custom-light dark:bg-[#0d1117]
        text-gray-900 dark:text-gray-100
        shadow-lg
        active:scale-95
        transition
        cursor-pointer
      "
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-y-full">
        <CarIcon />
      </span>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
        <ArrowUpIcon />
      </span>
    </button>
  );
}
