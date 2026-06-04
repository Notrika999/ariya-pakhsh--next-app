"use client";

// components/amazing-deals/CountdownTimer.tsx
import { useEffect, useState, useCallback } from "react";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: string | Date;
  variant?: "hero" | "card";
  onExpire?: () => void;
}

function getTimeLeft(targetDate: string | Date): TimeLeft {
  const date =
    targetDate instanceof Date
      ? targetDate
      : new Date(targetDate.replace(/^TIME\s*/, ""));

  const diff = date.getTime() - Date.now();

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diff / 1000);

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function CountdownTimer({
  targetDate,
  variant = "card",
  onExpire,
}: CountdownTimerProps) {
  // const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
  //   getTimeLeft(targetDate),
  // );
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  useEffect(() => {
    const update = () => {
      setTimeLeft(getTimeLeft(targetDate));
    };

    update();
    const id = setInterval(update, 1000);

    return () => clearInterval(id);
  }, [targetDate]);

  const [expired, setExpired] = useState(false);

  const tick = useCallback(() => {
    const t = getTimeLeft(targetDate);
    setTimeLeft(t);
    if (t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
      setExpired(true);
      onExpire?.();
    }
  }, [targetDate, onExpire]);

  useEffect(() => {
    if (expired) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick, expired]);

  if (expired) {
    if (variant === "hero") {
      return (
        <span className="text-amber-400 font-bold text-lg">
          پیشنهاد منقضی شد
        </span>
      );
    }
    return <span className="text-xs text-red-400 font-medium">منقضی شده</span>;
  }

  if (!timeLeft) {
    return <span className="text-xs text-amber-600 font-mono">00:00:00</span>;
  }
  // ─── Hero variant ───────────────────────────────────────────────
  if (variant === "hero") {
    return (
      <div className="flex items-center gap-3" dir="ltr">
        {[
          { value: timeLeft.hours, label: "ساعت" },
          { value: timeLeft.minutes, label: "دقیقه" },
          { value: timeLeft.seconds, label: "ثانیه" },
        ].map(({ value, label }, i) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 min-w-[64px] text-center">
                <span className="text-3xl font-bold text-white tabular-nums font-mono">
                  {pad(value)}
                </span>
              </div>
              <span className="text-xs text-white/70 mt-1">{label}</span>
            </div>
            {i < 2 && (
              <span className="text-2xl font-bold text-amber-400 mb-4 select-none">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // ─── Card variant ───────────────────────────────────────────────
  const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 30;

  return (
    <div
      className={`flex items-center gap-1 text-xs font-mono font-bold dir-ltr ${
        isUrgent ? "text-red-500" : "text-amber-600"
      }`}
      dir="ltr"
    >
      <svg
        className="w-3 h-3 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <polyline points="12 6 12 12 16 14" strokeWidth="2" />
      </svg>
      <span>
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
      {isUrgent && (
        <span className="text-red-500 font-normal text-[10px] mr-1 font-sans">
          باقی مانده
        </span>
      )}
    </div>
  );
}
