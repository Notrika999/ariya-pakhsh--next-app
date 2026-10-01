"use client";

import { useSearchParams } from "next/navigation";

export default function MagazineSearchForm() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  return (
    <form
      action="/mag"
      method="get"
      role="search"
<<<<<<< HEAD
      className="relative w-full min-w-0"
=======
      className="relative min-w-0 flex-1 md:w-72"
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    >
      <label htmlFor="magazine-search" className="sr-only">
        جستجو در مجله
      </label>
      <input
        id="magazine-search"
        type="search"
        name="q"
        defaultValue={query}
        placeholder="جستجوی مطلب خودرو..."
<<<<<<< HEAD
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pe-11 ps-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100 dark:focus:border-zinc-500 dark:focus:bg-zinc-950 dark:focus:ring-zinc-800/60"
=======
        className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 pe-10 ps-3 text-sm text-gray-900 outline-none transition focus:border-primary focus:bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100"
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      />
      <button
        type="submit"
        aria-label="جستجو"
<<<<<<< HEAD
        className="absolute inset-y-0 end-0 grid w-11 place-items-center text-slate-500 transition hover:text-primary"
=======
        className="absolute inset-y-0 end-0 grid w-10 place-items-center text-gray-500 hover:text-primary"
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      >
        <i className="far fa-magnifying-glass" aria-hidden="true" />
      </button>
    </form>
  );
}
