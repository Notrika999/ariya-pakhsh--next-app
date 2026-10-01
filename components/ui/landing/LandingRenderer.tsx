// landing/LandingRenderer.tsx

import Image from "next/image";
import Link from "next/link";
import DescriptionSection from "./sections/DescriptionSection";
import type { LandingSection } from "@/src/lib/types/landing/landing.types";

import HeroBannerGrid from "./sections/HeroBannerGrid";
import ProductSlider from "./sections/ProductSlider";

<<<<<<< HEAD
function LandingBanner({
  image,
  link = "#",
}: Extract<LandingSection, { type: "banner" }>) {
  return (
    <section className="px-4 py-4">
      <Link
        href={link}
        className="relative mx-auto block aspect-[415/175] max-w-7xl overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-900"
      >
        <Image
          fill
          src={image}
          alt=""
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover"
        />
      </Link>
    </section>
  );
}

export default function LandingRenderer({ sections }: { sections: LandingSection[] }) {
=======
export default function LandingRenderer({ sections }: { sections: any }) {
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  return (
    <>
      {sections.map((section: any, index: number) => {
        switch (section.type) {
          case "heroBannerGrid":
            return <HeroBannerGrid key={index} />;

          case "productSlider":
            return <ProductSlider key={index} />;

          case "banner":
            return <LandingBanner key={index} {...section} />;

          case "description":
            return <DescriptionSection key={index} {...section} />;

          default:
            return null;
        }
      })}
    </>
  );
}
