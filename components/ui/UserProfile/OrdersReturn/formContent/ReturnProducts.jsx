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
            condition: "unopened",
          };
          const maxQty = Math.max(1, Number(item.quantity) || 1);

          return (
            <div
              key={item.orderItemId}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  id={`return-item-${item.orderItemId}`}
                  checked={Boolean(selection.checked)}
                  disabled={disabled}
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
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      width={80}
                      height={80}
                      src={item.imageUrl || "/images/default.png"}
                      className="h-16 w-16 rounded-lg object-cover"
                      alt={item.productName}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">
                        {item.productName}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {item.variantName
                          ? `${item.variantName} • `
                          : ""}
                        تعداد: {toFa(item.quantity)} عدد
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatMoney(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              <div
                className={`product-details mt-4 pe-9 ${
                  selection.checked ? "" : "hidden"
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
                      value={selection.condition || "unopened"}
                      disabled={disabled}
                      onChange={(e) =>
                        onChange(item.orderItemId, {
                          ...selection,
                          condition: e.target.value,
                        })
                      }
                      className="w-full appearance-none rounded-lg border px-4 py-2 pe-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
                    >
                      <option value="unopened">دربسته و استفاده نشده</option>
                      <option value="opened">باز شده اما سالم</option>
                      <option value="used">استفاده شده</option>
                      <option value="defective">معیوب و ناقص</option>
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
