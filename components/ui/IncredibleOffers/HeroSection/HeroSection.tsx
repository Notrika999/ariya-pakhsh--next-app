"use client";

import CountdownTimer from "@/components/modules/CountdownTimer/CountdownTimer";

// components/amazing-deals/HeroSection.tsx

const HERO_DEAL_END = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h from now

export default function HeroSection() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,.05) 40px, rgba(255,255,255,.05) 80px)",
          }}
        />
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 px-8 py-10 md:py-12">
        {/* Left side: icon + decorative */}
        <div className="hidden md:flex items-center justify-center w-32 h-32 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shrink-0">
          <svg
            className="w-16 h-16 text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </div>

        {/* Center: text */}
        <div className="flex-1 text-center md:text-right">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 rounded-full px-4 py-1.5 text-amber-300 text-xs font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            پیشنهاد ویژه — فقط امروز
          </div>

          <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">
            پیشنهاد{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
              شگفت‌انگیز
            </span>
          </h1>

          <p className="text-stone-300 text-sm md:text-base max-w-lg md:mx-0 mx-auto leading-relaxed">
            بهترین لوازم لوکس داخل خودرو با تخفیف‌های استثنایی تا{" "}
            <strong className="text-amber-300">۴۰٪</strong>— برند‌های اصل، ارسال
            امروز، گارانتی اصالت.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row items-center md:items-start gap-4">
            <a
              href="#products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-400/30 active:scale-95 text-sm"
            >
              مشاهده محصولات
              <svg
                className="w-4 h-4 rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Right: countdown */}
        <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
          <p className="text-xs text-stone-400 font-medium">
            پایان پیشنهاد تا:
          </p>
          <CountdownTimer targetDate={HERO_DEAL_END} variant="hero" />
          <p className="text-[11px] text-stone-500">
            ۲۴ ساعت ساعت رقابتی — عجله کن!
          </p>
        </div>
      </div>
    </section>
  );
}
