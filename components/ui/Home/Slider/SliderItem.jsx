import Image from "next/image";
import React from "react";

export default function SliderItem({ image, alt }) {
  return (
    <a href="#" aria-label="تصویر 3 از اسلایدر فروشگاه">
      <div className="lg:h-90 h-50 flex justify-center items-center">
        <Image
        width={1280}
        height={360}
          src={image}
          className="h-full object-cover w-full rounded-lg"
          loading="lazy"
          alt={alt}
        />
      </div>
    </a>
  );
}
