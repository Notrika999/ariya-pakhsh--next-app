// components/ui/Checkout/PaymentResult.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ORDERS_PATH = "/user-profile/orders";
const REDIRECT_SECONDS = 5;

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

function isSuccessStatus(status: string | null) {
  if (!status) return false;

  return ["success", "succeeded", "paid", "ok", "true", "1"].includes(
    status.toLowerCase(),
  );
}

export default function PaymentResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [remainingSeconds, setRemainingSeconds] = useState(REDIRECT_SECONDS);

  const result = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const status = getFirstParam(params, ["status", "State", "state"]);
    const success = isSuccessStatus(status);

    return {
      success,
      title: success ? "پرداخت موفق" : "پرداخت ناموفق",
      description: success
        ? "پرداخت شما با موفقیت ثبت شد."
        : "پرداخت شما تایید نشد یا با خطا برگشت داده شد.",
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
      orderId: getFirstParam(params, [
        "orderId",
        "OrderId",
        "orderNumber",
        "OrderNumber",
      ]),
    };
  }, [searchParams]);

  useEffect(() => {
    const countdownTimer = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0));
    }, 1000);
    const redirectTimer = window.setTimeout(() => {
      router.replace(ORDERS_PATH);
    }, REDIRECT_SECONDS * 1000);

    return () => {
      window.clearInterval(countdownTimer);
      window.clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <section className="py-5">
      <div className="container mx-auto px-4">
        <div className="mx-auto w-full max-w-md">
          <div
            className={`overflow-hidden rounded-2xl border bg-white shadow-xl dark:bg-custom-dark ${
              result.success
                ? "border-green-200 dark:border-green-800"
                : "border-red-200 dark:border-red-800"
            }`}
          >
            <div
              className={`p-6 text-center ${
                result.success
                  ? "bg-linear-to-l from-green-500 to-emerald-600"
                  : "bg-linear-to-l from-red-500 to-rose-600"
              }`}
            >
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                <i
                  className={`text-2xl text-white ${
                    result.success ? "fa fa-check" : "far fa-x"
                  }`}
                />
              </div>
              <h1 className="text-2xl font-black text-white">
                {result.title}
              </h1>
              <p className="mt-2 text-white/85">{result.description}</p>
            </div>

            <div className="space-y-4 p-6">
              <div
                className={`rounded-xl p-4 ${
                  result.success
                    ? "bg-green-50 dark:bg-green-900/20"
                    : "bg-red-50 dark:bg-red-900/20"
                }`}
              >
                <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                  {result.message ||
                    (result.success
                      ? "نتیجه پرداخت از درگاه دریافت شد."
                      : "جزئیات خطا از پارامترهای برگشتی درگاه دریافت نشد.")}
                </p>
              </div>

              <div className="space-y-3 rounded-xl bg-gray-50 p-4 text-sm dark:bg-gray-800/60">
                {result.orderId ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-500 dark:text-gray-400">
                      شماره سفارش
                    </span>
                    <span className="break-all font-bold text-gray-800 dark:text-white">
                      {result.orderId}
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

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                انتقال خودکار به سفارش‌ها تا {remainingSeconds} ثانیه دیگر
              </p>

              <Link
                href={ORDERS_PATH}
                className={`flex w-full items-center justify-center rounded-lg px-4 py-3 font-medium text-white transition-colors duration-200 ${
                  result.success
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-primary hover:bg-primary-600"
                }`}
              >
                مشاهده سفارش‌ها
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
