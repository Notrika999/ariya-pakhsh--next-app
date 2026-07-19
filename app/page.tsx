// app/page.tsx
import { getProducts } from "@/src/services/product/product.server";
import { getAmazingProducts } from "@/src/services/promotion/promotion.server";

import Story from "@/components/ui/Home/Story/Story";
import Slider from "@/components/ui/Home/Slider/Slider";
import AmazingProducts from "@/components/ui/Home/AmazingProducts/AmazingProducts";
import BestSellingProducts from "@/components/ui/Home/BestSellingProducts/BestSellingProducts";
import Category from "@/components/ui/Home/Category/Category";
import Banner from "@/components/ui/Home/Banner/Banner";
import UserLatestViews from "@/components/ui/Home/CategoryProductBox/CategoryProductBox";
import Brand from "@/components/ui/Home/Brand/Brand";

import { getBrands } from "@/src/services/brand/brand.server";
import { getPromotedCategories } from "@/src/services/category/category.server";
import SliderProduct from "@/components/modules/SliderProduct/SliderProduct";

import { Metadata } from "next";
import { absoluteUrl } from "@/src/lib/seo/site";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import HeroSection from "@/components/ui/IncredibleOffers/HeroSection/HeroSection";
import { mapToBestSellingProducts } from "@/src/lib/mappers/best-selling-products.mapper";

export const dynamic = "force-dynamic";

// ساختار متاتگ‌ها به صورت استاندارد و حرفه‌ای
export const metadata: Metadata = {
  title:
    "فروشگاه اینترنتی کارآپ 24 | خرید آنلاین کفپوش، روکش و لوازم لوکس خودرو",
  description:
    "مرجع تخصصی خرید آنلاین انواع کالاهای ظاهری خودرو با بهترین قیمت و ضمانت اصالت کالا.",
  keywords: [
    "خرید آنلاین",
    "فروشگاه اینترنتی",
    "قیمت کفپوش ماشین",
    "خرید روکش صندلی",
    "لوازم تزینی",
    "کارآپ 24",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "فروشگاه اینترنتی کارآپ 24",
    description:
      "بهترین پیشنهادهای روزانه و محصولات شگفت‌انگیز را در فروشگاه ما دنبال کنید.",
    type: "website",
    locale: "fa_IR",
    url: absoluteUrl(),
    siteName: "کارآپ 24",
    images: [
      {
        url: "/images/og-image.jpg", // یک تصویر شاخص برای اشتراک‌گذاری در شبکه‌ها قرار دهید
        width: 1200,
        height: 630,
        alt: "لوگوی فروشگاه",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "فروشگاه اینترنتی کارآپ 24",
    description: "خرید آسان و مطمئن کالای لوکس خودرو",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: absoluteUrl(),
  },
};

export default async function Home() {
  const brands = await getBrands({
    // letter: "ه", // Search Letter
    pageNumber: 1,
    pageSize: 40,
    grouped: false,
  });

  // --- Recommended Categories ---
  const recommendedCategories = await getPromotedCategories({
    filter: "recommended",
    maxCount: 12,
  });
  const recommendedCategoriesMap = recommendedCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    img: cat.image?.iconUrl ?? "/images/default.png",
  }));

  // --- Featured Categories and map ---
  const featuredCategories = await getPromotedCategories({
    filter: "featured",
    maxCount: 12,
  });
  const featuredCategoriesMap = featuredCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    img: cat.image?.iconUrl ?? "/images/default.png",
  }));

  const homeData = await getProducts({
    TopCategoriesCount: 10,
  });
  const amazingProducts = await getAmazingProducts({
    includeDealTimer: false,
  });
  const newestProducts = homeData.newestProducts ?? [];
  const featuredProducts = homeData.featuredProducts ?? [];
  const topCategoriesMap = (homeData.topCategories ?? []).map((cat) => ({
    id: cat.categoryId,
    name: cat.name,
    slug: cat.slug,
    src: "/images/default.png",
  }));

  const bestSellingProducts = mapToBestSellingProducts(
    homeData.bestSellingProducts ?? [],
    3,
  );

  // fake banners data
  const bannersData = [
    {
      id: 1,
      image: "/images/banner/banner-1.png",
      alt: "تصویر تبلیغاتی اسلایدر فروشگاه - محصول ویژه 1",
      slug: "/products?category=1",
    },
    {
      id: 2,
      image: "/images/banner/banner-2.png",
      alt: "تصویر تبلیغاتی اسلایدر فروشگاه - محصول ویژه 2",
      slug: "/products?category=2",
    },
    {
      id: 3,
      image: "/images/banner/banner-3.png",
      alt: "تصویر تبلیغاتی اسلایدر فروشگاه - محصول ویژه 3",
      slug: "/products?category=3",
    },
  ];

  return (
    <main>
      {/* <!-- START STORY SECTION --> */}
      {/* <SectionContainer>
        <Story stories={stories} />
      </SectionContainer> */}
      {/* <!-- END STORY SECTION --> */}

      {/* <!-- SLIDER SECTION --> */}
      {/* <SectionContainer fullWidth>
        <Slider sliders={sliders} />
      </SectionContainer> */}
      {/* <!-- END SLIDER SECTION --> */}

      {/* <!-- START AMAZING SECTION --> */}
      {amazingProducts.length > 0 && (
        <SectionContainer>
          <AmazingProducts products={amazingProducts} />
        </SectionContainer>
      )}
      {/* <!-- END AMAZING SECTION --> */}

      {/* <!-- START TOP CATEGORIES SECTION --> */}
      {topCategoriesMap.length > 0 && (
        <SectionContainer>
          <Category categories={topCategoriesMap} title="دسته‌بندی‌های برتر" />
        </SectionContainer>
      )}
      {/* <!-- END TOP CATEGORIES SECTION --> */}

      {/* <!-- START Featured CATEGORY SECTION --> */}
      {featuredCategoriesMap.length > 0 && (
        <SectionContainer>
          <Category
            categories={featuredCategoriesMap}
            title="دسته‌بندی‌های ویژه"
          />
        </SectionContainer>
      )}
      {/* <!-- END CATEGORY SECTION --> */}

      <SectionContainer className="hidden">
        <HeroSection />
      </SectionContainer>

      {/* <!-- START BANNER SECTION --> */}
      <SectionContainer>
        <Banner banners={bannersData} title="تبلیغات فروشگاه" />
      </SectionContainer>
      {/* <!-- END BANNER SECTION --> */}

      {/* <!-- START Recommended CATEGORY SECTION --> */}
      {recommendedCategoriesMap.length > 0 ? (
        <SectionContainer>
          <Category
            categories={recommendedCategoriesMap}
            title="دسته‌بندی‌های پیشنهادی"
          />
        </SectionContainer>
      ) : null}
      {/* <!-- END CATEGORY SECTION --> */}

      {/* <!-- START NEW PRODUCT SLIDER SECTION -->/ */}
      {newestProducts.length > 0 ? (
        <SectionContainer>
          <SliderProduct
            products={newestProducts}
            loop={false}
            title="جدیدترین محصولات"
            href="/products?sort=newest"
          />
        </SectionContainer>
      ) : null}
      {/* <!-- END NEW PRODUCT SLIDER SECTION --> */}

      {/* <!-- START LATEST VIEW SECTION --> */}
      {/* {suggestedProducts.length > 0 ? (
        <SectionContainer>
          <UserLatestViews
            suggestedProducts={suggestedProducts}
            title={"محصولات پیشنهادی"}
            href={"#"}
          />
        </SectionContainer>
      ) : null} */}
      {/* <!-- END LATEST VIEW SECTION --> */}

      {/* <!-- START NEW PRODUCT SECTION --> */}
      {bestSellingProducts.length > 0 ? (
        <SectionContainer>
          <BestSellingProducts
            bestSellingProducts={bestSellingProducts}
            title={"پرفروش ترین محصولات"}
            href={"/products?sort=bestSelling"}
          />
        </SectionContainer>
      ) : null}
      {/* <!-- END NEW PRODUCT SECTION --> */}

      {/* <!-- START PRODUCT SLIDER SECTION -->/ */}
      {featuredProducts.length > 0 ? (
        <SectionContainer>
          <SliderProduct
            products={featuredProducts}
            loop={true}
            title="محصولات ویژه"
            href="#"
          />
        </SectionContainer>
      ) : null}

      {/* <!-- END PRODUCT SLIDER SECTION --> */}

      {/* <!-- START BRAND SECTION --> */}
      {brands.items.length > 0 ? (
        <SectionContainer>
          <Brand
            brands={brands.items}
            title={"برندهای های فروشگاه"}
            href={"#"}
          />
        </SectionContainer>
      ) : null}

      {/* <!-- END BRAND SECTION --> */}

      {/* <!-- START BLOG SECTION --> */}
      {/* <SectionContainer>
        <LastBlogs lastBlogLits={lastBlogLits} />
      </SectionContainer> */}
      {/* <!-- END BLOG SECTION --> */}
    </main>
  );
}
