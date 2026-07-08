// components/amazing-deals/ProductCard.tsx

"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { ProductCardModel } from "@/src/lib/types/productTypes";
import { formatPrice } from "@/src/utils/formatPrice";
import CountdownTimer from "../CountdownTimer/CountdownTimer";
import Link from "next/link";
import { useCart } from "@/src/context/CartContext";

interface ProductCardProps {
  product: ProductCardModel;
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
                  : "text-stone-300 dark:text-stone-600"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-stone-500 dark:text-stone-400">
        {rating.toFixed(1)} ({new Intl.NumberFormat("fa-IR").format(count)} نظر)
      </span>
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const [wishlist, setWishlist] = useState(false);
  const [expired, setExpired] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem } = useCart();

  const handleCart = useCallback(() => {
    addItem({
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      oldPrice: product.oldPrice,
      href: product.href,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, [addItem, product]);

  const review = {
    rating: product.rating,
    count: product.reviewCount,
  };

  const showStockBadge = typeof product.inStock === "boolean";
  const showSaleBadge = product.isOnSale === true;
  const showPublicCode = Boolean(product.publicCode?.trim());
  const isOutOfStock = product.inStock === false;

  return (
    <article
      className={`group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
        expired
          ? "opacity-60 border-stone-200 dark:border-stone-700"
          : product.isFeatured
            ? "border-amber-200 dark:border-amber-800 shadow-lg shadow-amber-50 dark:shadow-amber-950/30"
            : "border-stone-100 dark:border-stone-800 shadow-sm"
      }`}
    >
      {/* Wishlist */}
      <button
        onClick={() => setWishlist((w) => !w)}
        aria-label={
          wishlist ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
        }
        className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all hover:scale-110 hover:bg-white dark:hover:bg-gray-800"
      >
        <svg
          className={`w-4 h-4 transition-colors ${
            wishlist
              ? "text-red-500 fill-red-500"
              : "text-stone-400 dark:text-stone-500"
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

      {/* Image */}
      <div className="relative w-full h-48 bg-white dark:bg-stone-800 flex items-center justify-center overflow-hidden">
        {(showStockBadge || showSaleBadge || product.discountPercent || product.specialSale) && (
          <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1">
            {showStockBadge && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${
                  product.inStock
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                }`}
              >
                {product.inStock ? "موجود در انبار" : "اتمام کالا"}
              </span>
            )}
            {showSaleBadge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                فروش ویژه
              </span>
            )}
            {product.discountPercent ? (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                {product.discountPercent}٪
              </span>
            ) : null}
            {product.specialSale && !showSaleBadge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                ویژه
              </span>
            )}
          </div>
        )}
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Name */}
        <Link
          href={product.href}
          className="leading-relaxed line-clamp-2 min-h-10"
        >
          <span
            title={product.title}
            className="text-sm font-medium text-gray-900 dark:text-gray-100 block"
          >
            {product.title}
          </span>
        </Link>

        {showPublicCode && (
          <p
            className="text-[11px] text-stone-500 dark:text-stone-400 -mt-2 hidden"
            dir="ltr"
          >
            {product.publicCode}
          </p>
        )}

        {/* Rating */}
        {review && (
          <StarRating rating={review.rating ?? 0} count={review.count ?? 0} />
        )}

        {/* Countdown */}
        {product.dealEndsAt && !expired && (
          <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-800 rounded-xl px-3 py-2">
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              پایان پیشنهاد:
            </span>
            <CountdownTimer
              targetDate={new Date(product.dealEndsAt)}
              variant="card"
              onExpire={() => setExpired(true)}
            />
          </div>
        )}

        {/* Prices */}
        <div className="flex flex-col gap-1 pt-1 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            {product.oldPrice !== product.price && (
              <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 line-through text-nowrap">
                {formatPrice(product?.oldPrice)}
              </span>
            )}
            <span className="font-black text-stone-900 dark:text-stone-100 tracking-tight text-lg text-nowrap text-left inline-block mr-auto">
              {formatPrice(product.price)}
              <span className="inline-block text-[11px] font-bold -rotate-90 text-stone-500 dark:text-stone-400 border-b border-stone-300 dark:border-stone-600">
                تومان
              </span>
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-2">
          {isOutOfStock ? (
            <Link
              href={product.href}
              className="w-full py-2 rounded-xl text-sm text-center font-bold transition-all duration-200 bg-primary hover:bg-primary-600 text-white shadow-sm hover:shadow-md active:scale-95 dark:hover:bg-primary/80"
            >
              به من اطلاع بده
            </Link>
          ) : (
            <button
              onClick={handleCart}
              disabled={expired}
              className={`w-full py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                expired
                  ? "bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed"
                  : addedToCart
                    ? "bg-emerald-500 text-white scale-95"
                    : "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-amber-500 dark:hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-900/30 active:scale-95"
              }`}
            >
              {expired
                ? "پیشنهاد تمام شد"
                : addedToCart
                  ? "✓ افزوده شد"
                  : "افزودن به سبد"}
            </button>
          )}

          <Link
            href={product.href}
            className="w-full py-2 rounded-xl text-sm text-center font-bold transition-all duration-200 bg-primary hover:bg-primary-400 text-white"
          >
            جزییات
          </Link>
        </div>
      </div>
    </article>
  );
}
