"use client";

import Story from "@/components/ui/Home/Story/Story";
import Slider from "@/components/ui/Home/Slider/Slider";
import AmazingProducts from "@/components/ui/Home/AmazingProducts/AmazingProducts";
import Category from "@/components/ui/Home/Category/Category";
import Banner from "@/components/ui/Home/Banner/Banner";
import NewProducts from "@/components/ui/Home/NewProducts/NewProducts";
import UserLatestViews from "@/components/ui/Home/CategoryProductBox/CategoryProductBox";
import LastProducts from "@/components/ui/Home/LastProducts/LastProducts";
import Brand from "@/components/ui/Home/Brand/Brand";
import LastBlogs from "@/components/ui/Home/LastBlogs/LastBlogs";
import { useProducts } from "@/lib/hooks/useProducts";
import { useMemo } from "react";

export default function Home() {
  const { products, loading, error } = useProducts();

  const amazingProducts = useMemo(() => {
    return products ? products.filter((p) => p.offer === true) : [];
  }, [products]);

  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا در دریافت اطلاعات</div>;

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
    },
    {
      id: 2,
      image: "/images/slider/landing/laptop-2.webp",
      alt: "تصویر تبلیغاتی اسلایدر فروشگاه - محصول ویژه 2",
    },
    {
      id: 3,
      image: "/images/slider/landing/laptop-3.webp",
      alt: "تصویر تبلیغاتی اسلایدر فروشگاه - محصول ویژه 3",
    },
  ];

  // const products = [
  //   {
  //     id: 1,
  //     image: "/images/product/laptop-2.png",
  //     title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
  //     rating: 4,
  //     colors: [{ bg: "rgb(248, 162, 3)" }, { bg: "rgb(255, 232, 145)" }],
  //     discountText: "3%",
  //     oldPrice: "13,900,000",
  //     price: "13,550,000",
  //     countdownToISO: "2028-01-01T15:30:00.000Z",
  //     href: "/product",
  //   },
  //   {
  //     id: 2,
  //     image: "/images/product/mobile-3.png",
  //     title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
  //     rating: 4,
  //     colors: [{ bg: "rgb(248, 162, 3)" }, { bg: "rgb(255, 232, 145)" }],
  //     discountText: "3%",
  //     oldPrice: "13,900,000",
  //     price: "13,550,000",
  //     countdownToISO: "2028-01-01T15:30:00.000Z",
  //     href: "/product",
  //   },
  //   {
  //     id: 3,
  //     image: "/images/product/mobile-2.png",
  //     title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
  //     rating: 4,
  //     colors: [{ bg: "rgb(248, 162, 3)" }, { bg: "rgb(255, 232, 145)" }],
  //     discountText: "3%",
  //     oldPrice: "13,900,000",
  //     price: "13,550,000",
  //     countdownToISO: "2028-01-01T15:30:00.000Z",
  //     href: "/product",
  //   },
  //   {
  //     id: 4,
  //     image: "/images/product/laptop-6.png",
  //     title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
  //     rating: 4,
  //     colors: [{ bg: "rgb(248, 162, 3)" }, { bg: "rgb(255, 232, 145)" }],
  //     discountText: "3%",
  //     oldPrice: "13,900,000",
  //     price: "13,550,000",
  //     countdownToISO: "2028-01-01T15:30:00.000Z",
  //     href: "/product",
  //   },
  //   {
  //     id: 5,
  //     image: "/images/product/laptop-5.png",
  //     title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
  //     rating: 4,
  //     colors: [{ bg: "rgb(248, 162, 3)" }, { bg: "rgb(255, 232, 145)" }],
  //     discountText: "3%",
  //     oldPrice: "13,900,000",
  //     price: "13,550,000",
  //     countdownToISO: "2028-01-01T15:30:00.000Z",
  //     href: "/product",
  //   },
  //   {
  //     id: 6,
  //     image: "/images/product/wach-3.png",
  //     title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
  //     rating: 4,
  //     colors: [{ bg: "rgb(248, 162, 3)" }, { bg: "rgb(255, 232, 145)" }],
  //     discountText: "3%",
  //     oldPrice: "13,900,000",
  //     price: "13,550,000",
  //     countdownToISO: "2028-01-01T15:30:00.000Z",
  //     href: "/product",
  //   },
  //   {
  //     id: 7,
  //     image: "/images/product/laptop-3.png",
  //     title: "تبلت سامسونگ مدل Galaxy Tab S8 Ultra ظرفیت 128 گیگابایت",
  //     rating: 4,
  //     colors: [{ bg: "rgb(248, 162, 3)" }, { bg: "rgb(255, 232, 145)" }],
  //     discountText: "3%",
  //     oldPrice: "13,900,000",
  //     price: "13,550,000",
  //     countdownToISO: "2028-01-01T15:30:00.000Z",
  //     href: "/product",
  //   },
  //   // ...
  // ];

  const categories = [
    { id: 1, title: "لپتاپ", img: "/images/category/laptop.png" },
    { id: 2, title: "آرایشی", img: "/images/category/araeshi.png" },
    { id: 3, title: "آشپزخانه", img: "/images/category/ashpazkhane.png" },
    {
      id: 4,
      title: "لوازم تحریر",
      img: "/images/category/lavazem-tahrir.png",
    },
    { id: 5, title: "موبایل", img: "/images/category/mobile.png" },
    { id: 6, title: "پوشاک", img: "/images/category/poshak.png" },
    { id: 7, title: "لپتاپ", img: "/images/category/laptop.png" },
    { id: 8, title: "آرایشی", img: "/images/category/araeshi.png" },
    { id: 9, title: "آشپزخانه", img: "/images/category/ashpazkhane.png" },
    {
      id: 10,
      title: "لوازم تحریر",
      img: "/images/category/lavazem-tahrir.png",
    },
    { id: 11, title: "موبایل", img: "/images/category/mobile.png" },
    { id: 12, title: "پوشاک", img: "/images/category/poshak.png" },
    // تکرار موارد برای پر شدن اسلایدر...
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

  const brands = [
    { id: 1, name: "شیائومی", img: "/images/brand/brand1-1.png" },
    { id: 2, name: "سامسونگ", img: "/images/brand/brand1-2.png" },
    { id: 3, name: "آیفون", img: "/images/brand/brand1-3.png" },
    { id: 4, name: "لنوو", img: "/images/brand/brand1-4.png" },
    { id: 5, name: "ال‌جی", img: "/images/brand/brand1-5.png" },
    { id: 6, name: "Canon", img: "/images/brand/brand1-6.png" },
    { id: 7, name: "شیائومی", img: "/images/brand/brand1-1.png" },
    { id: 8, name: "سامسونگ", img: "/images/brand/brand1-2.png" },
    { id: 9, name: "آیفون", img: "/images/brand/brand1-3.png" },
    { id: 10, name: "لنوو", img: "/images/brand/brand1-4.png" },
    { id: 11, name: "ال‌جی", img: "/images/brand/brand1-5.png" },
    { id: 12, name: "Canon", img: "/images/brand/brand1-6.png" },
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
    <div className="container mx-auto">
      <Story stories={stories} />
      {/* <!-- SLIDER SECTION --> */}
      <Slider sliders={sliders} />
      {/* <!-- END SLIDER SECTION --> */}

      {/* <!-- START AMAZING SECTION --> */}
      <AmazingProducts products={amazingProducts} />
      {/* <!-- END AMAZING SECTION --> */}

      {/* <!-- START CATEGORY SECTION --> */}
      <Category categories={categories} />
      {/* <!-- END CATEGORY SECTION --> */}

      {/* <!-- START BANNER SECTION --> */}
      <Banner />
      {/* <!-- END BANNER SECTION --> */}

      {/* <!-- START PRODUCT SLIDER SECTION -->/ */}
      <NewProducts products={newProducts} loop={false} />
      {/* <!-- END PRODUCT SLIDER SECTION --> */}

      {/* <!-- START LATEST VIEW SECTION --> */}
      <UserLatestViews productsLast={productsLast} />
      {/* <!-- END LATEST VIEW SECTION --> */}

      {/* <!-- START NEW PRODUCT SECTION --> */}
      <LastProducts lastProductLists={lastProductLists} />
      {/* <!-- END NEW PRODUCT SECTION --> */}

      {/* <!-- START PRODUCT SLIDER SECTION -->/ */}
      <NewProducts loop={true} products={newProducts} />
      {/* <!-- END PRODUCT SLIDER SECTION --> */}

      {/* <!-- START BRAND SECTION --> */}
      <Brand brands={brands} />
      {/* <!-- END BRAND SECTION --> */}

      {/* <!-- START BLOG SECTION --> */}
      {/* <LastBlogs lastBlogLits={lastBlogLits} /> */}
      {/* <!-- END BLOG SECTION --> */}
    </div>
  );
}
