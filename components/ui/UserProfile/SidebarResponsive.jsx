"use client";

import React from "react";
import { usePathname } from "next/navigation";
import UserSidebar from "./UserSidebar";

export default function SidebarResponsive() {
  const pathname = usePathname();

  if (pathname !== "/user-profile") return null;

  return (
    <div className="lg:hidden">
      <UserSidebar variant="mobileBottom" />
    </div>
  );
}
