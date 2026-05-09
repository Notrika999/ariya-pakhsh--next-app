import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function BlogVideoSidebar() {
  return (
    <div className="bg-white dark:bg-custom-dark dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 dark:border-gray-700 p-4 rounded-2xl flex flex-col">
      <nav className="space-y-4">
        <Link href="#" className="block">
          <div className="flex items-start">
            <div className="relative me-3 flex-shrink-0">
              <Image
                width={96}
                height={80}
                src="/images/blog/blog-1.jpg"
                className="w-24 h-20 object-cover rounded brightness-50"
                alt="ویدیو ۱"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-10 text-white"
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
            </div>
            <div className="flex flex-col justify-between h-20">
              <h5 className="text-sm font-medium line-clamp-2">
                آخرین پرچمداران گوشی شیائومی
              </h5>
              <div className="flex items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0">
                  17 دی ماه 1402
                </p>
                <div className="text-right ms-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link href="#" className="block">
          <div className="flex items-start">
            <div className="relative me-3 flex-shrink-0">
              <Image
                width={96}
                height={80}
                src="/images/blog/blog-2.jpg"
                className="w-24 h-20 object-cover rounded brightness-50"
                alt="ویدیو ۲"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-10 text-white"
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
            </div>
            <div className="flex flex-col justify-between h-20">
              <h5 className="text-sm font-medium line-clamp-2">
                آخرین پرچمداران گوشی شیائومی
              </h5>
              <div className="flex items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0">
                  17 دی ماه 1402
                </p>
                <div className="text-right ms-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link href="#" className="block">
          <div className="flex items-start">
            <div className="relative me-3 flex-shrink-0">
              <Image
                width={96}
                height={80}
                src="/images/blog/blog-3.jpg"
                className="w-24 h-20 object-cover rounded brightness-50"
                alt="ویدیو ۳"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-10 text-white"
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
            </div>
            <div className="flex flex-col justify-between h-20">
              <h5 className="text-sm font-medium line-clamp-2">
                آخرین پرچمداران گوشی شیائومی
              </h5>
              <div className="flex items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0">
                  17 دی ماه 1402
                </p>
                <div className="text-right ms-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link href="#" className="block">
          <div className="flex items-start">
            <div className="relative me-3 flex-shrink-0">
              <Image
                width={96}
                height={80}
                src="/images/blog/blog-4.jpg"
                className="w-24 h-20 object-cover rounded brightness-50"
                alt="ویدیو ۳"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-10 text-white"
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
            </div>
            <div className="flex flex-col justify-between h-20">
              <h5 className="text-sm font-medium line-clamp-2">
                آخرین پرچمداران گوشی شیائومی
              </h5>
              <div className="flex items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0">
                  17 دی ماه 1402
                </p>
                <div className="text-right ms-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link href="#" className="block">
          <div className="flex items-start">
            <div className="relative me-3 flex-shrink-0">
              <Image
                width={96}
                height={80}
                src="/images/blog/blog-5.jpg"
                className="w-24 h-20 object-cover rounded brightness-50"
                alt="ویدیو ۳"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-10 text-white"
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
            </div>
            <div className="flex flex-col justify-between h-20">
              <h5 className="text-sm font-medium line-clamp-2">
                آخرین پرچمداران گوشی شیائومی
              </h5>
              <div className="flex items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0">
                  17 دی ماه 1402
                </p>
                <div className="text-right ms-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link href="#" className="block">
          <div className="flex items-start">
            <div className="relative me-3 flex-shrink-0">
              <Image
                width={96}
                height={80}
                src="/images/blog/blog-6.jpg"
                className="w-24 h-20 object-cover rounded brightness-50"
                alt="ویدیو ۳"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-10 text-white"
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
            </div>
            <div className="flex flex-col justify-between h-20">
              <h5 className="text-sm font-medium line-clamp-2">
                آخرین پرچمداران گوشی شیائومی
              </h5>
              <div className="flex items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0">
                  17 دی ماه 1402
                </p>
                <div className="text-right ms-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link href="#" className="block">
          <div className="flex items-start">
            <div className="relative me-3 flex-shrink-0">
              <Image
                width={96}
                height={80}
                src="/images/blog/blog-4.jpg"
                className="w-24 h-20 object-cover rounded brightness-50"
                alt="ویدیو ۳"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-10 text-white"
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
            </div>
            <div className="flex flex-col justify-between h-20">
              <h5 className="text-sm font-medium line-clamp-2">
                آخرین پرچمداران گوشی شیائومی
              </h5>
              <div className="flex items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0">
                  17 دی ماه 1402
                </p>
                <div className="text-right ms-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </nav>
    </div>
  );
}
