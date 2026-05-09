"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";

export default function LastProducts({ lastProductLists }) {
  return (
    <section className="py-5">
      <h2 className="sr-only">جدیدترین محصولات</h2>

      <div className="container">
        {/* <!-- header --> */}
        <header className="flex flex-wrap mb-2 justify-between items-center">
          <h2
            className="font-bold text-lg mb-4 relative pb-4 text-gray-900 dark:text-gray-200
                before:absolute before:start-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary
                after:absolute after:w-40 after:h-2 after:bottom-0 after:start-4 after:bg-primary after:rounded-lg"
          >
            جدیدترین محصولات
          </h2>

          <a
            href="#"
            className="text-xs font-medium bg-primary text-white py-1.5 px-4 rounded-lg
                hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow
                dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white"
          >
            مشاهده همه
          </a>
        </header>
        {/* <!-- product items --> */}
        <Swiper
          modules={[Autoplay]}
          loop={true}
          freeMode={false}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          spaceBetween={24}
          slidesPerView={5}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="my-swiper"
        >
          {lastProductLists.map((product, idx) => (
            <SwiperSlide key={product.id}>
              {product.products.map((subProduct) => (
                <Link key={subProduct.id} href="#" className="w-full block">
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
                          {subProduct.id}
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
                          className="size-20"
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
    </section>
  );
}
