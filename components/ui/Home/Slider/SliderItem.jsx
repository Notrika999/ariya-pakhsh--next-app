import React from "react";

export default function SliderItem({ image, alt }) {
  return (
    <a href="#" aria-label="تصویر 3 از اسلایدر فروشگاه">
      <div className="lg:h-90 h-50 flex justify-center items-center">
        <img
          src={image}
          className="h-full object-cover w-full rounded-lg"
          loading="lazy"
          alt={alt}
        />
      </div>
    </a>
  );
}
