import { getBlogHref } from "./blogData";

export const BLOG_CATEGORIES = [
  { id: "all", label: "همه" },
  { id: "buying-guide", label: "راهنمای خرید" },
  { id: "education", label: "آموزش خودرو" },
  { id: "lighting", label: "روشنایی خودرو" },
  { id: "interior", label: "داخل خودرو" },
  { id: "equipment", label: "تجهیزات و لوازم کاربردی" },
  { id: "safety", label: "امنیت و مراقبت" },
];

const BUYING_GUIDE_SLUGS = [
  "car-charger",
  "car-headlight",
  "car-floor-mat",
  "steering-wheel-cover",
  "car-monitor-glass",
];

const INTERIOR_SLUGS = [
  "key-cover",
  "car-monitor-glass",
  "trunk-mat",
  "car-trunk-liner",
  "car-floor-mat",
  "car-seat-cover",
  "steering-wheel-cover",
];

const EQUIPMENT_SLUGS = [
  "car-charger",
  "key-cover",
  "car-monitor-glass",
  "trunk-mat",
  "car-trunk-liner",
];

export function getPostHref(post) {
  return post.href ?? getBlogHref(post);
}

export function getPostImage(post) {
  return post.image || "/images/default.png";
}

export function normalizeCategory(category) {
  if (!category || category === "all") return "all";
  return BLOG_CATEGORIES.some((item) => item.id === category)
    ? category
    : "all";
}

export function getBlogHomeHref({ category = "all", q = "" } = {}) {
  const params = new URLSearchParams();
  const normalizedCategory = normalizeCategory(category);
  const query = q.trim();

  if (normalizedCategory !== "all") {
    params.set("category", normalizedCategory);
  }

  if (query) {
    params.set("q", query);
  }

  const search = params.toString();
  return search ? `/blog?${search}` : "/blog";
}

export function getPostCategoryIds(post) {
  const ids = new Set();
  const keyword = post.keyword ?? "";
  const title = post.title ?? "";

  if (title.includes("راهنمای") || BUYING_GUIDE_SLUGS.includes(post.slug)) {
    ids.add("buying-guide");
  }

  if (
    title.includes("چیست") ||
    title.includes("چرا") ||
    title.includes("اهمیت")
  ) {
    ids.add("education");
  }

  if (keyword.includes("هدلایت") || keyword.includes("چراغ")) {
    ids.add("lighting");
  }

  if (INTERIOR_SLUGS.includes(post.slug)) {
    ids.add("interior");
  }

  if (EQUIPMENT_SLUGS.includes(post.slug)) {
    ids.add("equipment");
  }

  if (
    title.includes("ایمنی") ||
    title.includes("محافظ") ||
    post.slug === "rear-car-lamp" ||
    post.slug === "key-cover"
  ) {
    ids.add("safety");
  }

  return ids;
}

export function filterPosts(posts, { query = "", category = "all" } = {}) {
  const normalizedCategory = normalizeCategory(category);
  const normalizedQuery = query.trim();

  return posts.filter((post) => {
    const matchesCategory =
      normalizedCategory === "all" ||
      getPostCategoryIds(post).has(normalizedCategory);

    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;

    const haystack = `${post.title} ${post.description} ${post.keyword}`;
    return haystack.includes(normalizedQuery);
  });
}

export function getFeaturedPosts(posts) {
  return posts.slice(0, 3);
}

export function getLatestPosts(posts, featuredPosts = []) {
  const featuredIds = new Set(featuredPosts.map((post) => post.id));
  return posts.filter((post) => !featuredIds.has(post.id));
}

export function getBuyingGuidePosts(posts) {
  return BUYING_GUIDE_SLUGS.map((slug) =>
    posts.find((post) => post.slug === slug),
  ).filter(Boolean);
}

export function getVideoPosts(posts) {
  return posts.slice(5, 9);
}

export function getPopularPosts(posts) {
  return posts.slice(-4);
}
