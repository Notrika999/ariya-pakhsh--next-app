"use client";
// components/ui/ProductPageClient/Review/ProductAction.jsx

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QuantitySelector from "../../../modules/QuantityProductSelector/QuantityProductSelector";
import { useCart } from "@/src/context/CartContext";
import { getProductImage } from "@/src/utils/product-image";
import { useStockNotify } from "@/src/hooks/useStockNotify";
import { formatVehicleLabel } from "@/src/services/vehicle/vehicle.service";
import {
  useSelectedVehicles,
  useVehicleStore,
} from "@/src/lib/stores/vehicle/vehicle.store";

export default function ProductAction({ product, variant, isOutOfStock }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);
  const [added, setAdded] = useState(false);
  const [showAddedNotice, setShowAddedNotice] = useState(false);
  const [quantityUpdating, setQuantityUpdating] = useState(false);
  const [stickyTop, setStickyTop] = useState(16);

  const { addItem, updateQty, removeItem, items } = useCart();
  const { requestNotify, stockNotifyModal } = useStockNotify();
  const selectedVehicles = useSelectedVehicles();
  const openVehicleModal = useVehicleStore((state) => state.openModal);
  const selectedVehiclesSummary =
    selectedVehicles.length === 0
      ? null
      : selectedVehicles.length === 1
        ? formatVehicleLabel(selectedVehicles[0])
        : `${formatVehicleLabel(selectedVehicles[0])} و ${selectedVehicles.length - 1} خودرو دیگر`;

  // تشخیص breakpoint واقعی
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const handleResize = () => setIsDesktop(mediaQuery.matches);
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // محاسبه فاصله sticky بر اساس ارتفاع هدر + 16px
  useEffect(() => {
    const header = document.querySelector("body > header");

    const updateStickyTop = () => {
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      setStickyTop(headerHeight + 16);
    };

    updateStickyTop();
    window.addEventListener("resize", updateStickyTop);

    const resizeObserver = header ? new ResizeObserver(updateStickyTop) : null;
    if (header) resizeObserver?.observe(header);

    return () => {
      window.removeEventListener("resize", updateStickyTop);
      resizeObserver?.disconnect();
    };
  }, []);

  // هماهنگ کردن quantity با سبد خرید (اگه قبلاً اضافه شده)
  useEffect(() => {
    const inCart = items.find((i) => i.id === variant?.variantId);
    if (inCart) {
      queueMicrotask(() => {
        setQuantity(inCart.quantity);
        setAdded(true);
      });
      return;
    }

    queueMicrotask(() => {
      setQuantity(1);
      setAdded(false);
      setShowAddedNotice(false);
    });
  }, [items, variant?.variantId]);

  useEffect(() => {
    const root = document.documentElement;
    const noticeIsVisible = showAddedNotice && added && !isOutOfStock;

    if (noticeIsVisible) {
      root.dataset.productCartNotice = "visible";
    } else {
      delete root.dataset.productCartNotice;
    }

    return () => {
      delete root.dataset.productCartNotice;
    };
  }, [added, isOutOfStock, showAddedNotice]);

  const price = variant?.salePrice ?? variant?.price ?? 0;
  const originalPrice = variant?.compareAtPrice ?? variant?.price ?? price;
  const hasDiscount = originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const maxQty = Math.min(
    variant?.availableQuantity ?? 99,
    product?.maxQuantityPerOrder ?? 99,
  );

  const handleAddToCart = async () => {
    if (!variant || isOutOfStock) return;
    setQuantityUpdating(true);

    const wasAdded = await addItem(
      {
        id: variant.variantId,
        variantId: variant.variantId,
        productId: product.productId,
        title: product.name,
        image: getProductImage(
          variant.images?.[0]?.thumbnailPath ||
            product.variants?.[0]?.images?.[0]?.thumbnailPath,
        ),
        price,
        oldPrice: originalPrice,
        href: `/product/${product.publicCode}/${product.slug}`,
        quantity,
      },
      { showSuccessToast: false },
    );

    setQuantityUpdating(false);
    if (!wasAdded) return;

    setAdded(true);
    setShowAddedNotice(true);
  };

  const handleQtyChange = (nextValue) => {
    const newQty =
      typeof nextValue === "function" ? nextValue(quantity) : nextValue;
    const normalizedQty = Math.min(Math.max(newQty, 1), maxQty);

    if (normalizedQty === quantity) return;

    setQuantity(normalizedQty);
    if (added && variant) {
      setQuantityUpdating(true);
      void updateQty(variant.variantId, normalizedQty).finally(() => {
        setQuantityUpdating(false);
      });
    }
  };

  const handleMobileDecrease = () => {
    if (!variant || quantityUpdating) return;

    setQuantityUpdating(true);
    const operation =
      quantity <= 1
        ? removeItem(variant.variantId)
        : updateQty(variant.variantId, quantity - 1);

    if (quantity > 1) setQuantity((current) => Math.max(1, current - 1));

    void operation.finally(() => setQuantityUpdating(false));
  };

  const handleMobileIncrement = () => {
    if (!variant || quantityUpdating || quantity >= maxQty) return;

    const nextQuantity = quantity + 1;
    setQuantity(nextQuantity);
    setQuantityUpdating(true);
    void updateQty(variant.variantId, nextQuantity).finally(() => {
      setQuantityUpdating(false);
    });
  };

  const handleBack = () => {
    router.back();
  };

  const viewCount = product?.viewCount ?? 0;
  const soldCount = product?.soldCount ?? 0;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 space-y-2.5 border-t border-gray-200 bg-white px-3 py-2.5 pb-[calc(env(safe-area-inset-bottom)+10px)] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] lg:hidden dark:border-gray-700 dark:bg-custom-dark">
        {showAddedNotice && added && !isOutOfStock && (
          <div
            className="flex min-h-12 items-center gap-2 rounded-xl bg-white px-1 text-sm shadow-sm dark:bg-zinc-900"
            role="status"
          >
            <button
              type="button"
              onClick={() => setShowAddedNotice(false)}
              aria-label="بستن پیام"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
            >
              <i className="far fa-xmark text-xl" aria-hidden="true" />
            </button>

            <i
              className="fas fa-circle-check text-xl text-green-600 dark:text-green-500"
              aria-hidden="true"
            />
            <span className="font-bold text-green-700 dark:text-green-500">
              کالا اضافه شد!
            </span>

            <Link
              href="/cart"
              className="ms-auto inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-gray-100 px-3 font-semibold text-gray-900 transition-colors hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-100 dark:hover:bg-zinc-700"
            >
              برو به سبد خرید
              <i className="far fa-angle-left" aria-hidden="true" />
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            aria-label="بازگشت به صفحه قبل"
            onClick={handleBack}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-800 shadow-sm transition-colors hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-zinc-900 dark:text-gray-100 dark:hover:bg-zinc-800"
          >
            <i className="far fa-angle-right text-lg" aria-hidden="true" />
          </button>

          {added && !isOutOfStock ? (
            <div
              dir="ltr"
              className="flex h-10 flex-1 items-center justify-between rounded-xl border border-gray-100 bg-white px-1 text-primary shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:text-primary-400"
              aria-label="تغییر تعداد محصول در سبد خرید"
            >
              <button
                type="button"
                onClick={handleMobileDecrease}
                disabled={quantityUpdating}
                aria-label={quantity <= 1 ? "حذف از سبد خرید" : "کاهش تعداد"}
                className="flex size-9 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10 disabled:cursor-wait disabled:opacity-50 dark:text-primary-400"
              >
                <i
                  className={`far ${quantity <= 1 ? "fa-trash-can" : "fa-minus"} text-lg`}
                  aria-hidden="true"
                />
              </button>

              <span
                className="min-w-8 text-center text-sm font-black"
                aria-live="polite"
              >
                {quantityUpdating ? (
                  <i className="far fa-spinner-third animate-spin" aria-hidden="true" />
                ) : (
                  new Intl.NumberFormat("fa-IR").format(quantity)
                )}
              </span>

              <button
                type="button"
                onClick={handleMobileIncrement}
                disabled={quantityUpdating || quantity >= maxQty}
                aria-label="افزایش تعداد"
                className="flex size-9 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40 dark:text-primary-400"
              >
                <i className="far fa-plus text-lg" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={isOutOfStock ? requestNotify : handleAddToCart}
              disabled={quantityUpdating || (!isOutOfStock && !variant)}
              className={`h-10 flex-1 rounded-xl px-2 text-xs font-semibold text-white transition-colors ${
                isOutOfStock
                  ? "bg-primary hover:bg-primary-600"
                  : !variant
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-primary hover:bg-primary-600"
              }`}
            >
              {quantityUpdating ? (
                <i className="far fa-spinner-third animate-spin" aria-hidden="true" />
              ) : isOutOfStock ? (
                "موجود شد خبرم کن"
              ) : (
                "افزودن به سبد خرید"
              )}
            </button>
          )}

          <div className="min-w-28 text-start" dir="rtl">
            {hasDiscount && (
              <div className="mb-0.5 flex items-center justify-start gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-black text-white ${isOutOfStock ? "bg-gray-400" : "bg-secondary-500"}`}
                >
                  {discountPercent}٪
                </span>
                <del className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                  {new Intl.NumberFormat("fa-IR").format(originalPrice)}
                </del>
              </div>
            )}
            <div className="flex items-end justify-start gap-1 text-gray-950 dark:text-white">
              <span className="text-xl font-black leading-none">
                {new Intl.NumberFormat("fa-IR").format(price)}
              </span>
              <span className="text-xs font-bold leading-4">تومان</span>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{ top: isDesktop ? stickyTop : undefined }}
        className="hidden bg-white dark:bg-custom-dark dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-4 lg:block xl:sticky"
      >
          {/* Title And Seller Box */}
          <div className="bg-gray-100/90 xl:block hidden dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow py-5 px-3 space-y-5">
            {/* <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 dark:text-white text-base">فروشنده</h3>
              <a href="#" className="text-primary-600 dark:text-primary-400 text-xs">
                1 فروشنده دیگر
              </a>
            </div> */}

            <div className="rounded-xl py-4 px-2 space-y-4">
              {/* Performance */}
              <div className="flex items-center space-x-2">
                <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
                  <i className="far fa-rotate text-gray-700 dark:text-gray-300 text-sm"></i>
                </span>
                <span className="text-sm font-bold text-gray-800 dark:text-white">
                  عملکرد
                </span>
                <span className="text-xs text-green-600 dark:text-green-400">
                  عالی
                </span>
              </div>

              {/* Product ID */}
              {/* <div className="flex items-center space-x-2">
                <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
                  <i className="fas fa-qrcode text-gray-700 dark:text-gray-300 text-sm"></i>
                </span>
                <span className="text-sm font-bold text-gray-800 dark:text-white">شناسه محصول</span>
                <span className="text-xs text-gray-500 dark:text-gray-300">{product?.publicCode}</span>
              </div> */}

              {/* Stock */}
              <div className="flex items-center space-x-2">
                <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
                  <i className="far fa-truck-fast text-gray-700 dark:text-gray-300 text-xs"></i>
                </span>
                <span className="text-sm font-bold text-gray-800 dark:text-white">
                  وضعیت موجودی
                </span>
                {isOutOfStock ? (
                  <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 rounded-full">
                    ناموجود
                  </span>
                ) : (
                  <span className="text-xs text-green-600">
                    {variant?.availableQuantity ? `موجود ` : "ناموجود"}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={openVehicleModal}
                className="flex w-full items-center space-x-2 rounded-lg text-start transition hover:bg-gray-200/60 dark:hover:bg-zinc-700/60"
              >
                <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
               
                <i class="fa-duotone fa-solid fa-user-headset dark:text-gray-300"></i>
                </span>
                <span className="min-w-0">
                  <span className="block md:text-sm text-xs font-semibold text-gray-800 dark:text-white">
                    مشاوره سازگاری با خودرو
                  </span>
                  {selectedVehiclesSummary ? (
                    <span className="mt-0.5 block truncate text-[11px] text-gray-500 dark:text-gray-400">
                      خودروی من: {selectedVehiclesSummary}
                    </span>
                  ) : (
                    <span className="mt-0.5 block text-[11px] text-gray-500 dark:text-gray-400">
                      تغییر خودرو
                    </span>
                  )}
                </span>
              </button>

            </div>
          </div>

          {/* Likes / Stats */}
          {viewCount > 0 && (
            <div className="overflow-hidden h-10 my-3">
              <div className="h-10 flex text-sm items-center text-gray-700 dark:text-gray-300">
                👁️{" "}
                <b className="mx-1">
                  {new Intl.NumberFormat("fa-IR").format(viewCount)}
                </b>{" "}
                نفر این کالا را مشاهده کرده‌اند
              </div>
            </div>
          )}

          {/* Price & Quantity */}
          <div className="flex items-center space-x-4 justify-between mt-4 mb-2">
            {!isOutOfStock && (
              <QuantitySelector
                value={quantity}
                onChange={handleQtyChange}
                min={1}
                max={maxQty}
                loading={quantityUpdating}
                disabled={quantityUpdating}
              />
            )}

            <div className="flex items-center">
              <div className="text-gray-700 dark:text-zinc-300 flex flex-col items-center">
                {hasDiscount && (
                  <div className="flex justify-between items-center">
                    <del className="text-zinc-400 dark:text-zinc-500">
                      <span>
                        {new Intl.NumberFormat("fa-IR").format(originalPrice)}
                      </span>
                    </del>
                    <div
                      className={`text-white text-xs ms-2 font-bold px-2 py-1 rounded-xl rounded-bl-md shadow shadow-red-500/50 z-10 ${isOutOfStock ? "bg-gray-400" : "bg-secondary-500"}`}
                    >
                      {discountPercent}%
                    </div>
                  </div>
                )}
                <span
                  className={`text-xl inline-block mt-2 font-bold ${isOutOfStock ? "text-gray-300" : "dark:text-white"}`}
                >
                  {new Intl.NumberFormat("fa-IR").format(price)}
                </span>
              </div>
              <span className="text-xs font-bold -rotate-90 dark:text-zinc-300">
                تومان
              </span>
            </div>
          </div>

          {/* CTA */}
          {!isOutOfStock ? (
            <div className="flex items-center justify-center">
              <button
                onClick={handleAddToCart}
                className={`ms-auto mt-3 text-white font-semibold rounded-xl px-6 py-4 text-sm cursor-pointer transition-colors ${
                  added
                    ? "bg-green-500 hover:bg-green-600 shadow-green-500/30"
                    : "bg-primary hover:bg-primary-600 shadow-primary-500"
                }`}
              >
                {added ? "✓ افزوده شد" : "افزودن به سبد خرید"}
              </button>
            </div>
          ) : (
            <>
              {/* <div className="flex items-center justify-center">
                <button className="bg-gray-400 cursor-not-allowed w-full mt-3 text-white font-semibold rounded-xl px-6 py-4 text-sm">
                  اتمام موجودی
                </button>
              </div> */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={requestNotify}
                  className="bg-primary shadow-primary-500 w-full hover:bg-primary-600 text-white font-semibold rounded-xl px-6 py-3 text-sm"
                >
                  موجود شد خبرم کن
                </button>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                  وقتی محصول موجود شد به من اطلاع بده
                </p>
              </div>
            </>
          )}

          {/* Points */}
          {soldCount > 0 && (
            <div className="flex items-center mt-2 justify-between pt-2">
              {/* <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-1">
                <i className="fa fa-star text-amber-400 me-1"></i>
                امتیاز باشگاه مشتریان
              </span> */}
              <div className="flex items-center space-x-2">
                <span className="font-black text-sm dark:text-white">
                  {new Intl.NumberFormat("fa-IR").format(soldCount)}
                </span>
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  فروش
                </span>
              </div>
            </div>
          )}
      </div>
      {stockNotifyModal}
    </>
  );
}
