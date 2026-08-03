// components/modules/ProductCard/ProductCard.tsx

"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProductCardModel } from "@/src/lib/types/productTypes";
import { formatPrice } from "@/src/utils/formatPrice";
import CountdownTimer from "../CountdownTimer/CountdownTimer";
import Link from "next/link";
import { useCart } from "@/src/context/CartContext";
import { apiClient } from "@/src/lib/http/api-client";
import { notify } from "@/src/utils/toast";
import {
  useIsAuthenticated,
  useIsAuthBootstrapping,
} from "@/src/lib/stores/auth/auth.store";
import {
  addWishlistProduct,
  getWishlistProductStatus,
  removeWishlistProduct,
} from "@/src/services/wishlist/wishlist.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";

interface ProductCardProps {
  product: ProductCardModel;
  noClick?: boolean;
  noTimer?: boolean;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 1 }, (_, i) => (
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

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function getStringField(
  value: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const fieldValue = value[key];
    if (typeof fieldValue === "string" && fieldValue.trim()) {
      return fieldValue.trim();
    }
  }

  return null;
}

function getProductHrefIdentifiers(href: string | undefined): string[] {
  if (!href) return [];

  const [path] = href.split("?");
  return path
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => part !== "product")
    .map((part) => decodeURIComponent(part));
}

function truncateTitle(title: string, maxLength = 28): string {
  const normalized = title.trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

async function resolveVariantId(
  product: ProductCardModel,
): Promise<string | null> {
  const direct = product.variantId?.trim();
  if (direct) return direct;

  const lookupKeys = [
    product.slug?.trim(),
    ...getProductHrefIdentifiers(product.href).reverse(),
    product.publicCode?.trim() || product.id?.trim(),
  ].filter((value): value is string => Boolean(value));

  const uniqueLookupKeys = [...new Set(lookupKeys)];
  if (uniqueLookupKeys.length === 0) return null;

  for (const lookupKey of uniqueLookupKeys) {
    try {
      const response = await apiClient.get(
        `/Products/${encodeURIComponent(lookupKey)}`,
      );
      const root = getRecord(response.data);
      const data = getRecord(root.data ?? root);
      const variants = Array.isArray(data.variants) ? data.variants : [];
      const firstVariant = variants[0];
      const variantId = getStringField(getRecord(firstVariant), [
        "variantId",
        "VariantId",
        "variantID",
        "VariantID",
      ]);

      if (variantId) return variantId;
    } catch (error) {
      console.error("[ProductCard] resolveVariantId failed =>", {
        lookupKey,
        error,
      });
    }
  }

  return null;
}

export default function ProductCard({
  product,
  noClick = false,
  noTimer = false,
}: ProductCardProps) {
  const [wishlist, setWishlist] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [expired, setExpired] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  const { addItem, items } = useCart();
  const isAuthenticated = useIsAuthenticated();
  const isAuthBootstrapping = useIsAuthBootstrapping();
  const productId = product.id?.trim() ?? "";
  const showWishlistActive = isAuthenticated && wishlist;

  const isOutOfStock = product.inStock === false;

  const isInCart = useMemo(() => {
    const variantId = product.variantId?.trim();
    return items.some((item) => {
      const itemVariantId = String(item.variantId ?? item.id).trim();
      if (variantId && itemVariantId === variantId) return true;
      if (item.productId && String(item.productId) === String(product.id)) {
        return true;
      }
      return false;
    });
  }, [items, product.id, product.variantId]);

  const showAdded = isInCart || justAdded;

  useEffect(() => {
    if (!productId || isAuthBootstrapping) return;

    if (!isAuthenticated) return;

    let cancelled = false;

    async function loadWishlistStatus() {
      try {
        const status = await getWishlistProductStatus(productId);
        if (!cancelled) {
          setWishlist(status.isInWishlist);
        }
      } catch {
        if (!cancelled) {
          setWishlist(false);
        }
      }
    }

    void loadWishlistStatus();

    return () => {
      cancelled = true;
    };
  }, [productId, isAuthenticated, isAuthBootstrapping]);

  const handleToggleWishlist = useCallback(async () => {
    if (wishlistBusy || isAuthBootstrapping) return;

    if (!isAuthenticated) {
      notify.info("برای افزودن به علاقمندی ابتدا وارد شوید");
      return;
    }

    if (!productId) {
      notify.error("شناسه محصول نامعتبر است.");
      return;
    }

    setWishlistBusy(true);
    try {
      if (wishlist) {
        await removeWishlistProduct(productId);
        setWishlist(false);
        notify.success("محصول از علاقه‌مندی‌ها حذف شد.");
      } else {
        await addWishlistProduct(productId);
        setWishlist(true);
        notify.success("محصول به علاقه‌مندی‌ها اضافه شد.");
      }
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
    } finally {
      setWishlistBusy(false);
    }
  }, [isAuthenticated, isAuthBootstrapping, productId, wishlist, wishlistBusy]);

  const handleCart = useCallback(async () => {
    if (expired || adding || isOutOfStock || isInCart) return;

    setAdding(true);
    try {
      const variantId = await resolveVariantId(product);
      if (!variantId) {
        notify.error("امکان افزودن این محصول به سبد وجود ندارد");
        return;
      }

      await addItem({
        id: variantId,
        variantId,
        productId: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        oldPrice: product.oldPrice,
        href: product.href,
        quantity: 1,
      });

      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 2000);
    } finally {
      setAdding(false);
    }
  }, [addItem, adding, expired, isInCart, isOutOfStock, product]);

  const review = {
    rating: product.rating,
    count: product.reviewCount,
  };

  const showStockBadge = typeof product.inStock === "boolean";
  const saleBadge = product.showSaleBadge;
  const showSaleBadge = Boolean(saleBadge?.label?.trim());

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
        type="button"
        onClick={() => void handleToggleWishlist()}
        disabled={wishlistBusy || isAuthBootstrapping}
        aria-label={
          wishlist ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
        }
        aria-pressed={showWishlistActive}
        className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all hover:scale-110 hover:bg-white dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg
          className={`w-4 h-4 transition-colors ${
            showWishlistActive
              ? "text-red-500 fill-red-500"
              : "text-stone-400 dark:text-stone-500"
          }`}
          fill={showWishlistActive ? "currentColor" : "none"}
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
      <div className="relative w-full h-48 bg-white dark:bg-stone-800 flex items-center justify-center overflow-hidden ">
        {(showStockBadge ||
          showSaleBadge ||
          product.discountPercent ||
          product.specialSale) && (
          <div className="absolute top-3 right-3 z-10 flex flex-col items-start gap-1">
            

            {showSaleBadge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                {saleBadge?.label}
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
          {noClick && (
            <>
              {showSaleBadge && (
                <span className="text-[10px] font-bold px-2 py-0.5 shadow-sm  text-amber-700  dark:text-amber-300 ">
                  {saleBadge?.label}
                </span>
              )}
            </>
          )}
          <span
            title={product.title}
            className="text-sm font-medium text-gray-900 dark:text-gray-100 block"
          >
            {truncateTitle(product.title)}
          </span>

          {showStockBadge && (
              <span
                className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full border shadow-sm ${
                  product.inStock
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                }`}
              >
                {product.inStock ? "موجود در انبار" : "اتمام کالا"}
              </span>
            )}
        </Link>

        {/* {showPublicCode && (
          <p
            className="text-[11px] text-stone-500 dark:text-stone-400 -mt-2 hidden"
            dir="ltr"
          >
            {product.publicCode}
          </p>
        )} */}

        {/* Rating */}
        {review && (
          <StarRating rating={review.rating ?? 0} count={review.count ?? 0} />
        )}

        {/* Countdown */}
        {product.dealEndsAt && !expired && !noTimer && (
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

              {product.discountPercent ? (
              <span className="bg-red-500 text-white text-xs font-bold me-2 py-0.5 px-1 rounded-lg shadow-sm">
                {product.discountPercent}٪
              </span>
            ) : null}
            {product.specialSale && !showSaleBadge && (
              <span className="text-[8px] font-extrabold me-2 py-0.5 px-2 rounded-full border shadow-sm bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                ویژه
              </span>
            )}
              <span className="inline-block text-[11px] font-bold -rotate-90 text-stone-500 dark:text-stone-400 border-b border-stone-300 dark:border-stone-600">
                تومان
              </span>
              
            </span>
          </div>
        </div>

        {/* CTA */}
        {!noClick && (
          <div className="flex gap-2">
            {isOutOfStock ? (
              <Link
                href={"#"}
                className="w-full py-2 rounded-xl text-sm text-center font-bold transition-all duration-200 bg-primary hover:bg-primary-600 text-white shadow-sm hover:shadow-md active:scale-95 dark:hover:bg-primary/80"
              >
                به من اطلاع بده
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => void handleCart()}
                disabled={expired || adding || showAdded}
                className={`w-full py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  expired
                    ? "cursor-not-allowed bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-600"
                    : showAdded
                      ? "cursor-default bg-emerald-500 text-white opacity-90"
                      : adding
                        ? "cursor-wait bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                        : "cursor-pointer bg-stone-900 text-white hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-200 active:scale-95 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-amber-400 dark:hover:shadow-amber-900/30"
                }`}
              >
                {expired
                  ? "پیشنهاد تمام شد"
                  : adding
                    ? "در حال افزودن..."
                    : showAdded
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
        )}
      </div>
    </article>
  );
}
