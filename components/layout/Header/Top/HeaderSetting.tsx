"use client";
// components/layout/Header/Top/HeaderSetting.tsx

import LoginModal from "@/components/modules/auth/LoginModal";
import UserMenu from "@/components/modules/auth/UserMenu";
import HeaderCart from "@/components/modules/HeaderCart/HeaderCart";
import React, {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useCart } from "@/src/context/CartContext";
import {
  useCurrentUser,
  useIsAuthenticated,
} from "@/src/lib/stores/auth/auth.store";

export default function HeaderSetting() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dark-mode") === "true";
    }
    return false;
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { totalItems } = useCart();

  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const showUserMenu = mounted && isAuthenticated && Boolean(user);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedTrigger = menuRef.current?.contains(target);
      const clickedMenu = (target as Element).closest?.("[data-user-menu]");
      if (!clickedTrigger && !clickedMenu) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("dark-mode", String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };
  return (
    <div className="lg:col-span-4 col-span-4 order-3 w-full">
      <div className="flex items-baseline justify-end">
        {/* basket and call and darkmode  */}
        <div className="flex items-center gap-x-4 md:me-5 me-4">
          {/* heart  */}
          {/* <a href="" className="hidden">
            <i className="fa-regular fa-heart"></i>
          </a> */}

          {/* basket  */}
          <div
            onClick={() => setCartOpen(true)}
            className="relative  ms-2 flex"
          >
            <i className="fa-regular fa-bag-shopping"></i>

            {totalItems > 0 && (
              <span className="size-4 text-sm -top-2 -inset-s-2 absolute bg-secondary dark:bg-primary-400 text-white dark:text-gray-100 rounded-lg text-center shadow-sm dark:shadow-[0_0_4px_rgba(255,255,255,0.2)] transition-colors duration-300">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </div>

          {/* dark mode  */}
          <div className="md:ms-5 ">
            <button onClick={toggleDarkMode} className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 22 22"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5 dark:block hidden dark:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 22 22"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5 dark:hidden block dark:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="lg:inline-block hidden me-3 h-10 w-px self-stretch bg-gray-200 dark:bg-gray-700"></div>
        {/* login  */}
        {!mounted ? (
          <div
            className="hidden lg:block h-10 w-28 rounded-lg bg-gray-100 dark:bg-zinc-800 animate-pulse"
            aria-hidden="true"
          />
        ) : showUserMenu ? (
          <div className="relative" ref={menuRef}>
            <button
              ref={triggerRef}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center bg-white dark:bg-custom-dark text-gray-900 dark:text-gray-100 lg:py-2 lg:px-3 lg:border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f242c] transition-colors duration-200"
            >
              <i className="fa-regular fa-user-circle me-1"></i>
              <span className="lg:inline-block hidden max-w-[120px] truncate">
                {user?.displayName ||
                  [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
                  "حساب کاربری"}
              </span>
              {/* <i
                className={`hidden  fa-solid fa-chevron-down ms-1 text-xs transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
              ></i> */}
            </button>
            {menuOpen && (
              <UserMenu
                anchorRef={triggerRef}
                onClose={() => setMenuOpen(false)}
              />
            )}
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center bg-white dark:bg-custom-dark text-gray-900 dark:text-gray-100 modal-trigger lg:py-2 lg:px-3 lg:border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f242c] transition-colors duration-200"
          >
            <i className="fa-regular fa-user-circle me-1"></i>
            <span className="lg:inline-block hidden">ورود / ثبت نام</span>
          </button>
        )}
        {/* login  */}
      </div>

      <HeaderCart open={cartOpen} onClose={() => setCartOpen(false)} />

      <LoginModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
