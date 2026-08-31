"use client";
// components/ui/UserProfile/Orders/UserOrdersList.jsx

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMyOrderById } from "@/src/services/orders/orders.client";
import { getProductImage } from "@/src/utils/product-image";
import { OrdersListSkeleton } from "../skeletons/UserProfileSkeletons";

function formatMoney(value) {
  return `${new Intl.NumberFormat("fa-IR").format(
    Math.max(0, Math.round(Number(value) || 0)),
  )} تومان`;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

const ORDER_STATUS_META = {
  pending: {
    icon: "fa-regular fa-clock",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  "order.payment_review_required": {
    icon: "fa-solid fa-magnifying-glass-dollar",
    className:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  },
  "order.paid": {
    icon: "fa-solid fa-credit-card",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  "order.payment_failed": {
    icon: "fa-solid fa-credit-card",
    className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
  "order.processing": {
    icon: "fa-solid fa-gears",
    className: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  },
  "order.confirmed": {
    icon: "fa-solid fa-circle-check",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  "order.shipped": {
    icon: "fa-solid fa-truck-fast",
    className:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  },
  "order.delivered": {
    icon: "fa-solid fa-check",
    className: "bg-emerald-500 text-white",
  },
  "order.returned": {
    icon: "fa-solid fa-rotate-left",
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  },
  "order.cancelled": {
    icon: "fa-solid fa-xmark",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  "order.expired": {
    icon: "fa-solid fa-hourglass-end",
    className: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  },
};

function statusIconMeta(order) {
  const key = String(order?.statusKey ?? "").toLowerCase();
  return (
    ORDER_STATUS_META[key] ?? {
      icon: "fa-regular fa-circle-question",
      className:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    }
  );
}

function canDownloadInvoice(order) {
  const statusKey = String(order?.statusKey ?? "").toLowerCase();
  const paymentStatusKey = String(order?.paymentStatusKey ?? "").toLowerCase();
  const fulfillmentStatusKey = String(
    order?.fulfillmentStatusKey ?? "",
  ).toLowerCase();
  const statusTitle = String(order?.statusTitleFa ?? "");
  const fulfillmentTitle = String(order?.fulfillmentStatusTitleFa ?? "");
  const paymentTitle = String(order?.paymentStatusTitleFa ?? "");
  const combinedKey = `${statusKey} ${paymentStatusKey} ${fulfillmentStatusKey}`;
  const combinedTitle = `${statusTitle} ${paymentTitle} ${fulfillmentTitle}`;
  const isRejected =
    combinedKey.includes("fail") ||
    combinedKey.includes("cancel") ||
    combinedKey.includes("expire") ||
    combinedTitle.includes("ناموفق") ||
    combinedTitle.includes("لغو") ||
    combinedTitle.includes("منقضی");

  if (isRejected) return false;

  return (
    statusKey === "order.paid" ||
    statusKey === "order.confirmed" ||
    statusKey === "order.shipped" ||
    statusKey === "order.delivered" ||
    paymentStatusKey.includes("paid") ||
    paymentStatusKey.includes("success") ||
    fulfillmentStatusKey.includes("shipped") ||
    fulfillmentStatusKey.includes("delivered") ||
    statusTitle.includes("پرداخت شده") ||
    statusTitle.includes("تأیید") ||
    statusTitle.includes("تایید") ||
    statusTitle.includes("ارسال") ||
    statusTitle.includes("تحویل") ||
    paymentTitle.includes("پرداخت شده") ||
    fulfillmentTitle.includes("ارسال") ||
    fulfillmentTitle.includes("تحویل")
  );
}

function getOrderItems(order, detailsByOrderId) {
  return detailsByOrderId[order.orderId]?.items ?? order.items ?? [];
}

function getOrderItemImage(item) {
  return getProductImage(item?.imageUrl);
}

function getOrderDetailsHref(order, query = "") {
  const publicOrderNumber = String(order?.publicOrderNumber ?? "").trim();
  const path = `/user-profile/orders/${encodeURIComponent(publicOrderNumber)}`;
  return query ? `${path}?${query}` : path;
}

function getVisibleItemClass(index) {
  if (index < 3) return "block";
  if (index < 5) return "hidden sm:block";
  if (index < 7) return "hidden lg:block";
  return "hidden";
}

function ProductOverflowBadge({ count, order }) {
  if (count <= 7) return null;

  const href = getOrderDetailsHref(order);
  const hiddenCount = new Intl.NumberFormat("fa-IR").format(count - 7);

  return (
    <Link
      href={href}
      className="inline-flex h-16 min-w-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 text-sm font-bold text-gray-700 dark:border-gray-700 dark:bg-zinc-900 dark:text-gray-200"
    >
      +{hiddenCount}
    </Link>
  );
}

export default function UserOrdersList({
  orders = [],
  loading = false,
  page = 1,
  totalPages = 1,
  totalCount = 0,
  pageSize = 10,
  hasPreviousPage = false,
  hasNextPage = false,
  retryingOrderId = null,
  downloadingInvoiceOrderId = null,
  onPrevPage,
  onNextPage,
  onGoToPage,
  onRetryPayment,
  onDownloadInvoice,
}) {
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);
  const [orderDetailsById, setOrderDetailsById] = useState({});
  const detailRequestIdsRef = useRef(new Set());

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      orders.forEach((order) => {
        if (!order?.orderId) return;
        if (order.items?.length) return;
        if (orderDetailsById[order.orderId]) return;
        if (detailRequestIdsRef.current.has(order.orderId)) return;

        detailRequestIdsRef.current.add(order.orderId);
        void getMyOrderById(order.orderId)
          .then((detail) => {
            setOrderDetailsById((prev) => ({
              ...prev,
              [order.orderId]: detail,
            }));
          })
          .catch((error) => {
            console.error("[UserOrdersList] load order items failed =>", error);
          })
          .finally(() => {
            detailRequestIdsRef.current.delete(order.orderId);
          });
      });
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [orders, orderDetailsById]);

  return (
    <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
      {loading ? (
        <OrdersListSkeleton />
      ) : (
        <div className="space-y-4 py-2">
          {orders.map((order) => {
            const items = getOrderItems(order, orderDetailsById);
            const iconMeta = statusIconMeta(order);

            return (
              <div
                key={order.orderId}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-zinc-900/30"
              >
                <div className="relative px-4 py-5 sm:px-6">
                 

                  <div className="flex flex-col gap-4 pe-0 ps-10 sm:ps-12">
                    <div className="flex items-center justify-start gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {order.statusTitleFa || order.statusKey || "—"}
                      </span>
                      <span
                        className={`inline-flex size-5 items-center justify-center rounded-full text-xs ${iconMeta.className}`}
                      >
                        <i className={iconMeta.icon}></i>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                    تاریخ
                      <span>{formatDate(order.createdAt)}</span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span>
                      کد سفارش{" "}
                        <b className="font-semibold text-gray-700 dark:text-gray-200">
                          {order.publicOrderNumber || order.orderId}
                        </b>
                      </span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span>
                        مبلغ{" "}
                        <b className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatMoney(order.payableAmount)}
                        </b>
                      </span>
                    </div>
                  </div>

                  <Link
                    href={getOrderDetailsHref(order)}
                    aria-label="مشاهده جزئیات سفارش"
                    className="absolute end-4 top-6 inline-flex size-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-gray-100"
                  >
                    <i className="fa-solid fa-chevron-left text-sm"></i>
                  </Link>
                </div>

                <div className="border-t border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
                  {getOrderItems(order, orderDetailsById).length > 0 ? (
                    <div className="flex min-w-0 items-center justify-start gap-7 overflow-x-auto" dir="rtl">
                      {items.map((item, index) => (
                        <Link
                          key={item.orderItemId}
                          href={getOrderDetailsHref(
                            order,
                            `itemId=${encodeURIComponent(item.orderItemId)}`,
                          )}
                          title={
                            item.productTitle || item.productName || "محصول"
                          }
                          className={`${getVisibleItemClass(index)} shrink-0`}
                        >
                          <div className="flex min-w-0 items-center">
                            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white transition hover:scale-105 dark:bg-zinc-900 sm:size-16 md:size-20">
                              <Image
                                width={80}
                                height={80}
                                src={getOrderItemImage(item)}
                                alt={
                                  item.productTitle ||
                                  item.productName ||
                                  "محصول"
                                }
                                unoptimized
                                className="h-[85%] w-[85%] object-contain"
                              />
                            </div>
                          </div>
                        </Link>
                      ))}
                      <div className="me-auto">
                        <ProductOverflowBadge
                          count={items.length}
                          order={order}
                        />
                      </div>
                    </div>
                  ) : null}

                <div className="mt-5 flex flex-col space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="flex flex-wrap items-center gap-3">
                    {order.canRetryPayment ? (
                      <button
                        type="button"
                        disabled={retryingOrderId === order.orderId}
                        onClick={() => onRetryPayment?.(order)}
                        className="flex items-center text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-60 dark:text-primary-200"
                      >
                        <i className="far fa-credit-card me-1"></i>
                        {retryingOrderId === order.orderId
                          ? "در حال انتقال..."
                          : "پرداخت مجدد"}
                      </button>
                    ) : null}
                    {canDownloadInvoice(order) ? (
                      <button
                        type="button"
                        disabled={downloadingInvoiceOrderId === order.orderId}
                        onClick={() => onDownloadInvoice?.(order)}
                        className="flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-600 disabled:opacity-60 dark:text-sky-400"
                      >
                        <i className="fa-solid fa-receipt text-base"></i>
                        {downloadingInvoiceOrderId === order.orderId
                          ? "در حال دانلود..."
                          : "مشاهده فاکتور"}
                      </button>
                    ) : null}
                  </div>
                </div>

              </div>
            </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex flex-col border-t border-gray-200 pt-6 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
        <p className="mb-4 text-sm text-gray-700 dark:text-gray-300 sm:mb-0">
          نمایش {new Intl.NumberFormat("fa-IR").format(from)} تا{" "}
          {new Intl.NumberFormat("fa-IR").format(to)} از{" "}
          {new Intl.NumberFormat("fa-IR").format(totalCount)} سفارش
        </p>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            disabled={!hasPreviousPage || loading}
            onClick={onPrevPage}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            قبلی
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === page;
            return (
              <button
                key={`page-${pageNumber}`}
                type="button"
                disabled={loading}
                onClick={() => onGoToPage?.(pageNumber)}
                className={[
                  "inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium",
                  isActive
                    ? "border-primary bg-primary text-white hover:bg-primary/90 dark:bg-primary/80"
                    : "border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
                ].join(" ")}
              >
                {new Intl.NumberFormat("fa-IR").format(pageNumber)}
              </button>
            );
          })}
          <button
            type="button"
            disabled={!hasNextPage || loading}
            onClick={onNextPage}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
}
