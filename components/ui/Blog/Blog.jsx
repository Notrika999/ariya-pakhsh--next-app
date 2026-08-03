import React from "react";
import BlogTop from "./BlogTop";
import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";
import BlogVideoSidebar from "./BlogVideoSidebar";
import BlogOriginalVideo from "./BlogOriginalVideo";
import LastBlogs from "../Home/LastBlogs/LastBlogs";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import { blogPosts, getBlogHref } from "./blogData";

export default function Blog() {
  const lastBlogLits = blogPosts.map((post) => ({
    ...post,
    href: getBlogHref(post),
  }));

  return (
    <>
      <SectionContainer>
        <div className="container">
          <BlogTop />
        </div>
      </SectionContainer>

      <h2 className="sr-only">راهنمای ویدیویی دسته‌بندی محصولات خودرو</h2>
      <SectionContainer>
        <SectionHeader
          title={"راهنمای سریع لوازم کاربردی خودرو"}
          href={"/blog"}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <BlogVideoSidebar />
          </div>

          <BlogOriginalVideo />
        </div>
      </SectionContainer>

      <h2 className="sr-only">مقالات دسته‌بندی محصولات خودرو</h2>
      <SectionContainer>
        <LastBlogs lastBlogLits={lastBlogLits} />
      </SectionContainer>
    </>
  );
}
