import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SliderItem({ image, alt, href }) {
  return (
    <Link href={href} aria-label="تصویر 3 از اسلایدر فروشگاه">
      <div className="lg:h-90 h-50 flex justify-center items-center">
        <Image
          width={1280}
          height={360}
          src={image ?? "/images/default.png"}
          className="h-full object-cover w-full rounded-lg"
          loading="lazy"
          alt={alt}
        />
      </div>
    </Link>
  );
}
