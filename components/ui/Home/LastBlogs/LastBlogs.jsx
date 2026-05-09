"use client";
import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
import Image from "next/image";
import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";

export default function LastBlogs({ lastBlogLits }) {
  return (
    <section className="py-5">
      {/* <!-- for seo --> */}
      <h2 className="sr-only">مطالب وبلاگ</h2>

      <div className="container">
        {/* <!-- header --> */}

        <SectionHeader title={"آخرین مقالات وبلاگ"} href={"#"} />

        {/* <!-- blog posts swiper --> */}
        <div className="swiper blog-carousel">
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
            slidesPerView={5}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="my-swiper"
          >
            {lastBlogLits.map((blog) => (
              <SwiperSlide key={blog.id}>
                <Link href={blog.href} className="block group">
                  <div
                    className="bg-white dark:bg-custom-dark border border-gray-200 dark:border-neutral-700
                          space-y-4 p-4 rounded-2xl transition-all duration-300
                          hover:shadow-lg hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-[#13171c]"
                  >
                    {/* <!-- Thumbnail --> */}
                    <figure className="overflow-hidden rounded-xl">
                      <Image
                        className="h-40 w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                        src={blog.image}
                        alt={blog.title}
                        width={240}
                        height={160}
                      />
                    </figure>

                    {/* <!-- Title --> */}
                    <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base h-12 leading-6 line-clamp-2">
                      {blog.title}
                    </h2>

                    {/* <!-- Date and link --> */}
                    <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                      <h4 className="text-sm">{blog.date}</h4>

                      <div className="flex items-center gap-1 transition-colors duration-200 group-hover:text-primary dark:group-hover:text-primary-400">
                        <span className="text-sm">ادامه مطلب</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                          />
                        </svg>
                      </div>
                    </div>
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
