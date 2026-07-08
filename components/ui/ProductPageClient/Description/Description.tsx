"use client";
// components/ui/ProductPageClient/Description.tsx
import React, { useState } from "react";
import { ProductDetail } from "@/src/lib/types/products/productDetail.types";

interface Props {
  product: ProductDetail;
  isOutOfStock: boolean;
}

export default function Description({ product, isOutOfStock }: Props) {
  const defaultVariant =
    product.variants?.find((v) => v.isDefault) ?? product.variants?.[0];

  const colorAttributes =
    product.variants?.map((v) => {
      const colorAttr = v.attributes?.find((a) => a.attributeName === "رنگ");
      return {
        id: v.variantId,
        title: v.name,
        code: colorAttr?.value ?? "#ccc",
        inStock: v.inStock,
      };
    }) ?? [];

  const [selectedColor, setSelectedColor] = useState(
    colorAttributes.find((c) => c.id === defaultVariant?.variantId) ??
      colorAttributes[0],
  );

  const primaryCategory =
    product.categories?.find((c) => c.isPrimary) ?? product.categories?.[0];
  const primaryBrand =
    product.brands?.find((b) => b.isPrimary) ?? product.brands?.[0];

  return (
    <section className="xl:col-span-5 mt-7 col-span-12 pb-10 w-full dark:text-gray-200">
      {/* Category */}
      <ul className="space-x-2 flex items-center">
        {primaryBrand && (
          <>
            <li>
              <a href={`/brand/${primaryBrand.slug}`} className="text-primary">
                {primaryBrand.name}
              </a>
            </li>
            <li className="text-gray-400 dark:text-gray-500">/</li>
          </>
        )}
        {primaryCategory && (
          <li>
            <a
              href={`/category/${primaryCategory.slug}`}
              className="text-primary"
            >
              {primaryCategory.name}
            </a>
          </li>
        )}
      </ul>

      {/* Title */}
      <div className="space-y-2 mt-2 pb-2 border-b border-b-gray-300 dark:border-b-gray-700">
        <h2 className="font-black leading-8">{product.name}</h2>
        {product.shortDescription && (
          <h2 className="text-gray-400 dark:text-gray-500 text-sm leading-8">
            {product.shortDescription}
          </h2>
        )}
      </div>

      {/* Rating, Comments */}
      <div className="flex flex-wrap items-center pt-2 mt-2 space-x-2">
        <div className="flex items-center space-x-1">
          <i className="fas fa-star text-amber-400"></i>
          <h4 className="text-sm font-bold">
            {product.averageRating?.toFixed(1) ?? "0.0"}
          </h4>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            (امتیاز{" "}
            {new Intl.NumberFormat("fa-IR").format(product.reviewCount ?? 0)}{" "}
            خریدار)
          </span>
        </div>

        <div>
          <a
            href="#comments"
            className="bg-gray-200 hover:bg-primary/20 transition dark:bg-zinc-800 dark:text-gray-200 px-2 py-1 space-x-1 rounded-full flex items-center"
          >
            <span className="text-xs">
              {new Intl.NumberFormat("fa-IR").format(product.reviewCount ?? 0)}{" "}
              دیدگاه
            </span>
            <i className="far fa-angle-left"></i>
          </a>
        </div>
      </div>

      {/* Out of Stock Notice */}
      {isOutOfStock && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <i className="far fa-exclamation-triangle text-red-500"></i>
            <span className="text-red-700 dark:text-red-300 font-medium">
              این محصول در حال حاضر موجود نمی‌باشد
            </span>
          </div>
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">
            می‌توانید از طریق دکمه زیر، در صورت موجود شدن به شما اطلاع‌رسانی
            کنیم.
          </p>
        </div>
      )}

      {/* Color Picker */}
      {colorAttributes.length > 0 && selectedColor && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full border"
              style={{ background: selectedColor.code }}
            />
            <p className="font-semibold text-lg">رنگ: {selectedColor.title}</p>
          </div>

          <div className="flex items-center gap-4">
            {colorAttributes.slice(0, 4).map((color) => {
              const isActive = selectedColor?.id === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => !isOutOfStock && setSelectedColor(color)}
                  className="relative w-12 h-12 rounded-full flex items-center justify-center"
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full ring-4 ring-sky-400" />
                  )}
                  <span
                    className="relative z-10 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    style={{ background: color.code }}
                  >
                    {isActive && (
                      <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Compatibilities */}
      {product.compatibilities?.length > 0 && (
        <div className="mt-8 space-y-3">
          <h4 className="font-bold text-lg flex items-center gap-2">
            <i className="fas fa-car-side text-primary" aria-hidden="true" />
            خودروهای سازگار
          </h4>
          <ul className="grid gap-3 lg:grid-cols-2 sm:grid-cols-2 grid-cols-1">
            {product.compatibilities.map((item) => (
              <li
                key={item.carId}
                className="flex items-center justify-between gap-3 p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg"
              >
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {item.name}
                  </p>
                  {item.model && (
                    <p className="line-clamp-1 mt-1 text-xs text-gray-600 dark:text-gray-300">
                      مدل: {item.model}
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    item.isIranianCar
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
                  }`}
                >
                  {item.isIranianCar ? "ایرانی" : "وارداتی"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Attributes */}
      {product.variants?.[0]?.attributes?.length > 0 && (
        <div className="mt-8 space-y-3">
          <h4 className="font-bold text-lg">ویژگی‌ها</h4>
          <div className="grid gap-3 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {product.variants[0].attributes.map((attr) => (
              <div
                key={attr.attributeId}
                className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg relative group"
              >
                <h5 className="line-clamp-1 text-xs text-gray-600 dark:text-gray-300">
                  {attr.attributeName}
                </h5>
                <h6 className="line-clamp-1 mt-3 text-xs">{attr.value}</h6>
                <span className="absolute text-nowrap z-50 inset-e-1/2 ms-2 -top-3 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
                  <span className="absolute inset-e-1/2 -bottom-2.5 rotate-90 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
                  {attr.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warranty / Alert */}
      {product.warrantyInfo && (
        <div className="rounded my-3 mx-5 lg:mx-0">
          <div className="flex">
            <div className="flex mt-1">
              <i className="fas fa-circle-exclamation text-gray-500 dark:text-gray-400"></i>
            </div>
            <span className="ms-2 text-xs leading-6 text-justify text-neutral-500 dark:text-neutral-400">
              {product.warrantyInfo}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
