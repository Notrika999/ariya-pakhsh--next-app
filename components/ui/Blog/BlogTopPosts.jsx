import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function BlogTopPosts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="blog-news-item relative rounded-2xl overflow-hidden md:col-span-4">
        <Link href="#">
          <Image
            width={1048}
            height={300}
            src="/images/blog/banner-1.jpg"
            alt="مقاله ۱"
            className="w-full h-29 object-cover rounded-xl shadow-box"
          />
        </Link>
      </div>

      <div className="blog-news-item relative rounded-2xl overflow-hidden md:col-span-1">
        <Link href="#">
          <Image
            width={250}
            height={300}
            src="/images/blog/blog-3.jpg"
            alt="مقاله ۱"
            className="w-full h-72 object-cover rounded-xl shadow-box"
          />
          <div className="absolute bottom-2 start-2 end-2 bg-white/90 dark:bg-custom-dark backdrop-blur-sm rounded-xl p-3">
            <h3 className="text-sm font-medium truncate">
              انتخاب هارد اکسترنال مناسب
            </h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                9 مرداد 1402
              </span>
              <i className="fas fa-arrow-left-long text-primary"></i>
              
            </div>
          </div>
        </Link>
      </div>

      <div className="blog-news-item relative rounded-2xl overflow-hidden md:col-span-2">
        <Link href="#">
          <Image
            width={510}
            height={300}
            src="/images/blog/blog-2.jpg"
            alt="مقاله ۲"
            className="w-full h-72 object-cover rounded-xl shadow-box"
          />
          <div className="absolute bottom-2 start-2 end-2 bg-white/90 dark:bg-custom-dark backdrop-blur-sm rounded-xl p-3">
            <h3 className="text-sm font-medium truncate">
              بررسی سه پرچمدار شرکت شیائومی
            </h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                9 تیر 1402
              </span>
               <i className="fas fa-arrow-left-long text-primary"></i>
            </div>
          </div>
        </Link>
      </div>

      <div className="blog-news-item relative rounded-2xl overflow-hidden md:col-span-1">
        <Link href="#">
          <Image
            width={250}
            height={300}
            src="/images/blog/blog-1.jpg"
            alt="مقاله ۳"
            className="w-full h-72 object-cover rounded-xl shadow-box"
          />
          <div className="absolute bottom-2 start-2 end-2 bg-white/90 dark:bg-custom-dark backdrop-blur-sm rounded-xl p-3">
            <h3 className="text-sm font-medium truncate">
              بررسی سه پرچمدار شرکت شیائومی
            </h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                9 تیر 1402
              </span>
              <i className="fas fa-arrow-left-long text-primary"></i>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
