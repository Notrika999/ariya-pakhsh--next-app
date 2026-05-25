import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function BlogOriginalVideo() {
  return (
    <div className="lg:col-span-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="tv-blog-item group relative rounded-xl overflow-hidden">
          <Link href="#">
            <Image
              width={340}
              height={320}
              src="/images/blog/blog-1.jpg"
              // src=?? "/images/default.png"
              alt="ویدیو ۱"
              className="w-full group-hover:scale-105 transition duration-500 h-80 object-cover rounded-xl grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="far fa-circle-play text-6xl text-secondary-600"></i>
            </div>
            <div className="absolute bottom-0 start-0 end-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-xl">
              <h3 className="text-sm font-medium text-white truncate mb-2">
                انتخاب هارد اکسترنال مناسب
              </h3>
              <div className="flex items-center text-white">
                <span className="text-xs">9 مرداد 1402</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="tv-blog-item group relative rounded-xl overflow-hidden md:col-span-2">
          <Link href="#">
            <Image
              width={700}
              height={320}
              src="/images/blog/blog-2.jpg"
              // src=?? "/images/default.png"
              alt="ویدیو ۲"
              className="w-full group-hover:scale-105 transition duration-500 h-80 object-cover rounded-xl grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="far fa-circle-play text-6xl text-secondary-600"></i>
            </div>
            <div className="absolute bottom-0 start-0 end-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-xl">
              <h3 className="text-sm font-medium text-white truncate mb-2">
                بررسی سه پرچمدار شرکت شیائومی
              </h3>
              <div className="flex items-center text-white">
                <span className="text-xs">9 تیر 1402</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="tv-blog-item group relative rounded-xl overflow-hidden md:col-span-1">
          <Link href="#">
            <Image
              width={340}
              height={320}
              src="/images/blog/blog-3.jpg"
              // src=?? "/images/default.png"
              alt="ویدیو ۳"
              className="w-full group-hover:scale-105 transition duration-500 h-80 object-cover rounded-xl grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="far fa-circle-play text-6xl text-secondary-600"></i>
            </div>
            <div className="absolute bottom-0 start-0 end-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-xl">
              <h3 className="text-sm font-medium text-white truncate mb-2">
                بررسی سه پرچمدار شرکت شیائومی
              </h3>
              <div className="flex items-center text-white">
                <span className="text-xs">9 تیر 1402</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="tv-blog-item group relative rounded-xl overflow-hidden md:col-span-1">
          <Link href="#">
            <Image
              width={340}
              height={320}
              src="/images/blog/blog-6.jpg"
              // src=?? "/images/default.png"
              alt="ویدیو ۴"
              className="w-full group-hover:scale-105 transition duration-500 h-80 object-cover rounded-xl grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="far fa-circle-play text-6xl text-secondary-600"></i>
            </div>
            <div className="absolute bottom-0 start-0 end-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-xl">
              <h3 className="text-sm font-medium text-white truncate mb-2">
                بررسی سه پرچمدار شرکت شیائومی
              </h3>
              <div className="flex items-center text-white">
                <span className="text-xs">9 تیر 1402</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="tv-blog-item group relative rounded-xl overflow-hidden md:col-span-1">
          <Link href="#">
            <Image
              width={340}
              height={320}
              src="/images/blog/blog-4.jpg"
              // src=?? "/images/default.png"
              alt="ویدیو ۵"
              className="w-full group-hover:scale-105 transition duration-500 h-80 object-cover rounded-xl grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="far fa-circle-play text-6xl text-secondary-600"></i>
            </div>
            <div className="absolute bottom-0 start-0 end-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-xl">
              <h3 className="text-sm font-medium text-white truncate mb-2">
                بررسی سه پرچمدار شرکت شیائومی
              </h3>
              <div className="flex items-center text-white">
                <span className="text-xs">9 تیر 1402</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
