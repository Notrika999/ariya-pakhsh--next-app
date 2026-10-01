import Link from "next/link";
import React from "react";
import BrandLogo from "@/components/modules/BrandLogo/BrandLogo";

export default function HeaderLogo() {
  return (
    <div className="order-1 col-span-6 w-auto lg:col-span-2 lg:w-full">
      <Link href="/" aria-label="صفحه اصلی آریا پخش">
        <div className="flex items-center justify-end gap-2 xl:justify-start">
          <BrandLogo priority />
        </div>
      </Link>
    </div>
  );
}
