import BlogHero from "./BlogHero";
import BlogSearch from "./BlogSearch";
import BlogCategories from "./BlogCategories";
import FeaturedArticles from "./FeaturedArticles";
import ArticleGrid from "./ArticleGrid";
import BuyingGuides from "./BuyingGuides";
import VideoArticles from "./VideoArticles";
import PopularArticles from "./PopularArticles";
import { blogPosts } from "./blogData";
import {
  BLOG_CATEGORIES,
  filterPosts,
  getBuyingGuidePosts,
  getFeaturedPosts,
  getLatestPosts,
  getPopularPosts,
  getVideoPosts,
  normalizeCategory,
} from "./blogHomeUtils";
import styles from "./blogHome.module.css";

export default function Blog({ query = "", category = "all" }) {
  const activeCategory = normalizeCategory(category);
  const searchQuery = query.trim();
  const isDefaultView = activeCategory === "all" && !searchQuery;
  const filteredPosts = filterPosts(blogPosts, {
    query: searchQuery,
    category: activeCategory,
  });

  const sourcePosts = isDefaultView ? blogPosts : filteredPosts;
  const useFeaturedLayout = isDefaultView || sourcePosts.length >= 3;
  const featuredPosts = useFeaturedLayout
    ? getFeaturedPosts(sourcePosts)
    : [];
  const latestPosts = useFeaturedLayout
    ? getLatestPosts(sourcePosts, featuredPosts)
    : sourcePosts;

  const latestTitle = searchQuery
    ? "نتایج جستجو"
    : activeCategory === "all"
      ? "آخرین مقالات"
      : (BLOG_CATEGORIES.find((item) => item.id === activeCategory)?.label ??
        "آخرین مقالات");

  return (
    <div className={styles.blogHome}>
      <div className={styles.container}>
        <BlogHero />
        <BlogSearch query={searchQuery} category={activeCategory} />
        <BlogCategories
          activeCategory={activeCategory}
          query={searchQuery}
        />

        {featuredPosts.length ? (
          <FeaturedArticles posts={featuredPosts} />
        ) : null}

        {latestPosts.length || !featuredPosts.length ? (
          <ArticleGrid
            posts={latestPosts}
            title={latestTitle}
            viewAllHref={isDefaultView ? "#latest-articles" : undefined}
            showViewAll
          />
        ) : null}

        {isDefaultView ? (
          <>
            <BuyingGuides posts={getBuyingGuidePosts(blogPosts)} />
            <VideoArticles posts={getVideoPosts(blogPosts)} />
            <PopularArticles posts={getPopularPosts(blogPosts)} />
          </>
        ) : null}
      </div>
    </div>
  );
}
