import { RecentViewItem } from "@/types/userpanel/activity-history";
import React from "react";

interface Props {
  product: RecentViewItem;
}

export default function ActivityHistoryCard({ product }: Props) {
  return (
    <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 hover:shadow-md transition duration-200">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 relative">
          <img
            src={product.imgSrc}
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
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
