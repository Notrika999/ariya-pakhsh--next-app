// components/ui/Categories/Filter/PriceRangeFilter.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, FocusEvent, KeyboardEvent, PointerEvent } from "react";

const MIN_PRICE_GAP = 500;
const PRICE_STEP = 500;
const THUMB_SIZE = 16;

type Props = {
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
};

export default function PriceRangeFilter({ min, max, value, onChange }: Props) {
  type ActiveThumb = "min" | "max";

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
  const [activeThumb, setActiveThumb] = useState<ActiveThumb | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<ActiveThumb | null>(null);
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

  const pushToURL = useCallback((newMin: number, newMax: number) => {
    const normalized = normalizeRange(newMin, newMax);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onChange(normalized);
    }, 500);
  }, [normalizeRange, onChange]);

  const range = max - min || 1;

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const updateTrackWidth = () => setTrackWidth(slider.clientWidth);

    updateTrackWidth();

    const resizeObserver = new ResizeObserver(updateTrackWidth);
    resizeObserver.observe(slider);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  // چون dir="ltr" هست و UI فارسی:
  // چپ = گران‌ترین (max) ← راست = ارزان‌ترین (min)
  // پس percent رو برعکس حساب میکنیم
  // minPercent = درصد از چپ برای نمایش thumb ارزان‌ترین (سمت راست slider)
  // maxPercent = درصد از چپ برای نمایش thumb گران‌ترین (سمت چپ slider)
  const minPercentFromLeft =
    100 - Math.min(Math.max(((localMin - min) / range) * 100, 0), 100);
  const maxPercentFromLeft =
    100 - Math.min(Math.max(((localMax - min) / range) * 100, 0), 100);
  const minThumbGapPercent = trackWidth ? (THUMB_SIZE / trackWidth) * 100 : 0;

  let minVisualPercentFromLeft = minPercentFromLeft;
  let maxVisualPercentFromLeft = maxPercentFromLeft;

  if (minVisualPercentFromLeft - maxVisualPercentFromLeft < minThumbGapPercent) {
    if (activeThumb === "max") {
      maxVisualPercentFromLeft = Math.max(
        0,
        minVisualPercentFromLeft - minThumbGapPercent,
      );

      if (maxVisualPercentFromLeft === 0) {
        minVisualPercentFromLeft = Math.min(100, minThumbGapPercent);
      }
    } else {
      minVisualPercentFromLeft = Math.min(
        100,
        maxVisualPercentFromLeft + minThumbGapPercent,
      );

      if (minVisualPercentFromLeft === 100) {
        maxVisualPercentFromLeft = Math.max(0, 100 - minThumbGapPercent);
      }
    }
  }

  // برای input‌ها: مقدار رو invert میکنیم تا کشیدن به چپ = افزایش قیمت
  // invert: invertedVal = max + min - realVal
  const invert = (val: number) => max + min - val;

  const getValueFromPointer = useCallback(
    (clientX: number) => {
      const slider = sliderRef.current;
      if (!slider) return null;

      const rect = slider.getBoundingClientRect();
      if (rect.width <= 0) return null;

      const percentFromLeft = Math.min(
        Math.max(((clientX - rect.left) / rect.width) * 100, 0),
        100,
      );
      const rawValue = min + ((100 - percentFromLeft) / 100) * range;
      const steppedValue =
        Math.round((rawValue - min) / PRICE_STEP) * PRICE_STEP + min;

      return clamp(steppedValue);
    },
    [clamp, min, range],
  );

  const applySliderValue = useCallback(
    (thumb: ActiveThumb, nextValue: number) => {
      if (thumb === "min") {
        const realVal = clampMin(nextValue, localMax);
        isInternalChange.current = true;
        setLocalMin(realVal);
        if (focusedInput !== "min") setMinInputValue(formatPrice(realVal));
        pushToURL(realVal, localMax);
        return;
      }

      const realVal = clampMax(nextValue, localMin);
      isInternalChange.current = true;
      setLocalMax(realVal);
      if (focusedInput !== "max") setMaxInputValue(formatPrice(realVal));
      pushToURL(localMin, realVal);
    },
    [
      clampMax,
      clampMin,
      focusedInput,
      formatPrice,
      localMax,
      localMin,
      pushToURL,
    ],
  );

  const getClosestThumb = useCallback(
    (clientX: number): ActiveThumb => {
      const slider = sliderRef.current;
      if (!slider) return "min";

      const rect = slider.getBoundingClientRect();
      if (rect.width <= 0) return "min";

      const percentFromLeft = Math.min(
        Math.max(((clientX - rect.left) / rect.width) * 100, 0),
        100,
      );
      const minDistance = Math.abs(percentFromLeft - minVisualPercentFromLeft);
      const maxDistance = Math.abs(percentFromLeft - maxVisualPercentFromLeft);

      return minDistance <= maxDistance ? "min" : "max";
    },
    [maxVisualPercentFromLeft, minVisualPercentFromLeft],
  );

  const handleSliderPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const requestedThumb = (e.target as HTMLElement).dataset.thumb as
      | ActiveThumb
      | undefined;
    const nextValue = getValueFromPointer(e.clientX);
    const nextActiveThumb = requestedThumb ?? getClosestThumb(e.clientX);

    if (nextValue === null) return;

    activeThumbRef.current = nextActiveThumb;
    setActiveThumb(nextActiveThumb);
    e.currentTarget.setPointerCapture(e.pointerId);
    applySliderValue(nextActiveThumb, nextValue);
  };

  const handleSliderPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const currentThumb = activeThumbRef.current;
    if (!currentThumb) return;

    const nextValue = getValueFromPointer(e.clientX);
    if (nextValue === null) return;

    applySliderValue(currentThumb, nextValue);
  };

  const stopSliderPointer = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    activeThumbRef.current = null;
    setActiveThumb(null);
  };

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
        <div
          ref={sliderRef}
          className="relative h-5 mt-8 touch-none select-none"
          dir="ltr"
          onPointerDown={handleSliderPointerDown}
          onPointerMove={handleSliderPointerMove}
          onPointerUp={stopSliderPointer}
          onPointerCancel={stopSliderPointer}
        >
          {/* track خاکستری */}
          <div className="absolute top-1/2 w-full h-2 -translate-y-1/2 bg-gray-200 rounded-full" />

          {/* track آبی — بین دو thumb (از maxPercentFromLeft تا minPercentFromLeft) */}
          <div
            className="absolute top-1/2 h-2 -translate-y-1/2 bg-blue-500 rounded-full"
            style={{
              left: `calc(${maxVisualPercentFromLeft}% + ${THUMB_SIZE / 2}px)`,
              width: `calc(${minVisualPercentFromLeft - maxVisualPercentFromLeft}% - ${THUMB_SIZE}px)`,
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
            className="range-thumb absolute inset-0 w-full h-full opacity-0 pointer-events-none"
            style={{ zIndex: 1 }}
          />

          {/* input برای localMax — مقدارش invert شده */}
          <input
            type="range"
            min={min}
            max={max}
            step={PRICE_STEP}
            value={invert(localMax)}
            onChange={handleMaxChange}
            className="range-thumb absolute inset-0 w-full h-full opacity-0 pointer-events-none"
            style={{ zIndex: 4 }}
          />

          {/* thumb بصری برای ارزان‌ترین (سمت راست) */}
          <div
            data-thumb="min"
            className="absolute top-1/2 z-10 h-4 w-4 -translate-y-1/2 cursor-pointer rounded-full border-2 border-blue-500 bg-white shadow"
            style={{ left: `calc(${minVisualPercentFromLeft}% - ${THUMB_SIZE / 2}px)` }}
          />

          {/* thumb بصری برای گران‌ترین (سمت چپ) */}
          <div
            data-thumb="max"
            className="absolute top-1/2 z-10 h-4 w-4 -translate-y-1/2 cursor-pointer rounded-full bg-blue-500 shadow"
            style={{ left: `calc(${maxVisualPercentFromLeft}% - ${THUMB_SIZE / 2}px)` }}
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
