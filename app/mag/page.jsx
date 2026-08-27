// app/blog/page.jsx

import Blog from "@/components/ui/Blog/Blog";
import { absoluteUrl } from "@/src/lib/seo/site";
import React from "react";

export const metadata = {
  title: "مجله کارآپ 24",
  description:
    "راهنمای انتخاب، خرید و استفاده از لوازم جانبی و تجهیزات خودرو",
  alternates: {
    canonical: absoluteUrl("/blog"),
  },
};

function getSearchValue(value) {
  if (Array.isArray(value)) return value[0] ?? "";
  return typeof value === "string" ? value : "";
}

async function BlogsPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) ?? {};

  return (
    <Blog
      query={getSearchValue(resolvedSearchParams.q)}
      category={getSearchValue(resolvedSearchParams.category) || "all"}
    />
  );
}

export default BlogsPage;
