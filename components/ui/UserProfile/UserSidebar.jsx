"use client";
// components/ui/UserProfile/UserSidebar.jsx
import React, { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";
import { performLogout } from "@/src/lib/auth/session-client";
import {
  deleteAvatar,
  getAuthErrorMessage,
  getMe,
  uploadAvatar,
} from "@/src/services/auth/auth.client";
import { notify } from "@/src/utils/toast";
import { getProductImage } from "@/src/utils/product-image";

const DEFAULT_AVATAR = "/images/user/profile-img.jpg";
const MAX_AVATAR_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function resolveAvatarSrc(avatarUrl) {
  if (!avatarUrl || typeof avatarUrl !== "string") return DEFAULT_AVATAR;
  const trimmed = avatarUrl.trim();
  if (!trimmed) return DEFAULT_AVATAR;
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  return getProductImage(trimmed);
}

export default function UserSidebar({ variant = "desktop" }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const fileInputRef = useRef(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const isActive = (href) => pathname === href;

  const displayName =
    user?.displayName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.phoneNumber ||
    "کاربر";

  const avatarSrc = previewUrl || resolveAvatarSrc(user?.avatarUrl);
  const hasCustomAvatar = Boolean(user?.avatarUrl);

  const userPanelMenu = [
    {
      id: 1,
      title: "پیشخوان",
      link: "/user-profile",
      icon: "far fa-table-cells",
      disabled: false,
    },
    {
      id: 2,
      title: "سفارش های من",
      link: "/user-profile/orders",
      icon: "far fa-cart-shopping",
      disabled: false,
    },
    {
      id: 3,
      title: "سفارش های برگشتی",
      link: "/user-profile/orders-return",
      icon: "far fa-rotate-left",
      disabled: false,
    },
    {
      id: 4,
      title: "اطلاعات حساب",
      link: "/user-profile/information",
      icon: "far fa-user",
      disabled: false,
    },
    {
      id: 5,
      title: "تیکت",
      link: "/user-profile/tickets",
      icon: "far fa-ticket",
      disabled: false,
    },
    // {
    //   id: 6,
    //   title: "پیام ها",
    //   link: "/user-profile/notification",
    //   icon: "far fa-envelope",
    //   disabled: true,
    // },
    {
      id: 7,
      title: "علاقمندی",
      link: "/user-profile/favorites",
      icon: "far fa-heart",
      disabled: false,
    },
    {
      id: 8,
      title: "کارت هدیه",
      link: "/user-profile/gift-cart",
      icon: "far fa-gift",
      disabled: false,
    },
    {
      id: 9,
      title: "تخفیف",
      link: "/user-profile/discount-points",
      icon: "far fa-tags",
      disabled: false,
    },
    {
      id: 10,
      title: "تراکنش ها",
      link: "/user-profile/credit-history",
      icon: "far fa-receipt",
      disabled: false,
    },
    {
      id: 11,
      title: "تاریخچه فعالیت‌",
      link: "/user-profile/activity-history",
      icon: "far fa-receipt",
      disabled: false,
    },
    {
      id: 12,
      title: "نظرات",
      link: "/user-profile/comments",
      icon: "far fa-comment",
      disabled: false,
    },
    {
      id: 13,
      title: "تغییر رمز",
      link: "/user-profile/change-password",
      icon: "far fa-lock",
      disabled: false,
    },
    {
      id: 14,
      title: "آدرس",
      link: "/user-profile/address",
      icon: "far fa-location-dot",
      disabled: false,
    },
  ];

  const refreshUserFromMe = async (fallbackAvatarUrl) => {
    try {
      const freshUser = await getMe();
      setUser({
        ...user,
        ...freshUser,
        avatarUrl: freshUser.avatarUrl ?? fallbackAvatarUrl ?? null,
      });
      return freshUser;
    } catch (error) {
      console.error("[UserSidebar] getMe after avatar change failed =>", error);
      if (fallbackAvatarUrl && user) {
        setUser({ ...user, avatarUrl: fallbackAvatarUrl });
      }
      return null;
    }
  };

  const handleAvatarPick = () => {
    if (avatarBusy) return;
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      notify.error("فقط تصویرهای JPG، PNG، WEBP یا GIF مجاز است");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_MB * 1024 * 1024) {
      notify.error(
        `حجم تصویر نباید بیشتر از ${MAX_AVATAR_SIZE_MB} مگابایت باشد`,
      );
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setAvatarBusy(true);

    try {
      const result = await uploadAvatar(file);
      if (result.success === false) {
        throw new Error(
          result.errorMessage || result.message || "آپلود ناموفق بود",
        );
      }

      await refreshUserFromMe(result.avatarUrl);
      notify.success(result.message || "آواتار با موفقیت به‌روزرسانی شد");
    } catch (error) {
      console.error("[UserSidebar] upload avatar failed =>", error);
      notify.error(getAuthErrorMessage(error));
      setPreviewUrl(null);
    } finally {
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(null);
      setAvatarBusy(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (avatarBusy || !hasCustomAvatar) return;

    setAvatarBusy(true);
    try {
      const result = await deleteAvatar();
      if (result.success === false) {
        throw new Error(
          result.errorMessage || result.message || "حذف ناموفق بود",
        );
      }

      const freshUser = await refreshUserFromMe(null);
      if (!freshUser?.avatarUrl && user) {
        setUser({ ...(freshUser ?? user), avatarUrl: null });
      }
      notify.success(result.message || "آواتار حذف شد");
    } catch (error) {
      console.error("[UserSidebar] delete avatar failed =>", error);
      notify.error(getAuthErrorMessage(error));
    } finally {
      setAvatarBusy(false);
    }
  };

  const handleLogout = async () => {
    await performLogout();
  };

  if (variant === "mobileBottom") {
    return (
      <nav
        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-custom-dark"
        aria-label="منوی پنل کاربر"
      >
        <h2 className="mb-4 text-center text-base font-black text-gray-900 dark:text-gray-100">
          منو پنل
        </h2>

        <ul className="grid grid-cols-2 gap-2">
          {userPanelMenu.map((menu) => {
            const active = isActive(menu.link);

            return (
              <li key={menu.id}>
                <Link
                  href={menu.link}
                  className={`flex min-h-12 items-center justify-start gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-100 text-gray-700 hover:border-primary/30 hover:text-primary dark:border-gray-700 dark:text-gray-300"
                  }`}
                  title={menu.disabled ? "در دست تکمیل است" : undefined}
                  aria-disabled={menu.disabled}
                >
                  <i
                    className={`${menu.icon} shrink-0 text-base ${
                      active ? "text-primary" : "text-[#BCC1C8]"
                    }`}
                  />
                  <span className="min-w-0 truncate">{menu.title}</span>
                </Link>
              </li>
            );
          })}

          <li className="col-span-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm font-bold text-red-500 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
            >
              <i className="far fa-right-from-bracket text-[#DC3545]" />
              خروج
            </button>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <div className="relative mb-8 rounded-2xl bg-white pt-24 shadow-[0_4px_30px_#edf0f5] dark:bg-custom-dark dark:shadow-lg">
      <div className="absolute inset-e-0 inset-s-0 top-[-10px] z-0 mx-auto h-[75px] w-[230px]">
        <svg
          width="230"
          height="75"
          viewBox="0 0 230 75"
          fill="none"
          className="absolute inset-e-0 inset-s-0 bottom-0 top-0 z-[-1] fill-custom-light dark:fill-[#0d1117]"
        >
          <path d="M230 0H0V10C26.2258 10.6605 43.6909 20.4901 52.0499 27.9356C60.4088 35.3811 84.5186 61.9259 84.5186 61.9259C101.038 79.219 128.627 79.219 145.146 61.9259C145.146 61.9259 169.146 35.4578 177.549 28.0042C185.953 20.5506 203.675 10.6625 230 10V0Z"></path>
        </svg>

        {/* Avatar */}
        <div className="absolute inset-e-0 inset-s-0 top-[-10px] mx-auto h-[75px] w-[75px]">
          <Image
            width={100}
            height={100}
            className="h-[73px] w-[73px] rounded-full object-cover"
            src={avatarSrc}
            alt={displayName}
            unoptimized={avatarSrc.startsWith("http")}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={handleAvatarChange}
          />

          <button
            type="button"
            onClick={handleAvatarPick}
            disabled={avatarBusy}
            className="absolute bottom-0 end-0 flex size-7 items-center justify-center rounded-full bg-primary text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
            aria-label="تغییر آواتار"
            title="تغییر آواتار"
          >
            {avatarBusy ? (
              <i className="far fa-spinner-third animate-spin text-xs" />
            ) : (
              <i className="far fa-camera text-xs" />
            )}
          </button>

          {hasCustomAvatar && (
            <button
              type="button"
              onClick={handleAvatarDelete}
              disabled={avatarBusy}
              className="absolute bottom-0 start-0 flex size-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
              aria-label="حذف آواتار"
              title="حذف آواتار"
            >
              <i className="far fa-trash-can text-xs" />
            </button>
          )}
        </div>
      </div>

      <div className="relative z-0 mx-6 mb-5 after:absolute after:bottom-0 after:left-1 after:right-1 after:top-[60%] after:z-[-1] after:h-2.5 after:content-[''] after:shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="relative z-10 bg-white dark:bg-custom-dark">
          <div className="truncate text-lg font-bold">{displayName}</div>
          {user?.phoneNumber && (
            <div className="text-primary-light truncate py-1 pb-2.5">
              {user.phoneNumber}
            </div>
          )}
        </div>
      </div>

      <ul className="space-y-1">
        {userPanelMenu.map((menu) => {
          const active = isActive(menu.link);

          return (
            <li key={menu.id} className="px-1">
              <Link
                href={menu.link}
                className={`group relative flex items-center justify-start px-3 py-3 ${
                  active
                    ? "font-bold text-primary before:absolute before:bottom-0 before:right-0 before:top-0 before:w-1 before:scale-y-100 before:rounded before:bg-primary before:content-['']"
                    : "text-gray-800 hover:text-primary before:absolute before:bottom-0 before:right-0 before:top-0 before:w-1 before:scale-y-0 before:rounded before:content-[''] hover:before:scale-y-100 hover:before:bg-primary dark:text-gray-500"
                }`}
                disabled={menu.disabled}
                title={menu.disabled ? "در دست تکمیل است" : undefined}
                aria-disabled={menu.disabled}
              >
                <i
                  className={`${menu.icon} me-2.5 text-lg transition-colors group-hover:text-primary ${
                    active ? "text-primary" : "text-[#BCC1C8]"
                  }`}
                ></i>
                {menu.title}
              </Link>
            </li>
          );
        })}

        <li className="px-1 py-2.5">
          <button
            onClick={handleLogout}
            className="relative flex items-center justify-start border-t border-gray-300 px-5 pt-6 text-red-500 before:hidden hover:text-red-500 dark:border-t-gray-700"
          >
            <i className="far fa-right-from-bracket me-2.5 h-[17px] w-[17px] text-[#DC3545]"></i>
            خروج
          </button>
        </li>
      </ul>
    </div>
  );
}
