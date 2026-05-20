"use client";

import React, { useEffect, useMemo, useState } from "react";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Zoom } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import Image from "next/image";
import ShareModal from "./ShareModal";
import ChartModal from "./ChartModal";

// swiper

function pad2(n) {
  return String(n).padStart(2, "0");
}

function useCountdown(targetISO) {
  const targetTime = useMemo(() => {
    // targetISO باید مثل: "2028-01-01T18:30:00.000Z" یا تاریخ قابل parse باشد
    return targetISO ? new Date(targetISO).getTime() : null;
  }, [targetISO]);

  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!targetTime) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [targetTime]);

  if (!targetTime) return { h: 0, m: 0, s: 0, done: true };

  const diff = Math.max(0, targetTime - now);
  const totalSeconds = Math.floor(diff / 1000);

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return { h, m, s, done: diff === 0 };
}

export default function Gallery({ images, isOutOfStock }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { h, m, s, done } = useCountdown("2028-01-01T15:30:00.000Z");
  return (
    <section className="xl:col-span-4 mt-7 col-span-12 pb-10 w-full">
      {/* <!-- Discount Timer --> */}
      {/* <div className="bg-secondary-200 dark:bg-custom-dark dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-2xl flex items-center justify-between mb-4 transition-all duration-200">
        <h3 className="font-black text-gray-800 dark:text-gray-100">
          فروش ویژه
        </h3>
        <!-- Timer -->
        <div
          className="countdown"
          style={{ direction: "ltr" }}
          aria-live="polite"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-200">
            <span>{pad2(h)}</span>
            <span>:</span>
            <span>{pad2(m)}</span>
            <span>:</span>
            <span>{pad2(s)}</span>
            {done && <span className="text-red-500 ms-2 text-xs">پایان</span>}
          </div>
        </div>
        <div
          className="countdown text-gray-700 dark:text-gray-300"
          style={{ direction: "ltr" }}
          data-date="2028-01-01"
          data-time="18:30"
        ></div>
      </div> */}
      {/* <!-- Discount Timer --> */}

      {/* <!-- Out of Stock Badge --> */}
      {isOutOfStock && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 shadow-sm border border-red-200 dark:border-red-800 px-3 py-2 rounded-2xl flex items-center justify-between mb-4 transition-all duration-200">
          <h3 className="font-black">اتمام موجودی</h3>
          <i className="far fa-exclamation-triangle"></i>
        </div>
      )}

      {/* <!-- Large gallery --> */}
      <div className="bg-primary relative mb-12 rounded-[15px] h-87.5 pt-5 px-3.75 pb-8.35 dark:bg-custom-dark dark:border dark:border-gray-700">
        {/* <!-- Action buttons --> */}
        <div className="flex rounded-2xl px-2 bg-gray-100 dark:bg-custom-dark gap-2 absolute top-3 inset-e-1/2 -translate-x-1/2 z-10 mt-4">
          {/* Share */}
          <button
            onClick={() => setShareOpen(true)}
            className="flex z-10 group relative items-center justify-center w-full p-2 transition dark:border-gray-700 drop-shadow rounded"
          >
            <i className="far fa-share-nodes"></i>
          </button>

          {/* Compare */}
          <button className="flex z-10 group relative items-center justify-center w-full p-2 transition dark:border-gray-700 drop-shadow rounded">
            <i className="fas fa-code-compare"></i>
          </button>

          {/* Favorite */}
          <button className="flex z-10 group relative items-center justify-center w-full p-2 transition dark:border-gray-700 drop-shadow rounded">
            <i className="far fa-heart"></i>
          </button>

          {/* Chart */}
          <button
            onClick={() => setChartOpen(true)}
            className="flex z-10 group relative items-center justify-center w-full p-2 transition dark:border-gray-700 drop-shadow rounded"
          >
            <i className="fas fa-chart-line"></i>
          </button>
        </div>

        <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
        <ChartModal open={chartOpen} onClose={() => setChartOpen(false)} />
        {/* <!-- Gallery --> */}
        <Swiper
          modules={[Navigation, Pagination, Thumbs, Zoom]}
          navigation
          pagination={{ clickable: true }}
          zoom
          spaceBetween={10}
          thumbs={{ swiper: thumbsSwiper }}
          className="h-full"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="border h-full border-gray-300 rounded-lg bg-white dark:bg-zinc-800 dark:border-gray-700 flex items-center justify-center">
                <div className="swiper-zoom-container">
                  <Image
                    width={328}
                    height={328}
                    src={img.imgSrc}
                    alt={`product-${index}`}
                    className="max-h-70 object-contain"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* <!-- Thumbnail gallery --> */}
      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[Thumbs]}
        spaceBetween={10}
        slidesPerView={4}
        watchSlidesProgress
        freeMode={true}
        className="mt-3"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="rounded-lg flex justify-center cursor-pointer border border-gray-300 h-20 dark:border-gray-700 p-2 dark:bg-zinc-800">
              <Image
                width={62}
                height={62}
                src={img.imgSrc}
                alt={`thumb-${index}`}
                className="h-full object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
