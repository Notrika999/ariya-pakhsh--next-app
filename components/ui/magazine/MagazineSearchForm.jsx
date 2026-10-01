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
      className="relative w-full min-w-0"
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
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pe-11 ps-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100 dark:focus:border-zinc-500 dark:focus:bg-zinc-950 dark:focus:ring-zinc-800/60"
      />
      <button
        type="submit"
        aria-label="جستجو"
        className="absolute inset-y-0 end-0 grid w-11 place-items-center text-slate-500 transition hover:text-primary"
      >
        <i className="far fa-magnifying-glass" aria-hidden="true" />
      </button>
    </form>
  );
}
