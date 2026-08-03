"use client";
// components/ui/Cart/CartSynchronizationModal.jsx
import React from "react";
import { formatPrice } from "@/src/utils/formatPrice";

function isPriceIssue(issue) {
  const type = String(issue?.issueType || "").toLowerCase();
  return type.includes("price");
}

function formatIssueValue(value, issue) {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);

  if (Number.isFinite(numeric) && numeric > 0) {
    return isPriceIssue(issue)
      ? `${formatPrice(numeric)} تومان`
      : new Intl.NumberFormat("fa-IR").format(numeric);
  }

  return String(value);
}

function getIssueTitle(issue) {
  const type = String(issue?.issueType || "").toLowerCase();

  if (type.includes("price")) return "تغییر قیمت";
  if (type.includes("warranty") || type.includes("guarantee")) {
    return "تغییر گارانتی یا اصالت کالا";
  }
  if (type.includes("stock") || type.includes("inventory")) return "ناموجودی کالا";

  return issue?.severity === "error" ? "مشکل در موجودی" : "تغییر اطلاعات کالا";
}

function IssueRow({ issue }) {
  const oldValue = formatIssueValue(issue?.oldValue, issue);
  const newValue = formatIssueValue(issue?.newValue, issue);

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-zinc-900">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-bold text-gray-800 dark:text-gray-100">
          {getIssueTitle(issue)}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
            issue?.severity === "error"
              ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
              : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
          }`}
        >
          {issue?.severity === "error" ? "نیازمند حذف" : "نیازمند تأیید"}
        </span>
      </div>
      {issue?.message ? (
        <p className="leading-6 text-gray-600 dark:text-gray-300">
          {issue.message}
        </p>
      ) : null}
      {(oldValue || newValue) && (
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {oldValue ? (
            <div className="rounded-md bg-gray-50 px-2 py-1 text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
              مقدار قبلی: <span className="font-bold">{oldValue}</span>
            </div>
          ) : null}
          {newValue ? (
            <div className="rounded-md bg-primary/10 px-2 py-1 text-primary dark:bg-primary/20">
              مقدار جدید: <span className="font-bold">{newValue}</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function ProductBox({ item, type }) {
  const issues = Array.isArray(item?.issues) ? item.issues : [];
  const hasIssues = issues.length > 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-zinc-800/80">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="line-clamp-2 font-black leading-7 text-gray-900 dark:text-white">
            {item?.productName || "محصول"}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            {item?.quantity ? (
              <span>تعداد: {new Intl.NumberFormat("fa-IR").format(item.quantity)}</span>
            ) : null}
            {item?.currentPrice ? (
              <span>قیمت فعلی: {formatPrice(item.currentPrice)} تومان</span>
            ) : null}
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
            type === "error"
              ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
              : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
          }`}
        >
          {type === "error" ? "ناموجود" : "تغییر کرده"}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {hasIssues ? (
          issues.map((issue, index) => (
            <IssueRow
              // Backend issue objects do not expose stable IDs.
              key={`${issue?.issueType || "issue"}-${index}`}
              issue={issue}
            />
          ))
        ) : (
          <p className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-6 text-gray-600 dark:border-gray-700 dark:bg-zinc-900 dark:text-gray-300">
            {type === "error"
              ? "این کالا در حال حاضر موجود نیست و با تأیید شما از سبد خرید حذف می‌شود."
              : "اطلاعات این کالا تغییر کرده است و برای ادامه خرید باید وضعیت جدید را تأیید کنید."}
          </p>
        )}
      </div>
    </div>
  );
}

export default function CartSynchronizationModal({
  actionLoading,
  onCancel,
  onConfirm,
  syncState,
}) {
  if (!syncState) return null;

  const hasErrors = syncState.errorItems.length > 0;
  const hasWarnings = syncState.warningItems.length > 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-sync-title"
    >
      <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-custom-dark">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                hasErrors
                  ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
              }`}
            >
              <i className={`far ${hasErrors ? "fa-triangle-exclamation" : "fa-badge-check"}`} />
            </div>
            <div className="space-y-2">
              <h2
                id="cart-sync-title"
                className="text-lg font-black text-gray-900 dark:text-white"
              >
                بروزرسانی وضعیت سبد خرید
              </h2>
              <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">
                {hasErrors
                  ? "برخی کالاهای سبد خرید دیگر موجود نیستند. با تأیید شما کالاهای ناموجود حذف می‌شوند و سبد خرید برای تکمیل خرید آماده می‌شود."
                  : "قیمت، گارانتی یا اصالت برخی کالاها تغییر کرده است. با تأیید، کالا با اطلاعات جدید ثبت می‌شود؛ با انصراف، کالاهای تغییر کرده از سبد خرید حذف می‌شوند."}
              </p>
              {hasErrors && hasWarnings ? (
                <p className="text-sm leading-7 text-amber-700 dark:text-amber-300">
                  کالاهای ناموجود حذف می‌شوند و تغییرات کالاهای باقی‌مانده با اطلاعات جدید تأیید می‌شود.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="max-h-[58vh] space-y-3 overflow-y-auto px-5 py-4">
          {syncState.errorItems.map((item) => (
            <ProductBox key={`error-${item.variantId || item.productId}`} item={item} type="error" />
          ))}

          {syncState.warningItems.map((item) => (
            <ProductBox
              key={`warning-${item.variantId || item.productId}`}
              item={item}
              type="warning"
            />
          ))}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-5 py-4 dark:border-gray-700 sm:flex-row sm:justify-end">
          {!hasErrors ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={actionLoading}
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-zinc-800"
            >
              انصراف و حذف کالاها
            </button>
          ) : null}
          <button
            type="button"
            onClick={onConfirm}
            disabled={actionLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {actionLoading ? (
              <i className="far fa-spinner-third animate-spin" aria-hidden="true" />
            ) : null}
            {hasErrors
              ? "تأیید و بروزرسانی سبد"
              : "تأیید تغییرات و ادامه خرید"}
          </button>
        </div>
      </div>
    </div>
  );
}
