// app/landing/components/HeroBannerGrid.tsx

import Image from "next/image";
import Link from "next/link";

const banners = [
  {
    id: 1,
    title: "Main Banner",
    src: "/images/product/laptop-1.png",
    href: "/products",
    large: true,
  },
  {
    id: 2,
    title: "Banner 2",
    src: "/images/product/laptop-3.png",
    href: "/products",
    large: false,
  },
  {
    id: 3,
    title: "Banner 3",
    src: "/images/product/laptop-5.png",
    href: "/products",
    large: false,
  },
  {
    id: 4,
    title: "Banner 4",
    src: "/images/product/laptop-6.png",
    href: "/products",
    large: false,
  },
];

export default function HeroBannerGrid() {
  return (
    <section className="w-full px-4 pt-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <Link
            href={banners[0].href}
            className="relative overflow-hidden rounded-2xl md:col-span-7 min-h-[220px] sm:min-h-[320px] lg:min-h-[420px]"
          >
            <Image
              src={banners[0].src ?? "/images/default.png"}
              alt={banners[0].title}
              fill
              className="object-cover"
              priority
            />
          </Link>

          <div className="grid grid-cols-1 gap-4 md:col-span-5 sm:grid-cols-2 md:grid-cols-2">
            {banners.slice(1).map((banner) => (
              <Link
                key={banner.id}
                href={banner.href}
                className="relative overflow-hidden rounded-2xl min-h-[180px] sm:min-h-[200px] lg:min-h-[205px]"
              >
                <Image
                  src={banner.src ?? "/images/default.png"}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
