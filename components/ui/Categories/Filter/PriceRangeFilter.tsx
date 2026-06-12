// PriceRangeFilter.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
};

export default function PriceRangeFilter({ min, max, value, onChange }: Props) {
  const clamp = (val: number) => Math.min(Math.max(val, min), max);

  const [localMin, setLocalMin] = useState(() => clamp(value.min));
  const [localMax, setLocalMax] = useState(() => clamp(value.max));

  const isInternalChange = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isInternalChange.current) {
      setLocalMin(clamp(value.min));
      setLocalMax(clamp(value.max));
    }
    isInternalChange.current = false;
  }, [min, max, value.min, value.max]);

  const pushToURL = (newMin: number, newMax: number) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onChange({ min: newMin, max: newMax });
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
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const invertedVal = Number(e.target.value);
    const realVal = clamp(Math.min(invert(invertedVal), localMax - 1));
    isInternalChange.current = true;
    setLocalMin(realVal);
    pushToURL(realVal, localMax);
  };

  // وقتی input max (که نقش گران‌ترین رو داره) تغییر میکنه:
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const invertedVal = Number(e.target.value);
    const realVal = clamp(Math.max(invert(invertedVal), localMin + 1));
    isInternalChange.current = true;
    setLocalMax(realVal);
    pushToURL(localMin, realVal);
  };

  const THUMB = 16;

  return (
    <div className="space-y-6">
        <div>
          {/* Min Price */}
          <div className="flex-1 text-center">
            <span className="text-gray-500 text-xs block mb-1">از</span>
            <div className="flex items-baseline justify-center border-b border-gray-300 pb-1">
              <span className="font-bold text-lg text-gray-800 dark:text-white">
                {localMin?.toLocaleString("fa-IR")}
              </span>
              <span className="mr-1 text-sm text-gray-600 dark:text-gray-300">
                تومان
              </span>
            </div>
          </div>
          {/* Max Price */}
          <div className="mt-1 text-center">
            <span className="text-gray-500 text-xs block mb-1">تا</span>
            <div className="flex items-baseline justify-center border-b border-gray-300 pb-1">
              <span className="font-bold text-lg text-gray-800 dark:text-white">
                {localMax?.toLocaleString("fa-IR")}
              </span>
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
