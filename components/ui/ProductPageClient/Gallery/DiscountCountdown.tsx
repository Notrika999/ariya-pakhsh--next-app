"use client";

import React, { memo, useEffect, useMemo, useState } from "react";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export type DiscountCountdownProps = {
  /** ISO timestamp مثل `2028-01-01T15:30:00.000Z` یا تعداد ثانیه باقی‌مانده مثل `3600` */
  target?: string | number | null;
  /** تاریخ پایان — همراه با `time` (مثل `2028-01-01`) */
  date?: string;
  /** ساعت پایان — همراه با `date` (مثل `18:30`) */
  time?: string;
  className?: string;
  showDoneLabel?: boolean;
};

type CountdownDisplay = {
  d: number;
  h: number;
  m: number;
  s: number;
  showDays: boolean;
  done: boolean;
};

const FOUR_DAYS_IN_SECONDS = 4 * 24 * 60 * 60;

function splitRemainingTime(totalSeconds: number): Omit<CountdownDisplay, "done"> {
  const showDays = totalSeconds > FOUR_DAYS_IN_SECONDS;

  if (showDays) {
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return { d, h, m, s, showDays };
  }

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return { d: 0, h, m, s, showDays };
}

function resolveTargetTime(
  target?: string | number | null,
  date?: string,
  time?: string,
): number | null {
  if (date && time) {
    const parsed = new Date(`${date}T${time}:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed.getTime();
  }

  if (target === null || target === undefined || target === "") return null;

  if (typeof target === "number") {
    if (target <= 0) return null;
    return Date.now() + target * 1000;
  }

  const value = String(target).trim();
  if (!value || value === "0") return null;

  if (/^\d+$/.test(value)) {
    const seconds = Number.parseInt(value, 10);
    if (seconds <= 0) return null;
    return Date.now() + seconds * 1000;
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed.getTime();

  return null;
}

function DiscountCountdown({
  target,
  date,
  time,
  className = "",
  showDoneLabel = true,
}: DiscountCountdownProps) {
  const targetTime = useMemo(
    () => resolveTargetTime(target, date, time),
    [target, date, time],
  );

  const [display, setDisplay] = useState<CountdownDisplay>({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
    showDays: false,
    done: !targetTime,
  });

  useEffect(() => {
    if (!targetTime) {
      setDisplay({ d: 0, h: 0, m: 0, s: 0, showDays: false, done: true });
      return;
    }

    const tick = () => {
      const diff = Math.max(0, targetTime - Date.now());
      const totalSeconds = Math.floor(diff / 1000);
      const done = diff === 0;
      const next = { ...splitRemainingTime(totalSeconds), done };

      setDisplay((prev) =>
        prev.d === next.d &&
        prev.h === next.h &&
        prev.m === next.m &&
        prev.s === next.s &&
        prev.showDays === next.showDays &&
        prev.done === next.done
          ? prev
          : next,
      );

      return done;
    };

    if (tick()) return;

    const id = window.setInterval(() => {
      if (tick()) window.clearInterval(id);
    }, 1000);

    return () => window.clearInterval(id);
  }, [targetTime]);

  if (!targetTime) return null;

  const { d, h, m, s, showDays, done } = display;

  return (
    <div
      className={`countdown ${className}`.trim()}
      style={{ direction: "ltr" }}
      aria-live="polite"
    >
      <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-200">
        {showDays && (
          <>
            <span>{d}</span>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              روز
            </span>
            <span>:</span>
          </>
        )}
        <span>{pad2(h)}</span>
        <span>:</span>
        <span>{pad2(m)}</span>
        <span>:</span>
        <span>{pad2(s)}</span>
        {showDoneLabel && done && (
          <span className="text-red-500 ms-2 text-xs">پایان</span>
        )}
      </div>
    </div>
  );
}

export default memo(DiscountCountdown);
