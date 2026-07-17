"use client";
// components/ui/UserProfile/Orders/UserOrdersList.jsx

import { useState } from "react";
import Link from "next/link";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import {
  cancelMyOrderItem,
  getMyOrderById,
} from "@/src/services/orders/orders.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { notify } from "@/src/utils/toast";

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

function statusBadgeClass(statusKey = "") {
  const key = statusKey.toLowerCase();
  if (key.includes("deliver") || key.includes("paid") || key.includes("success")) {
    return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
  }
  if (key.includes("ship") || key.includes("fulfill")) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
  }
  if (key.includes("cancel") || key.includes("fail") || key.includes("expire")) {
    return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
  }
  if (key.includes("pending") || key.includes("wait")) {
    return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300";
  }
  return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
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
  onPrevPage,
  onNextPage,
  onGoToPage,
  onRetryPayment,
  onBuyAgain,
  onTrackOrder,
  onCancelSuccess,
}) {
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);
  const [cancelDetail, setCancelDetail] = useState(null);
  const [cancelItemId, setCancelItemId] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoadingOrderId, setCancelLoadingOrderId] = useState(null);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  const closeCancelPanel = () => {
    setCancelDetail(null);
    setCancelItemId("");
    setCancelReason("");
  };

  const openCancelPanel = async (order) => {
    if (!order?.orderId) return;

    if (cancelDetail?.orderId === order.orderId) {
      closeCancelPanel();
      return;
    }

    setCancelLoadingOrderId(order.orderId);
    try {
      const detail = order.items?.length ? order : await getMyOrderById(order.orderId);
      const firstItem = detail.items?.[0] ?? null;
      setCancelDetail(detail);
      setCancelItemId(firstItem?.orderItemId ?? "");
      setCancelReason("");
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
    } finally {
      setCancelLoadingOrderId(null);
    }
  };

  const submitCancel = async () => {
    const reason = cancelReason.trim();
    if (!cancelDetail?.orderId || !cancelItemId) return;
    if (!reason) {
      notify.error("دلیل لغو را وارد کنید");
      return;
    }

    const selectedItem = cancelDetail.items.find(
      (item) => item.orderItemId === cancelItemId,
    );
    if (!selectedItem) {
      notify.error("آیتم سفارش انتخاب نشده است");
      return;
    }

    setCancelSubmitting(true);
    try {
      const result = await cancelMyOrderItem(cancelDetail.orderId, cancelItemId, {
        reason,
        quantity: selectedItem.quantity,
      });
      notify.success(result.message || "آیتم سفارش لغو شد");
      closeCancelPanel();
      onCancelSuccess?.();
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
    } finally {
      setCancelSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
      <TitleAfter title={"لیست سفارش‌ها"} />

      {loading ? (
        <div className="space-y-4 py-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`order-skeleton-${index}`}
              className="h-40 animate-pulse rounded-2xl bg-gray-100 dark:bg-zinc-800"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col bg-custom-light px-6 py-4 dark:bg-zinc-800 md:flex-row md:items-center md:justify-between">
                <div className="mb-3 flex flex-wrap items-center gap-4 md:mb-0">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      شماره سفارش
                    </p>
                    <p className="font-bold text-gray-800 dark:text-gray-200">
                      #{order.publicOrderNumber || order.orderId}
                    </p>
                  </div>
                  <div className="hidden h-6 w-px bg-gray-300 dark:bg-gray-600 sm:block"></div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      تاریخ سفارش
                    </p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="hidden h-6 w-px bg-gray-300 dark:bg-gray-600 sm:block"></div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      مبلغ کل
                    </p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {formatMoney(order.payableAmount)}
                    </p>
                  </div>
                  <div className="hidden h-6 w-px bg-gray-300 dark:bg-gray-600 sm:block"></div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      تعداد کالا
                    </p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {new Intl.NumberFormat("fa-IR").format(order.itemCount)} عدد
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(order.statusKey)}`}
                  >
                    {order.statusTitleFa || order.statusKey || "—"}
                  </span>
                  {order.paymentStatusTitleFa ? (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-zinc-700 dark:text-gray-200">
                      {order.paymentStatusTitleFa}
                    </span>
                  ) : null}
                  <Link
                    href={`/user-profile/orders/${order.orderId}`}
                    className="text-sm font-medium text-primary hover:text-primary/80 dark:text-primary-200"
                  >
                    مشاهده جزئیات
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {order.fulfillmentStatusTitleFa ? (
                  <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center">
                        <div className="me-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
                          <i className="far fa-truck text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            {order.fulfillmentStatusTitleFa}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            وضعیت ارسال سفارش
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onTrackOrder?.(order)}
                        className="text-sm font-medium text-primary hover:text-primary/80 dark:text-primary-200"
                      >
                        رهگیری
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="mt-2 flex flex-col space-y-3 border-t border-gray-200 pt-6 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
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
                    <button
                      type="button"
                      onClick={() => onTrackOrder?.(order)}
                      className="flex items-center text-sm font-medium text-primary hover:text-primary/80 dark:text-primary-200"
                    >
                      <i className="far fa-location-dot me-1"></i>
                      رهگیری سفارش
                    </button>
                    <Link
                      href={`/user-profile/orders-return?orderId=${order.orderId}`}
                      className="flex items-center text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400"
                    >
                      <i className="far fa-square-arrow-up-left me-1"></i>
                      درخواست مرجوعی
                    </Link>
                    <button
                      type="button"
                      disabled={cancelLoadingOrderId === order.orderId}
                      onClick={() => void openCancelPanel(order)}
                      className="flex items-center text-sm font-medium text-red-600 hover:text-red-500 disabled:opacity-60 dark:text-red-400"
                    >
                      <i className="far fa-ban me-1"></i>
                      {cancelLoadingOrderId === order.orderId
                        ? "در حال دریافت..."
                        : "لغو آیتم"}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onBuyAgain?.(order)}
                    className="w-full rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-white transition duration-200 hover:bg-primary/90 active:scale-95 sm:w-auto"
                  >
                    خرید مجدد
                  </button>
                </div>

                {cancelDetail?.orderId === order.orderId ? (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-900/20">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`cancel-item-${order.orderId}`}
                          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          آیتم سفارش
                        </label>
                        <select
                          id={`cancel-item-${order.orderId}`}
                          value={cancelItemId}
                          onChange={(event) => setCancelItemId(event.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-200"
                        >
                          {cancelDetail.items.map((item) => (
                            <option key={item.orderItemId} value={item.orderItemId}>
                              {item.productName} - تعداد{" "}
                              {new Intl.NumberFormat("fa-IR").format(item.quantity)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor={`cancel-reason-${order.orderId}`}
                          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          دلیل لغو
                        </label>
                        <input
                          id={`cancel-reason-${order.orderId}`}
                          type="text"
                          value={cancelReason}
                          onChange={(event) => setCancelReason(event.target.value)}
                          placeholder="دلیل لغو آیتم را وارد کنید"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-200"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap justify-end gap-3">
                      <button
                        type="button"
                        onClick={closeCancelPanel}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-zinc-800"
                      >
                        انصراف
                      </button>
                      <button
                        type="button"
                        disabled={cancelSubmitting}
                        onClick={() => void submitCancel()}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                      >
                        {cancelSubmitting ? "در حال لغو..." : "ثبت لغو"}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
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
