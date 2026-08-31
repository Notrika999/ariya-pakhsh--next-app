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
      className="relative min-w-0 flex-1 md:w-72"
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
        className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 pe-10 ps-3 text-sm text-gray-900 outline-none transition focus:border-primary focus:bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100"
      />
      <button
        type="submit"
        aria-label="جستجو"
        className="absolute inset-y-0 end-0 grid w-10 place-items-center text-gray-500 hover:text-primary"
      >
        <i className="far fa-magnifying-glass" aria-hidden="true" />
      </button>
    </form>
  );
}
