"use client";

import { useState } from "react";

export default function NewsletterCTA() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-bl from-slate-800 via-slate-900 to-slate-950 px-5 py-8 text-white shadow-[0_22px_55px_-38px_rgba(15,23,42,0.9)] md:px-8 md:py-10">
      <span className="absolute -end-16 -top-20 size-48 rounded-full border border-white/10" aria-hidden="true" />
      <span className="absolute -bottom-24 -start-12 size-52 rounded-full border border-white/5" aria-hidden="true" />
      <div className="relative mx-auto max-w-2xl text-center">
        <span className="mx-auto mb-4 grid size-11 place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/15" aria-hidden="true">
          <i className="far fa-envelope-open-text" />
        </span>
        <h2 className="text-xl font-bold text-white">
          مطالب کاربردی خودرو را از دست ندهید
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-300">
          گزیده‌ای از بهترین راهنماها و بررسی‌های خودرو، بدون پیام‌های اضافی.
        </p>

        {submitted ? (
          <p className="mt-5 text-sm font-medium text-orange-300" role="status">
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
              className="h-11 flex-1 rounded-xl border border-white/15 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-white focus:ring-4 focus:ring-white/10"
            />
            <button
              type="submit"
              className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              عضویت
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
