// components/modules/auth/OtpResendCountdown.tsx
"use client";
import { useEffect, useRef, useState } from "react";

interface OtpResendCountdownProps {
  /** مدت شمارش معکوس بر حسب ثانیه (مثلاً 120) */
  seconds: number;
  /** وقتی شمارش به صفر رسید صدا زده می‌شود */
  onExpire?: () => void;
  className?: string;
}

/**
 * این کامپوننت state تیک‌خور (هر ثانیه) رو فقط داخل خودش نگه می‌داره،
 * نه داخل والد (StepOtp). در نتیجه هر ثانیه فقط همین تکست
 * ری‌رندر میشه، نه کل فرم OTP.
 *
 * مبنای محاسبه، timestamp مطلق هست (نه شمارنده‌ی prev-1)
 * تا در صورت تعویض تب یا throttle شدن setInterval توسط مرورگر
 * هم عدد درست نمایش داده بشه (drift نداشته باشیم).
 */
export default function OtpResendCountdown({
  seconds,
  onExpire,
  className,
}: OtpResendCountdownProps) {
  const targetRef = useRef<number | null>(null);
  const [remaining, setRemaining] = useState<number>(seconds);

  useEffect(() => {
    targetRef.current = Date.now() + seconds * 1000;

    if (seconds <= 0) return;

    const id = setInterval(() => {
      const target = targetRef.current;
      const left = target
        ? Math.max(0, Math.ceil((target - Date.now()) / 1000))
        : 0;
      setRemaining(left);
      if (left <= 0) {
        clearInterval(id);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  if (remaining <= 0) return null;

  return (
    <p className={className ?? "text-sm text-gray-500"}>
      ارسال مجدد تا {remaining} ثانیه دیگر
    </p>
  );
}
