const REASON_LABELS = {
  defective: "کالای معیوب یا ناقص",
  wrong_item: "کالای نادرست ارسال شده",
  not_as_described: "مغایرت با توضیحات",
  change_mind: "تغییر نظر",
  damaged: "آسیب‌دیده در حمل و نقل",
  other: "سایر دلایل",
};

const REFUND_METHOD_LABELS = {
  wallet: "اعتبار کیف پول",
  bank_account: "حساب بانکی",
};

function formatMoney(value) {
  return `${new Intl.NumberFormat("fa-IR").format(
    Math.max(0, Math.round(Number(value) || 0)),
  )} تومان`;
}

function calculateSelectedRefund(item, selectedQuantity) {
  const itemQuantity = Math.max(1, Number(item.quantity) || 1);
  const lineAmount =
    Number(item.refundableAmount) ||
    Number(item.finalLineAmount) ||
    Number(item.lineTotal) ||
    (Number(item.unitPrice) || 0) * itemQuantity;
  const perUnitAmount = lineAmount / itemQuantity;

  return perUnitAmount * selectedQuantity;
}

export default function ReturnSummary({
  orderItems = [],
  selections = {},
  refundMethod = "wallet",
  returnReason = "",
  evidenceFileCount = 0,
  customerNationalIdFileCount = 0,
  cardOwnerNationalIdFileCount = 0,
}) {
  const selectedItems = orderItems.filter(
    (item) => selections[item.orderItemId]?.checked,
  );

  const refundableAmount = selectedItems.reduce((total, item) => {
    const quantity = Math.min(
      Math.max(1, Number(selections[item.orderItemId]?.quantity) || 1),
      Math.max(1, Number(item.quantity) || 1),
    );
    return total + calculateSelectedRefund(item, quantity);
  }, 0);

  const fileCount =
    evidenceFileCount +
    customerNationalIdFileCount +
    cardOwnerNationalIdFileCount;

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-zinc-800/70">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          خلاصه مرجوعی
        </h3>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-600 shadow-sm dark:bg-zinc-900 dark:text-gray-300">
          {new Intl.NumberFormat("fa-IR").format(selectedItems.length)} کالا
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 dark:bg-zinc-900">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            محصولات انتخابی
          </span>
          <p className="mt-2 font-bold text-gray-900 dark:text-gray-100">
            {new Intl.NumberFormat("fa-IR").format(selectedItems.length)} از{" "}
            {new Intl.NumberFormat("fa-IR").format(orderItems.length)}
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 dark:bg-zinc-900">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            دلیل مرجوعی
          </span>
          <p className="mt-2 font-bold text-gray-900 dark:text-gray-100">
            {REASON_LABELS[returnReason] || "انتخاب نشده"}
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 dark:bg-zinc-900">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            روش استرداد
          </span>
          <p className="mt-2 font-bold text-gray-900 dark:text-gray-100">
            {REFUND_METHOD_LABELS[refundMethod] || "انتخاب نشده"}
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 dark:bg-zinc-900">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            فایل‌های ضمیمه
          </span>
          <p className="mt-2 font-bold text-gray-900 dark:text-gray-100">
            {new Intl.NumberFormat("fa-IR").format(fileCount)} فایل
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 dark:bg-primary/10">
        <div className="flex items-center justify-between gap-4">
          <span className="font-bold text-gray-800 dark:text-gray-100">
            مبلغ تقریبی قابل استرداد
          </span>
          <span className="text-lg font-black text-primary">
            {formatMoney(refundableAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
