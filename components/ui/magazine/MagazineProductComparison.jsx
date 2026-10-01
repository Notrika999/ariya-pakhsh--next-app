import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/src/utils/formatPrice";

function ProductHeader({ product }) {
  return (
    <Link
      href={product.href}
      className="flex min-w-40 flex-col items-center gap-2 p-3 text-center transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:hover:bg-zinc-800/70"
    >
      <span className="relative size-20">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="80px"
          className="object-contain"
        />
      </span>
      <span className="line-clamp-2 min-h-10 text-xs font-semibold leading-5 text-gray-900 dark:text-gray-100">
        {product.title}
      </span>
      <span className="text-xs font-bold text-gray-900 dark:text-white">
        {product.price > 0 ? (
          <>
            {formatPrice(product.price)}
            <span className="mr-1 text-[10px] font-medium text-gray-500">
              تومان
            </span>
          </>
        ) : (
          "توافقی"
        )}
      </span>
    </Link>
  );
}

function ProductValue({ attribute, productId }) {
  const values = attribute.values?.[productId] ?? [];
  if (!values.length) {
    return <span className="text-gray-400">-</span>;
  }

  const localizedValues = values.map((value) => {
    const normalizedValue = String(value).trim().toLowerCase();

    if (normalizedValue === "true") return "دارد";
    if (normalizedValue === "false") return "ندارد";

    return value;
  });

  return <span>{localizedValues.join("، ")}</span>;
}

export default function MagazineProductComparison({
  title = "مقایسه محصول",
  products = [],
  attributes = [],
}) {
  if (products.length < 2) return null;

  return (
    <section
      className="my-6 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-zinc-700 dark:bg-custom-dark"
      aria-label={title}
    >
      <div className="border-b border-gray-200 px-4 py-3 dark:border-zinc-700">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-2xl border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-zinc-900/50">
              <th className="w-36 border-e border-gray-200 px-3 py-3 text-start font-semibold text-gray-700 dark:border-zinc-700 dark:text-gray-200">
                محصول
              </th>
              {products.map((product) => (
                <th
                  key={product.productId}
                  className="border-e border-gray-200 align-top last:border-e-0 dark:border-zinc-700"
                >
                  <ProductHeader product={product} />
                </th>
              ))}
            </tr>
          </thead>
          {attributes.length ? (
            <tbody>
              {attributes.map((attribute, rowIndex) => (
                <tr
                  key={attribute.attributeId}
                  className={
                    rowIndex % 2 === 1
                      ? "bg-gray-50/70 dark:bg-zinc-900/40"
                      : "bg-white dark:bg-custom-dark"
                  }
                >
                  <th className="border-t border-e border-gray-200 px-3 py-3 text-start font-semibold text-gray-800 dark:border-zinc-700 dark:text-gray-100">
                    {attribute.name}
                  </th>
                  {products.map((product) => (
                    <td
                      key={`${attribute.attributeId}-${product.productId}`}
                      className="border-t border-e border-gray-200 px-3 py-3 text-center leading-7 text-gray-700 last:border-e-0 dark:border-zinc-700 dark:text-gray-300"
                    >
                      <ProductValue
                        attribute={attribute}
                        productId={product.productId}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>
      </div>
    </section>
  );
}
