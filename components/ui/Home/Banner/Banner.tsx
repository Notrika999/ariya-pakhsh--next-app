import Image from "next/image";
import Link from "next/link";
import React from "react";

interface BannerProps {
  banners: {
    id: number;
    image: string;
    alt: string;
    slug: string;
  }[];
  title: string;
}
export default function Banner({ banners, title }: BannerProps) {
  return (
    <>
      <h2 className="sr-only">{title}</h2>

      {/* <!-- section one --> */}
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4 items-center justify-center">
        {banners.map((banner) => (
          <Link href={`${banner.slug}`} key={banner.id}>
            <Image
              width={415}
              height={175}
              src={banner.image}
              className="rounded-xl transition hover:-translate-y-2 mx-auto"
              alt={banner.alt}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
