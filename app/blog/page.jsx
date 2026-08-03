// app/blog/page.jsx

import Blog from "@/components/ui/Blog/Blog";
import { absoluteUrl } from "@/src/lib/seo/site";
import React from "react";

export const metadata = {
  alternates: {
    canonical: absoluteUrl("/blog"),
  },
};

function BlogsPage() {
  return <Blog />;
}

export default BlogsPage;
