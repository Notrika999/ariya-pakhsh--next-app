"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/src/utils/formatPrice";
import { trackMagazineArticleEvent } from "@/src/services/magazine/magazine.client";

export default function MagazineProductEmbed({
  product,
  text = "",
  articleId = "",
}) {
  if (!product) return null;

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <aside className="my-6 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-zinc-700 dark:bg-custom-dark">
      {text ? (
        <p className="border-b border-gray-200 px-4 py-3 text-sm leading-7 text-gray-700 dark:border-zinc-700 dark:text-gray-200">
          {text}
        </p>
      ) : null}
      <div className="flex flex-col sm:flex-row">
        <Link
          href={product.href}
          onClick={() => {
            if (!articleId || !product.productId) return;
            trackMagazineArticleEvent({
              articleId,
              eventType: "productClickedFromArticle",
              productId: product.productId,
            });
          }}
          className="relative aspect-square w-full shrink-0 bg-gray-50 sm:w-44 dark:bg-zinc-800"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="176px"
            className="object-contain p-3"
          />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-4">
          <h3 className="text-base font-bold leading-7 text-gray-900 dark:text-white">
            <Link
              href={product.href}
              onClick={() => {
                if (!articleId || !product.productId) return;
                trackMagazineArticleEvent({
                  articleId,
                  eventType: "productClickedFromArticle",
                  productId: product.productId,
                });
              }}
              className="hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {product.title}
            </Link>
          </h3>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
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
          <Link
            href={product.href}
            onClick={() => {
              if (!articleId || !product.productId) return;
              trackMagazineArticleEvent({
                articleId,
                eventType: "productClickedFromArticle",
                productId: product.productId,
              });
            }}
            className="inline-flex w-fit items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            مشاهده محصول
          </Link>
        </div>
      </div>
    </aside>
  );
}
