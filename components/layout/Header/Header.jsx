"use client";
import React, { useEffect, useRef, useState } from "react";
import HeaderTop from "./Top/HeaderTop";
import MegaMenu from "./MegaMenu/MegaMenu";

export default function Header() {
  const [showMega, setShowMega] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollY(window.scrollY);

      if (currentY > 50 && currentY > lastY.current) {
        setShowMega(false); // اسکرول بیشتر از ۲۰ → مخفی
      } else if (currentY < lastY.current) {
        setShowMega(true); // برگشت به بالای صفحه → نمایش
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);
  return (
    <>
      {/* HEADER  */}
      <header className="py-3 bg-white dark:bg-custom-dark border-b border-gray-200 dark:border-gray-700 shadow-md dark:shadow-none sticky top-0 start-0 end-0 z-20 transition-colors duration-300">
        <div className="container mx-auto">
          {/* row top header  */}
          <HeaderTop />

          {/* mega menu  */}
          <div className={` ${showMega ? "block" : "hidden"}`}>
            <MegaMenu />
          </div>
        </div>
      </header>
      {/* END HEADER  */}
    </>
  );
}
