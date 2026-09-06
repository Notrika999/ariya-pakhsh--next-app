import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import MagazineSearchForm from "./MagazineSearchForm";

export default function MagazineHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-custom-dark/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/mag"
            className="flex shrink-0 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Image
              src="/images/logo/carup24-logo.png"
              alt="کارآپ ۲۴"
              width={44}
              height={44}
              className="dark:invert dark:hue-rotate-180"
            />
          </Link>
          <Link href="/mag" className="min-w-0">
            <p className="text-xs font-medium text-primary">مجله خودرو</p>
            <p className="text-base font-bold leading-7 text-gray-900 md:text-lg dark:text-white">
              مجله خودرو کارآپ<span className="text-primary">۲۴</span>
            </p>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Suspense
            fallback={
              <div className="h-10 min-w-0 flex-1 rounded-md border border-gray-200 bg-gray-50 md:w-72 dark:border-zinc-700 dark:bg-zinc-900" />
            }
          >
            <MagazineSearchForm />
          </Suspense>

          <Link
  href="/"
  className="group inline-flex shrink-0 rounded-md border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-primary hover:text-primary dark:border-zinc-700 dark:text-gray-200"
>
  فروشگاه کارآپ{" "}
  <span className="text-primary transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-300">
    ۲۴
  </span>
</Link>
        </div>
      </div>
    </header>
  );
}
