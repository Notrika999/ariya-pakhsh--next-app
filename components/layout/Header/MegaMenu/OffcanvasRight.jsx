// components/OffcanvasRight.jsx
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OffcanvasRight({
  isOpen,
  onClose,
  leftMenuItems = [],
  megaContent = {},
}) {
  // نقشه باز/بسته هر منو به صورت جداگانه
  const [openMap, setOpenMap] = useState({});

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

  //Toggle هر منو به صورت جداگانه
  const toggleMenu = (menuID) => {
    setOpenMap((prev) => ({
      ...prev,
      [menuID]: !prev[menuID],
    }));
  };

  // helper برای render کردن بخش‌های megaContent برای یک منو
  const renderMegaForMenu = (menuID) => {
    const sections = (megaContent[String(menuID)] ?? []).filter(
      (sec) => !sec.src,
    );
    if (!sections.length) return null;

    return (
      <div className="mt-2 pl-2">
        {sections.map((sec, idx) => (
          <div key={idx} className="mb-2">
            {sec.title && (
              <div className="text-sm font-semibold mb-1">{sec.title}</div>
            )}
            {sec.items && sec.items.length > 0 && (
              <ul className="ml-4 space-y-1">
                {sec.items.map((item, i) => (
                  <li
                    key={i}
                    className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-[#1f242c] rounded"
                  >
                    <Link href={item.href ?? "#"} passHref>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

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
        aria-modal="true"
        aria-hidden={!showPanel}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between ">
          <h2 id="store-menu-title" className="font-bold text-base">
            فروشگاه دیارا
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer"
            aria-label="بستن منوی فروشگاه"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-8 text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
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
              <Link href="./index">صفحه اصلی</Link>
            </li>

            {/* دیتای منوها: هر کدام با کلیک فقط خودش رو باز می‌کند */}
            {leftMenuItems.map((m) => {
              const id = String(m.menuID);
              const isOpenForThis = !!openMap[id];
              return (
                <li
                  key={id}
                  className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200"
                >
                  <button
                    className="flex justify-between w-full text-start items-center"
                    aria-expanded={isOpenForThis}
                    aria-controls={`mega-${id}`}
                    id={`menu-${id}-button`}
                    onClick={() => toggleMenu(id)}
                  >
                    <span>{m.title}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform transform text-gray-600 dark:text-gray-300 ${isOpenForThis ? "rotate-180" : ""}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isOpenForThis && (
                    <div
                      id={`mega-${id}`}
                      role="region"
                      aria-label={m.title}
                      className="mt-2 pl-3"
                    >
                      {renderMegaForMenu(id)}
                    </div>
                  )}
                </li>
              );
            })}

            {/* صفحات یا آیتم‌های ثابت می‌توانید اینجا اضافه کنید اگر نیاز باشد */}
            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="#">لیست کالا ها</Link>
            </li>

            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="#">پیگیری سفارش</Link>
            </li>

            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="#">سوالی دارید</Link>
            </li>

            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="#">بلاگ</Link>
            </li>

            <li className="bg-gray-50 dark:bg-custom-dark border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f242c] p-2 transition-colors duration-200">
              <Link href="#">تماس با ما</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
