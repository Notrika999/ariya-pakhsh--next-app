"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/src/utils/formatPrice";
import { trackMagazineArticleEvent } from "@/src/services/magazine/magazine.client";

export default function MagazineRelatedProducts({
  products = [],
  articleId = "",
}) {
  if (!products.length) return null;

  return (
    <section aria-labelledby="related-products-heading" className="mt-10">
      <h2
        id="related-products-heading"
        className="mb-4 text-lg font-bold text-gray-900 dark:text-white"
      >
        محصولات مرتبط
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const hasDiscount =
            product.compareAtPrice && product.compareAtPrice > product.price;

          return (
            <Link
              key={product.publicCode}
              href={product.href}
              onClick={() => {
                if (!articleId || !product.productId) return;
                trackMagazineArticleEvent({
                  articleId,
                  eventType: "productClickedFromArticle",
                  productId: product.productId,
                });
              }}
              className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-zinc-700 dark:bg-custom-dark"
            >
              <div className="relative aspect-square bg-gray-50 dark:bg-zinc-800">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 220px"
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.04]"
                />
                {!product.isInStock ? (
                  <span className="absolute inset-s-2 top-2 rounded-sm bg-gray-900/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    ناموجود
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <h3 className="line-clamp-2 text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                  {product.title}
                </h3>
                <p className="mt-auto pt-2 text-sm font-bold text-gray-900 dark:text-white">
                  {hasDiscount ? (
                    <span className="ml-1 text-xs font-normal text-gray-400 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  ) : null}
                  {product.price > 0 ? (
                    <>
                      {formatPrice(product.price)}
                      <span className="mr-1 text-[11px] font-medium text-gray-500">
                        تومان
                      </span>
                    </>
                  ) : (
                    "توافقی"
                  )}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
