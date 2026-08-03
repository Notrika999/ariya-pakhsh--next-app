"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { retryMyOrderPayment } from "@/src/services/orders/orders.client";
import {
  clearRememberedPendingPaymentOrder,
  getRememberedPendingPaymentOrderInfo,
  rememberPendingPaymentOrder,
} from "@/src/utils/paymentRetryStorage";

const HOME_PATH = "/";
const ORDERS_PATH = "/user-profile/orders";

type PaymentResultStatus = "success" | "cancelled" | "failed";

function getFirstParam(
  searchParams: URLSearchParams,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value) return value;
  }

  return null;
}

function resolveStatus(status: string | null): PaymentResultStatus {
  if (!status) return "failed";

  const normalized = status.toLowerCase();

  if (["success", "succeeded", "paid", "ok", "true", "1"].includes(normalized)) {
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
  const status = getFirstParam(params, ["status", "State", "state"]);
  if (status) return resolveStatus(status);

  const code = getFirstParam(params, ["ResCode", "resCode", "code", "Code"]);
  if (code === "0") return "success";
  if (code === "17") return "cancelled";

  return "failed";
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "پرداخت مجدد ناموفق بود. دوباره تلاش کنید.";
}

function getResultCopy(status: PaymentResultStatus) {
  if (status === "success") {
    return {
      title: "پرداخت موفق",
      description: "پرداخت شما با موفقیت ثبت شد.",
      fallbackMessage: "نتیجه پرداخت از درگاه دریافت شد.",
      icon: "fa fa-check",
      shellClass: "border-green-200 dark:border-green-800",
      headerClass: "bg-linear-to-l from-green-500 to-emerald-600",
      messageClass: "bg-green-50 dark:bg-green-900/20",
    };
  }

  if (status === "cancelled") {
    return {
      title: "پرداخت لغو شد",
      description: "فرآیند پرداخت توسط کاربر لغو شد.",
      fallbackMessage:
        "پرداخت انجام نشد و سفارش در وضعیت پرداخت‌نشده باقی می‌ماند.",
      icon: "far fa-ban",
      shellClass: "border-amber-200 dark:border-amber-800",
      headerClass: "bg-linear-to-l from-amber-500 to-orange-600",
      messageClass: "bg-amber-50 dark:bg-amber-900/20",
    };
  }

  return {
    title: "پرداخت ناموفق",
    description: "پرداخت شما تایید نشد یا با خطا برگشت داده شد.",
    fallbackMessage:
      "جزئیات خطا از پارامترهای برگشتی درگاه دریافت نشد.",
    icon: "far fa-x",
    shellClass: "border-red-200 dark:border-red-800",
    headerClass: "bg-linear-to-l from-red-500 to-rose-600",
    messageClass: "bg-red-50 dark:bg-red-900/20",
  };
}

export default function PaymentResult() {
  const searchParams = useSearchParams();
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);



  const result = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const status = resolveCallbackStatus(params);
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
    const displayOrderNumber =
      getFirstParam(params, [
        "publicOrderNumber",
        "PublicOrderNumber",
        "orderNumber",
        "OrderNumber",
      ]) ?? rememberedOrder?.orderNumber ?? orderId;

    return {
      status,
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
      displayOrderNumber,
    };
  }, [searchParams]);

  useEffect(() => {
    if (result.status === "success") {
      clearRememberedPendingPaymentOrder();
    }
  }, [result.status]);

  const handleRetryPayment = async () => {
    if (!result.orderId || retrying) {
      setRetryError("شناسه سفارش برای پرداخت مجدد در پاسخ درگاه موجود نیست.");
      return;
    }

    setRetrying(true);
    setRetryError(null);

    try {
      const retryResult = await retryMyOrderPayment(result.orderId);
      const redirectUrl = retryResult.paymentUrl || retryResult.redirectUrl;

      if (!redirectUrl) {
        setRetryError("آدرس درگاه پرداخت از سرویس دریافت نشد.");
        return;
      }

      rememberPendingPaymentOrder(result.orderId, result.displayOrderNumber);
      window.location.assign(redirectUrl);
    } catch (error) {
      setRetryError(getErrorMessage(error));
    } finally {
      setRetrying(false);
    }
  };

  return (
    <section className="py-5">
      <div className="container mx-auto px-4">
        <div className="mx-auto w-full max-w-md">
          <div
            className={`overflow-hidden rounded-2xl border bg-white shadow-xl dark:bg-custom-dark ${result.shellClass}`}
          >
            <div className={`p-6 text-center ${result.headerClass}`}>
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                <i className={`text-2xl text-white ${result.icon}`} />
              </div>
              <h1 className="text-2xl font-black text-white">
                {result.title}
              </h1>
              <p className="mt-2 text-white/85">{result.description}</p>
            </div>

            <div className="space-y-4 p-6">
              <div className={`rounded-xl p-4 ${result.messageClass}`}>
                <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                  {result.message || result.fallbackMessage}
                </p>
              </div>

              <div className="space-y-3 rounded-xl bg-gray-50 p-4 text-sm dark:bg-gray-800/60">
                {result.displayOrderNumber ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-500 dark:text-gray-400">
                      شماره سفارش
                    </span>
                    <span className="break-all font-bold text-gray-800 dark:text-white">
                      {result.displayOrderNumber}
                    </span>
                  </div>
                ) : null}
                {result.transactionId ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-500 dark:text-gray-400">
                      شناسه پیگیری
                    </span>
                    <span className="break-all font-bold text-gray-800 dark:text-white">
                      {result.transactionId}
                    </span>
                  </div>
                ) : null}
                {result.code ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-500 dark:text-gray-400">
                      کد نتیجه
                    </span>
                    <span className="break-all font-bold text-gray-800 dark:text-white">
                      {result.code}
                    </span>
                  </div>
                ) : null}
              </div>

              {retryError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                  {retryError}
                </div>
              ) : null}

              {result.status === "success" ? (
                <Link
                  href={ORDERS_PATH}
                  className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-green-700"
                >
                  تایید
                </Link>
              ) : null}

              {result.status !== "success" ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => void handleRetryPayment()}
                    disabled={retrying}
                    className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {retrying ? "در حال انتقال..." : "پرداخت مجدد"}
                  </button>
                  <Link
                    href={HOME_PATH}
                    className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    صفحه اصلی
                  </Link>
                </div>
              ) : null}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
