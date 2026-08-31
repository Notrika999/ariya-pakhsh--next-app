export const MAGAZINE_ARTICLE_TYPES = [
  "standard",
  "buyingGuide",
  "howTo",
  "review",
  "comparison",
  "video",
  "news",
] as const;

export type MagazineArticleType = (typeof MAGAZINE_ARTICLE_TYPES)[number];

export type MagazineSectionType =
  | "featured"
  | "latest"
  | "popular"
  | "recommended"
  | "categoryArticles"
  | "videoArticles"
  | "compactArticles"
  | "vehicleArticles"
  | "buyingGuides"
  | "reviews"
  | "comparisons"
  | string;

export type MagazineDisplayVariant =
  | "heroGrid"
  | "largeWithSmallCards"
  | "grid3"
  | "grid4"
  | "compactList"
  | "videoGrid"
  | "featuredVideo"
  | string;

export type MagazineSectionLayout =
  | "featured"
  | "grid"
  | "compact"
  | "video";

export interface MagazineCategory {
  title: string;
  slug: string;
}

export interface MagazinePost {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  categorySlug: string;
  image: string;
  imageAlt: string;
  authorName: string;
  date: string;
  readTime: string;
  href: string;
  articleType: string | null;
}

export interface MagazineHomeSection {
  key: string;
  title: string;
  subtitle: string;
  sectionType: MagazineSectionType | null;
  layout: MagazineSectionLayout;
  categorySlug: string | null;
  posts: MagazinePost[];
}

export interface MagazineHomeData {
  categories: MagazineCategory[];
  sections: MagazineHomeSection[];
}

export interface MagazineArticlesPage {
  items: MagazinePost[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetMagazineArticlesParams {
  category?: string;
  articleType?: MagazineArticleType | string;
  tag?: string;
  vehicle?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export const MAGAZINE_ARTICLE_TYPE_LABELS: Record<string, string> = {
  standard: "مقاله",
  buyingGuide: "راهنمای خرید",
  howTo: "آموزش",
  review: "بررسی",
  comparison: "مقایسه",
  video: "ویدئو",
  news: "اخبار",
};

export interface MagazineAuthor {
  displayName: string;
  slug: string;
  jobTitle: string;
  avatar: string;
}

export interface MagazineTag {
  name: string;
  slug: string;
}

export interface MagazineTocItem {
  title: string;
  anchor: string;
  level: number;
}

export interface MagazineTableCell {
  text: string;
  bold: boolean;
  colspan: number;
  rowspan: number;
  align: "start" | "center" | "end";
}

export interface MagazineTableRow {
  cells: MagazineTableCell[];
}

export type MagazineContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level: 2 | 3 | 4; anchor: string }
  | { type: "image"; src: string; alt: string; caption: string }
  | { type: "table"; rows: MagazineTableRow[] }
  | { type: "infoBox"; text: string }
  | { type: "list"; style: "bullet" | "number"; items: string[] }
  | { type: "cta"; label: string; href: string; external: boolean }
  | { type: "faqGroup"; items: { question: string; answer: string }[] }
  | {
      type: "product";
      product: MagazineRelatedProduct;
      text: string;
    }
  | {
      type: "productCollection";
      title: string;
      href: string;
      products: MagazineRelatedProduct[];
    };

export const MAGAZINE_ANALYTICS_EVENT_TYPES = [
  "articleViewed",
  "article25PercentRead",
  "article50PercentRead",
  "article75PercentRead",
  "articleCompleted",
  "productClickedFromArticle",
] as const;

export type MagazineAnalyticsEventType =
  (typeof MAGAZINE_ANALYTICS_EVENT_TYPES)[number];

export interface MagazineRelatedProduct {
  productId: string;
  title: string;
  slug: string;
  publicCode: string;
  href: string;
  price: number;
  compareAtPrice: number | null;
  isInStock: boolean;
  image: string;
}

export interface MagazineArticleSeo {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: { index: boolean; follow: boolean };
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export interface MagazineArticleDetail {
  articleId: string;
  slug: string;
  title: string;
  excerpt: string;
  articleType: string | null;
  articleTypeLabel: string;
  featuredImage: string;
  featuredImageAlt: string;
  category: MagazineCategory | null;
  author: MagazineAuthor | null;
  publishedAt: string;
  publishedAtIso: string;
  updatedAt: string;
  updatedAtIso: string;
  readingTime: string;
  tableOfContents: MagazineTocItem[];
  content: MagazineContentBlock[];
  tags: MagazineTag[];
  relatedProducts: MagazineRelatedProduct[];
  relatedArticles: MagazinePost[];
  faqs: { question: string; answer: string }[];
  seo: MagazineArticleSeo;
  structuredData: Record<string, unknown>[];
}
