"use client";
// components/ui/Home/BestSellingProducts/BestSellingProducts.jsx
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";

function getActiveSlidesPerView(instance) {
  const value = instance.params.slidesPerView;

  return typeof value === "number" ? value : 1;
}

export default function BestSellingProducts({
  bestSellingProducts,
  title,
  href,
}) {
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
        canScroll: bestSellingProducts.length > visibleSlides && !instance.isLocked,
        isBeginning: instance.isBeginning,
        isEnd: instance.isEnd,
      });
    },
    [bestSellingProducts.length],
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
  }, [bestSellingProducts.length, swiper, syncSliderState]);

  const handleSlidePrev = () => {
    swiper?.slidePrev();
  };

  const handleSlideNext = () => {
    swiper?.slideNext();
  };

  let globalIndex = 1;
  return (
    <>
      <h2 className="sr-only">پرفروش ترین محصولات</h2>

      {/* <!-- header --> */}
      <SectionHeader title={title} href={href} />

      {/* <!-- product items --> */}
      <div className="mt-3 space-y-3">
        {sliderState.canScroll && (
          <div className="flex justify-end">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-custom-dark">
              <button
                type="button"
                aria-label="محصول پرفروش قبلی"
                onClick={handleSlidePrev}
                disabled={!isLoopEnabled && sliderState.isBeginning}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-gray-200 dark:hover:bg-gray-800 dark:disabled:text-gray-600"
              >
                <ChevronRight size={20} strokeWidth={2.4} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="محصول پرفروش بعدی"
                onClick={handleSlideNext}
                disabled={!isLoopEnabled && sliderState.isEnd}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-primary text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
              >
                <ChevronLeft size={20} strokeWidth={2.4} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

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
            modules={[Autoplay]}
            loop={isLoopEnabled}
            freeMode={false}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={24}
            slidesPerView={5}
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
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="my-swiper"
            // dir="rtl"
          >
            {bestSellingProducts.map((product) => (
              <SwiperSlide key={product.id}>
                {product.products.map((subProduct) => (
                  <Link
                    key={subProduct.id}
                    href={subProduct.href}
                    className="w-full block"
                  >
                    <article
                      className="flex py-2 px-3 my-3 rounded-xl
                                bg-white dark:bg-custom-dark
                                border border-gray-200 dark:border-gray-700
                                hover:bg-gray-100 dark:hover:bg-[#13171c]
                                transition-colors duration-200 shadow-sm
                                items-center justify-between"
                    >
                      <section className="w-1/6 border-e-2 border-gray-300 dark:border-neutral-600">
                        <div className="text-center">
                          <span className="font-bold text-3xl text-primary">
                            {globalIndex++}
                          </span>
                        </div>
                      </section>

                      <section className="w-3/6 space-y-2 ps-3">
                        <h3
                          itemProp="name"
                          className="font-bold leading-loose line-clamp-2 h-13 text-xs text-gray-900 dark:text-gray-200"
                        >
                          {subProduct.title}
                        </h3>
                      </section>

                      <figure className="w-2/6">
                        <div className="text-end flex justify-end">
                          <Image
                            src={subProduct.image}
                            className="object-fill"
                            loading="lazy"
                            alt={subProduct.title}
                            width={100}
                            height={100}
                          />
                        </div>
                      </figure>
                    </article>
                  </Link>
                ))}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
