export function getArticleHref(article) {
  return article?.href || (article?.slug ? `/mag/${article.slug}` : "/mag");
}

export function getArticleImage(article) {
  return article?.image || "/images/default.png";
}

export function getArticleKey(article, fallback = "article") {
  return article?.slug || fallback;
}
