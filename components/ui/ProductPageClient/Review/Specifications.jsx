// components/ui/ProductPageClient/Review/Specifications.jsx

function attributeValue(attribute) {
  return attribute?.displayText || attribute?.value || "";
}

function normalizeListValue(value) {
  if (Array.isArray(value)) {
    return value
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value !== "string") return [];

  return value
    .split(/[،,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildRows(product, attributes, variant) {
  const compatibleCars =
    product?.compatibilities
      ?.map((item) => `${item.name ? ` ${item.name}` : ""}`)
      .filter(Boolean) ?? [];

  const rows = [
    compatibleCars.length
      ? {
          label: "خودروهای سازگار",
          value: compatibleCars.join("، "),
          values: compatibleCars,
          featured: true,
        }
      : null,
  ];

  const productAttributes =
    attributes?.map((attribute) => ({
      label: attribute.attributeName,
      value: attributeValue(attribute),
      values: normalizeListValue(attributeValue(attribute)),
    })) ?? [];

  const variantAttributes =
    variant?.attributes?.map((attribute) => ({
      label: attribute.attributeName,
      value: attributeValue(attribute),
      values: normalizeListValue(attributeValue(attribute)),
    })) ?? [];

  return [...rows, ...productAttributes, ...variantAttributes].filter(
    (row) =>
      row &&
      row.label &&
      row.value !== undefined &&
      row.value !== null &&
      String(row.value).trim(),
  );
}

function ValueContent({ row }) {
  const shouldUseChips = row.featured || row.values.length > 3;

  if (!shouldUseChips) {
    return (
      <p className="whitespace-pre-line break-words text-sm leading-7 text-gray-800 dark:text-gray-100">
        {row.value}
      </p>
    );
  }

  return (
    <div className="max-h-72 overflow-y-auto pe-1">
      <div className="flex flex-wrap gap-2">
        {row.values.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium leading-5 text-gray-700 shadow-sm dark:border-gray-700 dark:bg-zinc-900 dark:text-gray-200"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Specifications({ product, attributes, variant }) {
  const rows = buildRows(product, attributes, variant);

  return (
    <>
      <h2 className="relative pb-3 md:text-2xl text-lg font-black text-zinc-800 before:absolute before:bottom-0 before:right-0 before:h-1 before:w-22 before:rounded before:bg-secondary-500 dark:text-white">
        مشخصات فنی
      </h2>

      {rows.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4">
          {rows.map((row, index) => (
            <section
              key={`${row.label}-${index}`}
              className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm transition-colors dark:border-gray-700 dark:bg-zinc-900/70 md:grid-cols-[240px_1fr]"
            >
              <div className="flex min-h-14 items-center rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-900/50 dark:bg-blue-950/30">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  {row.label}
                </span>
              </div>

              <div className="min-h-14 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-[#1e232a]">
                <ValueContent row={row} />
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-neutral-500 dark:border-gray-700 dark:bg-zinc-900 dark:text-neutral-400">
          مشخصاتی برای این محصول ثبت نشده است.
        </div>
      )}
    </>
  );
}
