"use client";
// components/ui/Cart/Cart.jsx
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import Link from "next/link";
import CartEmpty from "./CartEmpty";
import { useCart } from "@/src/context/CartContext";
import { formatPrice } from "@/src/utils/formatPrice";
import { notify } from "@/src/utils/toast";

function getDiscountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export default function Cart() {
  const {
    items,
    totalItems,
    totalPrice,
    loading,
    syncing,
    removeItem,
    updateQty,
    clearCart,
    refreshCart,
  } = useCart();
  const [clearing, setClearing] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const discountTotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (!item.oldPrice || item.oldPrice <= item.price) return sum;
        return sum + (item.oldPrice - item.price) * item.quantity;
      }, 0),
    [items],
  );

  const handleClearAll = async () => {
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

  const handleUpdateQty = async (id, quantity) => {
    setBusyId(String(id));
    try {
      await updateQty(id, quantity);
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (id) => {
    setBusyId(String(id));
    try {
      await removeItem(id);
    } finally {
      setBusyId(null);
    }
  };

  if (loading || syncing) {
    return (
      <SectionContainer>
        <div className="space-y-4 py-10">
          <div className="h-40 animate-pulse rounded-2xl bg-gray-100 dark:bg-zinc-800" />
          <div className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-zinc-800" />
        </div>
      </SectionContainer>
    );
  }

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <SectionContainer>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Right section - Shopping cart products */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-custom-dark">
            {/* Shopping cart header */}
            <div className="mb-6 flex items-baseline justify-between gap-3">
              <h1
                className="relative mb-4 pb-4 text-lg font-black text-gray-900 dark:text-gray-200
                  before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary
                  after:absolute after:inset-s-4 after:bottom-0 after:h-2 after:w-40 after:rounded-lg after:bg-primary"
              >
                سبد خرید
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-gray-600 dark:text-gray-400">
                  {new Intl.NumberFormat("fa-IR").format(totalItems)} کالا
                </span>
                <button
                  type="button"
                  onClick={() => void handleClearAll()}
                  disabled={clearing}
                  className="text-sm font-medium text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:text-red-300"
                >
                  {clearing ? "در حال حذف..." : "حذف همه"}
                </button>
                <button
                  type="button"
                  onClick={() => void refreshCart()}
                  className="text-sm text-gray-500 hover:text-primary dark:text-gray-400"
                  aria-label="بروزرسانی سبد"
                >
                  <i className="far fa-arrows-rotate"></i>
                </button>
              </div>
            </div>

            {/* Horizontal Timeline */}
            <div className="timeline-horizontal mb-8 flex items-center justify-between">
              <div className="timeline-step active flex flex-col items-center text-center">
                <div className="timeline-icon bg-primary text-white dark:bg-primary-500">
                  <i className="far fa-cart-shopping"></i>
                </div>
                <div className="timeline-title dark:text-white">سبد خرید</div>
              </div>

              <div className="timeline-step flex flex-col items-center text-center">
                <div className="timeline-icon dark:bg-gray-700 dark:text-gray-200">
                  <i className="far fa-credit-card"></i>
                </div>
                <div className="timeline-title dark:text-white">
                  جزییات سفارش
                </div>
              </div>

              <div className="timeline-step flex flex-col items-center text-center">
                <div className="timeline-icon dark:bg-gray-700 dark:text-gray-200">
                  <i className="far fa-circle-check"></i>
                </div>
                <div className="timeline-title dark:text-white">تأیید</div>
              </div>

              <div className="timeline-step flex flex-col items-center text-center">
                <div className="timeline-icon dark:bg-gray-700 dark:text-gray-200">
                  <i className="far fa-check"></i>
                </div>
                <div className="timeline-title dark:text-white">تکمیل</div>
              </div>
            </div>

            {/* Product List */}
            <div className="space-y-4">
              {items.map((item) => {
                const discountPercent = getDiscountPercent(
                  item.price,
                  item.oldPrice,
                );
                const isBusy = busyId === String(item.id);
                const lineTotal = item.price * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="cart-item flex flex-wrap items-start space-x-4 space-y-5 rounded-xl border border-gray-200 bg-custom-light p-4 dark:border-gray-700 dark:bg-zinc-800 sm:space-y-0"
                  >
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                      <Link href={item.href || "#"}>
                        <Image
                          width={80}
                          height={80}
                          src={item.image || "/images/default.png"}
                          alt={item.title}
                          className="h-20 w-20 object-contain"
                        />
                      </Link>
                    </div>

                    <div className="flex-1 space-y-4">
                      <h3 className="font-bold text-gray-800 dark:text-white">
                        <Link href={item.href || "#"}>{item.title}</Link>
                      </h3>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-zinc-700">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              void handleUpdateQty(item.id, item.quantity - 1)
                            }
                            className="cart-btn-minus flex h-8 w-8 items-center justify-center text-gray-600 disabled:opacity-50 dark:text-gray-400"
                            aria-label="کاهش تعداد"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-gray-800 dark:text-white">
                            {new Intl.NumberFormat("fa-IR").format(
                              item.quantity,
                            )}
                          </span>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              void handleUpdateQty(item.id, item.quantity + 1)
                            }
                            className="cart-btn-plus flex h-8 w-8 items-center justify-center text-gray-600 disabled:opacity-50 dark:text-gray-400"
                            aria-label="افزایش تعداد"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => void handleRemove(item.id)}
                          className="cart-btn-trash flex items-center text-red-500 transition-colors hover:text-red-700 disabled:opacity-50"
                        >
                          <i className="far fa-trash-can me-1 text-sm"></i>
                          حذف
                        </button>
                      </div>
                    </div>

                    <div className="text-end">
                      <div className="flex flex-col items-center text-gray-700 dark:text-gray-300">
                        {discountPercent > 0 ? (
                          <div className="flex items-center justify-between">
                            <del className="text-zinc-400 dark:text-zinc-500">
                              <span>{formatPrice(item.oldPrice)}</span>
                            </del>
                            <div className="z-10 ms-2 rounded-xl rounded-bl-md bg-secondary-500 px-2 py-1 text-xs font-bold text-white shadow shadow-red-500/50">
                              {discountPercent}%
                            </div>
                          </div>
                        ) : null}
                        <span className="mt-2 inline-block text-xl font-bold dark:text-white">
                          {formatPrice(lineTotal)}
                          <span className="text-xs font-bold dark:text-zinc-300">
                            {" "}
                            تومان
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Left Section - Shopping Cart Summary */}
        <div className="space-y-6">
          <div className="sticky top-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-custom-dark">
            <h2
              className="relative mb-4 pb-4 text-lg font-black text-gray-900 dark:text-gray-200
                before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary
                after:absolute after:inset-s-4 after:bottom-0 after:h-2 after:w-40 after:rounded-lg after:bg-primary"
            >
              خلاصه سفارش
            </h2>

            <div className="mb-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">جمع کل:</span>
                <span className="text-gray-800 dark:text-white">
                  {formatPrice(totalPrice + discountTotal)} تومان
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">تخفیف:</span>
                <span className="text-green-600 dark:text-green-400">
                  {discountTotal > 0
                    ? `${formatPrice(discountTotal)} تومان`
                    : "۰ تومان"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  هزینه ارسال:
                </span>
                <span className="text-gray-800 dark:text-white">رایگان</span>
              </div>
              <div className="border-t border-gray-300 pt-3 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800 dark:text-white">
                    مبلغ قابل پرداخت:
                  </span>
                  <span className="text-lg font-bold text-gray-800 dark:text-white">
                    {formatPrice(totalPrice)} تومان
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-primary-600"
            >
              <i className="far fa-credit-card me-1"></i>
              ادامه فرآیند پرداخت
            </Link>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
