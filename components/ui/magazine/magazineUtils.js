export function getArticleHref(article) {
  return article?.href || (article?.slug ? `/mag/${article.slug}` : "/mag");
}

export function getArticleImage(article, { preferThumbnail = false } = {}) {
  if (preferThumbnail) {
    return article?.thumbnail || article?.image || "/images/default.png";
  }

  return article?.image || article?.thumbnail || "/images/default.png";
}

export function getArticleKey(article, fallback = "article") {
  return article?.id || article?.slug || fallback;
}

