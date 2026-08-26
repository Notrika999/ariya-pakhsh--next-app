"use client";

import Link from "next/link";

type ErrorVariant = "not-found" | "server" | "network";

interface ErrorUIProps {
  variant?: ErrorVariant;
  statusCode?: string | number;
  title?: string;
  message?: string;
  description?: string;
  onRetry?: () => void;
  digest?: string;
}

const VARIANT_CONFIG: Record<
  ErrorVariant,
  {
    statusCode: string;
    title: string;
    message: string;
    description: string;
    icon: string;
    gradient: string;
    accent: string;
  }
> = {
  "not-found": {
    statusCode: "404",
    title: "صفحه پیدا نشد",
    message: "آدرسی که وارد کرده‌اید وجود ندارد یا جابه‌جا شده است.",
    description:
      "می‌توانید به صفحه اصلی برگردید یا از بخش‌های سایت مسیر درست را پیدا کنید.",
    icon: "fa-map-location-dot",
    gradient: "from-blue-500 to-indigo-600",
    accent: "text-blue-600 dark:text-blue-400",
  },
  server: {
    statusCode: "500",
    title: "خطای داخلی سرور",
    message: "مشکلی در پردازش درخواست رخ داد.",
    description:
      "این خطا معمولاً موقت است. می‌توانید دوباره تلاش کنید یا کمی بعد برگردید.",
    icon: "fa-server",
    gradient: "from-red-500 to-rose-600",
    accent: "text-red-600 dark:text-red-400",
  },
  network: {
    statusCode: "NET",
    title: "ارتباط با سرویس برقرار نشد",
    message: "اتصال به سرور یا شبکه با مشکل مواجه شده است.",
    description:
      "امکان برقراری ارتباط با سرور وجود ندارد. لطفاً اتصال اینترنت خود را بررسی کنید، VPN یا ابزارهای تغییر مسیر اتصال را خاموش کنید و دوباره تلاش کنید. در صورت ادامه مشکل، ممکن است سرور موقتاً در دسترس نباشد.",
    icon: "fa-wifi",
    gradient: "from-amber-500 to-orange-600",
    accent: "text-amber-600 dark:text-amber-400",
  },
};

export default function ErrorUI({
  variant = "server",
  statusCode,
  title,
  message,
  description,
  onRetry,
  digest,
}: ErrorUIProps) {
  const config = VARIANT_CONFIG[variant];

  return (
    <section className="min-h-[70vh] px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/70 dark:border-gray-800 dark:bg-custom-dark dark:shadow-black/20">
        <div className="grid md:grid-cols-5">
          <div
            className={`md:col-span-2 bg-linear-to-br ${config.gradient} p-8 md:p-10 text-white flex flex-col items-center justify-center text-center`}
          >
            <div className="mb-5 flex size-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
              <i className={`fa-solid ${config.icon} text-4xl`} />
            </div>
            <div className="text-7xl font-black tracking-tight">
              {statusCode ?? config.statusCode}
            </div>
            <p className="mt-3 text-lg font-bold">{title ?? config.title}</p>
          </div>

          <div className="md:col-span-3 p-8 md:p-10" dir="rtl">
            <p className={`text-sm font-bold ${config.accent}`}>
              وضعیت درخواست
            </p>

            <h1 className="mt-3 text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">
              {title ?? config.title}
            </h1>

            <p className="mt-4 leading-8 text-gray-600 dark:text-gray-300">
              {message ?? config.message}
            </p>

            <p className="mt-2 text-sm leading-7 text-gray-500 dark:text-gray-400">
              {description ?? config.description}
            </p>

            {/* {digest && (
              <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
                کد پیگیری خطا: <span dir="ltr">{digest}</span>
              </div>
            )} */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-400"
                >
                  <i className="fa-regular fa-rotate-right" />
                  تلاش مجدد
                </button>
              )}

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <i className="fa-regular fa-house" />
                بازگشت به صفحه اصلی
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-500 transition hover:text-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <i className="fa-regular fa-headset" />
                پشتیبانی
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
