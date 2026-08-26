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
    <div className="relative rounded-xl bg-[#f3f5f9] px-3 py-3 dark:bg-[#18202b] md:px-5">
      {sliderState.canScroll && (
        <>
          <button
            type="button"
            aria-label="دسته‌بندی قبلی"
            onClick={handleSlidePrev}
            disabled={sliderState.isBeginning}
            className="absolute right-2 top-1/2 z-20 hidden size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-sm transition hover:bg-white disabled:pointer-events-none disabled:opacity-0 dark:border-gray-700 dark:bg-custom-dark/95 dark:text-gray-200 md:flex"
          >
            <ChevronRight size={19} strokeWidth={2.4} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="دسته‌بندی بعدی"
            onClick={handleSlideNext}
            disabled={sliderState.isEnd}
            className="absolute left-2 top-1/2 z-20 hidden size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-sm transition hover:bg-white disabled:pointer-events-none disabled:opacity-0 dark:border-gray-700 dark:bg-custom-dark/95 dark:text-gray-200 md:flex"
          >
            <ChevronLeft size={19} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </>
      )}

      <div className="relative" dir="rtl">
        {sliderState.canScroll && !sliderState.isBeginning && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-[#f3f5f9] to-transparent dark:from-[#18202b]"
          />
        )}
        {sliderState.canScroll && !sliderState.isEnd && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-[#f3f5f9] to-transparent dark:from-[#18202b]"
          />
        )}

        <Swiper
          dir="rtl"
          modules={[FreeMode]}
          freeMode={true}
          slidesPerView="auto"
          spaceBetween={8}
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
            <SwiperSlide
              key={item.id ?? item.categoryId ?? item.slug}
              className="!w-fit min-w-28"
            >
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
                className="block h-full"
              >
                <div className="flex h-14 flex-row lg:flex-col items-center justify-center rounded-md bg-white px-2 py-1.5 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-custom-dark dark:text-gray-200 lg:h-25 ">
                  <figure className="flex h-12 w-full items-center justify-center lg:h-50">
                    <Image
                      width={70}
                      height={70}
                      src={item.src ?? "/images/default.png"}
                      alt={item.name}
                      className="max-h-full w-auto max-w-18 object-contain dark:invert-0"
                    />
                  </figure>
                  <span
                    title={item.name}
                    className="whitespace-nowrap text-xs font-medium leading-5 text-gray-70  lg:inline-block lg:w-full lg:text-ellipsis lg:text-center"
                  >
                    {item.name}
                  </span>
                  {/* <span
                    title={item.name}
                    className="line-clamp-2 min-h-9 w-full text-center text-[12px] font-semibold leading-[18px] text-gray-800 dark:text-gray-200 md:text-base md:font-semibold md:leading-6"
                  >
                    {item.name}
                  </span> */}
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
