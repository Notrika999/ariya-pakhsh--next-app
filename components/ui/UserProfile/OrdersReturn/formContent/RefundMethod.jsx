const REFUND_METHODS = [
  // {
  //   value: "wallet",
  //   title: "اعتبار کیف پول",
  //   description: "واریز سریع‌تر برای خریدهای بعدی",
  //   meta: "حدود ۲۴ ساعت کاری",
  //   icon: "fa-wallet",
  // },
  {
    value: "bank_account",
    title: "حساب بانکی",
    description: "بازگشت وجه به مسیر بانکی",
    meta: "۳ تا ۵ روز کاری",
    icon: "fa-building-columns",
  },
];

export default function RefundMethod({
  value,
  onChange,
  isPurchaseCardOwnedByCustomer = true,
  onCardOwnershipChange,
  disabled = false,
}) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">
        روش استرداد وجه
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {REFUND_METHODS.map((method) => {
          const selected = value === method.value;

          return (
            <label
              key={method.value}
              className={`relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition ${
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20 dark:bg-primary/10"
                  : "border-gray-200 hover:border-primary/50 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-800"
              } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
            >
              <input
                type="radio"
                name="refundMethod"
                value={method.value}
                disabled={disabled}
                className="sr-only"
                checked={selected}
                onChange={(e) => onChange?.(e.target.value)}
              />
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  selected
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-300"
                }`}
              >
                <i className={`fa-solid ${method.icon}`}></i>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-gray-900 dark:text-gray-100">
                  {method.title}
                </span>
                <span className="mt-1 block text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {method.description}
                </span>
                <span className="mt-3 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                  {method.meta}
                </span>
              </span>
              {selected ? (
                <i className="fa-regular fa-circle-check text-lg text-primary"></i>
              ) : null}
            </label>
          );
        })}
      </div>

      {value === "bank_account" ? (
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-zinc-800/70">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                کارت پرداخت متعلق به خریدار است؟
              </p>
              
            </div>
            <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-zinc-900">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onCardOwnershipChange?.(true)}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  isPurchaseCardOwnedByCustomer
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
                }`}
              >
                بله
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onCardOwnershipChange?.(false)}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  !isPurchaseCardOwnedByCustomer
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
                }`}
              >
                خیر
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
