"use client";
// components/ui/UserProfile/UserSidebar.jsx
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";
import { logout } from "@/src/services/auth/auth.client";

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);

  const isActive = (href) => pathname === href;

  const displayName =
    user?.displayName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.phoneNumber ||
    "کاربر";

  const userPanelMenu = [
    {
      id: 1,
      title: "پیشخوان",
      link: "/user-profile",
      icon: "far fa-table-cells",
    },
    {
      id: 2,
      title: "سفارش های من",
      link: "/user-profile/orders",
      icon: "far fa-cart-shopping",
    },
    {
      id: 3,
      title: "سفارش های برگشتی",
      link: "/user-profile/orders-return",
      icon: "far fa-rotate-left",
    },
    {
      id: 4,
      title: "اطلاعات حساب",
      link: "/user-profile/information",
      icon: "far fa-user",
    },
    {
      id: 5,
      title: "تیکت",
      link: "/user-profile/tickets",
      icon: "far fa-ticket",
    },
    {
      id: 6,
      title: "پیام ها",
      link: "/user-profile/notification",
      icon: "far fa-envelope",
    },
    {
      id: 7,
      title: "علاقمندی",
      link: "/user-profile/favorites",
      icon: "far fa-heart",
    },
    {
      id: 8,
      title: "کارت هدیه",
      link: "/user-profile/gift-cart",
      icon: "far fa-gift",
    },
    {
      id: 9,
      title: "تخفیف",
      link: "/user-profile/discount-points",
      icon: "far fa-tags",
    },
    {
      id: 10,
      title: "تراکنش ها",
      link: "/user-profile/credit-history",
      icon: "far fa-receipt",
    },
    {
      id: 11,
      title: "تاریخچه فعالیت‌",
      link: "/user-profile/activity-history",
      icon: "far fa-receipt",
    },
    {
      id: 12,
      title: "نظرات",
      link: "/user-profile/comments",
      icon: "far fa-comment",
    },
    {
      id: 13,
      title: "تغییر رمز",
      link: "/user-profile/change-password",
      icon: "far fa-lock",
    },
    {
      id: 14,
      title: "آدرس",
      link: "/user-profile/address",
      icon: "far fa-location-dot",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearUser();
      router.replace("/");
      router.refresh();
    }
  };

  return (
    <div className="relative p-4 pt-24 mb-8 bg-white dark:bg-custom-dark rounded-2xl shadow-[0_4px_30px_#edf0f5] dark:shadow-lg">
      {/* <!--The upper part has a wavy shape.--> */}
      <div className="absolute top-[-10px] inset-s-0 inset-e-0 mx-auto w-[230px] h-[75px] z-0">
        <svg
          width="230"
          height="75"
          viewBox="0 0 230 75"
          fill="none"
              className="absolute top-0 inset-s-0 inset-e-0 bottom-0 z-[-1] fill-custom-light dark:fill-[#0d1117]"
        >
          <path d="M230 0H0V10C26.2258 10.6605 43.6909 20.4901 52.0499 27.9356C60.4088 35.3811 84.5186 61.9259 84.5186 61.9259C101.038 79.219 128.627 79.219 145.146 61.9259C145.146 61.9259 169.146 35.4578 177.549 28.0042C185.953 20.5506 203.675 10.6625 230 10V0Z"></path>
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="115"
              y1="0"
              x2="115"
              y2="74.8957"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FAFBFB"></stop>
              <stop offset="1" stopColor="#F4F6F8"></stop>
            </linearGradient>
          </defs>
        </svg>
        <Image
          width={100}
          height={100}
          className="absolute top-[-10px] inset-s-0 inset-e-0 mx-auto w-[73px] h-[73px] rounded-full object-cover"
          src={user?.avatar || "/images/user/profile-img.jpg"}
          alt={displayName}
        />
      </div>

      {/* <!--User information--> */}
      <div className="relative z-0 mx-6 mb-5 after:content-[''] after:absolute after:top-[60%] after:right-1 after:left-1 after:bottom-0 after:h-2.5 after:z-[-1] after:shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="relative z-10 bg-white dark:bg-custom-dark">
          <div className="text-lg font-bold truncate">{displayName}</div>
          {user?.phoneNumber && (
            <div className="text-primary-light py-1 pb-2.5 truncate">
              {user.phoneNumber}
            </div>
          )}
        </div>
      </div>

      {/* <!--Navigation menu--> */}
      <ul className="space-y-2">
        {userPanelMenu.map((menu) => {
          const active = isActive(menu.link);

          return (
            <li key={menu.id} className="py-2.5 px-1">
              <Link
                href={menu.link}
                className={`group relative flex justify-start items-center py-1 px-5 ${
                  active
                    ? "text-primary font-bold before:content-[''] before:absolute before:top-0 before:right-0 before:bottom-0 before:w-1 before:rounded before:bg-primary before:scale-y-100"
                    : "dark:text-gray-500 text-gray-800 hover:text-primary before:content-[''] before:absolute before:top-0 before:right-0 before:bottom-0 before:w-1 before:rounded before:scale-y-0 hover:before:scale-y-100 hover:before:bg-primary"
                }`}
              >
                <i
                  className={`${menu.icon} me-2.5 text-lg group-hover:text-primary transition-colors ${
                    active ? "text-primary" : "text-[#BCC1C8]"
                  }`}
                ></i>
                {menu.title}
              </Link>
            </li>
          );
        })}

        <li className="py-2.5 px-1">
          <button
            onClick={handleLogout}
            className="relative flex justify-start items-center pt-6 px-5 text-red-500 border-t border-gray-300 dark:border-t-gray-700 before:hidden hover:text-red-500"
          >
            <i className="far fa-right-from-bracket text-[#DC3545] w-[17px] h-[17px] me-2.5"></i>
            خروج
          </button>
        </li>
      </ul>
    </div>
  );
}