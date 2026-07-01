// components/modules/auth/UserMenu.tsx

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/src/services/auth/auth.client";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";

interface UserMenuProps {
  onClose?: () => void;
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

export default function UserMenu({ onClose }: UserMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearUser();
      onClose?.();
      if (pathname.startsWith("/user-profile")) {
        router.replace("/");
        router.refresh();
      }
    }
  };

  if (!user) return null;

  const displayName =
    user.displayName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.phoneNumber ||
    "کاربر";

  return (
    <div className="absolute top-full mt-2 inset-e-0 z-50 w-56 rounded-xl bg-white dark:bg-custom-dark shadow-lg border border-gray-100 dark:border-gray-700 p-2">
      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
        <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">
          {displayName}
        </p>
        {user.phoneNumber && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user.phoneNumber}
          </p>
        )}
      </div>

      {MENU_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1f242c] transition-colors"
        >
          <i className={`fa-regular ${item.icon} w-4 text-center`}></i>
          <span>{item.label}</span>
        </Link>
      ))}

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
      >
        <i className="fa-regular fa-arrow-right-from-bracket w-4 text-center"></i>
        <span>خروج از حساب</span>
      </button>
    </div>
  );
}
