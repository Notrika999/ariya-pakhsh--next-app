"use client";
// components/modules/CategoriesSlider/CategoriesSlider.tsx
import React, { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

// استایل‌های مورد نیاز
import "swiper/css";
import "swiper/css/free-mode";
import Image from "next/image";
import Link from "next/link";
import { truncateTitle } from "@/src/utils/truncateTitle";

export type SliderCategory = {
  id?: string;
  categoryId?: string;
  name: string;
  slug: string;
  src?: string | null;
};

type Props = {
  categories: SliderCategory[];
  onNavigate?: (href: string) => void;
};

type SliderState = {
  canScroll: boolean;
  isBeginning: boolean;
  isEnd: boolean;
};

export default function CategoriesSlider({ categories, onNavigate }: Props) {
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
  }, [categories.length, swiper, syncSliderState]);

  const handleSlidePrev = () => {
    swiper?.slidePrev();
  };

  const handleSlideNext = () => {
    swiper?.slideNext();
  };

  return (
    <div className="space-y-3">
      {sliderState.canScroll && (
        <div className="flex justify-end">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-custom-dark">
            <button
              type="button"
              aria-label="دسته‌بندی قبلی"
              onClick={handleSlidePrev}
              disabled={sliderState.isBeginning}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-gray-200 dark:hover:bg-gray-800 dark:disabled:text-gray-600"
            >
              <ChevronRight size={20} strokeWidth={2.4} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="دسته‌بندی بعدی"
              onClick={handleSlideNext}
              disabled={sliderState.isEnd}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-primary text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
            >
              <ChevronLeft size={20} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        {sliderState.canScroll && !sliderState.isBeginning && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-white to-transparent dark:from-[#121923]"
          />
        )}
        {sliderState.canScroll && !sliderState.isEnd && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-white to-transparent dark:from-[#121923]"
          />
        )}

        <Swiper
          modules={[FreeMode]}
          freeMode={true}
          slidesPerView="auto"
          spaceBetween={16}
          watchOverflow
          onSwiper={(instance) => {
            setSwiper(instance);
            syncSliderState(instance);
          }}
          onAfterInit={syncSliderState}
          onResize={syncSliderState}
          onUpdate={syncSliderState}
          onSlideChange={syncSliderState}
          onReachBeginning={syncSliderState}
          onReachEnd={syncSliderState}
          onFromEdge={syncSliderState}
          onLock={syncSliderState}
          onUnlock={syncSliderState}
          className="mySwiper"
        >
          {categories.map((item) => (
            <SwiperSlide key={item.id ?? item.categoryId ?? item.slug} className="w-50!">
              <Link
                href={`/products/${item.slug}`}
                prefetch={false}
                onClick={(event) => {
                  if (
                    !onNavigate ||
                    event.defaultPrevented ||
                    event.button !== 0 ||
                    event.metaKey ||
                    event.altKey ||
                    event.ctrlKey ||
                    event.shiftKey
                  ) {
                    return;
                  }

                  event.preventDefault();
                  onNavigate(`/products/${item.slug}`);
                }}
              >
                <div className="bg-white dark:bg-custom-dark dark:border-gray-700 dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 p-3 rounded-2xl flex flex-col items-center justify-center duration-200 hover:shadow-md hover:scale-[1.02] transition-all">
                  <figure>
                    <Image
                      width={80}
                      height={80}
                      src={item.src ?? "/images/default.png"}
                      alt={item.name}
                      className="w-20 dark:invert-0"
                    />
                  </figure>
                  <span
                    title={item.name}
                    className="text-sm font-medium text-gray-900 dark:text-gray-200 text-center block"
                  >
                    {truncateTitle(item.name)}
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
