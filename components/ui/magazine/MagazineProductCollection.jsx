"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import { formatPrice } from "@/src/utils/formatPrice";
import { trackMagazineArticleEvent } from "@/src/services/magazine/magazine.client";

const SWIPER_THRESHOLD = 2;

function ProductCell({ product, articleId }) {
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  return (
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
      className="flex h-full min-w-0 flex-col items-center px-4 py-5 text-center transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:hover:bg-zinc-800/70"
    >
      <div className="relative aspect-square w-full max-w-36">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="160px"
          className="object-contain"
        />
      </div>
      <h3 className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-gray-900 dark:text-gray-100">
        {product.title}
      </h3>
      <p className="mt-auto pt-3 text-sm font-bold text-gray-900 dark:text-white">
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
    </Link>
  );
}

function CollectionCta({ title, href }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-5 py-6 text-center">
      <p className="text-sm font-medium leading-7 text-gray-900 dark:text-gray-100">
        خرید {title} از کارآپ۲۴
      </p>
      <Link
        href={href}
        className="inline-flex w-full max-w-40 items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        مشاهده همه
      </Link>
    </div>
  );
}

export default function MagazineProductCollection({
  title,
  href,
  products = [],
  articleId = "",
}) {
  if (!products.length) return null;

  const useSwiper = products.length > SWIPER_THRESHOLD;

  return (
    <section
      className="my-6 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-zinc-700 dark:bg-custom-dark"
      aria-label={title}
    >
      <div className="flex flex-col md:flex-row">
        <div className="min-w-0 flex-1">
          {useSwiper ? (
            <Swiper
              modules={[FreeMode]}
              freeMode
              dir="rtl"
              slidesPerView={1.15}
              spaceBetween={0}
              breakpoints={{
                640: { slidesPerView: 1.6 },
                768: { slidesPerView: 2 },
              }}
              className="h-full"
            >
              {products.map((product) => (
                <SwiperSlide
                  key={product.publicCode}
                  className="h-auto border-b border-gray-200 md:border-b-0 md:border-e dark:border-zinc-700"
                >
                  <ProductCell product={product} articleId={articleId} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {products.map((product) => (
                <div
                  key={product.publicCode}
                  className="border-b border-gray-200 sm:border-b-0 sm:border-e last:border-e-0 dark:border-zinc-700"
                >
                  <ProductCell product={product} articleId={articleId} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-gray-200 md:w-44 md:border-t-0 md:border-s dark:border-zinc-700">
          <CollectionCta title={title} href={href} />
        </div>
      </div>
    </section>
  );
}
