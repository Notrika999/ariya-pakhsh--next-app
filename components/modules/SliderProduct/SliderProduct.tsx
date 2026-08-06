"use client";
// components/modules/SliderProduct/SliderProduct.tsx
import React, { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";
import ProductCard from "../ProductCard/ProductCard";
import { normalizeProduct } from "@/src/lib/mappers/product.mapper";
import { ProductCardModel } from "@/src/lib/types/productTypes";

type NormalizableProduct = Parameters<typeof normalizeProduct>[0];

interface SliderProductProps {
  loop?: boolean;
  products: Array<NormalizableProduct | ProductCardModel>;
  title: string;
  href?: string | false;
}

type SliderState = {
  canScroll: boolean;
  isBeginning: boolean;
  isEnd: boolean;
};

function toCardProduct(
  product: NormalizableProduct | ProductCardModel,
): ProductCardModel {
  if ("categoryName" in product && "currency" in product) {
    return product as ProductCardModel;
  }

  return normalizeProduct(product);
}

export default function SliderProduct({
  loop,
  products,
  title,
  href,
}: SliderProductProps) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [sliderState, setSliderState] = useState<SliderState>({
    canScroll: false,
    isBeginning: true,
    isEnd: true,
  });

  const isLoopEnabled = !!loop;

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
  }, [products.length, swiper, syncSliderState]);

  const handleSlidePrev = () => {
    swiper?.slidePrev();
  };

  const handleSlideNext = () => {
    swiper?.slideNext();
  };

  return (
    <>
      <SectionHeader title={title} href={href} />

      <div className="mt-1 space-y-1">
        {sliderState.canScroll && (
          <div className="flex justify-end">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-custom-dark">
              <button
                type="button"
                aria-label="محصول قبلی"
                onClick={handleSlidePrev}
                disabled={!isLoopEnabled && sliderState.isBeginning}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-gray-200 dark:hover:bg-gray-800 dark:disabled:text-gray-600"
              >
                <ChevronRight size={20} strokeWidth={2.4} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="محصول بعدی"
                onClick={handleSlideNext}
                disabled={!isLoopEnabled && sliderState.isEnd}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-primary text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
              >
                <ChevronLeft size={20} strokeWidth={2.4} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <div className="bg-linear-to-b from-white dark:from-[#121923] to-transparent rounded-2xl px-3 py-6">
          <div className="relative">
            {sliderState.canScroll && (isLoopEnabled || !sliderState.isBeginning) && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-white to-transparent dark:from-[#121923]"
              />
            )}
            {sliderState.canScroll && (isLoopEnabled || !sliderState.isEnd) && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-white to-transparent dark:from-[#121923]"
              />
            )}

            <Swiper
              modules={isLoopEnabled ? [Autoplay] : []}
              loop={isLoopEnabled}
              autoplay={
                isLoopEnabled
                  ? {
                      delay: 2500,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }
                  : false
              }
              spaceBetween={2}
              slidesPerView={1}
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
              breakpoints={{
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
              }}
            >
              {products.map((product) => {
                const cardProduct = toCardProduct(product);

                return (
                  <SwiperSlide key={cardProduct.id}>
                    <ProductCard product={cardProduct} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
}
