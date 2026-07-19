"use client";

import { memo, useEffect, useState } from "react";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";

export type GatewayRedirectDetail = {
  label: string;
  value: string | number | null | undefined;
  tone?: "default" | "success" | "warning" | "primary";
};

type GatewayRedirectConfirmationProps = {
  title?: string;
  description?: string;
  iconClassName?: string;
  iconWrapClassName?: string;
  details: GatewayRedirectDetail[];
  amountLabel: string;
  amountValue: string;
  starting?: boolean;
  seconds?: number;
  showCountdown?: boolean;
  cancelLabel?: string;
  proceedLabel?: string;
  proceedingLabel?: string;
  showCancel?: boolean;
  onCancel: () => void;
  onProceed: () => void;
};

const DEFAULT_SECONDS = 30;

const valueToneClassName: Record<NonNullable<GatewayRedirectDetail["tone"]>, string> = {
  default: "text-gray-900 dark:text-gray-100",
  success: "text-green-600 dark:text-green-400",
  warning: "text-amber-700 dark:text-amber-300",
  primary: "text-primary",
};

const Countdown = memo(function Countdown({
  seconds,
  disabled,
  onComplete,
}: {
  seconds: number;
  disabled: boolean;
  onComplete: () => void;
}) {
  const [remainingSeconds, setRemainingSeconds] = useState(seconds);

  useEffect(() => {
    if (disabled) return;

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          window.setTimeout(onComplete, 0);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [disabled, onComplete]);

  const progress = Math.max(0, Math.min(100, (remainingSeconds / seconds) * 100));

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
          انتقال خودکار به درگاه تا
        </span>
        <span className="rounded-lg bg-white px-3 py-1 text-lg font-black text-amber-700 shadow-sm dark:bg-zinc-900 dark:text-amber-300">
          {new Intl.NumberFormat("fa-IR").format(remainingSeconds)} ثانیه
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-amber-200 dark:bg-amber-950">
        <div
          className="h-full rounded-full bg-amber-500 transition-[width] duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-amber-800 dark:text-amber-100">
        در صورت تایید نکردن دستی، بعد از پایان زمان به صورت خودکار به درگاه منتقل می‌شوید.
      </p>
    </div>
  );
});

export default function GatewayRedirectConfirmation({
  title = "تایید انتقال به درگاه",
  description = "قبل از ورود به درگاه، خلاصه پرداخت را بررسی کنید.",
  iconClassName = "far fa-credit-card text-lg",
  iconWrapClassName = "bg-primary/10 text-primary",
  details,
  amountLabel,
  amountValue,
  starting = false,
  seconds = DEFAULT_SECONDS,
  showCountdown = true,
  cancelLabel = "انصراف از پرداخت",
  proceedLabel = "انتقال به درگاه",
  proceedingLabel = "در حال انتقال...",
  showCancel = true,
  onCancel,
  onProceed,
}: GatewayRedirectConfirmationProps) {
  const visibleDetails = details.filter(
    (detail) => detail.value !== null && detail.value !== undefined && detail.value !== "",
  );

  return (
    <SectionContainer>
      <div className="flex min-h-[70vh] items-center justify-center py-8">
        <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-custom-dark">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-5 dark:border-gray-700 dark:bg-zinc-900/60">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-black text-gray-900 dark:text-gray-100">
                  {title}
                </h1>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              </div>
              <div
                className={[
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                  iconWrapClassName,
                ].join(" ")}
              >
                <i className={iconClassName} />
              </div>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-zinc-900/60">
              <div className="space-y-3 text-sm">
                {visibleDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-gray-500 dark:text-gray-400">
                      {detail.label}
                    </span>
                    <span
                      className={[
                        "text-left font-bold",
                        valueToneClassName[detail.tone ?? "default"],
                      ].join(" ")}
                    >
                      {detail.value}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {amountLabel}
                    </span>
                    <span className="text-xl font-black text-primary">
                      {amountValue}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {showCountdown ? (
              <Countdown
                seconds={seconds}
                disabled={starting}
                onComplete={onProceed}
              />
            ) : null}

            <div
              className={[
                "grid grid-cols-1 gap-3",
                showCancel ? "sm:grid-cols-2" : "",
              ].join(" ")}
            >
              {showCancel ? (
                <button
                  type="button"
                  disabled={starting}
                  onClick={onCancel}
                  className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-zinc-900"
                >
                  {cancelLabel}
                </button>
              ) : null}
              <button
                type="button"
                disabled={starting}
                onClick={onProceed}
                className="rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {starting ? proceedingLabel : proceedLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
