import { RecentViewItem } from "@/src/lib/types/userpanel/activity-history";
import Image from "next/image";
import React from "react";

interface Props {
  product: RecentViewItem;
}

export default function ActivityHistoryCard({ product }: Props) {
  return (
    <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 hover:shadow-md transition duration-200">
      <div className="flex items-start space-x-4">
        <div className="shrink-0 relative">
          <Image
            width={80}
            height={80}
            src={product.imgSrc ?? "/images/default.png"}
            className="size-20 rounded-lg"
            alt={product.title}
          />
          <div
            className={`absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center`}
          >
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
            {product.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {product.productCode}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold text-primary">
              {product.price}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ۲ بار بازدید
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ۱۴:۳۰
            </span>
          </div>
        </div>
      </div>
      <div className="flex space-x-2 mt-4">
        <button className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition duration-200 text-xs font-medium">
          مشاهده محصول
        </button>
        <button className="w-10 h-10 bg-gray-200 dark:bg-zinc-700 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 transition duration-200 flex items-center justify-center">
          <i className="far fa-trash-can text-gray-600 dark:text-gray-400"></i>
        </button>
      </div>
    </div>
  );
}
