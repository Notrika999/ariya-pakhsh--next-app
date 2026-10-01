"use client";
// components/ui/ProductPageClient/RelatedArticles/RelatedArticles.tsx
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";

import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";
import type { ProductRelatedArticle } from "@/src/lib/types/products/productDetail.types";
import { getProductImage } from "@/src/utils/product-image";

interface RelatedArticlesProps {
  articles?: ProductRelatedArticle[] | null;
  title?: string;
}

type SliderState = {
  canScroll: boolean;
  isBeginning: boolean;
  isEnd: boolean;
};

function getArticleHref(article: ProductRelatedArticle) {
  return `/mag/${encodeURIComponent(article.slug)}`;
}

function RelatedArticleCard({ article }: { article: ProductRelatedArticle }) {
  const image = getProductImage(
    article.featuredImageThumbnailUrl ?? article.featuredImageUrl,
  );

  return (
    <article className="h-full min-w-0">
      <Link
        href={getArticleHref(article)}
        className="group flex h-full min-h-24 items-center gap-3 overflow-hidden rounded-lg border border-gray-200 bg-white p-2 transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-gray-700 dark:bg-custom-dark"
      >
        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md bg-gray-100 sm:w-28 dark:bg-zinc-800">
          <Image
            src={image}
            alt={article.featuredImageAlt || article.title}
            fill
            sizes="(max-width: 639px) 96px, 112px"
            className="object-contain p-1 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-xs font-bold leading-6 text-gray-900 sm:text-[13px] dark:text-gray-100">
            {article.title}
          </h3>
        </div>
      </Link>
    </article>
  );
}

export default function RelatedArticles({
  articles = [],
  title = "مقالات مرتبط با محصول",
}: RelatedArticlesProps) {
  const items = (articles ?? []).filter(
    (item) => Boolean(item?.articleId) && Boolean(item?.slug) && Boolean(item?.title),
  );
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [sliderState, setSliderState] = useState<SliderState>({
    canScroll: false,
    isBeginning: true,
    isEnd: true,
  });

  const syncSliderState = useCallback((instance: SwiperInstance) => {
    setSliderState({
      canScroll: !instance.isLocked,
      isBeginning: instance.isBeginning,
      isEnd: instance.isEnd,
    });
  }, []);

  useEffect(() => {
    if (!swiper || swiper.destroyed) return;

    swiper.update();
    const frameId = window.requestAnimationFrame(() => {
      if (!swiper.destroyed) {
        syncSliderState(swiper);
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [items.length, swiper, syncSliderState]);

  const handleSlidePrev = () => {
    swiper?.slidePrev();
  };

  const handleSlideNext = () => {
    swiper?.slideNext();
  };

  if (items.length === 0) return null;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md md:p-8 dark:border-gray-700 dark:bg-custom-dark">
      <h2 className="sr-only">{title}</h2>
      <SectionHeader title={title} href={false} />

      <div className="mt-3 space-y-3">
        {sliderState.canScroll && (
          <div className="flex justify-end">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-custom-dark">
              <button
                type="button"
                aria-label="مقاله قبلی"
                onClick={handleSlidePrev}
                disabled={sliderState.isBeginning}
                className="flex h-5 w-6 cursor-pointer items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 md:h-9 md:w-9 dark:text-gray-200 dark:hover:bg-gray-800 dark:disabled:text-gray-600"
              >
                <ChevronRight size={20} strokeWidth={2.4} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="مقاله بعدی"
                onClick={handleSlideNext}
                disabled={sliderState.isEnd}
                className="flex h-5 w-6 cursor-pointer items-center justify-center rounded-lg bg-primary text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none md:h-9 md:w-9 dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
              >
                <ChevronLeft size={20} strokeWidth={2.4} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-linear-to-b from-white to-transparent p-1 transition-colors dark:from-[#121923]">
          <div className="relative">
            {sliderState.canScroll && !sliderState.isBeginning ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-white to-transparent dark:from-[#121923]"
              />
            ) : null}
            {sliderState.canScroll && !sliderState.isEnd ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-white to-transparent dark:from-[#121923]"
              />
            ) : null}

            <Swiper
              spaceBetween={12}
              slidesPerView={1}
              watchOverflow
              onSwiper={(instance) => {
                setSwiper(instance);
                syncSliderState(instance);
              }}
              onAfterInit={syncSliderState}
              onBreakpoint={syncSliderState}
              onResize={syncSliderState}
              onUpdate={syncSliderState}
              onSlideChange={syncSliderState}
              onReachBeginning={syncSliderState}
              onReachEnd={syncSliderState}
              onFromEdge={syncSliderState}
              onLock={syncSliderState}
              onUnlock={syncSliderState}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {items.map((article) => (
                <SwiperSlide key={article.articleId}>
                  <RelatedArticleCard article={article} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
