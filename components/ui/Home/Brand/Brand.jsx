"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import Image from "next/image";
import Link from "next/link";

export default function Brand({ brands }) {
  return (
    <section className="py-5">
      {/* <!-- for seo --> */}
      <h2 className="sr-only">برند های فروشگاه</h2>

      <div className="container">
        {/* <!-- header --> */}
        <header className="flex flex-wrap mb-2 justify-between items-center">
          {/* <!-- title --> */}
          <h2
            className="font-bold text-lg mb-4 relative pb-4 text-gray-900 dark:text-gray-200
                before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary
                after:absolute after:w-40 after:h-2 after:bottom-0 after:inset-s-4 after:bg-primary after:rounded-lg"
          >
            برندهای های فروشگاه
          </h2>
          {/* <!-- link --> */}
          <a
            href="#"
            className="text-xs font-medium bg-primary text-white py-1.5 px-4 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white"
          >
            مشاهده همه
          </a>
        </header>
        {/* <!-- categories swiper --> */}
        <div className="py-4">
          <Swiper
            modules={[Autoplay]}
            loop={true}
            freeMode={false}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={10}
            slidesPerView={8}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 4 },
              1024: { slidesPerView: 8 },
            }}
            className="my-swiper"
          >
            {/* {brands.map((brand) => ( */}

            {brands.map((brand) => (
              <SwiperSlide key={brand.id}>
                <Link href="#">
                  <div
                    className="bg-white dark:bg-custom-dark border border-gray-200 dark:border-neutral-700
                                    space-y-4 p-4 rounded-2xl flex flex-col items-center justify-center
                                    transition-all duration-200 hover:shadow-md hover:scale-[1.02]
                                    dark:hover:bg-[#13171c]"
                  >
                    {/* <!-- thumbnail --> */}
                    <figure>
                      <Image
                        src={brand.img}
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
    </section>
  );
}
