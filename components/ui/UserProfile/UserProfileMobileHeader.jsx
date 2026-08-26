"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGE_TITLES = {
  "/user-profile/orders": "سفارش های من",
  "/user-profile/orders-return": "سفارش های برگشتی",
  "/user-profile/information": "اطلاعات حساب",
  "/user-profile/tickets": "تیکت",
  "/user-profile/favorites": "علاقمندی",
  "/user-profile/gift-cart": "کارت هدیه",
  "/user-profile/discount-points": "تخفیف و امتیاز",
  "/user-profile/credit-history": "تراکنش ها",
  "/user-profile/activity-history": "تاریخچه فعالیت",
  "/user-profile/comments": "نظرات",
  "/user-profile/change-password": "تغییر رمز",
  "/user-profile/address": "آدرس",
};

function getPageTitle(pathname) {
  const exactTitle = PAGE_TITLES[pathname];
  if (exactTitle) return exactTitle;

  if (pathname?.startsWith("/user-profile/orders/")) return "جزئیات سفارش";
  if (pathname?.startsWith("/user-profile/tickets/")) return "جزئیات تیکت";

  return "پنل کاربر";
}

export default function UserProfileMobileHeader() {
  const pathname = usePathname();

  if (pathname === "/user-profile") return null;

  return (
    <header className="mb-1 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-2 py-1 shadow-sm dark:border-gray-700 dark:bg-custom-dark lg:hidden">
      <Link
        href="/user-profile"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition hover:bg-primary/90"
        aria-label="بازگشت به داشبورد"
        title="بازگشت به داشبورد"
      >
        <i className="fa-solid fa-arrow-right text-xs" /> 
      </Link>
     <span className="text-sm"> بازگشت به داشبورد</span>
      {/* <h1 className="min-w-0 flex-1 truncate px-3 text-right text-base font-black text-gray-900 dark:text-gray-100">
        {getPageTitle(pathname)}
      </h1> */}
    </header>
  );
}
