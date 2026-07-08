import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/src/lib/seo/site";

export const metadata: Metadata = {
  title: "آفلاین",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-3xl text-primary">
        <i className="far fa-wifi-slash" aria-hidden />
      </div>
      <h1 className="mb-3 text-2xl font-bold">اتصال اینترنت برقرار نیست</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300">
        در حال حاضر به اینترنت دسترسی ندارید. لطفاً اتصال خود را بررسی کنید و
        دوباره تلاش کنید.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-primary px-6 py-3 font-medium text-white transition hover:opacity-90"
      >
        بازگشت به {SITE_NAME}
      </Link>
    </main>
  );
}
