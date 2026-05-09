import Image from "next/image";
import React from "react";
import { FreeMode, Autoplay } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

export default function Categories() {
  return (
    <div className="pb-10">
      <Swiper
        modules={[FreeMode, Autoplay]}
        freeMode={true}
        centeredSlides={false}
        allowTouchMove={true}
        spaceBetween={24}
        slidesPerView={8}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
      >
        <SwiperSlide>
          <a href="">
            <div className="bg-white dark:bg-custom-dark dark:border-gray-700 dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 p-3 rounded-2xl flex flex-col items-center justify-center duration-200 hover:shadow-md hover:scale-[1.02] transition-all">
              {/* <!-- thumbnail --> */}
              <figure>
                <Image
                  width={100}
                  height={100}
                  src="/images/category/laptop.png"
                  alt=""
                  className="w-20 dark:invert-0"
                />
              </figure>

              {/* <!-- title --> */}
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 text-center">
                لپتاپ
              </h3>
            </div>
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="">
            <div className="bg-white dark:bg-custom-dark dark:border-gray-700 dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 p-3 rounded-2xl flex flex-col items-center justify-center duration-200 hover:shadow-md hover:scale-[1.02] transition-all">
              {/* <!-- thumbnail --> */}
              <figure>
                <Image
                  width={100}
                  height={100}
                  src="/images/category/araeshi.png"
                  alt=""
                  className="w-20 dark:invert-0"
                />
              </figure>

              {/* <!-- title --> */}
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 text-center">
                آرایشی
              </h3>
            </div>
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="">
            <div className="bg-white dark:bg-custom-dark dark:border-gray-700 dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 p-3 rounded-2xl flex flex-col items-center justify-center duration-200 hover:shadow-md hover:scale-[1.02] transition-all">
              {/* <!-- thumbnail --> */}
              <figure>
                <Image
                  width={100}
                  height={100}
                  src="/images/category/ashpazkhane.png"
                  alt=""
                  className="w-20 dark:invert-0"
                />
              </figure>

              {/* <!-- title --> */}
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 text-center">
                آشپزخانه
              </h3>
            </div>
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="">
            <div className="bg-white dark:bg-custom-dark dark:border-gray-700 dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 p-3 rounded-2xl flex flex-col items-center justify-center duration-200 hover:shadow-md hover:scale-[1.02] transition-all">
              {/* <!-- thumbnail --> */}
              <figure>
                <Image
                  width={100}
                  height={100}
                  src="/images/category/lavazem-tahrir.png"
                  alt=""
                  className="w-20 dark:invert-0"
                />
              </figure>

              {/* <!-- title --> */}
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 text-center">
                لوازم تحریر
              </h3>
            </div>
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="">
            <div className="bg-white dark:bg-custom-dark dark:border-gray-700 dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 p-3 rounded-2xl flex flex-col items-center justify-center duration-200 hover:shadow-md hover:scale-[1.02] transition-all">
              {/* <!-- thumbnail --> */}
              <figure>
                <Image
                  width={100}
                  height={100}
                  src="/images/category/mobile.png"
                  alt=""
                  className="w-20 dark:invert-0"
                />
              </figure>

              {/* <!-- title --> */}
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 text-center">
                موبایل
              </h3>
            </div>
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="">
            <div className="bg-white dark:bg-custom-dark dark:border-gray-700 dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 p-3 rounded-2xl flex flex-col items-center justify-center duration-200 hover:shadow-md hover:scale-[1.02] transition-all">
              {/* <!-- thumbnail --> */}
              <figure>
                <Image
                  width={100}
                  height={100}
                  src="/images/category/poshak.png"
                  alt=""
                  className="w-20 dark:invert-0"
                />
              </figure>

              {/* <!-- title --> */}
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 text-center">
                پوشاک
              </h3>
            </div>
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="">
            <div className="bg-white dark:bg-custom-dark dark:border-gray-700 dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 p-3 rounded-2xl flex flex-col items-center justify-center duration-200 hover:shadow-md hover:scale-[1.02] transition-all">
              {/* <!-- thumbnail --> */}
              <figure>
                <Image
                  width={100}
                  height={100}
                  src="/images/category/laptop.png"
                  alt=""
                  className="w-20 dark:invert-0"
                />
              </figure>

              {/* <!-- title --> */}
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 text-center">
                لپتاپ
              </h3>
            </div>
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="">
            <div className="bg-white dark:bg-custom-dark dark:border-gray-700 dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 p-3 rounded-2xl flex flex-col items-center justify-center duration-200 hover:shadow-md hover:scale-[1.02] transition-all">
              {/* <!-- thumbnail --> */}
              <figure>
                <Image
                  width={100}
                  height={100}
                  src="/images/category/araeshi.png"
                  alt=""
                  className="w-20 dark:invert-0"
                />
              </figure>

              {/* <!-- title --> */}
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 text-center">
                آرایشی
              </h3>
            </div>
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="">
            <div className="bg-white dark:bg-custom-dark dark:border-gray-700 dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 p-3 rounded-2xl flex flex-col items-center justify-center duration-200 hover:shadow-md hover:scale-[1.02] transition-all">
              {/* <!-- thumbnail --> */}
              <figure>
                <Image
                  width={100}
                  height={100}
                  src="/images/category/ashpazkhane.png"
                  alt=""
                  className="w-20 dark:invert-0"
                />
              </figure>

              {/* <!-- title --> */}
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 text-center">
                آشپزخانه
              </h3>
            </div>
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="">
            <div className="bg-white dark:bg-custom-dark dark:border-gray-700 dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 p-3 rounded-2xl flex flex-col items-center justify-center duration-200 hover:shadow-md hover:scale-[1.02] transition-all">
              {/* <!-- thumbnail --> */}
              <figure>
                <Image
                  width={100}
                  height={100}
                  src="/images/category/lavazem-tahrir.png"
                  alt=""
                  className="w-20 dark:invert-0"
                />
              </figure>

              {/* <!-- title --> */}
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 text-center">
                لوازم تحریر
              </h3>
            </div>
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="">
            <div className="bg-white dark:bg-custom-dark dark:border-gray-700 dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 p-3 rounded-2xl flex flex-col items-center justify-center duration-200 hover:shadow-md hover:scale-[1.02] transition-all">
              {/* <!-- thumbnail --> */}
              <figure>
                <Image
                  width={100}
                  height={100}
                  src="/images/category/mobile.png"
                  alt=""
                  className="w-20 dark:invert-0"
                />
              </figure>

              {/* <!-- title --> */}
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 text-center">
                موبایل
              </h3>
            </div>
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="">
            <div className="bg-white dark:bg-custom-dark dark:border-gray-700 dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 p-3 rounded-2xl flex flex-col items-center justify-center duration-200 hover:shadow-md hover:scale-[1.02] transition-all">
              {/* <!-- thumbnail --> */}
              <figure>
                <Image
                  width={100}
                  height={100}
                  src="/images/category/poshak.png"
                  alt=""
                  className="w-20 dark:invert-0"
                />
              </figure>

              {/* <!-- title --> */}
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 text-center">
                پوشاک
              </h3>
            </div>
          </a>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
