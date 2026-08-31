// components/layout/Header/Top/HeaderLogo.jsx

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HeaderLogo() {
  return (
    <div className="order-1 col-span-6 w-auto lg:col-span-2 lg:w-full">
      <Link href="/">
        <div className="flex items-center justify-end xl:justify-start">
          <Image
            width={60}
            height={60}
            className="dark:invert dark:hue-rotate-180"
            src="/images/logo/carup24-logo.png"
            priority
            alt="کارآپ ۲۴"
          />
          <span className="ms-3 md:text-xl md:font-bold font-semibold">کارآپ <span className="text-primary">۲۴</span></span>
        </div>
      </Link>
    </div>
  );
}
