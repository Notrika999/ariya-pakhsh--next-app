"use client";

import { useEffect, useRef, useState } from "react";
import HeaderTop from "./Top/HeaderTop";
import MegaMenu from "./MegaMenu/MegaMenu";

export default function HeaderClient() {
  const [showMega, setShowMega] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const threshold = 100;
    lastY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastY.current;

      if (Math.abs(diff) < threshold) return;

      if (diff > 0 && currentY > 80) {
        setShowMega(false); // scroll down
      } else if (diff < 0) {
        setShowMega(true); // scroll up
      }

      lastY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="py-3 bg-white dark:bg-custom-dark border-b border-gray-200 dark:border-gray-700 shadow-md dark:shadow-none sticky top-0 start-0 end-0 z-20">
      <div className="container mx-auto">
        <HeaderTop />

        {showMega && <MegaMenu />}
      </div>
    </header>
  );
}
