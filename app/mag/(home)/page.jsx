// app/mag/(home)/page.jsx

import {
  getArticleTypeForCategory,
  getMagazineQueryPageSeo,
  normalizeCategory,
  parseMagazineHomeSearchParams,
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
import { buildMagazineCanonical } from "@/src/lib/seo/canonical";
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

const MAG_METADATA_BASE = {
  title: { absolute: MAG_TITLE },
  description: MAG_DESCRIPTION,
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

async function resolveMagazineHomeState(searchParams) {
  const parsed = parseMagazineHomeSearchParams(await searchParams);
  const home = await getMagazineHome();
  const categories = composeMagazineCategories(home.categories);
  const category = normalizeCategory(parsed.requestedCategory, categories);
  const mappedType = getArticleTypeForCategory(category);
  const articleType =
    parsed.requestedArticleType && parsed.requestedArticleType !== mappedType
      ? parsed.requestedArticleType
      : "";
  const searchQuery = parsed.query.trim();

  return {
    ...parsed,
    home,
    categories,
    category,
    articleType,
    searchQuery,
  };
}

export async function generateMetadata({ searchParams }) {
  const state = await resolveMagazineHomeState(searchParams);
  const robots = getMagazineQueryPageSeo({
    category: state.category,
    query: state.searchQuery,
    tag: state.tag,
    vehicle: state.vehicle,
    articleType: state.articleType,
    showAllArticles: state.showAllArticles,
    page: state.page,
    sort: state.sort,
  });

  return {
    ...MAG_METADATA_BASE,
    alternates: {
      canonical: buildMagazineCanonical({
        category: state.category,
        page: state.page,
      }),
    },
    robots,
  };
}

async function BlogsPage({ searchParams }) {
  const {
    home,
    categories,
    category,
    articleType,
    searchQuery,
    requestedArticleType,
    tag,
    vehicle,
    sort,
    page,
    pageSize,
    showAllArticles,
  } = await resolveMagazineHomeState(searchParams);

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
        articleType={articleType}
        tag={tag}
        vehicle={vehicle}
        sort={sort}
        list={showAllArticles}
        pageSize={pageSize}
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
