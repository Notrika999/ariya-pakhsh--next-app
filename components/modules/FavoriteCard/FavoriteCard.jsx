"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function FavoriteCard({
  title,
  image,
  href = "#",
  discount,
  rating,
  price,
  originalPrice,
  colors = [],
  inStock = true,
  hasPriceDropped = false,
  onRemove,
  removing = false,
}) {
  const showDiscount = typeof discount === "number" && discount > 0;
  const showRating = typeof rating === "number" && rating > 0;

  return (
    <div className="relative dark:border-gray-700 dark:shadow-[0_0_10px_rgba(0,0,0,0.6)] rounded p-3 bg-white dark:bg-zinc-800 transition-all duration-200 ease-in-out group">
      {colors.length > 0 && (
        <ul className="absolute top-4 inset-s-3 space-y-1 z-10">
          {colors.map((color, index) => (
            <li
              key={index}
              className="w-2.5 h-2.5 rounded-full border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: color }}
            ></li>
          ))}
        </ul>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          disabled={removing}
          aria-label="حذف از علاقه‌مندی‌ها"
          className="absolute top-3 inset-s-3 z-20 flex size-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-900/90 dark:hover:bg-red-950/40"
        >
          <i className={`far ${removing ? "fa-spinner fa-spin" : "fa-trash-can"} text-sm`} />
        </button>
      )}

      <div className="text-center flex items-center justify-center overflow-hidden">
        <Image
          width={160}
          height={160}
          src={image ?? "/images/default.png"}
          alt={title}
          loading="lazy"
          className="block h-40 object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {showDiscount && (
        <div className="absolute inset-e-3 top-3 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-xl rounded-bl-md shadow shadow-red-500/50 z-10">
          {discount}%
        </div>
      )}

      {!inStock && (
        <div className="absolute inset-e-3 top-3 z-10 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
          اتمام کالا
        </div>
      )}

      {hasPriceDropped && inStock && !showDiscount && (
        <div className="absolute inset-e-3 top-3 z-10 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
          کاهش قیمت
        </div>
      )}

      <div className="mt-3">
        <h3 className="font-normal text-sm leading-6 max-h-12 min-h-12 mt-2 px-1 overflow-hidden group-hover:text-primary-600 dark:group-hover:text-primary-400 dark:text-gray-200 text-gray-900 transition-colors duration-200">
          <Link href={href} className="font-bold relative z-10">
            {title}
          </Link>
        </h3>
      </div>

      <div className="mt-2 flex justify-between items-end">
        <div className="flex flex-row items-end mt-2">
          {showRating ? (
            <span className="font-bold flex items-center text-xs text-gray-900 dark:text-gray-200 ms-1 mb-1">
              {rating}
              <span className="text-amber-400 text-xs ms-1">
                <i className="fas fa-star"></i>
              </span>
            </span>
          ) : (
            <span className="text-[11px] text-gray-400 dark:text-gray-500 ms-1 mb-1">
              بدون امتیاز
            </span>
          )}
        </div>

        <div className="flex flex-col justify-end min-h-10 h-10">
          {originalPrice && originalPrice !== price && (
            <span className="text-xs text-gray-400 dark:text-gray-500 line-through tracking-wider text-left">
              {originalPrice}
            </span>
          )}
          <span className="font-bold text-sm text-gray-900 dark:text-gray-200 tracking-wider text-left">
            {price}
          </span>
        </div>
      </div>

      <Link className="absolute inset-0 w-full h-full" href={href} aria-label={title} />
    </div>
  );
}
