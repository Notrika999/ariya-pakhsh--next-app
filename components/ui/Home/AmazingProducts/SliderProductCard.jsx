// SliderProductCard.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function useCountdown(targetISO) {
  const targetTime = useMemo(() => {
    // targetISO باید مثل: "2028-01-01T18:30:00.000Z" یا تاریخ قابل parse باشد
    return targetISO ? new Date(targetISO).getTime() : null;
  }, [targetISO]);

  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!targetTime) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [targetTime]);

  if (!targetTime) return { h: 0, m: 0, s: 0, done: true };

  const diff = Math.max(0, targetTime - now);
  const totalSeconds = Math.floor(diff / 1000);

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return { h, m, s, done: diff === 0 };
}

export default function SliderProductCard({ product }) {
  // product نمونه پیشنهادی:
  // { id, image, title, rating, colors: [{color, bg}], discountText, oldPrice, price, countdownToISO }
  const { h, m, s, done } = useCountdown(product?.countdownToISO);

  return (
    <div className="relative dark:border-gray-700 dark:shadow-[0_0_10px_rgba(0,0,0,0.6)] p-3 bg-white dark:bg-custom-dark transition-all duration-200 ease-in-out group">
      {/* Product Colors */}
      <ul className="absolute top-4 inset-s-3 space-y-1">
        {(product?.colors ?? []).slice(0, 6).map((c, idx) => (
          <li
            key={idx}
            className="w-2.5 h-2.5 rounded-full border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: c.bg }}
          />
        ))}
      </ul>

      {/* Timer */}
      <div
        className="countdown"
        style={{ direction: "ltr" }}
        aria-live="polite"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-200">
          <span>{pad2(h)}</span>
          <span>:</span>
          <span>{pad2(m)}</span>
          <span>:</span>
          <span>{pad2(s)}</span>
          {done && <span className="text-red-500 ms-2 text-xs">پایان</span>}
        </div>
      </div>

      {/* Thumbnail */}
      <div className="text-center flex items-center justify-center overflow-hidden">
        <Image
          width={160}
          height={160}
          src={product?.image ?? "/images/default.png"}
          alt={product?.title}
          loading="lazy"
          className="block h-40 object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Rating */}
      <div className="flex flex-row items-end mt-2">
        <span className="font-bold flex items-center text-xs text-gray-900 dark:text-gray-200 ms-1 mb-1">
          {product?.rating ?? 4}
          <span className="text-amber-400 text-xs ms-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m12 16.3l-3.7 2.825q-.275.225-.6.213t-.575-.188t-.387-.475t-.013-.65L8.15 13.4l-3.625-2.575q-.3-.2-.375-.525t.025-.6t.35-.488t.6-.212H9.6l1.45-4.8q.125-.35.388-.538T12 3.475t.563.188t.387.537L14.4 9h4.475q.35 0 .6.213t.35.487t.025.6t-.375.525L15.85 13.4l1.425 4.625q.125.35-.012.65t-.388.475t-.575.188t-.6-.213z"
              />
            </svg>
          </span>
        </span>
      </div>

      {/* Product Body */}
      <div className="mt-3">
        <h3 className="font-normal text-sm leading-6 max-h-12 min-h-12 mt-2 px-1 overflow-hidden group-hover:text-primary-600 dark:group-hover:text-primary-400 dark:text-gray-200 transition-colors duration-200">
          <a href="#" className="font-bold">
            {product?.title}
          </a>
        </h3>
      </div>

      {/* Price + Discount */}
      <div className="mt-2 flex justify-between items-end">
        <div className="bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-xl rounded-bl-md shadow shadow-red-500/50">
          {product?.discountText ?? "3%"}
        </div>

        <div className="flex flex-col justify-end min-h-10 h-10">
          <span className="text-xs text-gray-400 dark:text-gray-500 line-through tracking-wider text-left">
            {product?.oldPrice ?? "13,900,000"}
          </span>
          <span className="font-bold text-sm text-gray-900 dark:text-gray-200 tracking-wider text-left">
            {product?.price ?? "13,550,000"}
          </span>
        </div>
      </div>

      <Link
        className="absolute inset-0 w-full h-full"
        href={product.href}
        aria-label={`مشاهده ${product?.title}`}
      />
    </div>
  );
}
