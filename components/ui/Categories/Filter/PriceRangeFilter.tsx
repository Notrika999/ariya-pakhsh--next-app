// components/ui/Categories/Filter/PriceRangeFilter.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, FocusEvent, KeyboardEvent } from "react";

const MIN_PRICE_GAP = 500;
const PRICE_STEP = 500;

type Props = {
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
};

export default function PriceRangeFilter({ min, max, value, onChange }: Props) {
  const clamp = useCallback(
    (val: number) => Math.min(Math.max(val, min), max),
    [max, min],
  );
  const clampMin = useCallback(
    (val: number, currentMax: number) =>
      clamp(Math.min(val, currentMax - MIN_PRICE_GAP)),
    [clamp],
  );
  const clampMax = useCallback(
    (val: number, currentMin: number) =>
      clamp(Math.max(val, currentMin + MIN_PRICE_GAP)),
    [clamp],
  );
  const normalizeRange = useCallback(
    (nextMin: number, nextMax: number) => {
      const safeMin = clamp(nextMin);
      const safeMax = clamp(Math.max(nextMax, safeMin + MIN_PRICE_GAP));

      if (safeMax > max) {
        return {
          min: clamp(Math.min(safeMin, max - MIN_PRICE_GAP)),
          max,
        };
      }

      return {
        min: safeMin,
        max: safeMax,
      };
    },
    [clamp, max],
  );

  const [localMin, setLocalMin] = useState(
    () => normalizeRange(value.min, value.max).min,
  );
  const [localMax, setLocalMax] = useState(
    () => normalizeRange(value.min, value.max).max,
  );
  const formatPrice = useCallback(
    (price: number) => price.toLocaleString("fa-IR"),
    [],
  );
  const [minInputValue, setMinInputValue] = useState(() =>
    formatPrice(normalizeRange(value.min, value.max).min),
  );
  const [maxInputValue, setMaxInputValue] = useState(() =>
    formatPrice(normalizeRange(value.min, value.max).max),
  );
  const [focusedInput, setFocusedInput] = useState<"min" | "max" | null>(null);

  const isInternalChange = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const parsePriceInput = (rawValue: string) => {
    const normalized = rawValue
      .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
      .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
      .replace(/[^\d]/g, "");

    return normalized ? Number(normalized) : null;
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!isInternalChange.current) {
      const normalized = normalizeRange(value.min, value.max);
      setLocalMin(normalized.min);
      setLocalMax(normalized.max);
      if (focusedInput !== "min") setMinInputValue(formatPrice(normalized.min));
      if (focusedInput !== "max") setMaxInputValue(formatPrice(normalized.max));
    }
    isInternalChange.current = false;
  }, [focusedInput, formatPrice, normalizeRange, value.min, value.max]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const pushToURL = (newMin: number, newMax: number) => {
    const normalized = normalizeRange(newMin, newMax);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onChange(normalized);
    }, 500);
  };

  const range = max - min || 1;

  // چون dir="ltr" هست و UI فارسی:
  // چپ = گران‌ترین (max) ← راست = ارزان‌ترین (min)
  // پس percent رو برعکس حساب میکنیم
  // minPercent = درصد از چپ برای نمایش thumb ارزان‌ترین (سمت راست slider)
  // maxPercent = درصد از چپ برای نمایش thumb گران‌ترین (سمت چپ slider)
  const minPercentFromLeft =
    100 - Math.min(Math.max(((localMin - min) / range) * 100, 0), 100);
  const maxPercentFromLeft =
    100 - Math.min(Math.max(((localMax - min) / range) * 100, 0), 100);

  // برای input‌ها: مقدار رو invert میکنیم تا کشیدن به چپ = افزایش قیمت
  // invert: invertedVal = max + min - realVal
  const invert = (val: number) => max + min - val;

  // وقتی input min (که نقش ارزان‌ترین رو داره) تغییر میکنه:
  // input value = invert(localMin) → وقتی بره سمت چپ، localMin کم میشه (ارزان‌تر)
  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const invertedVal = Number(e.target.value);
    const realVal = clampMin(invert(invertedVal), localMax);
    isInternalChange.current = true;
    setLocalMin(realVal);
    if (focusedInput !== "min") setMinInputValue(formatPrice(realVal));
    pushToURL(realVal, localMax);
  };

  // وقتی input max (که نقش گران‌ترین رو داره) تغییر میکنه:
  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const invertedVal = Number(e.target.value);
    const realVal = clampMax(invert(invertedVal), localMin);
    isInternalChange.current = true;
    setLocalMax(realVal);
    if (focusedInput !== "max") setMaxInputValue(formatPrice(realVal));
    pushToURL(localMin, realVal);
  };

  const handleManualMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setMinInputValue(rawValue);
    const parsedValue = parsePriceInput(rawValue);
    if (parsedValue === null) return;

    const realVal = clampMin(parsedValue, localMax);
    isInternalChange.current = true;
    setLocalMin(realVal);
    pushToURL(realVal, localMax);
  };

  const handleManualMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setMaxInputValue(rawValue);
    const parsedValue = parsePriceInput(rawValue);
    if (parsedValue === null) return;

    const realVal = clampMax(parsedValue, localMin);
    isInternalChange.current = true;
    setLocalMax(realVal);
    pushToURL(localMin, realVal);
  };

  const handleManualMinBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocusedInput(null);
    const parsedValue = parsePriceInput(e.target.value);
    const realVal =
      parsedValue === null ? localMin : clampMin(parsedValue, localMax);
    setLocalMin(realVal);
    setMinInputValue(formatPrice(realVal));
    pushToURL(realVal, localMax);
  };

  const handleManualMaxBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocusedInput(null);
    const parsedValue = parsePriceInput(e.target.value);
    const realVal =
      parsedValue === null ? localMax : clampMax(parsedValue, localMin);
    setLocalMax(realVal);
    setMaxInputValue(formatPrice(realVal));
    pushToURL(localMin, realVal);
  };

  const handleManualInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const THUMB = 16;

  return (
    <div className="space-y-6">
        <div>
          {/* Min Price */}
          <div className="flex-1 text-center">
            <span className="text-gray-500 text-xs block mb-1">از</span>
            <div className="flex items-baseline justify-center border-b border-gray-300 pb-1">
              <input
                type="text"
                inputMode="numeric"
                aria-label="حداقل قیمت"
                value={minInputValue}
                onFocus={() => {
                  setFocusedInput("min");
                  setMinInputValue(String(localMin));
                }}
                onChange={handleManualMinChange}
                onBlur={handleManualMinBlur}
                onKeyDown={handleManualInputKeyDown}
                className="w-28 bg-transparent text-center font-bold text-lg text-gray-800 outline-none dark:text-white"
              />
              <span className="mr-1 text-sm text-gray-600 dark:text-gray-300">
                تومان
              </span>
            </div>
          </div>
          {/* Max Price */}
          <div className="mt-1 text-center">
            <span className="text-gray-500 text-xs block mb-1">تا</span>
            <div className="flex items-baseline justify-center border-b border-gray-300 pb-1">
              <input
                type="text"
                inputMode="numeric"
                aria-label="حداکثر قیمت"
                value={maxInputValue}
                onFocus={() => {
                  setFocusedInput("max");
                  setMaxInputValue(String(localMax));
                }}
                onChange={handleManualMaxChange}
                onBlur={handleManualMaxBlur}
                onKeyDown={handleManualInputKeyDown}
                className="w-28 bg-transparent text-center font-bold text-lg text-gray-800 outline-none dark:text-white"
              />
              <span className="mr-1 text-sm text-gray-600 dark:text-gray-300">
                تومان
              </span>
            </div>
          </div>
        </div>

        {/* Slider — dir="ltr" ولی مقادیر invert شدن */}
        <div className="relative h-2 mt-8" dir="ltr">
          {/* track خاکستری */}
          <div className="absolute top-1 w-full h-2 bg-gray-200 rounded-full" />

          {/* track آبی — بین دو thumb (از maxPercentFromLeft تا minPercentFromLeft) */}
          <div
            className="absolute top-1 h-2 bg-blue-500 rounded-full"
            style={{
              left: `calc(${maxPercentFromLeft}% + ${THUMB / 2}px)`,
              width: `calc(${minPercentFromLeft - maxPercentFromLeft}% - ${THUMB}px)`,
            }}
          />

          {/* input برای localMin — مقدارش invert شده */}
          <input
            type="range"
            min={min}
            max={max}
            step={PRICE_STEP}
            value={invert(localMin)}
            onChange={handleMinChange}
            className="range-thumb absolute w-full h-full opacity-0 cursor-pointer"
            style={{ zIndex: localMin < min + range * 0.1 ? 5 : 3 }}
          />

          {/* input برای localMax — مقدارش invert شده */}
          <input
            type="range"
            min={min}
            max={max}
            step={PRICE_STEP}
            value={invert(localMax)}
            onChange={handleMaxChange}
            className="range-thumb absolute w-full h-full opacity-0 cursor-pointer"
            style={{ zIndex: 4 }}
          />

          {/* thumb بصری برای ارزان‌ترین (سمت راست) */}
          <div
            className="absolute top-1/1 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full pointer-events-none shadow"
            style={{ left: `calc(${minPercentFromLeft}% - 10px)` }}
          />

          {/* thumb بصری برای گران‌ترین (سمت چپ) */}
          <div
            className="absolute top-1/1 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full pointer-events-none shadow"
            style={{ left: `calc(${maxPercentFromLeft}% - 6px)` }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-4">
          <span>ارزان‌ترین</span>
          <span>گران‌ترین</span>
        </div>
    </div>
  );
}
