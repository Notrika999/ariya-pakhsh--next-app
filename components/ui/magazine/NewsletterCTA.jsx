"use client";

import { useState } from "react";

export default function NewsletterCTA() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-8 dark:border-zinc-700 dark:bg-zinc-900/60 md:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          مطالب کاربردی خودرو را از دست ندهید
        </h2>
        <p className="mt-2 text-sm leading-7 text-gray-500 dark:text-gray-400">
          برای دریافت جدیدترین راهنماها و مطالب خودرو عضو خبرنامه شوید.
        </p>

        {submitted ? (
          <p className="mt-5 text-sm font-medium text-primary" role="status">
            عضویت شما ثبت شد. به‌زودی مطالب جدید را دریافت می‌کنید.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-5 flex max-w-md flex-col gap-2 sm:flex-row"
          >
            <label htmlFor="magazine-newsletter" className="sr-only">
              ایمیل
            </label>
            <input
              id="magazine-newsletter"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="ایمیل شما"
              className="h-11 flex-1 rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-primary dark:border-zinc-700 dark:bg-zinc-950"
            />
            <button
              type="submit"
              className="h-11 rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              عضویت
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
