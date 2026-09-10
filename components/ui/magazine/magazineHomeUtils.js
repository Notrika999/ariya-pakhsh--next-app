export const MAGAZINE_ARTICLE_TYPES = [
  "standard",
  "buyingGuide",
  "howTo",
  "review",
  "comparison",
  "video",
  "news",
];

const CATEGORY_SLUG_TO_ARTICLE_TYPE = {
  "buying-guide": "buyingGuide",
  "how-to": "howTo",
  video: "video",
  "news-technology": "news",
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function getPostHref(post) {
  if (post?.href) return post.href;
  if (post?.slug) return `/mag/${encodeURIComponent(post.slug)}`;
  return "/mag";
}

export function getPostImage(post) {
  return post?.image || "/images/default.png";
}

export function getPostKey(post, fallback = "post") {
  return post?.slug || fallback;
}

export function normalizeCategory(category, categories = []) {
  if (!category || category === "all") return "all";
  return categories.some((item) => item.slug === category) ? category : "all";
}

export function normalizeArticleType(value) {
  if (!value || typeof value !== "string") return "";
  return MAGAZINE_ARTICLE_TYPES.includes(value) ? value : "";
}

export function normalizeVehicleId(value) {
  if (!value || typeof value !== "string") return "";
  return UUID_PATTERN.test(value.trim()) ? value.trim() : "";
}

export function parsePositiveInt(value, fallback, max) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return max ? Math.min(parsed, max) : parsed;
}

export function getArticleTypeForCategory(category) {
  if (!category || category === "all") return "";
  return CATEGORY_SLUG_TO_ARTICLE_TYPE[category] ?? "";
}

function getSearchValue(value) {
  if (Array.isArray(value)) return value[0] ?? "";
  return typeof value === "string" ? value : "";
}

export function parseMagazineHomeSearchParams(searchParams) {
  const resolved = searchParams ?? {};

  return {
    query: getSearchValue(resolved.q),
    tag: getSearchValue(resolved.tag),
    vehicle: getSearchValue(resolved.vehicle),
    sort: getSearchValue(resolved.sort) || "latest",
    requestedCategory: getSearchValue(resolved.category) || "all",
    requestedArticleType: normalizeArticleType(
      getSearchValue(resolved.articleType),
    ),
    page: parsePositiveInt(resolved.page, 1),
    pageSize: parsePositiveInt(resolved.pageSize, 12, 48),
    showAllArticles: getSearchValue(resolved.list) === "1",
  };
}

export function getMagazineQueryPageSeo({
  category = "all",
  query = "",
  tag = "",
  vehicle = "",
  articleType = "",
  showAllArticles = false,
  page = 1,
  sort = "latest",
} = {}) {
  const isSearch = Boolean(String(query).trim());
  const isTag = Boolean(String(tag).trim());
  const isInternalFilter =
    Boolean(String(vehicle).trim()) ||
    Boolean(articleType) ||
    Boolean(showAllArticles) ||
    (sort && sort !== "latest") ||
    (page > 1 && category === "all");

  if (isSearch || isTag || isInternalFilter) {
    return { index: false, follow: true };
  }

  return { index: true, follow: true };
}

export function getBlogHomeHref({
  category = "all",
  q = "",
  articleType = "",
  tag = "",
  vehicle = "",
  sort = "",
  list = false,
  page = 1,
  pageSize,
} = {}) {
  const params = new URLSearchParams();
  const query = q.trim();
  const mappedType = getArticleTypeForCategory(category);
  const nextType = normalizeArticleType(articleType);

  if (category && category !== "all") {
    params.set("category", category);
  }

  if (nextType && nextType !== mappedType) {
    params.set("articleType", nextType);
  }

  if (tag.trim()) {
    params.set("tag", tag.trim());
  }

  if (vehicle.trim()) {
    params.set("vehicle", vehicle.trim());
  }

  if (query) {
    params.set("q", query);
  }

  if (sort.trim() && sort.trim() !== "latest") {
    params.set("sort", sort.trim());
  }

  if (list) {
    params.set("list", "1");
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  if (pageSize && pageSize !== 12) {
    params.set("pageSize", String(pageSize));
  }

  const search = params.toString();
  return search ? `/mag?${search}` : "/mag";
}

export function getCategoryLabel(category, categories = []) {
  if (!category || category === "all") return "آخرین مقالات";
  return (
    categories.find((item) => item.slug === category)?.title ?? "آخرین مقالات"
  );
}

export function resolveMagazineArticleParams({
  category = "all",
  articleType = "",
  tag = "",
  vehicle = "",
  search = "",
  page = 1,
  pageSize = 12,
  sort = "latest",
} = {}) {
  const mappedType = getArticleTypeForCategory(category);
  const nextType = normalizeArticleType(articleType) || mappedType;
  const nextCategory =
    category && category !== "all" && !mappedType ? category : "";

  return {
    category: nextCategory || undefined,
    articleType: nextType || undefined,
    tag: tag.trim() || undefined,
    vehicle: normalizeVehicleId(vehicle) || undefined,
    search: search.trim() || undefined,
    page: parsePositiveInt(page, 1),
    pageSize: parsePositiveInt(pageSize, 12, 48),
    sort: sort.trim() || "latest",
  };
}
