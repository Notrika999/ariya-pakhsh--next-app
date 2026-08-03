"use client";

import Image from "next/image";

function formatMoney(value) {
  return `${new Intl.NumberFormat("fa-IR").format(
    Math.max(0, Math.round(Number(value) || 0)),
  )} تومان`;
}

function toFa(value) {
  return new Intl.NumberFormat("fa-IR").format(Number(value) || 0);
}

export default function ReturnProducts({
  orderItems = [],
  selections = {},
  onChange,
  disabled = false,
}) {
  if (orderItems.length === 0) {
    return (
      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">
          انتخاب محصولات برای مرجوعی
        </h3>
        <p className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
          آیتمی برای مرجوعی در این سفارش وجود ندارد.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">
        انتخاب محصولات برای مرجوعی
      </h3>

      <div className="space-y-4">
        {orderItems.map((item) => {
          const selection = selections[item.orderItemId] ?? {
            checked: false,
            quantity: 1,
            condition: "sealed_unused",
          };
          const maxQty = Math.max(1, Number(item.quantity) || 1);
          const canRequestReturn = item.canRequestReturn !== false;

          return (
            <div
              key={item.orderItemId}
              className={`rounded-xl border p-4 transition ${
                canRequestReturn && selection.checked
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20 dark:bg-primary/10"
                  : canRequestReturn
                    ? "border-gray-200 bg-white hover:border-primary/40 hover:bg-gray-50 dark:border-gray-700 dark:bg-zinc-900/40 dark:hover:bg-zinc-800"
                    : "border-amber-200 bg-amber-50/50 dark:border-amber-800/70 dark:bg-amber-950/20"
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <input
                  type="checkbox"
                  id={`return-item-${item.orderItemId}`}
                  checked={canRequestReturn && Boolean(selection.checked)}
                  disabled={disabled || !canRequestReturn}
                  onChange={(e) =>
                    onChange(item.orderItemId, {
                      ...selection,
                      checked: e.target.checked,
                      quantity: Math.min(
                        Math.max(1, Number(selection.quantity) || 1),
                        maxQty,
                      ),
                    })
                  }
                  className="product-checkbox h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor={`return-item-${item.orderItemId}`}
                  className={`min-w-0 flex-1 ${
                    canRequestReturn ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Image
                      width={80}
                      height={80}
                      src={item.imageUrl || "/images/default.png"}
                      className="h-20 w-20 rounded-xl border border-gray-100 bg-white object-cover dark:border-gray-700 dark:bg-zinc-900"
                      alt={item.productName}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">
                        {item.productName}
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                        {item.variantName ? (
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-zinc-800">
                            {item.variantName}
                          </span>
                        ) : null}
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-zinc-800">
                          تعداد سفارش: {toFa(item.quantity)}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-zinc-800">
                          قیمت واحد: {formatMoney(item.unitPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </label>

                {!canRequestReturn && (
                  <div className="ms-auto flex max-w-[180px] shrink-0 items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs font-bold text-amber-700 shadow-sm dark:border-amber-800/70 dark:bg-zinc-900 dark:text-amber-300">
                    <i className="fa-regular fa-circle-info"></i>
                    <span>این کالا قابل مرجوعی نیست</span>
                  </div>
                )}
              </div>

              <div
                className={`product-details mt-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-zinc-900 ${
                  canRequestReturn && selection.checked ? "" : "hidden"
                }`}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      تعداد مرجوعی
                    </label>
                    <select
                      value={String(selection.quantity || 1)}
                      disabled={disabled}
                      onChange={(e) =>
                        onChange(item.orderItemId, {
                          ...selection,
                          quantity: Number(e.target.value) || 1,
                        })
                      }
                      className="w-full appearance-none rounded-lg border px-4 py-2 pe-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
                    >
                      {Array.from({ length: maxQty }, (_, index) => {
                        const qty = index + 1;
                        return (
                          <option key={qty} value={qty}>
                            {toFa(qty)} عدد
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      وضعیت محصول
                    </label>
                    <select
                      value={selection.condition || "sealed_unused"}
                      disabled={disabled}
                      onChange={(e) =>
                        onChange(item.orderItemId, {
                          ...selection,
                          condition: e.target.value,
                        })
                      }
                      className="w-full appearance-none rounded-lg border px-4 py-2 pe-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
                    >
                      <option value="sealed_unused">
                        دربسته و استفاده نشده
                      </option>
                      <option value="opened_intact">باز شده اما سالم</option>
                      <option value="used">استفاده شده</option>
                      <option value="defective_incomplete">معیوب و ناقص</option>
                      <option value="partially_used">با ذکر صلوات</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
