import { Suspense } from "react";
import Link from "next/link";
<<<<<<< HEAD
import MagazineSearchForm from "./MagazineSearchForm";
import BrandLogo from "@/components/modules/BrandLogo/BrandLogo";

export default function MagazineHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 shadow-[0_8px_30px_-24px_rgba(15,23,42,0.55)] backdrop-blur-md dark:border-zinc-800 dark:bg-custom-dark/95">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 md:grid-cols-[auto_minmax(16rem,28rem)_auto] md:px-6 lg:px-8">
        <div className="col-start-1 row-start-1 flex min-w-0 items-center gap-3">
          <Link
            href="/mag"
            className="flex shrink-0 items-center rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="صفحه اصلی مجله کارآپ۲۴"
          >
            <BrandLogo showText={false} logoClassName="h-12 w-12" priority />
          </Link>
          <Link href="/mag" className="min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <p className="text-xs font-medium tracking-wide text-primary">مجله خودرو</p>
            <p className="truncate text-base font-bold leading-7 text-slate-900 md:text-lg dark:text-white">
=======
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
              className="object-contain"
            />
          </Link>
          <Link href="/mag" className="min-w-0">
            <p className="text-xs font-medium text-primary">مجله خودرو</p>
            <p className="text-base font-bold leading-7 text-gray-900 md:text-lg dark:text-white">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
              مجله خودرو کارآپ<span className="text-primary">۲۴</span>
            </p>
          </Link>
        </div>

<<<<<<< HEAD
        <div className="col-span-2 row-start-2 min-w-0 md:col-span-1 md:col-start-2 md:row-start-1">
          <Suspense
            fallback={
              <div className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900" />
=======
        <div className="flex items-center gap-3">
          <Suspense
            fallback={
              <div className="h-10 min-w-0 flex-1 rounded-md border border-gray-200 bg-gray-50 md:w-72 dark:border-zinc-700 dark:bg-zinc-900" />
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
            }
          >
            <MagazineSearchForm />
          </Suspense>
<<<<<<< HEAD
        </div>

        <Link
          href="/"
          className="group col-start-2 row-start-1 inline-flex h-11 w-fit shrink-0 items-center justify-center justify-self-end gap-2 rounded-xl bg-slate-900 px-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 md:col-start-3 md:px-4 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <i className="far fa-store text-sm text-primary" aria-hidden="true" />
          <span className="hidden sm:inline">رفتن به فروشگاه</span>
          <span className="sm:hidden">فروشگاه</span>
          <i
            className="far fa-arrow-left-long text-xs opacity-70 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
=======

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
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      </div>
    </header>
  );
}
