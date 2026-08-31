import ArticleGrid from "./ArticleGrid";
import BuyingGuides from "./BuyingGuides";
import FeaturedArticles from "./FeaturedArticles";
import PopularArticles from "./PopularArticles";
import VideoArticles from "./VideoArticles";
import { getBlogHomeHref } from "./blogHomeUtils";

export default function MagazineSections({ sections = [] }) {
  return sections.map((section) => {
    const viewAllHref = section.categorySlug
      ? getBlogHomeHref({ category: section.categorySlug })
      : undefined;

    if (section.layout === "featured") {
      return (
        <FeaturedArticles
          key={section.key}
          posts={section.posts}
          title={section.title}
          description={section.subtitle}
        />
      );
    }

    if (section.layout === "video") {
      return (
        <VideoArticles
          key={section.key}
          posts={section.posts}
          title={section.title}
          description={section.subtitle}
        />
      );
    }

    if (section.sectionType === "buyingGuides") {
      return (
        <BuyingGuides
          key={section.key}
          posts={section.posts}
          title={section.title}
          description={section.subtitle}
        />
      );
    }

    if (
      section.layout === "compact" &&
      (section.sectionType === "popular" ||
        section.sectionType === "recommended")
    ) {
      return (
        <PopularArticles
          key={section.key}
          posts={section.posts}
          title={section.title}
          description={section.subtitle}
        />
      );
    }

    if (section.layout === "compact") {
      return (
        <BuyingGuides
          key={section.key}
          posts={section.posts}
          title={section.title}
          description={section.subtitle}
        />
      );
    }

    return (
      <ArticleGrid
        key={section.key}
        posts={section.posts}
        title={section.title}
        viewAllHref={viewAllHref}
        showViewAll={Boolean(viewAllHref)}
      />
    );
  });
}
