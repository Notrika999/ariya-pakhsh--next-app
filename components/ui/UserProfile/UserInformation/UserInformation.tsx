// components/ui/UserProfile/UserInformation/UserInformation.jsx
"use client";

import React, { useEffect, useRef } from "react";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import UserInformationTop from "./UserInformationTop";
import PersonalInfoForm from "./PersonalInfoForm";
import UserInformationSecuritySettings from "./UserInformationSecuritySettings";
import UserInformationAccountPreferences from "./UserInformationAccountPreferences";
import { useAuthStore, useCurrentUser } from "@/src/lib/stores/auth/auth.store";
import { getMe } from "@/src/services/auth/auth.client";

export default function UserInformation() {
  const user = useCurrentUser();

  const setUser = useAuthStore((state) => state.setUser);
  const profileRequestedUserIdRef = useRef<string | null>(null);
  const userKey = `${user?.userId ?? "guest"}-${user?.birthDate ?? "no-birth-date"}`;

  useEffect(() => {
    if (!user?.userId || user.birthDate) return;
    if (profileRequestedUserIdRef.current === user.userId) return;

    let cancelled = false;
    profileRequestedUserIdRef.current = user.userId;

    getMe()
      .then((freshUser) => {
        if (cancelled) return;
        setUser({
          ...user,
          ...freshUser,
          userId: user.userId,
          birthDate: freshUser.birthDate ?? user.birthDate,
        });
      })
      .catch(() => {
        // اگر endpoint پروفایل در دسترس نبود، فرم با داده فعلی کاربر نمایش داده می‌شود.
      });

    return () => {
      cancelled = true;
    };
  }, [setUser, user]);

  return (
    <div className="lg:col-span-3 space-y-4">
      {/* <!--Dashboard header-->/ */}
      <UserInformationTop user={user} />

      {/* <!--Personal Information Form--> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"اطلاعات شخصی"} tag={false} />

        <PersonalInfoForm key={userKey} user={user} />
      </div>

      {/* <!--Security Settings--> */}
      <UserInformationSecuritySettings user={user} />

      {/* <!--Account Preferences--> */}
      {/* <UserInformationAccountPreferences key={userKey} user={user} /> */}
    </div>
  );
}
