"use client";

import Image from "next/image";
import Link from "next/link";
import { trackHomeLayoutItemView } from "@/src/services/home/home-layout.client";

interface BannerProps {
  banners: {
    id: string | number;
    image: string;
    alt: string;
    href: string;
    title?: string | null;
    subtitle?: string | null;
    ctaText?: string | null;
  }[];
  title: string;
}

function chunkRows<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }

  return rows;
}

function getRowGridClass(count: number) {
  switch (count) {
    case 1:
      return "md:grid-cols-1";
    case 2:
      return "md:grid-cols-2";
    case 3:
      return "md:grid-cols-3";
    default:
      return "md:grid-cols-4";
  }
}

export default function Banner({ banners, title }: BannerProps) {
  const rows = chunkRows(banners, 4);

  return (
    <>
      <h2 className="sr-only">{title}</h2>

      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div
            key={`banner-row-${rowIndex}`}
            className={`grid grid-cols-1 gap-4 ${getRowGridClass(row.length)}`}
          >
            {row.map((banner) => (
              <Link
                href={banner.href}
                key={banner.id}
                aria-label={banner.alt}
                className="group relative block aspect-[415/175] overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-900"
                onClick={() => trackHomeLayoutItemView(String(banner.id))}
              >
                <Image
                  fill
                  src={banner.image}
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  alt={banner.alt}
                  sizes={
                    row.length >= 4
                      ? "(min-width: 768px) 25vw, 100vw"
                      : row.length === 3
                        ? "(min-width: 768px) 33vw, 100vw"
                        : row.length === 2
                          ? "(min-width: 768px) 50vw, 100vw"
                          : "100vw"
                  }
                />
              </Link>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
