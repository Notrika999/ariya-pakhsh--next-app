"use client";
// components/ui/Home/Slider/Slider.jsx
import React from "react";
import SliderItem from "./SliderItem";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Swiper React
import { Swiper, SwiperSlide } from "swiper/react";

// Modules
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Slider({ sliders }) {
  return (
    <>
      <h2 className="sr-only">اسلایدر فروشگاه </h2>

      {/* <!-- Main slider --> */}
      <div className="overflow-hidden">
        <div className=" mx-auto relative!" aria-label="اسلایدر فروشگاه">
          {/* <!-- prev button --> */}
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={0}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: ".custom-swiper-next",
              prevEl: ".custom-swiper-prev",
            }}
            pagination={{
              el: ".swiper-pagination",
              clickable: true,
            }}
          >
            {sliders.map((slid) => (
              <SwiperSlide key={slid.id} className="w-full">
                <SliderItem
                  image={slid.image}
                  alt={slid.alt}
                  href={slid.href ?? slid.slug ?? "#"}
                  mobileImage={slid.mobileImage}
                  title={slid.title}
                  subtitle={slid.subtitle}
                  ctaText={slid.ctaText}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            type="button"
            aria-label="اسلاید قبلی"
            className="custom-swiper-prev absolute start-4 top-1/2 z-30! hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-transparent text-gray-700 transition-colors text-white hover:bg-white/85 dark:hover:text-white lg:flex dark:text-white dark:hover:bg-gray-900/70 hover:text-gray-900/70"
          >
            <ChevronRight size={28} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="اسلاید بعدی"
            className="custom-swiper-next absolute end-4 top-1/2 z-30! hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-transparent text-gray-700 transition-colors text-white hover:bg-white/85 dark:hover:text-white lg:flex dark:text-white dark:hover:bg-gray-900/70 hover:text-gray-900/70"
          >
            <ChevronLeft size={28} strokeWidth={2.5} />
          </button>

          {/* <!-- pagination --> */}
          <div className="swiperPaginationCustome swiper-pagination"></div>
        </div>
      </div>
    </>
  );
}
