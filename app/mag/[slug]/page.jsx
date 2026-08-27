// app/blog/[slug]/page.jsx
import React from "react";
import Breadcrumb from "@/components/modules/Breadcrumb/Breadcrumb";
import BlogContent from "@/components/ui/Blog/slug/BlogContent";
import {
  blogPosts,
  getBlogPostBySlug,
} from "@/components/ui/Blog/blogData";
import { getBlogRelatedProducts } from "@/components/ui/Blog/slug/getBlogRelatedProducts";

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPage({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  const relatedProducts = await getBlogRelatedProducts(post.keyword);

  return (
    <section className="py-5">
      <div className="container mx-auto">
        <Breadcrumb
          items={[
            { id: "home", name: "کارآپ 24", slug: "", depth: -1 },
            { id: "blog", name: "بلاگ", slug: "blog", depth: -2 },
            { id: post.slug, name: post.keyword, slug: post.slug, depth: -2 },
          ]}
        />

        <BlogContent post={post} relatedProducts={relatedProducts} />
      </div>
    </section>
  );
}
