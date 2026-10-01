"use client";
<<<<<<< HEAD
// components/ui/checkout/PaymentResult.tsx
=======

>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type {
  MyOrderDetail,
  MyOrderItem,
  MyOrderPayment,
  MyOrderShipment,
  ShippingAddressFields,
} from "@/src/lib/types/orders/order.types";
import {
  getMyOrderById,
  getMyOrderByNumber,
  retryMyOrderPayment,
} from "@/src/services/orders/orders.client";
import {
  clearRememberedPendingPaymentOrder,
  getRememberedPendingPaymentOrderInfo,
  rememberPendingPaymentOrder,
} from "@/src/utils/paymentRetryStorage";

const HOME_PATH = "/";
const ORDERS_PATH = "/user-profile/orders";

<<<<<<< HEAD
type PaymentResultStatus = "success" | "cancelled" | "failed" | "pending";

const PAYMENT_CONFIRMATION_POLL_INTERVAL_MS = 2500;
const PAYMENT_CONFIRMATION_MAX_POLLS = 8;
=======
type PaymentResultStatus = "success" | "cancelled" | "failed";
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

function getFirstParam(
  searchParams: URLSearchParams,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value?.trim()) return value.trim();
  }

  return null;
}

function resolveStatus(status: string | null): PaymentResultStatus {
  if (!status) return "failed";

  const normalized = status.toLowerCase();

<<<<<<< HEAD
  if (
    ["success", "succeeded", "paid", "ok", "true", "1", "0", "00"].includes(
      normalized,
    )
  ) {
=======
  if (["success", "succeeded", "paid", "ok", "true", "1"].includes(normalized)) {
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    return "success";
  }

  if (
    ["cancelled", "canceled", "cancel", "user_cancelled", "17"].includes(
      normalized,
    )
  ) {
    return "cancelled";
  }

  return "failed";
}

function resolveCallbackStatus(params: URLSearchParams): PaymentResultStatus {
<<<<<<< HEAD
  const status = getFirstParam(params, [
    "status",
    "Status",
    "State",
    "state",
  ]);
  if (status) return resolveStatus(status);

  const code = getFirstParam(params, [
    "ResCode",
    "resCode",
    "code",
    "Code",
    "statusCode",
    "StatusCode",
  ]);
  if (code === "0" || code === "00") return "success";
=======
  const status = getFirstParam(params, ["status", "State", "state"]);
  if (status) return resolveStatus(status);

  const code = getFirstParam(params, ["ResCode", "resCode", "code", "Code"]);
  if (code === "0") return "success";
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  if (code === "17") return "cancelled";

  return "failed";
}

<<<<<<< HEAD
function isPaidPaymentStatus(statusKey?: string | null) {
  const normalized = statusKey?.trim().toLowerCase() ?? "";

  return [
    "paid",
    "payment.paid",
    "payment_paid",
    "success",
    "succeeded",
  ].includes(normalized);
}

function isOrderPaid(order: MyOrderDetail | null) {
  if (!order) return false;

  return (
    isPaidPaymentStatus(order.paymentStatusKey) ||
    order.payments.some((payment) => isPaidPaymentStatus(payment.statusKey))
  );
}

=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "پرداخت مجدد ناموفق بود. دوباره تلاش کنید.";
}

function formatMoney(value: number) {
  return `${new Intl.NumberFormat("fa-IR").format(
    Math.max(0, Math.round(Number(value) || 0)),
  )} تومان`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(Number(value) || 0);
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getAddressField(
  address: ShippingAddressFields,
  key: keyof ShippingAddressFields,
) {
  const value = address[key];
  if (value != null && String(value).trim()) return String(value).trim();
  return "";
}

function formatAddress(order: MyOrderDetail) {
  const address = order.shippingAddressSnapshot?.address;
  if (!address) return "—";

  const postalCode = getAddressField(address, "PostalCode");

  return [
    getAddressField(address, "CountryName"),
    getAddressField(address, "State"),
    getAddressField(address, "City"),
    getAddressField(address, "AddressLine"),
    postalCode ? `کد پستی ${postalCode}` : "",
  ]
    .filter(Boolean)
    .join("، ") || "—";
}

function statusBadgeClass(statusKey = "") {
  const key = statusKey.toLowerCase();

  if (
    key.includes("deliver") ||
    key.includes("paid") ||
    key.includes("success") ||
    key.includes("complete")
  ) {
    return "bg-green-100 text-green-800 dark:bg-green-900/35 dark:text-green-300";
  }

  if (
    key.includes("cancel") ||
    key.includes("fail") ||
    key.includes("expire") ||
    key.includes("reject")
  ) {
    return "bg-red-100 text-red-800 dark:bg-red-900/35 dark:text-red-300";
  }

  if (key.includes("pending") || key.includes("wait") || key.includes("new")) {
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/35 dark:text-amber-300";
  }

  return "bg-blue-100 text-blue-800 dark:bg-blue-900/35 dark:text-blue-300";
}

function getResultCopy(status: PaymentResultStatus) {
  if (status === "success") {
    return {
      title: "نتیجه سفارش",
      headline: "سفارش با موفقیت ثبت شد",
      description: "پرداخت شما تایید شد و سفارش وارد مرحله پردازش شده است.",
      fallbackMessage: "نتیجه پرداخت از درگاه دریافت شد.",
      icon: "fa fa-check",
      shellClass: "border-green-200 dark:border-green-800",
      headerClass: "bg-linear-to-l from-green-500 to-emerald-600",
      messageClass: "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200",
      toneClass: "text-green-700 dark:text-green-300",
    };
  }

  if (status === "cancelled") {
    return {
      title: "نتیجه سفارش",
      headline: "پرداخت لغو شد",
      description: "سفارش ثبت شده اما پرداخت آن توسط کاربر لغو شده است.",
      fallbackMessage:
        "پرداخت انجام نشد و سفارش در وضعیت پرداخت‌نشده باقی می‌ماند.",
      icon: "far fa-ban",
      shellClass: "border-amber-200 dark:border-amber-800",
      headerClass: "bg-linear-to-l from-amber-500 to-orange-600",
      messageClass: "bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200",
      toneClass: "text-amber-700 dark:text-amber-300",
    };
  }

<<<<<<< HEAD
  if (status === "pending") {
    return {
      title: "نتیجه سفارش",
      headline: "در انتظار تأیید پرداخت",
      description:
        "پرداخت شما در حال بررسی است. نتیجه نهایی پس از تأیید سرور نمایش داده می‌شود.",
      fallbackMessage:
        "هنوز نتیجه قطعی پرداخت از سرور دریافت نشده است. لطفاً چند لحظه صبر کنید.",
      icon: "fa fa-clock",
      shellClass: "border-amber-200 dark:border-amber-800",
      headerClass: "bg-linear-to-l from-amber-500 to-orange-600",
      messageClass:
        "bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200",
      toneClass: "text-amber-700 dark:text-amber-300",
    };
  }

=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  return {
    title: "نتیجه سفارش",
    headline: "پرداخت ناموفق بود",
    description: "پرداخت تایید نشد و سفارش در انتظار پرداخت باقی مانده است.",
    fallbackMessage:
      "جزئیات خطا از پارامترهای برگشتی درگاه دریافت نشد.",
    icon: "far fa-x",
    shellClass: "border-red-200 dark:border-red-800",
    headerClass: "bg-linear-to-l from-red-500 to-rose-600",
    messageClass: "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200",
    toneClass: "text-red-700 dark:text-red-300",
  };
}

function getItemStatusTitle(item: MyOrderItem) {
  return item.statusTitleFa || item.statusKey || "ثبت اولیه";
}

function getShippingTitle(order: MyOrderDetail | null) {
  if (!order) return "—";
  const firstShipment = order.shipments[0] as MyOrderShipment | undefined;

  return (
    order.shippingMethodTitleSnapshot ||
    firstShipment?.shippingMethodTitle ||
    "—"
  );
}

function getPaymentTitle(order: MyOrderDetail | null) {
  if (!order) return "—";
  const firstPayment = order.payments[0] as MyOrderPayment | undefined;

  return firstPayment?.methodTitleFa || firstPayment?.method || "—";
}

function DetailRow({
  label,
  value,
  valueClassName = "text-gray-900 dark:text-gray-100",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-b-0 dark:border-gray-800">
      <span className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className={`text-left text-sm font-semibold leading-6 ${valueClassName}`}>
        {value || "—"}
      </span>
    </div>
  );
}

function OrderItemRow({ item }: { item: MyOrderItem }) {
  const discount =
    (item.campaignDiscountAmount || 0) + (item.couponDiscountShare || 0);

  return (
    <div className="grid gap-4 border-b border-gray-100 py-5 last:border-b-0 dark:border-gray-800 md:grid-cols-[88px_minmax(0,1fr)_auto] md:items-center">
      <div className="flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-zinc-900">
        <Image
          src={item.imageUrl || "/images/default.png"}
          alt={item.productTitle || item.productName || "محصول"}
          width={88}
          height={88}
          unoptimized
          className="h-[82px] w-[82px] object-contain"
        />
      </div>

      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="line-clamp-2 text-sm font-bold leading-7 text-gray-900 dark:text-gray-100 md:text-base">
            {item.productTitle || item.productName || "محصول"}
          </h3>
          <span
            className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(
              item.statusKey,
            )}`}
          >
            {getItemStatusTitle(item)}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
          <span>تعداد: {formatNumber(item.quantity)}</span>
          {item.variantName ? <span>تنوع: {item.variantName}</span> : null}
          {item.sku ? <span>کد کالا: {item.sku}</span> : null}
        </div>

        {item.cancelReason ? (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            دلیل لغو: {item.cancelReason}
          </p>
        ) : null}
      </div>

      <div className="text-right md:text-left">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {formatMoney(item.lineTotal)}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {formatNumber(item.quantity)} × {formatMoney(item.unitPrice)}
        </p>
        {discount > 0 ? (
          <p className="mt-2 text-xs font-medium text-green-600 dark:text-green-400">
            تخفیف: {formatMoney(discount)}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function PaymentResult() {
  const searchParams = useSearchParams();
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);
  const [order, setOrder] = useState<MyOrderDetail | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
<<<<<<< HEAD
  const [
    paymentConfirmationPendingOrderRef,
    setPaymentConfirmationPendingOrderRef,
  ] = useState<string | null>(null);
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

  const result = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const status = resolveCallbackStatus(params);
<<<<<<< HEAD
    const hasGatewayResult = Boolean(
      getFirstParam(params, [
        "status",
        "Status",
        "State",
        "state",
        "ResCode",
        "resCode",
        "code",
        "Code",
        "statusCode",
        "StatusCode",
      ]),
    );
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    const copy = getResultCopy(status);
    const rememberedOrder = getRememberedPendingPaymentOrderInfo();
    const orderId =
      getFirstParam(params, [
        "orderId",
        "OrderId",
        "orderID",
        "OrderID",
        "SaleOrderId",
        "saleOrderId",
        "SaleOrderID",
        "saleOrderID",
      ]) ?? rememberedOrder?.orderId ?? null;
    const orderNumber =
      getFirstParam(params, [
        "publicOrderNumber",
        "PublicOrderNumber",
        "orderNumber",
        "OrderNumber",
      ]) ?? rememberedOrder?.orderNumber ?? null;

    return {
      status,
<<<<<<< HEAD
      hasGatewayResult,
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      ...copy,
      message: getFirstParam(params, [
        "message",
        "Message",
        "errorMessage",
        "ErrorMessage",
        "error",
      ]),
      code: getFirstParam(params, [
        "code",
        "Code",
        "errorCode",
        "ErrorCode",
        "statusCode",
      ]),
      transactionId: getFirstParam(params, [
        "transactionId",
        "TransactionId",
        "traceNo",
        "TraceNo",
        "refId",
        "RefId",
        "Authority",
        "authority",
      ]),
      orderId,
      orderNumber,
      displayOrderNumber: orderNumber ?? orderId,
    };
  }, [searchParams]);

  useEffect(() => {
<<<<<<< HEAD
    const orderRef = result.orderId || result.orderNumber;
    const hasOrderRef = Boolean(orderRef);
=======
    const hasOrderRef = Boolean(result.orderId || result.orderNumber);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

    if (!hasOrderRef) {
      return;
    }

    let cancelled = false;
<<<<<<< HEAD
    let pollCount = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

    async function loadOrder() {
      setOrderLoading(true);
      setOrderError(null);

      try {
        const detail = result.orderId
          ? await getMyOrderById(result.orderId)
          : await getMyOrderById(
              (await getMyOrderByNumber(result.orderNumber as string)).orderId,
            );

        if (cancelled) return;
        setOrder(detail);

<<<<<<< HEAD
        // برخی درگاه‌ها (از جمله IPG دیجی‌پی) ابتدا کاربر را برمی‌گردانند و
        // تأیید نهایی را به‌صورت غیرهم‌زمان در سرور انجام می‌دهند.
        if (
          !result.hasGatewayResult &&
          !isOrderPaid(detail) &&
          pollCount < PAYMENT_CONFIRMATION_MAX_POLLS
        ) {
          pollCount += 1;
          setPaymentConfirmationPendingOrderRef(orderRef);
          timeoutId = setTimeout(loadOrder, PAYMENT_CONFIRMATION_POLL_INTERVAL_MS);
          return;
        }

        setPaymentConfirmationPendingOrderRef(null);
=======

>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      } catch (error) {
        if (cancelled) return;
        setOrder(null);
        setOrderError(getErrorMessage(error));
<<<<<<< HEAD
        setPaymentConfirmationPendingOrderRef(null);
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      } finally {
        if (!cancelled) setOrderLoading(false);
      }
    }

    void loadOrder();

    return () => {
      cancelled = true;
<<<<<<< HEAD
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [result.hasGatewayResult, result.orderId, result.orderNumber]);

  const paymentConfirmationPending =
    !result.hasGatewayResult &&
    paymentConfirmationPendingOrderRef ===
      (result.orderId || result.orderNumber);

  const displayStatus = useMemo<PaymentResultStatus>(() => {
    if (isOrderPaid(order)) return "success";

    if (orderLoading || paymentConfirmationPending) return "pending";

    // نتیجه‌ای که از URL می‌آید قابل اعتماد نیست؛ وضعیت سفارش تنها مرجع
    // قطعی پرداخت است. پاسخ‌های صریحِ لغو یا خطا را برای تجربه کاربر حفظ کن.
    if (result.hasGatewayResult && result.status !== "success") {
      return result.status;
    }

    if (order?.canRetryPayment) return "failed";

    return order ? "pending" : result.status;
  }, [
    order,
    orderLoading,
    paymentConfirmationPending,
    result.hasGatewayResult,
    result.status,
  ]);

  const displayResult = useMemo(
    () => ({ ...result, status: displayStatus, ...getResultCopy(displayStatus) }),
    [displayStatus, result],
  );

  useEffect(() => {
    if (displayStatus === "success" && !orderLoading) {
      clearRememberedPendingPaymentOrder();
    }
  }, [displayStatus, orderLoading]);
=======
    };
  }, [result.orderId, result.orderNumber]);

  useEffect(() => {
    if (result.status === "success" && !orderLoading) {
      clearRememberedPendingPaymentOrder();
    }
  }, [orderLoading, result.status]);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

  const handleRetryPayment = async () => {
    const targetOrderId = order?.orderId || result.orderId;

    if (!targetOrderId || retrying) {
      setRetryError("شناسه سفارش برای پرداخت مجدد در پاسخ درگاه موجود نیست.");
      return;
    }

    setRetrying(true);
    setRetryError(null);

    try {
      const retryResult = await retryMyOrderPayment(targetOrderId);
      const redirectUrl = retryResult.paymentUrl || retryResult.redirectUrl;

      if (!redirectUrl) {
        setRetryError("آدرس درگاه پرداخت از سرویس دریافت نشد.");
        return;
      }

      rememberPendingPaymentOrder(
        targetOrderId,
        order?.publicOrderNumber || result.displayOrderNumber,
      );
      window.location.assign(redirectUrl);
    } catch (error) {
      setRetryError(getErrorMessage(error));
    } finally {
      setRetrying(false);
    }
  };

  const displayOrderNumber =
    order?.publicOrderNumber || result.displayOrderNumber || "—";
  const missingOrderRef = !result.orderId && !result.orderNumber;
  const visibleOrderError = missingOrderRef
    ? "شناسه یا شماره سفارش در پاسخ درگاه موجود نیست."
    : orderError;
  const payableOrPaidAmount =
<<<<<<< HEAD
    displayStatus === "success"
      ? order?.paidAmount || order?.payments[0]?.amount || order?.payableAmount || 0
      : order?.payableAmount || order?.payments[0]?.amount || 0;
  const amountLabel =
    displayStatus === "success" ? "مبلغ پرداختی" : "مبلغ قابل پرداخت";
=======
    result.status === "success"
      ? order?.paidAmount || order?.payments[0]?.amount || order?.payableAmount || 0
      : order?.payableAmount || order?.payments[0]?.amount || 0;
  const amountLabel =
    result.status === "success" ? "مبلغ پرداختی" : "مبلغ قابل پرداخت";
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

  const actionButtons = (
    <div className="flex w-full flex-col gap-3">
      {retryError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          {retryError}
        </div>
      ) : null}

<<<<<<< HEAD
      {displayStatus === "failed" ? (
=======
      {result.status !== "success" ? (
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
        <button
          type="button"
          onClick={() => void handleRetryPayment()}
          disabled={retrying}
          className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {retrying ? "در حال انتقال..." : "پرداخت مجدد"}
        </button>
      ) : null}
      <Link
        href={order?.orderId ? `${ORDERS_PATH}/${order.orderId}` : ORDERS_PATH}
        className="inline-flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-green-700"
      >
        مشاهده جزئیات سفارش
      </Link>
      <Link
<<<<<<< HEAD
        href={displayStatus === "success" ? ORDERS_PATH : HOME_PATH}
        className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        {displayStatus === "success" ? "سفارش‌های من" : "صفحه اصلی"}
=======
        href={result.status === "success" ? ORDERS_PATH : HOME_PATH}
        className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        {result.status === "success" ? "سفارش‌های من" : "صفحه اصلی"}
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      </Link>
    </div>
  );

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <div
<<<<<<< HEAD
            className={`overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-custom-dark ${displayResult.shellClass}`}
          >
            <div className={`p-6 md:p-8 ${displayResult.headerClass}`}>
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <i className={`text-2xl text-white ${displayResult.icon}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/80">
                      {displayResult.title}
                    </p>
                    <h1 className="mt-1 text-2xl font-black text-white md:text-3xl">
                      {displayResult.headline}
                    </h1>
                    <p className="mt-2 max-w-2xl leading-7 text-white/85">
                      {displayResult.description}
=======
            className={`overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-custom-dark ${result.shellClass}`}
          >
            <div className={`p-6 md:p-8 ${result.headerClass}`}>
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <i className={`text-2xl text-white ${result.icon}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/80">
                      {result.title}
                    </p>
                    <h1 className="mt-1 text-2xl font-black text-white md:text-3xl">
                      {result.headline}
                    </h1>
                    <p className="mt-2 max-w-2xl leading-7 text-white/85">
                      {result.description}
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-white/15 px-5 py-4 text-white backdrop-blur">
                  <p className="text-sm text-white/75">{amountLabel}</p>
                  <p className="mt-1 text-xl font-black">
                    {formatMoney(payableOrPaidAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-0 md:grid-cols-4">
              <div className="border-b border-gray-100 p-5 dark:border-gray-800 md:border-b-0 md:border-l">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  شماره سفارش
                </p>
                <p className="mt-2 break-all text-sm font-black text-gray-900 dark:text-gray-100">
                  {displayOrderNumber}
                </p>
              </div>
              <div className="border-b border-gray-100 p-5 dark:border-gray-800 md:border-b-0 md:border-l">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  وضعیت سفارش
                </p>
                <p className="mt-2 text-sm font-black text-gray-900 dark:text-gray-100">
<<<<<<< HEAD
                  {order?.statusTitleFa || order?.statusKey || displayResult.headline}
=======
                  {order?.statusTitleFa || order?.statusKey || result.headline}
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                </p>
              </div>
              <div className="border-b border-gray-100 p-5 dark:border-gray-800 md:border-b-0 md:border-l">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  روش ارسال
                </p>
                <p className="mt-2 text-sm font-black text-gray-900 dark:text-gray-100">
                  {getShippingTitle(order)}
                </p>
              </div>
              <div className="p-5">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  تاریخ ثبت
                </p>
                <p className="mt-2 text-sm font-black text-gray-900 dark:text-gray-100">
                  {formatDate(order?.createdAt)}
                </p>
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <div className={`rounded-xl p-4 text-sm leading-7 ${displayResult.messageClass}`}>
            {displayResult.message || displayResult.fallbackMessage}
=======
          <div className={`rounded-xl p-4 text-sm leading-7 ${result.messageClass}`}>
            {result.message || result.fallbackMessage}
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
          </div>

          {orderLoading ? (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="h-96 animate-pulse rounded-2xl bg-gray-100 dark:bg-zinc-800 lg:col-span-2" />
              <div className="h-96 animate-pulse rounded-2xl bg-gray-100 dark:bg-zinc-800" />
            </div>
          ) : null}

          {!orderLoading && visibleOrderError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-7 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              {visibleOrderError}
            </div>
          ) : null}

          {!orderLoading && !missingOrderRef && order ? (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-custom-dark">
                  <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-black text-gray-900 dark:text-gray-100">
                        لیست کالاهای سفارش
                      </h2>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        وضعیت اولیه هر کالا جداگانه نمایش داده شده است.
                      </p>
                    </div>
                    <span className="inline-flex w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-zinc-800 dark:text-gray-200">
                      {formatNumber(order.items.length)} قلم کالا
                    </span>
                  </div>

                  <div>
                    {order.items.length ? (
                      order.items.map((item) => (
                        <OrderItemRow key={item.orderItemId} item={item} />
                      ))
                    ) : (
                      <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        کالایی برای این سفارش دریافت نشد.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-custom-dark">
                  <h2 className="mb-3 text-lg font-black text-gray-900 dark:text-gray-100">
                    خلاصه سفارش
                  </h2>
                  <DetailRow label="وضعیت سفارش" value={order.statusTitleFa || order.statusKey} />
                  <DetailRow
                    label="وضعیت پرداخت"
                    value={order.paymentStatusTitleFa || order.paymentStatusKey}
<<<<<<< HEAD
                    valueClassName={displayResult.toneClass}
=======
                    valueClassName={result.toneClass}
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                  />
                  <DetailRow
                    label="روش پرداخت"
                    value={getPaymentTitle(order)}
                  />
                  <DetailRow label="جمع کالاها" value={formatMoney(order.subtotalAmount)} />
                  <DetailRow label="هزینه ارسال" value={formatMoney(order.shippingFee)} />
                  <DetailRow
                    label="تخفیف"
                    value={formatMoney(order.appliedDiscountAmount)}
                    valueClassName="text-green-700 dark:text-green-300"
                  />
                  <DetailRow
                    label={amountLabel}
                    value={formatMoney(payableOrPaidAmount)}
                    valueClassName="text-gray-950 dark:text-white"
                  />
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-custom-dark">
                  <h2 className="mb-3 text-lg font-black text-gray-900 dark:text-gray-100">
                    ارسال و آدرس
                  </h2>
                  <DetailRow label="روش ارسال" value={getShippingTitle(order)} />
                  <DetailRow
                    label="زمان تقریبی"
                    value={
                      order.estimatedDeliveryDays
                        ? `${formatNumber(order.estimatedDeliveryDays)} روز`
                        : "—"
                    }
                  />
                  <div className="pt-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      آدرس
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-7 text-gray-900 dark:text-gray-100">
                      {formatAddress(order)}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-custom-dark">
                  <h2 className="mb-3 text-lg font-black text-gray-900 dark:text-gray-100">
                    اطلاعات پرداخت
                  </h2>
                  {result.transactionId ? (
                    <DetailRow label="شناسه پیگیری" value={result.transactionId} />
                  ) : null}
                  {result.code ? (
                    <DetailRow label="کد نتیجه" value={result.code} />
                  ) : null}
                  {!result.transactionId && !result.code ? (
                    <p className="text-sm leading-7 text-gray-500 dark:text-gray-400">
                      اطلاعات تکمیلی پرداخت از درگاه دریافت نشد.
                    </p>
                  ) : null}
                </div>

                {actionButtons}
              </aside>
            </div>
          ) : !orderLoading ? (
            <div className="max-w-md">{actionButtons}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
