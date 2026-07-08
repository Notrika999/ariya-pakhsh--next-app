"use client";

import Image from "next/image";

export default function ReturnProducts({ products, onChange }) {
  return (
    <div>
      <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4">
        انتخاب محصولات برای مرجوعی
      </h3>

      <div className="space-y-4">
        {/* Product 1 */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-4 ">
            <input
              type="checkbox"
              id="product1"
              checked={products.product1.checked}
            onChange={(e) =>
              onChange("product1", {
                ...products.product1,
                checked: e.target.checked,
              })
            }
              className="product-checkbox w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="product1" className="flex-1 cursor-pointer">
              <div className="flex items-center space-x-4 ">
                <Image
                width={80}
                height={80}
                  src="/images/product-car/03.jpg"
                  // src=?? "/images/default.png"
                  className="w-16 h-16 rounded-lg"
                  alt="روکش صندلی"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    روکش صندلی
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    رنگ: مشکی • تعداد: ۱ عدد
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ۱,۱۰۰,۰۰۰ تومان
                  </p>
                </div>
              </div>
            </label>
          </div>

          <div
           className={`mt-4 pe-9 product-details ${
            products.product1.checked ? "" : "hidden"
          }`}
            id="product1-details"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تعداد مرجوعی
                </label>
                <select 
                 value={products.product1.quantity}
              onChange={(e) =>
                onChange("product1", {
                  ...products.product1,
                  quantity: e.target.value,
                })
              } className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white">
                  <option value="1">۱ عدد</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وضعیت محصول
                </label>
                <select 
                 value={products.product1.condition}
              onChange={(e) =>
                onChange("product1", {
                  ...products.product1,
                  condition: e.target.value,
                })
              }
              className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white">
                  <option value="unopened">دربسته و استفاده نشده</option>
                  <option value="opened">باز شده اما سالم</option>
                  <option value="used">استفاده شده</option>
                  <option value="defective">معیوب و ناقص</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
