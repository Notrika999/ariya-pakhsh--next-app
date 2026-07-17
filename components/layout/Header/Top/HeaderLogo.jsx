import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HeaderLogo() {
  return (
    <div className="lg:col-span-2 lg:order-1 order-2 col-span-4 w-full">
      <Link href="/">
        <div className="xl:text-start text-center flex items-center xl:justify-start justify-center">
          <Image
            width={124}
            height={48}
            className="h-12 dark:invert"
            src="/images/logo.png"
            priority
            alt="کارآپ ۲۴"
          />
        </div>
      </Link>
    </div>
  );
}
