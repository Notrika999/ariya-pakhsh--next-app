// components/OffcanvasRight.jsx
import Link from "next/link";
import { useEffect, useState } from "react";
import CategoryNode from "./CategoryNode";

export default function OffcanvasRight({ isOpen, onClose, menu }) {
  // برای انیمیشن دو مرحله‌ای:Backdrop و Panel
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  // هماهنگی با isOpen
  useEffect(() => {
    if (isOpen) {
      // بکگراند رو فوراً نمایش بده
      setShowBackdrop(true);
      // و بعد از یه تأخیر کوتاه پنل رو باز کن
      const t = setTimeout(() => setShowPanel(true), 60);
      return () => clearTimeout(t);
    } else {
      // وقتی بسته می‌شه، اول پنل رو خارج کن و بعد بکگراند رو پنهان کن
      setShowPanel(false);
      const t = setTimeout(() => setShowBackdrop(false), 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

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
        className={`fixed inset-0 bg-black/25 z-40 transition-opacity duration-200 ${showBackdrop ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden={!showBackdrop}
      />

      {/* پنل جانب راست (با انیمیشن ترجمه) */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] bg-white dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 border-e border-gray-200 dark:border-gray-800 shadow-xl transform transition-transform duration-300 z-50 ${showPanel ? "translate-x-0" : "translate-x-full"}`}
        role="navigation"
        aria-labelledby="store-menu-title"
        aria-hidden={!showPanel}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between ">
          <h2 id="store-menu-title" className="font-bold text-base">
            فروشگاه آریاپخش
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
          style={{ paddingLeft: 12 }}
          className="relative space-y-3 divide-y divide-gray-100 dark:divide-gray-800 p-3 overflow-y-scroll h-full"
          aria-label="منوی اصلی"
        >
          <ul className="space-y-2 text-sm">
            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="/">صفحه اصلی</Link>
            </li>

            {menu.map((cat) => (
              <CategoryNode key={cat.id} category={cat} />
            ))}

            {/* صفحات یا آیتم‌های ثابت می‌توانید اینجا اضافه کنید اگر نیاز باشد */}
            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="/categories">لیست کالا ها</Link>
            </li>

            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="#">پیگیری سفارش</Link>
            </li>

            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="/faq">سوالی دارید</Link>
            </li>

            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="/blog">بلاگ</Link>
            </li>

            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="/contact">تماس با ما</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
