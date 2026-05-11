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

export default function Gallery({ images }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { h, m, s, done } = useCountdown("2028-01-01T15:30:00.000Z");
  return (
    <section className="xl:col-span-4 mt-7 col-span-12 pb-10 w-full">
      {/* <!-- Discount Timer --> */}
      <div className="bg-secondary-200 dark:bg-custom-dark dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-2xl flex items-center justify-between mb-4 transition-all duration-200">
        <h3 className="font-black text-gray-800 dark:text-gray-100">
          فروش ویژه
        </h3>
        {/* <!-- Timer --> */}
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
      </div>
      {/* <!-- Discount Timer --> */}

      {/* <!-- Large gallery --> */}
      <div className="bg-primary relative mb-12 rounded-[15px] h-[350px] pt-5 px-[15px] pb-[33px] dark:bg-custom-dark dark:border dark:border-gray-700">
        {/* <!-- Action buttons --> */}
        <div className="flex rounded-2xl px-2 bg-gray-100 dark:bg-custom-dark gap-2 absolute top-3 end-1/2 -translate-x-1/2 z-10 mt-4">
          {/* <!-- Share --> */}
          <button
            data-modal-target="shareModal"
            className="modal-trigger flex z-10 group relative items-center justify-center w-full p-2  transition dark:border-gray-700 drop-shadow rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
              />
            </svg>
            {/* <!-- Tooltip --> */}
            <span className="absolute text-nowrap z-50 end-1/2 ms-2 -top-7 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
              <span className="absolute end-1/2 -bottom-[10px] rotate-[90deg] -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
              اشتراک گذاری
            </span>
          </button>

          {/* <!-- Compare --> */}
          <button className="flex z-10 group relative items-center justify-center w-full p-2  transition dark:border-gray-700 drop-shadow rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
              />
            </svg>
            {/* <!-- Tooltip --> */}
            <span className="absolute text-nowrap z-50 end-1/2 ms-2 -top-7 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
              <span className="absolute end-1/2 -bottom-[10px] rotate-[90deg] -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
              مقایسه
            </span>
          </button>

          {/* <!-- Favorite --> */}
          <button className="flex z-10 group relative items-center justify-center w-full p-2  transition dark:border-gray-700 drop-shadow rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            {/* <!-- Tooltip --> */}
            <span className="absolute text-nowrap z-50 end-1/2 ms-2 -top-7 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
              <span className="absolute end-1/2 -bottom-[10px] rotate-[90deg] -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
              افزودن به علاقه مندی ها
            </span>
          </button>

          {/* <!-- Chart --> */}
          <button
            data-modal-target="chartModal"
            className="modal-trigger flex z-10 group relative items-center justify-center w-full p-2  transition dark:border-gray-700 drop-shadow rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
              />
            </svg>
            {/* <!-- Tooltip --> */}
            <span className="absolute text-nowrap z-50 end-1/2 ms-2 -top-7 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
              <span className="absolute end-1/2 -bottom-[10px] rotate-[90deg] -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
              نمودار قیمت
            </span>
          </button>
        </div>
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
                  <img
                    src={img.imgSrc}
                    alt={`product-${index}`}
                    className="max-h-[280px] object-contain"
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
              <img
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
