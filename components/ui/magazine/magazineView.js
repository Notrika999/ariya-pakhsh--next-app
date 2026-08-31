export function toMagazineArticle(post) {
  if (!post) return null;

  const slug = post.slug;
  const title = post.title;
  if (!slug || !title) return null;

  return {
    slug,
    title,
    excerpt: post.excerpt || post.description || "",
    image: post.image || "/images/default.png",
    imageAlt: post.imageAlt || title,
    category: post.category || post.keyword || "",
    categorySlug: post.categorySlug || "",
    author: post.author || post.authorName || "",
    publishedAt: post.publishedAt || post.date || "",
    readingTime: post.readingTime || post.readTime || "",
    views: post.views || "",
    href: post.href || `/mag/${encodeURIComponent(slug)}`,
    featured: Boolean(post.featured),
    articleType: post.articleType || null,
  };
}

function uniqueBySlug(articles) {
  const seen = new Set();
  return articles.filter((article) => {
    if (!article?.slug || seen.has(article.slug)) return false;
    seen.add(article.slug);
    return true;
  });
}

export function composeMagazineArticles(apiPosts = []) {
  return uniqueBySlug(apiPosts.map(toMagazineArticle).filter(Boolean));
}

export function composeMagazineCategories(apiCategories = []) {
  return apiCategories.filter((item) => item.slug && item.title);
}

function take(articles, start, count) {
  if (!articles.length) return [];
  return articles.slice(start, start + count);
}

function articlesFromSection(sections, sectionType) {
  const section = sections.find((item) => item.sectionType === sectionType);
  if (!section?.posts?.length) return [];
  return composeMagazineArticles(section.posts);
}

export function buildMagazineHomeModel({
  apiPosts = [],
  apiCategories = [],
  apiSections = [],
} = {}) {
  const articles = composeMagazineArticles(apiPosts);
  const categories = composeMagazineCategories(apiCategories);
  const featured = articlesFromSection(apiSections, "featured");
  const latestFromApi = articlesFromSection(apiSections, "latest");
  const popularFromApi = articlesFromSection(apiSections, "popular");

  const heroSource = featured.length ? featured : articles;
  const heroMain = heroSource[0] ?? null;
  const heroSide = take(heroSource, 1, 4);
  const latest = latestFromApi.length ? take(latestFromApi, 0, 5) : take(articles, 0, 5);
  const editorialCandidate = featured[1] ?? articles[1] ?? null;
  const editorial =
    editorialCandidate && editorialCandidate.slug !== heroMain?.slug
      ? editorialCandidate
      : null;
  const heroSlugs = new Set(
    [heroMain, ...heroSide].filter(Boolean).map((item) => item.slug),
  );
  const remaining = articles.filter((item) => !heroSlugs.has(item.slug));
  const grid = take(remaining.length ? remaining : articles, 0, 9);
  const popular = popularFromApi.length
    ? take(popularFromApi, 0, 5)
    : take(articles, 0, 5);
  const newest = take(articles, 0, 6);

  const categorySectionsFromApi = apiSections
    .filter((section) => section.sectionType === "categoryArticles" && section.categorySlug)
    .map((section) => ({
      title: section.title,
      slug: section.categorySlug,
      articles: take(composeMagazineArticles(section.posts), 0, 4),
    }))
    .filter((section) => section.articles.length);

  const categorySections = categorySectionsFromApi.length
    ? categorySectionsFromApi
    : categories
        .map((category) => ({
          title: category.title,
          slug: category.slug,
          articles: articles
            .filter((item) => item.categorySlug === category.slug)
            .slice(0, 4),
        }))
        .filter((section) => section.articles.length >= 2)
        .slice(0, 6);

  return {
    categories,
    heroMain,
    heroSide,
    latest,
    editorial,
    grid,
    popular,
    newest,
    categorySections,
  };
}
