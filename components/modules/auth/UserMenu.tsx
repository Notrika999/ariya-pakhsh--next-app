// components/modules/auth/UserMenu.tsx

"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { performLogout } from "@/src/lib/auth/session-client";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";

interface UserMenuProps {
  onClose?: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
}

const MENU_ITEMS = [
  { href: "/user-profile", label: "داشبورد", icon: "fa-gauge" },
  { href: "/user-profile/orders", label: "سفارش‌های من", icon: "fa-box" },
  {
    href: "/user-profile/tickets",
    label: "تیکت و پشتیبانی",
    icon: "fa-headset",
  },
] as const;

type MenuPosition = {
  top: number;
  left: number;
};

export default function UserMenu({ onClose, anchorRef }: UserMenuProps) {
  const user = useAuthStore((s) => s.user);
  const [position, setPosition] = useState<MenuPosition | null>(null);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef?.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const menuWidth = 224; // w-56
    const gap = 8;
    const left = Math.min(
      Math.max(8, rect.right - menuWidth),
      window.innerWidth - menuWidth - 8,
    );

    setPosition({
      top: rect.bottom + gap,
      left,
    });
  }, [anchorRef]);

  useLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition]);

  const handleLogout = async () => {
    onClose?.();
    await performLogout();
  };

  if (!user || typeof document === "undefined" || !position) return null;

  const displayName =
    user.displayName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.phoneNumber ||
    "کاربر";

  return createPortal(
    <div
      data-user-menu
      className="fixed z-9999 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-custom-dark"
      style={{ top: position.top, left: position.left }}
      role="menu"
    >
      <div className="mb-1 border-b border-gray-100 px-3 py-2 dark:border-gray-700">
        <p className="truncate font-semibold text-gray-800 dark:text-gray-100">
          {displayName}
        </p>
        {user.phoneNumber && (
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {user.phoneNumber}
          </p>
        )}
      </div>

      {MENU_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#1f242c]"
        >
          <i className={`fa-regular ${item.icon} w-4 text-center`}></i>
          <span>{item.label}</span>
        </Link>
      ))}

      <button
        onClick={handleLogout}
        className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
      >
        <i className="fa-regular fa-arrow-right-from-bracket w-4 text-center"></i>
        <span>خروج از حساب</span>
      </button>
    </div>,
    document.body,
  );
}
