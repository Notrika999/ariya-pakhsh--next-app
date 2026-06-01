"use client";

import { useEffect, useState } from "react";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="بازگشت به بالا"
      className="
        fixed z-50
        bottom-7 right-6
        md:bottom-11 md:right-8
        rounded-full
        bg-gray-900 text-white
        w-11 h-11
        shadow-lg
        hover:bg-gray-800
        active:scale-95
        transition
      "
    >
      ↑
    </button>
  );
}
