import "server-only";
// src/services/magazine/magazine.server.ts
import { cache } from "react";
import { proxyToBackend } from "@/src/lib/http/server-http";
import { ApiResponse } from "@/src/lib/types/common/api-response.types";
import type {
  GetMagazineArticlesParams,
  MagazineArticleDetail,
  MagazineArticlesPage,
  MagazineHomeData,
  MagazineRelatedProduct,
} from "@/src/lib/types/magazine/magazine.types";
import {
  collectMagazineContentCategoryIds,
  collectMagazineContentProductIds,
  mapMagazineArticleDetail,
  mapMagazineArticlesPage,
  mapMagazineHome,
  mapMagazineRelatedCatalog,
  mapProductDetailToMagazineRelated,
  summarizeMagazineContentTypes,
  type MagazineCategoryLink,
} from "@/src/services/magazine/magazine.mapper";
import { getCategoryBreadcrumb } from "@/src/services/category/category.server";
import { getProductById } from "@/src/services/product/product.server";

const EMPTY_HOME: MagazineHomeData = {
  categories: [],
  sections: [],
};

const EMPTY_ARTICLES: MagazineArticlesPage = {
  items: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 12,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

function isSuccess(payload: ApiResponse<unknown> | null | undefined): boolean {
  return Boolean(payload?.success ?? payload?.isSuccess);
}

function relatedProductIdsFromPayload(payload: unknown): Set<string> {
  return new Set(
    mapMagazineRelatedCatalog(payload).map((product) => product.productId),
  );
}

async function resolveMissingContentProducts(
  payload: unknown,
): Promise<MagazineRelatedProduct[]> {
  const neededIds = collectMagazineContentProductIds(payload);
  if (!neededIds.length) return [];

  const knownIds = relatedProductIdsFromPayload(payload);
  const missing = neededIds.filter((id) => !knownIds.has(id)).slice(0, 24);
  if (!missing.length) return [];

  const results = await Promise.all(
    missing.map(async (id) => {
      try {
        return mapProductDetailToMagazineRelated(await getProductById(id));
      } catch {
        return null;
      }
    }),
  );

  return results.filter((item): item is MagazineRelatedProduct => Boolean(item));
}

function encodeCategoryPath(slug: string): string {
  return encodeURIComponent(slug.trim());
}

async function resolveContentCategories(
  payload: unknown,
): Promise<MagazineCategoryLink[]> {
  const ids = collectMagazineContentCategoryIds(payload).slice(0, 12);
  if (!ids.length) return [];

  const results = await Promise.all(
    ids.map(async (categoryId: string): Promise<MagazineCategoryLink | null> => {
      try {
        const breadcrumb = await getCategoryBreadcrumb({
          categoryId,
          includeHome: false,
        });
        const items = breadcrumb ?? [];
        const match =
          items.find((item) => item.id === categoryId) ||
          [...items].reverse().find((item) => item.slug?.trim());
        const slug = match?.slug?.trim() || "";
        const title = match?.name?.trim() || "";
        if (!slug && !title) return null;

        return {
          categoryId,
          title,
          href: slug
            ? `/products/${encodeCategoryPath(slug)}`
            : `/products?categoryId=${encodeURIComponent(categoryId)}`,
        };
      } catch {
        return null;
      }
    }),
  );

  return results.filter((item): item is MagazineCategoryLink => Boolean(item));
}

export const getMagazineHome = cache(async function getMagazineHome(): Promise<MagazineHomeData> {
  try {
    const response = await proxyToBackend<ApiResponse<unknown>>({
      method: "GET",
      path: "/api/v1/magazine/home",
      cache: "no-store",
      timeout: 8_000,
      retries: 0,
    });



    if (!response.ok || !isSuccess(response.data)) {
      return EMPTY_HOME;
    }

    return mapMagazineHome(response.data.data);
  } catch {
    return EMPTY_HOME;
  }
});

export async function getMagazineArticles(
  params: GetMagazineArticlesParams = {},
): Promise<MagazineArticlesPage> {
  try {
    const response = await proxyToBackend<ApiResponse<unknown>>({
      method: "GET",
      path: "/api/v1/magazine/articles",
      params: {
        category: params.category || undefined,
        articleType: params.articleType || undefined,
        tag: params.tag || undefined,
        vehicle: params.vehicle || undefined,
        search: params.search || undefined,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 12,
        sort: params.sort || "latest",
      },
      cache: "no-store",
      timeout: 8_000,
      retries: 0,
    });

    if (!response.ok || !isSuccess(response.data)) {
      return EMPTY_ARTICLES;
    }

    return mapMagazineArticlesPage(response.data.data);
  } catch {
    return EMPTY_ARTICLES;
  }
}

export const getMagazineArticleBySlug = cache(
  async function getMagazineArticleBySlug(
    slug: string,
  ): Promise<MagazineArticleDetail | null> {
    const safeSlug = slug.trim();
    if (!safeSlug || safeSlug.includes("/") || safeSlug.includes("..")) {
      return null;
    }

    try {
      const response = await proxyToBackend<ApiResponse<unknown>>({
        method: "GET",
        path: `/api/v1/magazine/articles/${encodeURIComponent(safeSlug)}`,
        cache: "no-store",
        timeout: 10_000,
        retries: 0,
      });



      if (response.status === 404 || !response.ok || !isSuccess(response.data)) {
        console.warn("[magazine] getMagazineArticleBySlug", {
          slug: safeSlug,
          status: response.status,
          ok: response.ok,
        });
        return null;
      }

      const payload = response.data.data;
      const extraCatalog = await resolveMissingContentProducts(payload);
      const categoryLinks = await resolveContentCategories(payload);
      const article = mapMagazineArticleDetail(
        payload,
        extraCatalog,
        categoryLinks,
      );
      const mappedTypes: Record<string, number> = {};
      for (const block of article?.content ?? []) {
        mappedTypes[block.type] = (mappedTypes[block.type] || 0) + 1;
      }

      console.info("[magazine] getMagazineArticleBySlug", {
        slug: safeSlug,
        incomingContentTypes: summarizeMagazineContentTypes(payload),
        mappedContentTypes: mappedTypes,
        extraProductsFetched: extraCatalog.length,
        relatedProducts: article?.relatedProducts.length ?? 0,
      });

      if (!article) {
        console.warn(
          `[magazine] article mapper returned null for slug="${safeSlug}"`,
        );
      }
      return article;
    } catch (error) {
      console.warn(
        `[magazine] getMagazineArticleBySlug failed slug="${safeSlug}"`,
        error,
      );
      return null;
    }
  },
);
