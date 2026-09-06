// app/mag/page.jsx

import {
  getArticleTypeForCategory,
  normalizeArticleType,
  normalizeCategory,
  parsePositiveInt,
  resolveMagazineArticleParams,
} from "@/components/ui/magazine/magazineHomeUtils";
import MagazineHome, {
  MagazineListing,
} from "@/components/ui/magazine/MagazineHome";
import {
  buildMagazineHomeModel,
  composeMagazineCategories,
  toMagazineArticle,
} from "@/components/ui/magazine/magazineView";
import { absoluteUrl, SITE_NAME } from "@/src/lib/seo/site";
import {
  getMagazineArticles,
  getMagazineHome,
} from "@/src/services/magazine/magazine.server";
import React from "react";

export const dynamic = "force-dynamic";

const MAG_TITLE = "مجله خودرو کارآپ۲۴ | راهنمای خرید، نگهداری و لوازم خودرو";
const MAG_DESCRIPTION =
  "مجله خودرو کارآپ۲۴؛ راهنمای خرید لوازم جانبی، نگهداری، دیتیلینگ و مقایسه تجهیزات خودرو.";
const MAG_URL = absoluteUrl("/mag");

export const metadata = {
  title: { absolute: MAG_TITLE },
  description: MAG_DESCRIPTION,
  alternates: {
    canonical: MAG_URL,
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: MAG_TITLE,
    description: MAG_DESCRIPTION,
    type: "website",
    locale: "fa_IR",
    url: MAG_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: absoluteUrl("/images/og-image.jpg"),
        width: 1200,
        height: 630,
        alt: MAG_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: MAG_TITLE,
    description: MAG_DESCRIPTION,
    images: [absoluteUrl("/images/og-image.jpg")],
  },
};

function getSearchValue(value) {
  if (Array.isArray(value)) return value[0] ?? "";
  return typeof value === "string" ? value : "";
}

async function BlogsPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = getSearchValue(resolvedSearchParams.q);
  const tag = getSearchValue(resolvedSearchParams.tag);
  const vehicle = getSearchValue(resolvedSearchParams.vehicle);
  const sort = getSearchValue(resolvedSearchParams.sort) || "latest";
  const requestedCategory =
    getSearchValue(resolvedSearchParams.category) || "all";
  const requestedArticleType = normalizeArticleType(
    getSearchValue(resolvedSearchParams.articleType),
  );
  const page = parsePositiveInt(resolvedSearchParams.page, 1);
  const pageSize = parsePositiveInt(resolvedSearchParams.pageSize, 12, 48);

  const home = await getMagazineHome();
  const categories = composeMagazineCategories(home.categories);
  const category = normalizeCategory(requestedCategory, categories);
  const mappedType = getArticleTypeForCategory(category);
  const articleType =
    requestedArticleType && requestedArticleType !== mappedType
      ? requestedArticleType
      : "";
  const searchQuery = query.trim();
  const showAllArticles = getSearchValue(resolvedSearchParams.list) === "1";
  const isFiltered =
    category !== "all" ||
    Boolean(searchQuery) ||
    Boolean(articleType) ||
    Boolean(tag.trim()) ||
    Boolean(vehicle.trim()) ||
    page > 1 ||
    showAllArticles;

  if (isFiltered) {
    const listing = await getMagazineArticles(
      resolveMagazineArticleParams({
        category,
        articleType: requestedArticleType,
        tag,
        vehicle,
        search: searchQuery,
        page,
        pageSize,
        sort,
      }),
    );

    return (
      <MagazineListing
        query={searchQuery}
        category={category}
        categories={categories}
        posts={listing.items.map(toMagazineArticle).filter(Boolean)}
        page={listing.pageNumber || page}
        totalPages={Math.max(listing.totalPages || 1, 1)}
      />
    );
  }

  if (home.sections.length) {
    return <MagazineHome sections={home.sections} />;
  }

  const listing = await getMagazineArticles(
    resolveMagazineArticleParams({
      category,
      articleType: requestedArticleType,
      tag,
      vehicle,
      search: searchQuery,
      page,
      pageSize: 24,
      sort,
    }),
  );

  const model = buildMagazineHomeModel({
    apiPosts: listing.items,
    apiCategories: home.categories,
    apiSections: home.sections,
  });

  return <MagazineHome model={model} />;
}

export default BlogsPage;
