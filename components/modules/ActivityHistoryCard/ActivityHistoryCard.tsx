import { RecentViewItem } from "@/src/lib/types/userpanel/activity-history";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  product: RecentViewItem;
  deleting?: boolean;
  onDelete?: (productId: string) => void;
}

export default function ActivityHistoryCard({
  product,
  deleting = false,
  onDelete,
}: Props) {
  const imageSrc = product.imgSrc || "/images/default.png";

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 transition duration-200 hover:shadow-md dark:border-gray-700 dark:bg-zinc-800">
      <div className="flex items-start space-x-4">
        <div className="relative shrink-0">
          <Image
            width={80}
            height={80}
            src={imageSrc}
            className="size-20 rounded-lg object-cover"
            alt={product.title || "محصول"}
            unoptimized={imageSrc.startsWith("http")}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-medium text-gray-800 dark:text-gray-200">
            {product.title || "محصول بدون عنوان"}
          </h3>
          <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
            {product.productCode ? `کد: ${product.productCode}` : "کد نامشخص"}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {product.formattedPrice}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {product.formattedVisitCount}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {product.formattedLastViewedAt}
            </span>
          </div>
          {product.formattedDuration && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              مدت بازدید: {product.formattedDuration}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 flex space-x-2">
        <Link
          href={product.productHref}
          className="flex-1 rounded-lg bg-primary py-2 text-center text-xs font-medium text-white transition duration-200 hover:bg-primary/90"
        >
          مشاهده محصول
        </Link>
        <button
          type="button"
          disabled={deleting}
          onClick={() => onDelete?.(product.productId)}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 transition duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-700 dark:hover:bg-red-500/10"
          aria-label={`حذف ${product.title || "محصول"} از تاریخچه`}
        >
          <i
            className={[
              "far",
              deleting ? "fa-spinner fa-spin" : "fa-trash-can",
              "text-gray-600 dark:text-gray-400",
            ].join(" ")}
          ></i>
        </button>
      </div>
    </div>
  );
}
