// components/ui/Home/Slider/SliderItem.jsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function SliderItem({
  image,
  alt,
  href,
  mobileImage,
  title,
  subtitle,
  ctaText,
  onClick,
  priority = false,
}) {
  const desktopSrc = image ?? "/images/default.png";
  const mobileSrc = mobileImage ?? desktopSrc;
  const hasContent = Boolean(title || subtitle || ctaText);
  const imageQuality = 100;

  return (
    <Link
      href={href}
      aria-label={alt}
      className="group block"
      onClick={onClick}
    >
      <div className="relative aspect-[2/1] w-full overflow-hidden lg:h-[350px] h-[125px] lg:aspect-auto">
        <Image
          fill
          src={desktopSrc}
          className="hidden object-fill w-fit h-fit object-center lg:block"
          loading={priority ? undefined : "lazy"}
          priority={priority}
          quality={imageQuality}
       
          alt={alt}
        />
        <Image
          fill
          src={mobileSrc}
          className="object-fill w-fit h-fit object-center lg:hidden"
          loading={priority ? undefined : "lazy"}
          priority={priority}
          quality={imageQuality}
          sizes="100vw"
          alt={alt}
        />
        {/* {hasContent ? (
          <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/60 via-black/10 to-transparent">
            <div className="w-full px-5 pb-6 text-white sm:px-12 sm:pb-14">
              {title ? (
                <h2 className="max-w-2xl text-lg font-black leading-8 sm:text-4xl sm:leading-12">
                  {title}
                </h2>
              ) : null}
              {subtitle ? (
                <p className="mt-2 max-w-xl text-xs font-semibold leading-6 text-white/90 sm:text-lg sm:leading-8">
                  {subtitle}
                </p>
              ) : null}
              {ctaText ? (
                <span className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-xs font-bold text-white transition-colors group-hover:bg-primary/90 sm:px-5 sm:text-sm">
                  {ctaText}
                </span>
              ) : null}
            </div>
          </div>
        ) : null} */}
      </div>
    </Link>
  );
}
