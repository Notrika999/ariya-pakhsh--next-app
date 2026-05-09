import Image from "next/image";
import Link from "next/link";
import React from "react";
import BlogSidbar from "./BlogSidebar";
import BlogTopPosts from "./BlogTopPosts";

export default function BlogTop() {
  return (
    <div className="grid grid-cols-12 mt-4 gap-4">
      {/* <!-- Search --> */}
      <div className="lg:col-span-3 col-span-12">
        <BlogSidbar />
      </div>
      {/* <!-- Top post --> */}
      <div className="lg:col-span-9 col-span-12">
        <BlogTopPosts />
      </div>
    </div>
  );
}
