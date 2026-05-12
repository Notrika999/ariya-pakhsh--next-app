"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  min: number;
  max: number;
  value: {
    min: number;
    max: number;
  };
  onChange: (value: { min: number; max: number }) => void;
};

export default function PriceRangeFilter({ min, max, value, onChange }: Props) {
  const [minValue, setMinValue] = useState(value.min);
  const [maxValue, setMaxValue] = useState(value.max);

  // سینک کردن استیت محلی با Props فقط وقتی مقادیر عددی واقعاً تغییر کنند
  useEffect(() => {
    setMinValue(value.min);
  }, [value.min]); // فقط به عدد وابسته است، نه کل آبجکت

  useEffect(() => {
    setMaxValue(value.max);
  }, [value.max]);

  const minPercent = useMemo(
    () => ((minValue - min) / (max - min)) * 100,
    [minValue, min, max],
  );

  const maxPercent = useMemo(
    () => ((maxValue - min) / (max - min)) * 100,
    [maxValue, min, max],
  );

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxValue - 1);
    setMinValue(val);
    onChange({ min: val, max: maxValue });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minValue + 1);
    setMaxValue(val);
    onChange({ min: minValue, max: val });
  };

  return (
    <div className="dark:bg-custom-dark dark:border-gray-700 dark:text-white bg-white rounded-lg drop-shadow-lg border-gray-300 border p-4">
      <h2 className="font-bold text-base mb-4 relative pb-4 before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary after:absolute after:w-40 after:h-2 after:bottom-0 after:inset-s-4 after:bg-primary after:rounded-lg">
        محدوده قیمت
      </h2>

      <div className="space-y-6">
        <div className="">
          {" "}
          {/* Added ltr:flex-row-reverse for Digikala style price inputs */}
          {/* Min Price Input */}
          <div className="flex-1 text-center">
            <span className="text-gray-500 text-xs block mb-1">از</span>
            <div className="flex items-baseline justify-center border-b border-gray-300 pb-1">
              <span className="font-bold text-lg text-gray-800 dark:text-white">
                {minValue.toLocaleString("fa-IR")}
              </span>
              <span className="mr-1 text-sm text-gray-600 dark:text-gray-300">
                تومان
              </span>
            </div>
          </div>
          {/* Max Price Input */}
          <div className="mt-1 text-center">
            <span className="text-gray-500 text-xs block mb-1">تا</span>
            <div className="flex items-baseline justify-center border-b border-gray-300 pb-1">
              <span className="font-bold text-lg text-gray-800 dark:text-white">
                {maxValue.toLocaleString("fa-IR")}
              </span>
              <span className="mr-1 text-sm text-gray-600 dark:text-gray-300">
                تومان
              </span>
            </div>
          </div>
        </div>

        <div className="relative h-2 mt-8">
          {" "}
          {/* Increased margin top */}
          <div className="absolute top-1 w-full h-2 bg-gray-200 rounded-full" />
          <div
            className="absolute top-1 h-2 bg-blue-500 rounded-full" // Changed to blue-500 for Digikala look
            style={{
              right: `${minPercent}%`,
              left: `${100 - maxPercent}%`,
            }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={maxValue}
            onChange={handleMaxChange}
            className="range-thumb"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={minValue}
            onChange={handleMinChange}
            className="range-thumb"
          />
        </div>

        {/* Labels for "ارزان‌ترین" and "گران‌ترین" */}
        <div className="flex justify-between text-xs text-gray-500 mt-4 ltr:flex-row-reverse">
          {" "}
          {/* Added ltr:flex-row-reverse for Digikala style labels */}
          <span>گران‌ترین</span>
          <span>ارزان‌ترین</span>
        </div>
      </div>
    </div>
  );
}
