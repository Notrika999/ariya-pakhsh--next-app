"use client";

export default function ErrorUI({
  message = "در حال حاضر مشکلی در دسترسی به سرویس به وجود آمده است.",
}: {
  message?: string;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white dark:bg-neutral-900 shadow-lg border border-neutral-200 dark:border-neutral-700 rounded-xl p-8 max-w-md w-full text-center animate-fadeIn">
        <div className="flex justify-center text-neutral-400 text-6xl mb-5">
          <i className="fa-solid fa-circle-exclamation"></i>
        </div>

        <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-100">
          خطایی رخ داده است
        </h2>

        <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-6 mb-2">
          {message}
        </p>

        <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-6 mt-4">
          تیم فنی در حال بررسی و رفع این مشکل است. لطفاً در زمان دیگری دوباره سر
          بزنید.
        </p>
      </div>
    </div>
  );
}
