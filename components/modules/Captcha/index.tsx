"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { CaptchaHandle } from "./Captcha.types";
import { CaptchaProps } from "./Captcha.types";
import { drawCaptcha, generateCaptchaText } from "./Captcha.utils";

const DEFAULTS = {
  length: 6,
  width: 240,
  height: 96,
  caseSensitive: false,
  autoRefreshInterval: 0,
  placeholder: "کد را وارد کن",
  expiryMs: 120_000, // 2 minutes
};

export const Captcha = forwardRef<CaptchaHandle, CaptchaProps>(function Captcha(
  {
    length = DEFAULTS.length,
    width = DEFAULTS.width,
    height = DEFAULTS.height,
    charset,
    caseSensitive = DEFAULTS.caseSensitive,
    autoRefreshInterval = DEFAULTS.autoRefreshInterval,
    onValidate,
    onSubmit,
    placeholder = DEFAULTS.placeholder,
    controlledValidation = false,
    className,
  },
  ref,
) {
  const [captchaText, setCaptchaText] = useState<string>(() =>
    generateCaptchaText(length, charset),
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(
    DEFAULTS.expiryMs / 1000,
  );
  const [expired, setExpired] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const refreshTimeoutRef = useRef<number | null>(null);
  const expiryIntervalRef = useRef<number | null>(null);

  const compareValues = useCallback(
    (raw: string): boolean => {
      if (!raw) return false;
      return caseSensitive
        ? raw === captchaText
        : raw.toLowerCase() === captchaText.toLowerCase();
    },
    [captchaText, caseSensitive],
  );

  const startExpiryTimer = useCallback(() => {
    if (expiryIntervalRef.current)
      window.clearInterval(expiryIntervalRef.current);
    setSecondsLeft(DEFAULTS.expiryMs / 1000);
    setExpired(false);

    const startTime = Date.now();
    expiryIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(
        0,
        Math.round((DEFAULTS.expiryMs - elapsed) / 1000),
      );
      setSecondsLeft(remaining);
      if (remaining === 0) {
        window.clearInterval(expiryIntervalRef.current!);
        setExpired(true);
      }
    }, 1000);
  }, []);

  const refresh = useCallback(() => {
    setCaptchaText(generateCaptchaText(length, charset));
    setInputValue("");
    setIsValid(null);
    startExpiryTimer();
  }, [length, charset, startExpiryTimer]);

  const validate = useCallback(
    (value: string): boolean => {
      if (expired) {
        refresh();
        onValidate?.(false, value);
        return false;
      }
      const result = compareValues(value);
      setIsValid(result);
      onValidate?.(result, value);
      // If wrong → refresh captcha immediately
      if (!result) {
        setTimeout(() => refresh(), 600);
      }
      return result;
    },
    [compareValues, onValidate, expired, refresh],
  );

  useImperativeHandle(
    ref,
    (): CaptchaHandle => ({
      refresh,
      validate,
      getCaptchaText: () => captchaText,
    }),
    [refresh, validate, captchaText],
  );

  // Draw canvas on captchaText change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawCaptcha(canvas, captchaText, width, height);
  }, [captchaText, width, height]);

  // Start expiry timer on mount
  useEffect(() => {
    startExpiryTimer();
    return () => {
      if (expiryIntervalRef.current)
        window.clearInterval(expiryIntervalRef.current);
    };
  }, [startExpiryTimer]);

  // Optional external auto-refresh interval
  useEffect(() => {
    if (!autoRefreshInterval || autoRefreshInterval <= 0) return;
    const id = window.setInterval(() => refresh(), autoRefreshInterval);
    return () => window.clearInterval(id);
  }, [autoRefreshInterval, refresh]);

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current !== null)
        window.clearTimeout(refreshTimeoutRef.current);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setInputValue(next);
    if (controlledValidation) return;

    if (next.length >= captchaText.length) {
      const isMatch = compareValues(next);
      setIsValid(isMatch);
      onValidate?.(isMatch, next);
    } else if (isValid !== null) {
      setIsValid(null);
      onValidate?.(false, next);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const result = validate(inputValue);
      onSubmit?.(result, inputValue);
    }
  };

  const feedbackLabel = useMemo(() => {
    if (expired) return "کپچا منقضی شد. یک کد جدید دریافت کن.";
    if (isValid === null) return "";
    return isValid ? "کپچا مطابقت‌ دارد." : "کپچا اشتباه است.";
  }, [isValid, expired]);

  // Timer colour: green → yellow → red
  const timerColor =
    secondsLeft > 90
      ? "text-emerald-600"
      : secondsLeft > 30
        ? "text-amber-500"
        : "text-rose-600";

  const inputAriaInvalid = isValid === false ? true : undefined;

  return (
    <div className={["w-full max-w-md", className].filter(Boolean).join(" ")}>
      <div
        role="group"
        aria-label="CAPTCHA verification"
        className="flex flex-col gap-1.5 mb-4"
      >
        {/* Single row: input (right) | divider | canvas + refresh (left) */}
        <div
          className="flex items-stretch w-full rounded-xl border border-slate-300 bg-slate-50 overflow-hidden"
          dir="rtl"
        >
          {/* Right: label + input */}
          <div className="flex flex-col justify-center flex-1 px-3 py-2 gap-0.5">
            <span className="text-xs text-slate-400 text-right select-none">
              عبارت امنیتی
            </span>
            <label htmlFor="captcha-input" className="sr-only">
              {placeholder}
            </label>
            <input
              id="captcha-input"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              autoComplete="off"
              spellCheck={false}
              maxLength={length + 4}
              disabled={expired}
              aria-invalid={inputAriaInvalid}
              aria-describedby="captcha-feedback"
              className="bg-transparent border-none outline-none w-full text-sm text-slate-800 placeholder:text-slate-400 text-right disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Divider */}
          <div className="w-px self-stretch bg-slate-300" />

          {/* Left: refresh + timer + canvas */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 shrink-0">
            <div className="flex flex-col items-center gap-0.5">
              <button
                type="button"
                onClick={refresh}
                aria-label="Refresh CAPTCHA"
                title="Refresh CAPTCHA"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:text-slate-800 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <RefreshIcon />
              </button>
              {/* <span
                className={`text-[10px] font-mono font-semibold tabular-nums leading-none ${timerColor}`}
                aria-live="polite"
              >
                {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:{String(secondsLeft % 60).padStart(2, "0")}
              </span> */}
            </div>
            <div className="overflow-hidden rounded-md bg-slate-100">
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                role="img"
                aria-label="Distorted text used for CAPTCHA verification"
                className="block select-none"
                style={{ width, height }}
              />
            </div>
          </div>
        </div>

        {/* Feedback */}
        <p
          id="captcha-feedback"
          role={isValid === false || expired ? "alert" : "status"}
          aria-live="polite"
          className={[
            "text-xs text-right px-1",
            isValid === true && "text-emerald-600",
            (isValid === false || expired) && "text-rose-600",
            isValid === null && !expired && "text-slate-400",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {feedbackLabel || "عبارت تصویر را وارد کنید."}
        </p>
      </div>
    </div>
  );
});

export default Captcha;

export type {
  CaptchaHandle,
  CaptchaProps,
  CaptchaCharsetOptions,
} from "./Captcha.types";

function RefreshIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 4v5h-5" />
    </svg>
  );
}
