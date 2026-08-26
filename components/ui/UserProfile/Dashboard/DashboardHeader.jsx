"use client";
// components/ui/UserProfile/DashboardDashboardHeader.jsx
import UserProfileTop, { UserProfileTopStat } from "../UserProfileTop";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";
import { getProductImage } from "@/src/utils/product-image";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const DEFAULT_AVATAR = "/images/user/profile-img.jpg";

function formatMoney(value) {
  return `${new Intl.NumberFormat("fa-IR").format(
    Math.max(0, Math.round(Number(value) || 0)),
  )} تومان`;
}

function resolveAvatarSrc(avatarUrl) {
  if (!avatarUrl || typeof avatarUrl !== "string") return DEFAULT_AVATAR;
  const trimmed = avatarUrl.trim();
  if (!trimmed) return DEFAULT_AVATAR;
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  return getProductImage(trimmed);
}

export default function DashboardHeader({ displayName = "", wallet, loading }) {
  const user = useAuthStore((s) => s.user);
  const name =
    displayName?.trim() ||
    user?.displayName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.phoneNumber ||
    "کاربر";
  const avatarSrc = resolveAvatarSrc(user?.avatarUrl);

  return (
    <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
      <div className="flex items-center justify-between gap-4 md:hidden">
        <Link
          href="/user-profile/information"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-primary transition hover:bg-primary/10"
          aria-label="ویرایش اطلاعات حساب"
          title="ویرایش اطلاعات حساب"
        >
          <i className="fa-solid fa-pen text-base" />
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-3 text-right">
          <div className="min-w-0">
            <div className="truncate text-base font-black text-gray-900 dark:text-gray-100">
              {name}
            </div>
            {user?.phoneNumber ? (
              <div className="truncate text-sm font-semibold text-gray-600 dark:text-gray-400">
                {user.phoneNumber}
              </div>
            ) : null}
          </div>
          <Image
            width={64}
            height={64}
            className="size-16 shrink-0 rounded-full border-2 border-gray-900 object-cover p-0.5 dark:border-gray-100"
            src={avatarSrc}
            alt={name}
            unoptimized={avatarSrc.startsWith("http")}
          />
        </div>
      </div>

      <div className="hidden md:block">
        <UserProfileTop
          title="پنل کاربری"
          description={`به پنل کاربری خود خوش آمدید، ${name} عزیز`}
          wrapped={false}
          aside={
            <UserProfileTopStat
              label="اعتبار کیف پول"
              value={loading ? "..." : formatMoney(wallet?.balance)}
              iconClassName="bg-green-100 dark:bg-green-900"
              icon={
                <i className="fa-solid fa-circle-dollar-to-slot text-green-600 dark:text-green-400"></i>
              }
            />
          }
        />
      </div>
    </div>
  );
}
