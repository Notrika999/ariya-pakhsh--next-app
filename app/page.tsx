import { getProducts } from "@/src/services/product/product.service";

import Story from "@/components/ui/Home/Story/Story";
import Slider from "@/components/ui/Home/Slider/Slider";
import AmazingProducts from "@/components/ui/Home/AmazingProducts/AmazingProducts";
import Category from "@/components/ui/Home/Category/Category";
import Banner from "@/components/ui/Home/Banner/Banner";
import UserLatestViews from "@/components/ui/Home/CategoryProductBox/CategoryProductBox";
import LastProducts from "@/components/ui/Home/LastProducts/LastProducts";
import Brand from "@/components/ui/Home/Brand/Brand";
import LastBlogs from "@/components/ui/Home/LastBlogs/LastBlogs";

import { getBrands } from "@/src/services/brand/brand.service";
import { getPromotedCategories } from "@/src/services/category/category.service";
import SliderProduct from "@/components/modules/SliderProduct/SliderProduct";

import { Metadata } from "next";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";

// ساختار متاتگ‌ها به صورت استاندارد و حرفه‌ای
export const metadata: Metadata = {
  title:
    "فروشگاه اینترنتی آریاپخش | خرید آنلاین کفپوش، روکش و لوازم لوکس خودرو",
  description:
    "مرجع تخصصی خرید آنلاین انواع کالاهای ظاهری خودرو با بهترین قیمت و ضمانت اصالت کالا.",
  keywords: [
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
    title: "فروشگاه اینترنتی آریاپخش",
    description:
      "بهترین پیشنهادهای روزانه و محصولات شگفت‌انگیز را در فروشگاه ما دنبال کنید.",
    type: "website",
    locale: "fa_IR",
    url: "https://yourdomain.com", // آدرس اصلی سایت را اینجا وارد کنید
    siteName: "آریاپخش",
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
    title: "فروشگاه اینترنتی آریاپخش",
    description: "خرید آسان و مطمئن کالای لوکس خودرو",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://yourdomain.com",
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
    title: cat.name,
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
    title: cat.name,
    slug: cat.slug,
    img: cat.image?.iconUrl ?? "/images/default.png",
  }));

  // stories, sliders, newProducts, productsLast, lastProductLists, lastBlogLits
  // همگی فیک
  const data = await getProducts();
  const products = data.products;

  const amazingProducts = products?.filter((p) => p.offer === true) ?? [];

  const stories = [
    {
      type: "image",
      user: "استوری ۱",
      avatar: "/images/story/1.jpg",
      url: "/images/story/1.jpg",
      duration: 5000,
      link: "https://www.rtl-theme.com/author/amir_rezaii/products/",
    },
    {
      type: "image",
      user: "استوری 2",
      avatar: "/images/story/2.jpg",
      url: "/images/story/2.jpg",
      duration: 5000,
      link: "https://www.rtl-theme.com/author/amir_rezaii/products/",
    },
    {
      type: "image",
      user: "استوری 3",
      avatar: "/images/story/3.jpg",
      url: "/images/story/3.jpg",
      duration: 5000,
      link: "https://www.rtl-theme.com/author/amir_rezaii/products/",
    },
    {
      type: "image",
      user: "استوری 4",
      avatar: "/images/story/5.jpg",
      url: "/images/story/5.jpg",
      duration: 5000,
      link: "https://www.rtl-theme.com/author/amir_rezaii/products/",
    },
    {
      type: "image",
      user: "استوری 5",
      avatar: "/images/story/6.jpg",
      url: "/images/story/6.jpg",
      duration: 5000,
      link: "https://www.rtl-theme.com/author/amir_rezaii/products/",
    },
    {
      type: "image",
      user: "استوری 6",
      avatar: "/images/story/7.jpg",
      url: "/images/story/7.jpg",
      duration: 5000,
      link: "https://www.rtl-theme.com/author/amir_rezaii/products/",
    },
    {
      type: "image",
      user: "استوری 7",
      avatar: "/images/story/8.jpg",
      url: "/images/story/8.jpg",
      duration: 5000,
      link: "https://www.rtl-theme.com/author/amir_rezaii/products/",
    },
    {
      type: "video",
      user: "استوری 8",
      avatar: "/images/story/4.jpg",
      url: "/images/story/video/1.mp4",
      duration: null,
      link: "https://www.rtl-theme.com/author/amir_rezaii/products/",
    },
    {
      type: "image",
      user: "استوری ۱",
      avatar: "/images/story/1.jpg",
      url: "/images/story/1.jpg",
      duration: 5000,
      link: "https://www.rtl-theme.com/author/amir_rezaii/products/",
    },
    {
      type: "image",
      user: "استوری 2",
      avatar: "/images/story/2.jpg",
      url: "/images/story/2.jpg",
      duration: 5000,
      link: "https://www.rtl-theme.com/author/amir_rezaii/products/",
    },
    {
      type: "image",
      user: "استوری 3",
      avatar: "/images/story/3.jpg",
      url: "/images/story/3.jpg",
      duration: 5000,
      link: "https://www.rtl-theme.com/author/amir_rezaii/products/",
    },
    {
      type: "image",
      user: "استوری 4",
      avatar: "/images/story/5.jpg",
      url: "/images/story/5.jpg",
      duration: 5000,
      link: "https://www.rtl-theme.com/author/amir_rezaii/products/",
    },
    {
      type: "image",
      user: "استوری 5",
      avatar: "/images/story/6.jpg",
      url: "/images/story/6.jpg",
      duration: 5000,
      link: "https://www.rtl-theme.com/author/amir_rezaii/products/",
    },
  ];

  const sliders = [
    {
      id: 1,
      image: "/images/slider/landing/laptop-1.webp",
      alt: "تصویر تبلیغاتی اسلایدر فروشگاه - محصول ویژه 1",
      slug: "coffee",
    },
    {
      id: 2,
      image: "/images/slider/landing/laptop-2.webp",
      alt: "تصویر تبلیغاتی اسلایدر فروشگاه - محصول ویژه 2",
      slug: "tea",
    },
    {
      id: 3,
      image: "/images/slider/landing/laptop-3.webp",
      alt: "تصویر تبلیغاتی اسلایدر فروشگاه - محصول ویژه 3",
      slug: "coffee",
    },
  ];

  const newProducts = [
    {
      id: 1,
      title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
      image: "/images/product/laptop-2.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 2,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/laptop-1.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 3,
      title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
      image: "/images/product/laptop-3.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 4,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/television-2.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 5,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/laptop-5.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 6,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/laptop-1.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 7,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/wach-2.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    {
      id: 8,
      title: "تبلت سامسونگ مدل S8",
      image: "/images/product/laptop-1.png",
      discount: "3",
      price: "13,550,000",
      oldPrice: "13,900,000",
      rating: 4,
      colors: ["rgb(248, 162, 3)", "rgb(255, 232, 145)"],
      href: "/product",
    },
    // سایر محصولات را اینجا اضافه کنید...
  ];

  const productsLast = [
    {
      id: 1,
      title: "لپتاپ",
      offerProducts: [
        {
          id: 1,
          title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
          image: "/images/product/laptop-2.png",
          discount: 3,
          rating: 4,
          oldPrice: "13,900,000",
          price: "13,550,000",

          colors: ["rgb(248,162,3)", "rgb(255,232,145)"],
          href: "/product",
        },
        {
          id: 2,
          title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
          image: "/images/product/laptop-1.png",
          discount: 3,
          rating: 4,
          oldPrice: "13,900,000",
          price: "13,550,000",

          colors: ["rgb(248,162,3)", "rgb(255,232,145)"],
          href: "/product",
        },
        {
          id: 3,
          title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
          image: "/images/product/laptop-3.png",
          discount: 3,
          rating: 4,
          oldPrice: "13,900,000",
          price: "13,550,000",

          colors: ["rgb(248,162,3)", "rgb(255,232,145)"],
          href: "/product",
        },
        {
          id: 4,
          title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
          image: "/images/product/laptop-4.png",
          discount: 3,
          rating: 4,
          oldPrice: "13,900,000",
          price: "13,550,000",

          colors: ["rgb(248,162,3)", "rgb(255,232,145)"],
          href: "/product",
        },
      ],
    },
    {
      id: 2,
      title: "ساعت هوشمند",
      offerProducts: [
        {
          id: 1,
          title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
          image: "/images/product/wach-2.png",
          discount: 3,
          rating: 4,
          oldPrice: "13,900,000",
          price: "13,550,000",

          colors: ["rgb(248,162,3)", "rgb(255,232,145)"],
          href: "/product",
        },
        {
          id: 2,
          title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
          image: "/images/product/wach-1.png",
          discount: 3,
          rating: 4,
          oldPrice: "13,900,000",
          price: "13,550,000",

          colors: ["rgb(248,162,3)", "rgb(255,232,145)"],
          href: "/product",
        },
        {
          id: 3,
          title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
          image: "/images/product/wach-3.png",
          discount: 3,
          rating: 4,
          oldPrice: "13,900,000",
          price: "13,550,000",

          colors: ["rgb(248,162,3)", "rgb(255,232,145)"],
          href: "/product",
        },
        {
          id: 4,
          title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
          image: "/images/product/wach-4.png",
          discount: 3,
          rating: 4,
          oldPrice: "13,900,000",
          price: "13,550,000",

          colors: ["rgb(248,162,3)", "rgb(255,232,145)"],
          href: "/product",
        },
      ],
    },
    {
      id: 3,
      title: "تلفن همراه",
      offerProducts: [
        {
          id: 1,
          title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
          image: "/images/product/television-2.png",
          discount: 3,
          rating: 4,
          oldPrice: "13,900,000",
          price: "13,550,000",

          colors: ["rgb(248,162,3)", "rgb(255,232,145)"],
          href: "/product",
        },
        {
          id: 2,
          title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
          image: "/images/product/television-1.png",
          discount: 3,
          rating: 4,
          oldPrice: "13,900,000",
          price: "13,550,000",

          colors: ["rgb(248,162,3)", "rgb(255,232,145)"],
          href: "/product",
        },
        {
          id: 3,
          title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
          image: "/images/product/television-3.png",
          discount: 3,
          rating: 4,
          oldPrice: "13,900,000",
          price: "13,550,000",

          colors: ["rgb(248,162,3)", "rgb(255,232,145)"],
          href: "/product",
        },
        {
          id: 4,
          title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
          image: "/images/product/television-4.png",
          discount: 3,
          rating: 4,
          oldPrice: "13,900,000",
          price: "13,550,000",

          colors: ["rgb(248,162,3)", "rgb(255,232,145)"],
          href: "/product",
        },
      ],
    },
  ];

  const lastProductLists = [
    {
      id: 1,
      products: [
        {
          id: 1,
          title: "گوشی موبایل اپل مدل iPhone 13 Pro Max دو سیم کارت",
          image: "/images/product/mobile-1.png",
          href: "/product",
        },
        {
          id: 2,
          title: "گوشی موبایل اپل مدل iPhone 13 Pro Max",
          image: "/images/product/television-2.png",
          href: "/product",
        },
        {
          id: 3,
          title: "گوشی موبایل اپل مدل iPhone 13 Pro Max",
          image: "/images/product/television-1.png",
          href: "/product",
        },
      ],
    },
    {
      id: 2,
      products: [
        {
          id: 1,
          title: "گوشی موبایل اپل مدل iPhone 13 Pro Max دو سیم کارت",
          image: "/images/product/mobile-4.png",
          href: "/product",
        },
        {
          id: 2,
          title: "گوشی موبایل اپل مدل iPhone 13 Pro Max",
          image: "/images/product/mobile-6.png",
          href: "/product",
        },
        {
          id: 3,
          title: "گوشی موبایل اپل مدل iPhone 13 Pro Max",
          image: "/images/product/wach-4.png",
          href: "/product",
        },
      ],
    },
    {
      id: 3,
      products: [
        {
          id: 1,
          title: "گوشی موبایل اپل مدل iPhone 13 Pro Max دو سیم کارت",
          image: "/images/product/mobile-5.png",
          href: "/product",
        },
        {
          id: 2,
          title: "گوشی موبایل اپل مدل iPhone 13 Pro Max",
          image: "/images/product/television-2.png",
          href: "/product",
        },
        {
          id: 3,
          title: "گوشی موبایل اپل مدل iPhone 13 Pro Max",
          image: "/images/product/wach-3.png",
          href: "/product",
        },
      ],
    },
    {
      id: 4,
      products: [
        {
          id: 1,
          title: "گوشی موبایل اپل مدل iPhone 13 Pro Max دو سیم کارت",
          image: "/images/product/mobile-6.png",
          href: "/product",
        },
        {
          id: 2,
          title: "گوشی موبایل اپل مدل iPhone 13 Pro Max",
          image: "/images/product/mobile-4.png",
          href: "/product",
        },
        {
          id: 3,
          title: "گوشی موبایل اپل مدل iPhone 13 Pro Max",
          image: "/images/product/wach-2.png",
          href: "/product",
        },
      ],
    },
    {
      id: 5,
      products: [
        {
          id: 1,
          title: "گوشی موبایل اپل مدل iPhone 13 Pro Max دو سیم کارت",
          image: "/images/product/mobile-1.png",
          href: "/product",
        },
        {
          id: 2,
          title: "گوشی موبایل اپل مدل iPhone 13 Pro Max",
          image: "/images/product/television-2.png",
          href: "/product",
        },
        {
          id: 3,
          title: "گوشی موبایل اپل مدل iPhone 13 Pro Max",
          image: "/images/product/television-1.png",
          href: "/product",
        },
      ],
    },
  ];

  const lastBlogLits = [
    {
      id: 1,
      image: "/images/blog/blog-1.jpg",
      title: "آخرین پرچمدار شیائومی",
      date: "۲۱ آبان ۱۴۰۴",
      href: "#",
    },
    {
      id: 2,
      image: "/images/blog/blog-2.jpg",
      title: "آخرین پرچمدار شیائومی",
      date: "۲2 آبان ۱۴۰۴",
      href: "#",
    },
    {
      id: 3,
      image: "/images/blog/blog-3.jpg",
      title: "آخرین پرچمدار شیائومی",
      date: "۲2 آبان ۱۴۰۴",
      href: "#",
    },
    {
      id: 4,
      image: "/images/blog/blog-4.jpg",
      title: "آخرین پرچمدار شیائومی",
      date: "۲3 آبان ۱۴۰۴",
      href: "#",
    },
    {
      id: 5,
      image: "/images/blog/blog-5.jpg",
      title: "آخرین پرچمدار شیائومی",
      date: "۲3 آبان ۱۴۰۴",
      href: "#",
    },
    {
      id: 6,
      image: "/images/blog/blog-6.jpg",
      title: "آخرین پرچمدار شیائومی",
      date: "۲3 آبان ۱۴۰۴",
      href: "#",
    },
  ];
  return (
    <main>
      {/* <!-- START STORY SECTION --> */}
      <SectionContainer>
        <Story stories={stories} />
      </SectionContainer>
      {/* <!-- END STORY SECTION --> */}

      {/* <!-- SLIDER SECTION --> */}
      <SectionContainer fullWidth>
        <Slider sliders={sliders} />
      </SectionContainer>
      {/* <!-- END SLIDER SECTION --> */}

        {/* <!-- START AMAZING SECTION --> */}
      <SectionContainer>
        <AmazingProducts products={amazingProducts} />
      </SectionContainer>
        {/* <!-- END AMAZING SECTION --> */}

        {/* <!-- START Featured CATEGORY SECTION --> */}
      <SectionContainer>
        <Category
          categories={featuredCategoriesMap}
          title="دسته‌بندی‌های ویژه"
        />
      </SectionContainer>
        {/* <!-- END CATEGORY SECTION --> */}

        {/* <!-- START BANNER SECTION --> */}
      <SectionContainer>
        <Banner />
      </SectionContainer>
        {/* <!-- END BANNER SECTION --> */}

        {/* <!-- START Recommended CATEGORY SECTION --> */}
      <SectionContainer>
        <Category
          categories={recommendedCategoriesMap}
          title="دسته‌بندی‌های پیشنهادی"
        />
      </SectionContainer>
        {/* <!-- END CATEGORY SECTION --> */}

        {/* <!-- START PRODUCT SLIDER SECTION -->/ */}
      <SectionContainer>
        <SliderProduct
          products={newProducts}
          loop={false}
          title="جدیدترین محصولات"
          href="#"
        />
      </SectionContainer>
        {/* <!-- END PRODUCT SLIDER SECTION --> */}

        {/* <!-- START LATEST VIEW SECTION --> */}
      <SectionContainer>
        <UserLatestViews
          productsLast={productsLast}
          title={"محصولات پیشنهادی"}
          href={"#"}
        />
      </SectionContainer>
        {/* <!-- END LATEST VIEW SECTION --> */}

        {/* <!-- START NEW PRODUCT SECTION --> */}
      <SectionContainer>
        <LastProducts
          lastProductLists={lastProductLists}
          title={"پرفروش ترین محصولات"}
          href={"#"}
        />
      </SectionContainer>
        {/* <!-- END NEW PRODUCT SECTION --> */}

        {/* <!-- START PRODUCT SLIDER SECTION -->/ */}
      <SectionContainer>
        <SliderProduct
          loop={true}
          products={newProducts}
          title="جدیدترین محصولات"
          href="#"
        />
      </SectionContainer>
        {/* <!-- END PRODUCT SLIDER SECTION --> */}

        {/* <!-- START BRAND SECTION --> */}
      <SectionContainer>
        <Brand brands={brands.items} title={"برندهای های فروشگاه"} href={"#"} />
      </SectionContainer>
        {/* <!-- END BRAND SECTION --> */}

        {/* <!-- START BLOG SECTION --> */}
      <SectionContainer>
        <LastBlogs lastBlogLits={lastBlogLits} />
      </SectionContainer>
        {/* <!-- END BLOG SECTION --> */}
    </main>
  );
}
