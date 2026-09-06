"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
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
      className="flex h-full min-w-0 flex-col items-center px-2.5 py-2.5 text-center transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:hover:bg-zinc-800/70"
    >
      <div className="relative h-20 w-20 shrink-0">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="80px"
          className="object-contain"
        />
      </div>
      <h3 className="mt-1.5 line-clamp-2 min-h-8 text-xs leading-4 text-gray-900 dark:text-gray-100">
        {product.title}
      </h3>
      <p className="mt-auto pt-1.5 text-xs font-bold text-gray-900 dark:text-white">
        {hasDiscount ? (
          <span className="ml-1 text-[10px] font-normal text-gray-400 line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        ) : null}
        {product.price > 0 ? (
          <>
            {formatPrice(product.price)}
            <span className="mr-0.5 text-[10px] font-medium text-gray-500">
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
    <div className="flex h-full min-h-28 flex-col items-center justify-center gap-2 px-3 py-3 text-center md:min-h-0">
      <p className="text-xs font-medium leading-5 text-gray-900 dark:text-gray-100">
        خرید {title} از کارآپ۲۴
      </p>
      <Link
        href={href}
        className="inline-flex w-full max-w-32 items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        مشاهده همه
      </Link>
    </div>
  );
}

function NavButton({ buttonRef, label, icon }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-30 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-200"
    >
      <i className={`fas ${icon} text-xs`} aria-hidden="true" />
    </button>
  );
}

export default function MagazineProductCollection({
  title,
  href,
  products = [],
  articleId = "",
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (!products.length) return null;

  const useSwiper = products.length > SWIPER_THRESHOLD;

  return (
    <section
      className="my-6 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-zinc-700 dark:bg-custom-dark"
      aria-label={title}
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative min-w-0 flex-1">
          {useSwiper ? (
            <>
              <div
                dir="ltr"
                className="pointer-events-none absolute inset-x-1 top-1/2 z-20 flex -translate-y-1/2 justify-between"
              >
                <span className="pointer-events-auto">
                  <NavButton
                    buttonRef={nextRef}
                    label="محصولات بعدی"
                    icon="fa-chevron-left"
                  />
                </span>
                <span className="pointer-events-auto">
                  <NavButton
                    buttonRef={prevRef}
                    label="محصولات قبلی"
                    icon="fa-chevron-right"
                  />
                </span>
              </div>
              <Swiper
                modules={[FreeMode, Navigation]}
                freeMode
                grabCursor
                dir="rtl"
                slidesPerView={1.35}
                spaceBetween={0}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                breakpoints={{
                  640: { slidesPerView: 1.7 },
                  768: { slidesPerView: 2.35 },
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
              <div className="pointer-events-none absolute inset-y-0 inset-e-0 z-10 w-8 bg-linear-to-r from-white to-transparent dark:from-custom-dark md:w-10" />
            </>
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

        <div className="shrink-0 border-t border-gray-200 md:w-36 md:border-t-0 md:border-s dark:border-zinc-700">
          <CollectionCta title={title} href={href} />
        </div>
      </div>
    </section>
  );
}
