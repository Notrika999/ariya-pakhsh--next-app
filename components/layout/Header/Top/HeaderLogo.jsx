import Link from "next/link";
import React from "react";

export default function HeaderLogo() {
  return (
    <div className="lg:col-span-2 lg:order-1 order-2 col-span-4 w-full">
      <Link href="/">
        <div className="xl:text-start text-center flex items-center xl:justify-start justify-center">
          <img
            className="h-12 dark:invert"
            src="/images/logo.png"
            loading="lazy"
            alt=""
          />
        </div>
      </Link>
    </div>
  );
}
