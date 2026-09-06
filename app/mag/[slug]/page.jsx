// app/mag/[slug]/page.jsx

import { notFound } from "next/navigation";
import MagazineArticle from "@/components/ui/magazine/MagazineArticle";
import { SITE_NAME } from "@/src/lib/seo/site";
import { getMagazineArticleBySlug } from "@/src/services/magazine/magazine.server";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getMagazineArticleBySlug(slug);

  if (!article) notFound();

  const { seo } = article;

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: seo.canonicalUrl },
    robots: seo.robots,
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      type: "article",
      locale: "fa_IR",
      url: seo.canonicalUrl,
      siteName: SITE_NAME,
      publishedTime: article.publishedAtIso || undefined,
      modifiedTime: article.updatedAtIso || undefined,
      authors: article.author?.displayName ? [article.author.displayName] : undefined,
      images: seo.ogImage
        ? [{ url: seo.ogImage, alt: seo.ogTitle || article.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}

export default async function MagazineArticlePage({ params }) {
  const { slug } = await params;
  const article = await getMagazineArticleBySlug(slug);

  if (!article) notFound();

  return <MagazineArticle article={article} />;
}
