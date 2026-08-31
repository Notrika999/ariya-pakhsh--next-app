// components/OffcanvasRight.jsx
import Link from "next/link";
import { Suspense, useEffect } from "react";
import HeaderSearch from "../Top/HeaderSearch";
import CategoryNode from "./CategoryNode";

export default function OffcanvasRight({ isOpen, onClose, menu }) {
  // بستن با کلید Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Overlay و Panel در کنار هم (با کنترل استایل کلاس‌ها)
  return (
    <>
      {/* بکگراندی که با opacity کم نمایش داده می‌شود */}
      <div
        className={`fixed inset-0 z-40 bg-black/25 transition-opacity duration-200 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* پنل جانب راست (با انیمیشن ترجمه) */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-dvh w-full flex-col bg-white text-gray-900 shadow-xl transform transition-transform duration-300 dark:bg-[#0d1117] dark:text-gray-100 sm:w-[80%] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        role="navigation"
        aria-labelledby="store-menu-title"
        aria-hidden={!isOpen}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between ">
          <h2 id="store-menu-title" className="font-bold text-base">
            فروشگاه کارآپ 24
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer"
            aria-label="بستن منوی فروشگاه"
          >
            <i className="far fa-x text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors"></i>
          </button>
        </div>

        {/* navigation */}
        <nav
          className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-8"
          aria-label="منوی اصلی"
        >
          <div className="sticky top-0 z-10 mb-4 bg-white pb-3 dark:bg-[#0d1117]">
            <Suspense
              fallback={
                <div className="h-14 w-full rounded-full border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900" />
              }
            >
              <HeaderSearch
                className="block w-full"
                inputClassName="h-14 mt-1 w-full appearance-none rounded-full border border-gray-200 bg-white py-3 pe-5 ps-14 text-base font-semibold placeholder-gray-400 shadow-sm transition-colors duration-300 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
                buttonClassName="absolute right-3 rounded-full p-2 text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-100"
                placeholder="جستجو در کارآپ24"
                onNavigate={onClose}
                resultsVariant="mobile"
                resultsId="offcanvasSearchResults"
              />
            </Suspense>
          </div>

          <ul className="space-y-2 pb-6 text-sm">
            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="/" onClick={onClose}>صفحه اصلی</Link>
            </li>

            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="/products" onClick={onClose}>فروشگاه</Link>
            </li>
            
            {menu.map((cat) => (
              <CategoryNode key={cat.id} category={cat} onNavigate={onClose} />
            ))}

            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="#" onClick={onClose}>پیگیری سفارش</Link>
            </li>

            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="/faq" onClick={onClose}>سوالی دارید</Link>
            </li>

            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="/mag" onClick={onClose}>مجله</Link>
            </li>

            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="/contact" onClick={onClose}>تماس با ما</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
