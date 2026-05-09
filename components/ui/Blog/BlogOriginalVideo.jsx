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
              alt="ویدیو ۱"
              className="w-full group-hover:scale-105 transition duration-500 h-80 object-cover rounded-xl grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-20 text-secondary-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                />
              </svg>
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
              alt="ویدیو ۲"
              className="w-full group-hover:scale-105 transition duration-500 h-80 object-cover rounded-xl grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-20 text-secondary-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                />
              </svg>
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
              alt="ویدیو ۳"
              className="w-full group-hover:scale-105 transition duration-500 h-80 object-cover rounded-xl grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-20 text-secondary-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                />
              </svg>
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
              alt="ویدیو ۴"
              className="w-full group-hover:scale-105 transition duration-500 h-80 object-cover rounded-xl grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-20 text-secondary-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                />
              </svg>
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
              alt="ویدیو ۵"
              className="w-full group-hover:scale-105 transition duration-500 h-80 object-cover rounded-xl grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-20 text-secondary-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                />
              </svg>
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
