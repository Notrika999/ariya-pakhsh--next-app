import React from "react";
import Breadcrumb from "@/components/modules/Breadcrumb/Breadcrumb";
import Image from "next/image";
import Link from "next/link";
import BlogContent from "@/components/ui/Blog/slug/BlogContent";

export default function BlogPage() {
  return (
    <section className="py-5">
      <div className="container mx-auto">
        {/* <!-- Breadcrumb --> */}
        <Breadcrumb
          title={"بلاگ"}
          href={"#"}
          active={"گوشی موبایل اپل مدل iPhone 13 Pro Max دو سیم کارت"}
        />

        {/* <!-- Content --> */}
        <BlogContent />
      </div>
    </section>
  );
}
