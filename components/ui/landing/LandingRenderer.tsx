// landing/LandingRenderer.tsx

import Banner from "../Home/Banner/Banner";
import DescriptionSection from "./sections/DescriptionSection";

import HeroBannerGrid from "./sections/HeroBannerGrid";
import ProductSlider from "./sections/ProductSlider";

export default function LandingRenderer({ sections }) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section.type) {
          case "heroBannerGrid":
            return <HeroBannerGrid key={index} {...section} />;

          case "productSlider":
            return <ProductSlider key={index} {...section} />;

          case "banner":
            return <Banner key={index} {...section} />;

          case "description":
            return <DescriptionSection key={index} {...section} />;

          default:
            return null;
        }
      })}
    </>
  );
}
