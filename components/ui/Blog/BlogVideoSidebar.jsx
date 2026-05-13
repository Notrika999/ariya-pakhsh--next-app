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
                <i className="far fa-circle-play text-3xl text-white"></i>
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
                  <i className="fas fa-arrow-left-long text-primary"></i>
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
                <i className="far fa-circle-play text-3xl text-white"></i>
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
                  <i className="fas fa-arrow-left-long text-primary"></i>
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
               <i className="far fa-circle-play text-3xl text-white"></i>
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
                  <i className="fas fa-arrow-left-long text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </nav>
    </div>
  );
}
