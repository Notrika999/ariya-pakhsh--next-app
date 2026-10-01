// app/page.tsx — storefront home route
import { getProducts } from "@/src/services/product/product.server";
import { getAmazingProducts } from "@/src/services/promotion/promotion.server";
import {
  getHomeLayout,
  mapHomeLayoutCarousel,
  mapHomeLayoutPromoCards,
  mapHomeLayoutStories,
} from "@/src/services/home/home-layout.server";

import Story from "@/components/ui/Home/Story/Story";
import Slider from "@/components/ui/Home/Slider/Slider";
import AmazingProducts from "@/components/ui/Home/AmazingProducts/AmazingProducts";
import BestSellingProducts from "@/components/ui/Home/BestSellingProducts/BestSellingProducts";
import CategoryGrid from "@/components/ui/Home/CategoryGrid/CategoryGrid";
import Banner from "@/components/ui/Home/Banner/Banner";
import Brand from "@/components/ui/Home/Brand/Brand";
import LastBlogs from "@/components/ui/Home/LastBlogs/LastBlogs";

import { getPromotedCategories } from "@/src/services/category/category.server";
import SliderProduct from "@/components/modules/SliderProduct/SliderProduct";

import { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/src/lib/seo/site";
import { buildCanonical } from "@/src/lib/seo/canonical";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import { mapToBestSellingProducts } from "@/src/lib/mappers/best-selling-products.mapper";
import { getCategoryImage } from "@/src/utils/product-image";
import JsonLd, { type JsonLdValue } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

const HOME_CANONICAL_URL = buildCanonical("/");
const HOME_DESCRIPTION =
  "کارآپ 24؛ مرجع تخصصی خرید آنلاین لوازم جانبی، تزئینی و لوکس خودرو.";

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  "@id": `${HOME_CANONICAL_URL}#online-store`,
  name: SITE_NAME,
  alternateName: "CarUp24",
  url: HOME_CANONICAL_URL,
  logo: absoluteUrl("/images/logo/Logo.png"),
  description: HOME_DESCRIPTION,
  email: "info@carup24.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IR",
    addressRegion: "مازندران",
    addressLocality: "ساری",
    streetAddress: "بلوار امام رضا (ع)",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@carup24.com",
  },
  sameAs: [
    "https://www.aparat.com/carup24.com",
    "https://www.instagram.com/carup24.ir",
    "https://t.me/carup24",
  ],
} satisfies JsonLdValue;

// ساختار متاتگ‌ها به صورت استاندارد و حرفه‌ای
export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),

  title: {
    default: "فروشگاه اینترنتی کارآپ 24 | CarUp24",
    template: "%s | کارآپ 24",
  },

  description: HOME_DESCRIPTION,
  keywords: [
    "کارآپ 24",
    "کار آپ 24",
    "کار اپ 24",
    "کاراپ 24",
    "CarUp24",
    "Car Up 24",
    "carup24",
    "خرید آنلاین",
    "فروشگاه اینترنتی",
    "قیمت کفپوش ماشین",
    "خرید روکش صندلی",
    "لوازم تزینی",
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
    canonical: HOME_CANONICAL_URL,
  },
};

export default async function Home() {
  // --- Recommended Categories ---
  const recommendedCategories = await getPromotedCategories({
    filter: "recommended",
    maxCount: 12,
  });
  const recommendedCategoriesMap = recommendedCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    src: getCategoryImage(cat.image),
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
    src: getCategoryImage(cat.image),
  }));

  const homeData = await getProducts({
    TopCategoriesCount: 10,
    TopBrandsCount: 10,
    LatestArticlesCount: 10,
  });
  const amazingProducts = await getAmazingProducts({
    includeDealTimer: false,
  });
  const homeLayout = await getHomeLayout();
  const stories = mapHomeLayoutStories(homeLayout.sections);
  const homeCarouselSlides = mapHomeLayoutCarousel(homeLayout.sections);
  const homePromoCards = mapHomeLayoutPromoCards(homeLayout.sections);

  const inStockOnly = <T,>(products: T[]) =>
    products.filter(
      (product) => (product as { inStock?: boolean | null }).inStock !== false,
    );

  const newestProducts = inStockOnly(homeData.newestProducts ?? []);
  const featuredProducts = inStockOnly(homeData.featuredProducts ?? []);
  const onSaleProducts = homeData.onSaleProducts ?? [];
  const topBrands = homeData.brands ?? [];
  const latestArticles = homeData.latestArticles ?? [];
  const topCategoriesMap = (homeData.topCategories ?? []).map((cat) => ({
    id: cat.categoryId,
    name: cat.name,
    slug: cat.slug,
    src: getCategoryImage({
      thumbUrl: cat.thumbUrl,
      iconUrl: cat.iconUrl,
    }),
  }));

  const bestSellingProducts = mapToBestSellingProducts(
    inStockOnly(homeData.bestSellingProducts ?? []),
    3,
  );

  const bannerItems = homePromoCards;
  const carouselSliders = homeCarouselSlides;

  return (
    <main>
      <JsonLd id="online-store-json-ld" data={storeJsonLd} />
      <h1 className="sr-only">
        فروشگاه لوازم جانبی، تزئینی و لوکس خودرو | کارآپ 24
      </h1>
      {/* <!-- START STORY SECTION --> */}
      {stories.length > 0 ? (
        <SectionContainer>
          <Story stories={stories} />
        </SectionContainer>
      ) : null}
      {/* <!-- END STORY SECTION --> */}

      {/* <!-- Carousel SECTION --> */}
      {carouselSliders.length > 0 ? (
        <SectionContainer fullWidth>
          <Slider sliders={carouselSliders} />
        </SectionContainer>
      ) : null}
      {/* <!-- END Carousel SECTION --> */}

      {/* <!-- START AMAZING SECTION --> */}
      {amazingProducts.length > 0 && (
        <SectionContainer>
          <AmazingProducts products={amazingProducts} />
        </SectionContainer>
      )}
      {/* <!-- END AMAZING SECTION --> */}

      {/* <!-- START TOP CATEGORIES SECTION --> */}
      {topCategoriesMap.length > 0 && (
        <SectionContainer className="bg-[#fefefe] dark:bg-[#0d1117]">
          <CategoryGrid
            categories={topCategoriesMap}
            title="دسته‌بندی‌های برتر"
          />
        </SectionContainer>
      )}
      {/* <!-- END TOP CATEGORIES SECTION --> */}

      {/* <!-- START Featured CATEGORY SECTION --> */}
      {featuredCategoriesMap.length > 0 && (
        <SectionContainer className="bg-[#fefefe] dark:bg-[#0d1117] ">
          <CategoryGrid
            categories={featuredCategoriesMap}
            title="دسته‌بندی‌های ویژه"
          />
        </SectionContainer>
      )}
      {/* <!-- END CATEGORY SECTION --> */}

      {/* <!-- START BANNER SECTION --> */}
      {bannerItems.length > 0 ? (
        <SectionContainer>
          <Banner banners={bannerItems} title="بنرهای تبلیغات فروشگاه" />
        </SectionContainer>
      ) : null}
      {/* <!-- END BANNER SECTION --> */}

      {/* <!-- START Recommended CATEGORY SECTION --> */}
      {recommendedCategoriesMap.length > 0 ? (
        <SectionContainer className="bg-[#fefefe] dark:bg-[#0d1117]">
          <CategoryGrid
            categories={recommendedCategoriesMap}
            title="دسته‌بندی‌های پیشنهادی"
          />
        </SectionContainer>
      ) : null}
      {/* <!-- END CATEGORY SECTION --> */}

      {/* <!-- START NEW PRODUCT SLIDER SECTION -->/ */}
      {newestProducts.length > 0 ? (
        <SectionContainer className="bg-[#fefefe] dark:bg-[#0d1117]">
          <SliderProduct
            products={newestProducts}
            loop={false}
            title="جدیدترین محصولات"
            href="/products?sort=newest"
          />
        </SectionContainer>
      ) : null}
      {/* <!-- END NEW PRODUCT SLIDER SECTION --> */}

      {/* <!-- START ON-SALE PRODUCTS SECTION --> */}
      {onSaleProducts.length > 0 ? (
        <SectionContainer>
          <SliderProduct
            products={onSaleProducts}
            loop={false}
            title="محصولات پیشنهادی"
            href="/products?onSaleOnly=true"
          />
        </SectionContainer>
      ) : null}
      {/* <!-- END ON-SALE PRODUCTS SECTION --> */}

      {/* <!-- START NEW PRODUCT SECTION --> */}
      {bestSellingProducts.length > 0 ? (
        <SectionContainer className="bg-[#fefefe] dark:bg-[#0d1117]">
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
        <SectionContainer className="bg-[#fefefe] dark:bg-[#0d1117]">
          <SliderProduct
            products={featuredProducts}
            loop={true}
            title="محصولات ویژه"
          />
        </SectionContainer>
      ) : null}

      {/* <!-- END PRODUCT SLIDER SECTION --> */}

      {/* <!-- START BRAND SECTION --> */}
      {topBrands.length > 0 ? (
        <SectionContainer className="bg-[#fefefe] dark:bg-[#0d1117]">
          <Brand brands={topBrands} title="برندهای فروشگاه" />
        </SectionContainer>
      ) : null}

      {/* <!-- END BRAND SECTION --> */}

      {/* <!-- START BLOG SECTION --> */}
      {latestArticles.length > 0 ? (
        <SectionContainer>
          <LastBlogs lastBlogLits={latestArticles} />
        </SectionContainer>
      ) : null}
      {/* <!-- END BLOG SECTION --> */}
    </main>
  );
}
