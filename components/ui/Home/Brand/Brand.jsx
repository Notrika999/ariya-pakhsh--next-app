"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import Image from "next/image";
import Link from "next/link";
import { getBrands } from "@/src/services/brand/brand.service";
import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";

export default function Brand({ brands }) {
  console.log(brands)
  return (
    <section className="py-5">
      {/* <!-- for seo --> */}
      <h2 className="sr-only">برند های فروشگاه</h2>

      <div className="container">
        {/* <!-- header --> */}
        <SectionHeader title={"برندهای های فروشگاه"} href={"#"} />

        {/* <!-- categories swiper --> */}
        <div className="pb-4">
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

            {brands.length && (
              brands.map((brand) => (
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
                        src={brand.image?.logoMdUrl || "/images/placeholder.png"}
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
            ))
            )}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
