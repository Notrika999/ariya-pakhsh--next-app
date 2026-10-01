<<<<<<< HEAD
=======
// components/layout/Header/Top/HeaderLogo.jsx

import Image from "next/image";
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
import Link from "next/link";
import React from "react";
import BrandLogo from "@/components/modules/BrandLogo/BrandLogo";

export default function HeaderLogo() {
  return (
    <div className="order-1 col-span-6 w-auto lg:col-span-2 lg:w-full">
<<<<<<< HEAD
      <Link href="/" aria-label="صفحه اصلی آریا پخش">
        <div className="flex items-center justify-end gap-2 xl:justify-start">
          <BrandLogo priority />
=======
      <Link href="/">
        <div className="flex items-center justify-end xl:justify-start">
          <Image
            width={50}
            height={50}
            className="object-contain"
            src="/images/logo/carup24-logo.png"
            priority
            alt="کارآپ ۲۴"
          />
          <span className="ms-3 md:text-[22px] md:font-bold font-semibold">کارآپ <span className="text-primary">۲۴</span></span>
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
        </div>
      </Link>
    </div>
  );
}
