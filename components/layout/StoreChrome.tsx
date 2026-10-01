"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer/Footer";
import Header from "@/components/layout/Header/Header";
import NavMobile from "@/components/layout/NavMobile/NavMobile";
import { BackToTopButton } from "@/components/modules/BackToTopButton/BackToTopButton";
import { GoftinoWidget } from "@/components/modules/RaychatWidget/RaychatWidget";
import VehicleSelectorHost from "@/components/modules/VehicleSelector/VehicleSelectorHost";
import StoryMiniPlayer from "@/components/ui/Home/Story/StoryMiniPlayer";

function isMagazinePath(pathname: string) {
  return pathname === "/mag" || pathname.startsWith("/mag/");
}

export default function StoreChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";

  if (isMagazinePath(pathname)) {
    return children;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <NavMobile />
      <VehicleSelectorHost />
      <GoftinoWidget liftAboveMobileNav />
      <BackToTopButton />
      <StoryMiniPlayer />
    </>
  );
}
