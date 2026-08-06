// components/ui/ProductPageClient/Action/Action.tsx
"use client";
import React, { useEffect, useState } from "react";
import QuantitySelector from "../../../modules/QuantityProductSelector/QuantityProductSelector";
import {
  ProductDetail,
  ProductDetailVariant,
} from "@/src/lib/types/products/productDetail.types";
import { useCart } from "@/src/context/CartContext";
import { getProductImage } from "@/src/utils/product-image";

interface Props {
  product: ProductDetail;
  variant?: ProductDetailVariant;
  isOutOfStock: boolean;
}

export default function Action({ product, variant, isOutOfStock }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [quantityUpdating, setQuantityUpdating] = useState(false);

  const { addItem, updateQty, items } = useCart();

  const price = variant?.salePrice ?? variant?.price ?? 0;
  const originalPrice = variant?.compareAtPrice ?? variant?.price ?? price;
  const hasDiscount = originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const maxQty = Math.min(
    variant?.availableQuantity ?? 99,
    product.maxQuantityPerOrder ?? 99,
  );

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
    });
  }, [items, variant?.variantId]);

  const handleAddToCart = () => {
    if (!variant) return;

    const primaryImage =
      variant.images?.find((img) => img.isPrimary) ?? variant.images?.[0];

    void addItem({
      id: variant.variantId,
      variantId: variant.variantId,
      productId: product.productId,
      title: product.name,
      image: primaryImage?.thumbnailPath
        ? getProductImage(primaryImage.thumbnailPath)
        : "",
      price,
      oldPrice: originalPrice,
      href: `/product/${product.publicCode}/${product.slug}`,
      quantity,
    });
    setAdded(true);
  };

  const handleQtyChange = (
    nextValue: number | ((previousQuantity: number) => number),
  ) => {
    const resolvedQuantity =
      typeof nextValue === "function" ? nextValue(quantity) : nextValue;
    const nextQty = Math.min(Math.max(resolvedQuantity, 1), maxQty);

    if (nextQty === quantity) return;

    if (!added || !variant) {
      setQuantity(nextQty);
      return;
    }

    setQuantityUpdating(true);
    void updateQty(variant.variantId, nextQty).finally(() => {
      setQuantityUpdating(false);
    });
  };

  return (
    <section className="xl:col-span-3 mt-7 col-span-12 pb-10 w-full">
      <div className="bg-gray-100/90 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow py-5 px-3 space-y-5">
        {/* Title */}
        {/* <div className="flex items-center justify-between mb-3 hidden">
          <h3 className="font-bold text-gray-800 dark:text-white text-base">
            فروشنده
          </h3>
          <Link
            href={`/`}
            className="text-primary-600 dark:text-primary-400 text-xs"
          >
            کارآپ 24
          </Link>
        </div> */}

        <div className="rounded-xl py-4 px-2 space-y-4">
          {/* Performance */}
          {/* <div className="flex items-center space-x-2">
            <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
              <i className="far fa-rotate text-gray-700 dark:text-gray-300 text-sm"></i>
            </span>
            <span className="text-sm font-bold text-gray-800 dark:text-white">
              عملکرد
            </span>
            <span className="text-xs text-green-600 dark:text-green-400">
              عالی
            </span>
          </div> */}

          {/* Product ID */}
          <div className="flex items-center space-x-2">
            <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
              <i className="fas fa-qrcode text-gray-700 dark:text-gray-300 text-sm"></i>
            </span>
            <span className="md:text-sm text-xs text-nowrap font-semibold text-gray-800 dark:text-white">
              شناسه محصول
            </span>
            <span className="text-xs text-nowrap text-gray-500 dark:text-gray-300">
              {product.publicCode}
            </span>
          </div>

          {/* Stock */}
          {(variant?.availableQuantity ?? 0) < 5 && (
            <div className="flex items-center space-x-2">
              <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
                <i className="far fa-truck-fast text-gray-700 dark:text-gray-300 text-xs"></i>
              </span>

              <span className="md:text-sm text-xs text-nowrap font-semibold text-gray-800 dark:text-white">
                وضعیت موجودی
              </span>

              {isOutOfStock ? (
                <span className="text-xs text-nowrap bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 rounded-full">
                  ناموجود
                </span>
              ) : (
                <span className="text-xs text-red-600">
                  موجودی (
                  {new Intl.NumberFormat("fa-IR").format(
                    variant?.availableQuantity ?? 0,
                  )}{" "}
                  عدد)
                </span>
              )}
            </div>
          )}

          {/* Delivery */}
          <div className="flex items-center space-x-2">
            <span className="size-8 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-md">
              <i className="far fa-truck-fast text-gray-700 dark:text-gray-300 text-xs"></i>
            </span>
            <span className="md:text-sm text-xs text-nowrap font-semibold text-gray-800 dark:text-white">
              ارسال از فروشگاه اصلی
            </span>
            <span className="text-xsmd:text-sm text-xs text-nowrap font-semibold text-gray-500 dark:text-gray-300">
              آماده ارسال
            </span>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 pt-2 flex-wrap">
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
              کالای اصل
            </span>
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
              کالای نو
            </span>
            {product.warrantyInfo && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                {product.warrantyInfo}
              </span>
            )}
            {isOutOfStock && (
              <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 rounded-full">
                ناموجود
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Likes / Stats */}
      <div className="overflow-hidden h-10 my-3">
        <div className="h-10 flex text-sm items-center text-gray-700 dark:text-gray-300">
          👁️{" "}
          <b className="mx-1">
            {new Intl.NumberFormat("fa-IR").format(product.viewCount ?? 0)}
          </b>{" "}
          نفر این کالا را مشاهده کرده‌اند
        </div>
      </div>

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
            disabled={quantityUpdating}
            className={`ms-auto mt-3 text-white font-semibold rounded-xl px-6 py-4 text-sm cursor-pointer transition-colors ${
              added
                ? "bg-green-500 hover:bg-green-600 shadow-green-500/30"
                : "bg-primary hover:bg-primary-600 shadow-primary-500"
            } disabled:cursor-wait disabled:opacity-70`}
          >
            {added ? "✓ افزوده شد" : "افزودن به سبد خرید"}
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center">
            <button className="bg-gray-400 cursor-not-allowed w-full mt-3 text-white font-semibold rounded-xl px-6 py-4 text-sm">
              اتمام موجودی
            </button>
          </div>
          <div className="mt-3">
            <button className="bg-primary shadow-primary-500 w-full hover:bg-primary-600 text-white font-semibold rounded-xl px-6 py-3 text-sm">
              📧 به من اطلاع بده
            </button>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
              وقتی محصول موجود شد به من اطلاع بده
            </p>
          </div>
        </>
      )}

      {/* Points */}
      <div className="flex items-center mt-2 justify-between pt-2">
        <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-1">
          <i className="fa fa-star text-amber-400 me-1"></i>
          امتیاز باشگاه مشتریان
        </span>
        <div className="flex items-center space-x-2">
          <span className="font-black text-sm dark:text-white">
            {new Intl.NumberFormat("fa-IR").format(product.soldCount ?? 0)}
          </span>
          <span className="text-gray-600 dark:text-gray-300 text-sm">فروش</span>
        </div>
      </div>
    </section>
  );
}
