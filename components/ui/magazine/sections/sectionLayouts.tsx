import ArticleCard from "../ArticleCard";
import ArticleGrid from "../ArticleGrid";
import MagazineHero from "../MagazineHero";
import SidebarArticleList from "../SidebarArticleList";
import { getArticleKey } from "../magazineUtils";

type LayoutProps = {
  articles: Array<Record<string, unknown>>;
  titleAs?: "h2" | "h3";
  priority?: boolean;
<<<<<<< HEAD
  sectionType?: string;
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
};

export function HeroGrid({ articles, titleAs = "h3", priority = false }: LayoutProps) {
  const [main, ...rest] = articles;
  return (
    <MagazineHero
      main={main}
      articles={rest}
      titleAs={titleAs}
      priority={priority}
    />
  );
}

export function LargeWithSmallCards({
  articles,
  titleAs = "h3",
  priority = false,
}: LayoutProps) {
  const [main, ...rest] = articles;

  if (!rest.length) {
    return (
      <ArticleCard
        article={main}
        variant="editorial"
        priority={priority}
        titleAs={titleAs}
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-7">
        <ArticleCard
          article={main}
          variant="editorial"
          priority={priority}
          titleAs={titleAs}
        />
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
        {rest.map((article) => (
          <ArticleCard
            key={getArticleKey(article)}
            article={article}
            variant="compact"
            titleAs={titleAs}
          />
        ))}
      </div>
    </div>
  );
}

export function ThreeColumnArticleGrid({ articles, titleAs = "h3" }: LayoutProps) {
  return (
    <ArticleGrid articles={articles} columns={3} titleAs={titleAs} />
  );
}

export function FourColumnArticleGrid({ articles, titleAs = "h3" }: LayoutProps) {
  return (
    <ArticleGrid articles={articles} columns={4} titleAs={titleAs} />
  );
}

<<<<<<< HEAD
export function CompactArticleList({
  articles,
  titleAs = "h3",
  sectionType,
}: LayoutProps) {
  return (
    <SidebarArticleList
      articles={articles}
      titleAs={titleAs}
      showRank={sectionType === "popular"}
    />
  );
=======
export function CompactArticleList({ articles, titleAs = "h3" }: LayoutProps) {
  return <SidebarArticleList articles={articles} titleAs={titleAs} />;
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
}

export function VideoGrid({ articles, titleAs = "h3" }: LayoutProps) {
  return (
    <ArticleGrid
      articles={articles}
      columns={4}
      cardVariant="video"
      titleAs={titleAs}
    />
  );
}

export function FeaturedVideo({
  articles,
  titleAs = "h3",
  priority = false,
}: LayoutProps) {
  const [main, ...rest] = articles;

  if (!rest.length) {
    return (
      <ArticleCard
        article={main}
        variant="featuredVideo"
        priority={priority}
        titleAs={titleAs}
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-7">
        <ArticleCard
          article={main}
          variant="featuredVideo"
          priority={priority}
          titleAs={titleAs}
        />
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-5">
        {rest.map((article) => (
          <ArticleCard
            key={getArticleKey(article)}
            article={article}
            variant="video"
            titleAs={titleAs}
          />
        ))}
      </div>
    </div>
  );
}
