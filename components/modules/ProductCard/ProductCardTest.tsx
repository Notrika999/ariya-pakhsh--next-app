"use client";

// components/amazing-deals/ProductCard.tsx
import Image from "next/image";
import { useState, useCallback } from "react";
import { Product } from "@/src/lib/types/productTypes";
import { formatPrice } from "@/lib/mock-data";
import CountdownTimer from "../CountdownTimer/CountdownTimer";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            className={`w-3.5 h-3.5 ${
              i < full
                ? "text-amber-400"
                : i === full && half
                  ? "text-amber-300"
                  : "text-stone-200"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-stone-500">
        {rating.toFixed(1)} ({new Intl.NumberFormat("fa-IR").format(count)} نظر)
      </span>
    </div>
  );
}

export default function ProductCardTest({ product }: ProductCardProps) {
  console.log("Product Cart Test => ", product);
  const [wishlist, setWishlist] = useState(false);
  const [expired, setExpired] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleCart = useCallback(() => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, []);

  const review = product?.review ?? { rating: 0, count: 0 };
  const image = product.image?.trim();
  const imageSrc = image
    ? image.startsWith("http")
      ? image
      : `https://aryapakhsh.shop/${image.replace(/^\/+/, "")}`
    : undefined;
  const original = Number(product.originalPrice ?? 0);
  const discounted = Number(product.discountedPrice ?? 0);

  const savings = original - discounted;

  return (
    <article
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
        expired
          ? "opacity-60 border-stone-200"
          : product.isFeatured
            ? "border-amber-200 shadow-lg shadow-amber-50"
            : "border-stone-100 shadow-sm"
      }`}
    >
      {/* Featured glow */}
      {/* {product.isFeatured && !expired && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-amber-300/40 pointer-events-none z-10" />
      )} */}

      {/* Wishlist */}
      <button
        onClick={() => setWishlist((w) => !w)}
        aria-label={
          wishlist ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
        }
        className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all hover:scale-110 hover:bg-white"
      >
        <svg
          className={`w-4 h-4 transition-colors ${
            wishlist ? "text-red-500 fill-red-500" : "text-stone-400"
          }`}
          fill={wishlist ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Discount badge */}
      <div className="absolute top-3 right-3 z-20">
        {product.discountPercent && (
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
            {product.discountPercent}٪
          </div>
        )}
        {product.specialSale && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200`}
          >
            ویژه
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative w-full h-48 bg-gradient-to-br from-stone-50 to-stone-100 overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Image
            src="/images/default.png"
            alt="تصویر پیش‌فرض محصول"
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Name */}
        <Link
          href={`/product/${product.id}`}
          className="text-sm font-bold text-stone-800 leading-relaxed line-clamp-2 min-h-10"
        >
          <span
            title={product.title ?? product.name}
            className="text-sm font-medium text-gray-900 dark:text-gray-200 text-s block"
          >
            {product.title}
          </span>
        </Link>

        {/* Rating */}
        {review && (
          <StarRating rating={review.rating ?? 0} count={review.count ?? 0} />
        )}

        {/* Countdown */}
        {product.dealEndsAt && !expired && (
          <div className="flex items-center justify-between bg-stone-50 rounded-xl px-3 py-2">
            <span className="text-[11px] text-stone-500">پایان پیشنهاد:</span>
            <CountdownTimer
              targetDate={new Date(product.dealEndsAt)}
              variant="card"
              onExpire={() => setExpired(true)}
            />
          </div>
        )}

        {/* Prices */}
        <div className="flex flex-col gap-1 pt-1 border-t border-stone-100">
          <div className="flex items-center gap-2">
            {product.oldPrice !== product.price && (
              <span className="text-[10px] text-stone-400 line-through">
                {formatPrice(product.oldPrice)} تومان
              </span>
            )}

            <span className=" font-black text-stone-900 tracking-tight">
              {formatPrice(product.price)}
              <span className="text-xs font-normal text-stone-500 mr-1">
                تومان
              </span>
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex">
          <button
            onClick={handleCart}
            disabled={expired}
            className={`w-full  py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              expired
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : addedToCart
                  ? "bg-emerald-500 text-white scale-95"
                  : "bg-stone-900 text-white hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-200 active:scale-95"
            }`}
          >
            {expired
              ? "پیشنهاد تمام شد"
              : addedToCart
                ? "✓ افزوده شد"
                : "افزودن به سبد"}
          </button>

          <Link
            href={`/product/${product.id}`}
            className="w-full py-2 rounded-xl text-sm text-center font-bold transition-all duration-200 bg-primary-500 hover:bg-primary-400 text-white scale-95"
          >
            جزییات
          </Link>
        </div>
      </div>
    </article>
  );
}
