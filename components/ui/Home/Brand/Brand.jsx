"use client";
// components/ui/Home/Brand/Brand.jsx

import React, { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";

import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";
import { getProductImage } from "@/src/utils/product-image";

function getActiveSlidesPerView(instance) {
  const value = instance.params.slidesPerView;

  return typeof value === "number" ? value : 1;
}

function getBrandImage(brand) {
  if (typeof brand.image === "string") {
    return getProductImage(brand.image);
  }

  return getProductImage(
    brand.image?.logoMdUrl ??
      brand.image?.logoLgUrl ??
      brand.image?.logoSmUrl ??
      brand.logoUrl ??
      brand.imageUrl,
  );
}

function getBrandHref(brand) {
  const slug = String(brand.slug ?? "").trim();
  return slug ? `/products/${encodeURIComponent(slug)}` : "/products";
}

export default function Brand({ brands, title }) {

  const [swiper, setSwiper] = useState(null);
  const [sliderState, setSliderState] = useState({
    canScroll: false,
    isBeginning: true,
    isEnd: true,
  });
  const isLoopEnabled = true;

  const syncSliderState = useCallback(
    (instance) => {
      const visibleSlides = getActiveSlidesPerView(instance);

      setSliderState({
        canScroll: brands.length > visibleSlides && !instance.isLocked,
        isBeginning: instance.isBeginning,
        isEnd: instance.isEnd,
      });
    },
    [brands.length],
  );

  useEffect(() => {
    if (!swiper || swiper.destroyed) return;

    swiper.update();
    const frameId = window.requestAnimationFrame(() => {
      if (!swiper.destroyed) {
        syncSliderState(swiper);
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [brands.length, swiper, syncSliderState]);

  const handleSlidePrev = () => {
    swiper?.slidePrev();
  };

  const handleSlideNext = () => {
    swiper?.slideNext();
  };

  return (
    <>
      {/* <!-- header --> */}
      <SectionHeader title={title} />

      {/* <!-- categories swiper --> */}
      <div className="mt-3 space-y-3 pb-4">
        {sliderState.canScroll && (
          <div className="flex justify-end">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-custom-dark">
              <button
                type="button"
                aria-label="برند قبلی"
                onClick={handleSlidePrev}
                disabled={!isLoopEnabled && sliderState.isBeginning}
                className="flex md:h-9 md:w-9 h-5 w-6 cursor-pointer items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-gray-200 dark:hover:bg-gray-800 dark:disabled:text-gray-600"
              >
                <ChevronRight size={20} strokeWidth={2.4} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="برند بعدی"
                onClick={handleSlideNext}
                disabled={!isLoopEnabled && sliderState.isEnd}
                className="flex md:h-9 md:w-9 h-5 w-6 cursor-pointer items-center justify-center rounded-lg bg-primary text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
              >
                <ChevronLeft size={20} strokeWidth={2.4} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <div className="relative">
          {sliderState.canScroll &&
            (isLoopEnabled || !sliderState.isBeginning) && (
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
            modules={[Autoplay]}
            loop={isLoopEnabled}
            freeMode={false}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={10}
            slidesPerView={8}
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
              320: { slidesPerView: 2 },
              640: { slidesPerView: 4 },
              1024: { slidesPerView: 8 },
            }}
            className="my-swiper"
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand.id}>
                <Link href={getBrandHref(brand)}>
                  <div
                    className="bg-white dark:bg-custom-dark border border-gray-200 dark:border-neutral-700
                                    space-y-4 p-4 rounded-2xl flex flex-col items-center justify-center
                                    transition-all duration-200 hover:shadow-md hover:scale-[1.02]
                                    dark:hover:bg-[#13171c]"
                  >
                    {/* <!-- thumbnail --> */}
                    <figure>
                      <Image
                        src={getBrandImage(brand)}
                        alt={brand.name}
                        width={100}
                        height={100}
                        className="w-28"
                      />
                    </figure>
                    {/* <!-- title --> */}
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 text-center">
                      {brand.name}
                    </h3>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
