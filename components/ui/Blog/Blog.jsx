import React from "react";
import Breadcrumb from "@/components/modules/Breadcrumb/Breadcrumb";
import BlogTop from "./BlogTop";
import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";
import BlogVideoSidebar from "./BlogVideoSidebar";
import BlogOriginalVideo from "./BlogOriginalVideo";
import LastBlogs from "../Home/LastBlogs/LastBlogs";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";

export default function Blog() {
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
    <>
      {/* <!-- START CONTENT --> */}

      <SectionContainer>
        {/* <!-- Breadcrumb --> */}
        {/* <Breadcrumb active={"وبلاگ"} /> */}

        {/* <!-- Content --> */}
        <div className="container">
          {/* <!-- Search and top post --> */}
          <BlogTop />
        </div>
      </SectionContainer>

      {/* <!-- END CONTENT --> */}

      {/* <!-- START VIDEO BLOG --> */}
      <>
        {/* <!-- for seo --> */}
        <h2 className="sr-only">آخرین ویدیو وبلاگ</h2>

        <SectionContainer>
          <SectionHeader title={"آخرین ویدیو های وبلاگ"} href={"#"} />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              {/* <!--Video sidebar--> */}
              <BlogVideoSidebar />
            </div>

            {/* <!--Original video content--> */}
            <BlogOriginalVideo />
          </div>
        </SectionContainer>
      </>
      {/* <!-- END VIDEO BLOG --> */}

      {/* <!-- START LATEST POST BLOG SECTION --> */}
      <>
        {/* <!-- for seo --> */}
        <h2 className="sr-only">مطالب وبلاگ</h2>
        <SectionContainer>
          {/* <!-- blog posts swiper --> */}
          <LastBlogs lastBlogLits={lastBlogLits} />
        </SectionContainer>
      </>
    </>
  );
}
