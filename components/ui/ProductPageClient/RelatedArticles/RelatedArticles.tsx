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

function formatReadingTime(minutes?: number | null) {
  if (!minutes || minutes <= 0) return null;

  return `${new Intl.NumberFormat("fa-IR").format(minutes)} دقیقه مطالعه`;
}

function formatPublishedDate(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getArticleHref(article: ProductRelatedArticle) {
  return `/mag/${encodeURIComponent(article.slug)}`;
}

function RelatedArticleCard({ article }: { article: ProductRelatedArticle }) {
  const image = getProductImage(
    article.featuredImageThumbnailUrl ?? article.featuredImageUrl,
  );
  const metaParts = [
    formatReadingTime(article.readingTimeMinutes),
    formatPublishedDate(article.publishedAt),
  ].filter(Boolean);

  return (
    <article className="h-full min-w-0">
      <Link
        href={getArticleHref(article)}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-gray-700 dark:bg-custom-dark"
      >
        <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-zinc-800">
          <Image
            src={image}
            alt={article.featuredImageAlt || article.title}
            fill
            sizes="(max-width: 767px) 90vw, (max-width: 1023px) 45vw, 320px"
            className="object-contain p-1 transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {article.categoryTitle ? (
            <span className="absolute right-2.5 top-2.5 rounded-sm bg-primary px-2 py-0.5 text-[11px] font-medium text-white">
              {article.categoryTitle}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-3.5">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-7 text-gray-900 dark:text-gray-100">
            {article.title}
          </h3>

          {article.excerpt ? (
            <p className="mt-2 line-clamp-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
              {article.excerpt}
            </p>
          ) : null}

          {metaParts.length ? (
            <p className="mt-auto flex flex-wrap items-center gap-x-2 pt-3 text-xs text-gray-500 dark:text-gray-400">
              {metaParts.map((part, index) => (
                <span
                  key={`${part}-${index}`}
                  className="inline-flex items-center gap-2"
                >
                  {index > 0 ? (
                    <span aria-hidden="true" className="opacity-50">
                      ·
                    </span>
                  ) : null}
                  {part}
                </span>
              ))}
            </p>
          ) : null}
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
