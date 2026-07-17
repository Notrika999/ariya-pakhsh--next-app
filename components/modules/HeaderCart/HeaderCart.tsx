// components/HeaderCart/HeaderCart.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useCart } from "@/src/context/CartContext";
import { formatPrice } from "@/src/utils/formatPrice";
import { notify } from "@/src/utils/toast";

interface HeaderCartProps {
  open: boolean;
  onClose: () => void;
}

export default function HeaderCart({ open, onClose }: HeaderCartProps) {
  const { items, totalPrice, removeItem, updateQty, clearCart } = useCart();
  const [clearing, setClearing] = React.useState(false);

  const handleClearCart = async () => {
    if (items.length === 0 || clearing) return;

    const confirmed = await notify.confirm("همه کالاها از سبد خرید حذف شوند؟", {
      confirmLabel: "حذف همه",
      cancelLabel: "انصراف",
    });
    if (!confirmed) return;

    setClearing(true);
    try {
      await clearCart();
      notify.success("سبد خرید خالی شد");
    } catch {
      notify.error("حذف سبد خرید ناموفق بود");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div
      className={`fixed top-0 inset-e-0 sm:w-100 w-[80%] h-full bg-white dark:bg-[#0d1117]
      text-gray-900 dark:text-gray-100 border-s border-gray-200 dark:border-gray-800 shadow-xl
      transform transition-all duration-300 z-50
      ${open ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible"}`}
      role="dialog"
      aria-labelledby="cart-title"
      aria-modal="true"
    >
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between gap-2">
        <Link
          href="/cart"
          id="cart-title"
          onClick={onClose}
          className="font-bold text-base"
        >
          سبد خرید شما
          {items.length > 0 && (
            <span className="mr-2 text-xs font-normal text-gray-500 dark:text-gray-400">
              ({items.length} کالا)
            </span>
          )}
        </Link>

        <div className="flex items-center gap-3">
          {items.length > 0 ? (
            <button
              type="button"
              onClick={() => void handleClearCart()}
              disabled={clearing}
              className="cursor-pointer text-xs font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:text-red-300"
              aria-label="حذف همه کالاها از سبد خرید"
            >
              {clearing ? "در حال حذف..." : "حذف همه"}
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="cursor-pointer"
            aria-label="بستن سبد خرید"
          >
            <i className="far fa-x"></i>
          </button>
        </div>
      </header>

      {/* Cart Items */}
      <main className="relative space-y-4 divide-y divide-gray-200 dark:divide-gray-800 p-3 overflow-y-scroll h-full">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-600 gap-3">
            <i className="far fa-cart-shopping text-4xl"></i>
            <p className="text-sm">سبد خرید شما خالی است</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="py-3 last:mb-35">
              <div className="flex flex-wrap items-center">
                {/* Product Image */}
                <div className="text-start w-1/3">
                  <Link href={item.href} onClick={onClose}>
                    {item.image && (
                      <Image
                        width={120}
                        height={120}
                        className="max-w-full rounded-lg shadow-sm"
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                      />
                    )}
                  </Link>
                </div>

                {/* Product Info */}
                <div className="w-2/3 space-y-4 px-2">
                  <h3 className="font-bold leading-7 text-gray-800 dark:text-gray-100 line-clamp-2 text-sm">
                    <Link href={item.href} onClick={onClose}>
                      {item.title}
                    </Link>
                  </h3>

                  <div className="flex items-center justify-between">
                    {item.oldPrice && item.oldPrice !== item.price && (
                      <del className="text-rose-600 dark:text-gray-400 line-through text-sm">
                        {formatPrice(item.oldPrice)}
                      </del>
                    )}
                    <ins className="no-underline text-lg text-green-600 font-bold dark:text-green-400">
                      {formatPrice(item.price)}
                      <span className="text-xs font-normal text-gray-700 dark:text-gray-300 mr-1">
                        تومان
                      </span>
                    </ins>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => void updateQty(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="کاهش تعداد"
                      >
                        <i className="far fa-minus text-xs"></i>
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => void updateQty(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="افزایش تعداد"
                      >
                        <i className="far fa-plus text-xs"></i>
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => void removeItem(item.id)}
                      className="bg-red-100 hover:bg-red-200 dark:bg-custom-dark dark:hover:bg-[#1f242c] text-red-800 dark:text-gray-200 border border-transparent dark:border-gray-700 p-2 rounded-lg transition-colors duration-200"
                      aria-label="حذف محصول از سبد خرید"
                    >
                      <i className="far fa-x text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Footer */}
      {items.length > 0 && (
        <footer className="p-3 absolute bottom-0 start-0 end-0 bg-white dark:bg-custom-dark border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="inline-block text-sm text-gray-500 dark:text-gray-400">
                جمع کل
              </span>
              <h3 className="font-bold text-xl">
                {formatPrice(totalPrice)}
                <span className="text-sm font-normal text-gray-700 dark:text-gray-300 mr-1">
                  تومان
                </span>
              </h3>
            </div>
            <div className="text-end">
              <Link
                href="/checkout"
                onClick={onClose}
                className="bg-primary dark:bg-primary-500 hover:bg-primary-600 dark:hover:bg-primary-400 text-white py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                role="button"
                aria-label="تکمیل فرایند خرید"
              >
                تکمیل خرید
              </Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
