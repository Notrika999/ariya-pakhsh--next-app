import React from "react";

const numberFormatter = new Intl.NumberFormat("fa-IR");

function formatNumber(value) {
  if (value === undefined || value === null) return "";
  return numberFormatter.format(value);
}

function attributeValue(attribute) {
  return attribute?.displayText || attribute?.value || "";
}

function buildRows(product, attributes, variant) {
  const primaryCategory =
    product?.categories?.find((item) => item.isPrimary) ||
    product?.categories?.[0];
  const primaryBrand =
    product?.brands?.find((item) => item.isPrimary) || product?.brands?.[0];

  const rows = [
    
   
    [
      "خودروهای سازگار",
      product?.compatibilities
        ?.map((item) => `${item.name}${item.model ? ` ${item.model}` : ""}`)
        .join("، "),
    ],
  ];

  const productAttributes =
    attributes?.map((attribute) => [
      attribute.attributeName,
      attributeValue(attribute),
    ]) ?? [];

  const variantAttributes =
    variant?.attributes?.map((attribute) => [
      attribute.attributeName,
      attributeValue(attribute),
    ]) ?? [];

  return [...rows, ...productAttributes, ...variantAttributes].filter(
    ([, value]) => value !== undefined && value !== null && String(value).trim(),
  );
}

export default function Specifications({ product, attributes, variant }) {
  const rows = buildRows(product, attributes, variant);

  return (
    <>
      <h2 className="text-2xl pb-3 font-black text-zinc-800 relative before:absolute before:bottom-0 before:right-0 before:h-1 before:w-22 before:bg-secondary-500 before:rounded dark:text-white">
        مشخصات فنی
      </h2>

      {rows.length > 0 ? (
        <div className="mx-auto p-6">
          <div className="grid grid-cols-2 gap-6 text-right">
            {rows.map(([label, value], index) => (
              <React.Fragment key={`${label}-${index}`}>
                <span className="sm:col-span-1 col-span-2 bg-gray-200 border border-gray-300 dark:border-gray-700 px-3 rounded text-gray-900 text-sm py-4 inline-flex items-center dark:bg-[#1e232a] dark:text-white">
                  {label}:
                </span>
                <span className="sm:col-span-1 col-span-2 bg-gray-100 border border-gray-200 px-3 py-4 text-sm text-gray-900 inline-flex items-center dark:bg-[#252b33] dark:border-gray-700 rounded dark:text-white">
                  {value}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-6 text-neutral-500 dark:text-neutral-400">
          مشخصاتی برای این محصول ثبت نشده است.
        </p>
      )}
    </>
  );
}
