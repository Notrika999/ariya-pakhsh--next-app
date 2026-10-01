import type { CanonicalDisplayVariant } from "@/src/lib/magazine/section-config";
import { resolveDisplayVariant } from "@/src/lib/magazine/section-config";
import type { MagazineHomeSection } from "@/src/lib/types/magazine/magazine.types";
import {
  composeMagazineArticles,
  getSectionViewAllHref,
} from "../magazineView";
import MagazineSection from "./MagazineSection";
import {
  CompactArticleList,
  FeaturedVideo,
  FourColumnArticleGrid,
  HeroGrid,
  LargeWithSmallCards,
  ThreeColumnArticleGrid,
  VideoGrid,
} from "./sectionLayouts";

type LayoutComponent = typeof HeroGrid;

const DISPLAY_VARIANT_REGISTRY: Record<CanonicalDisplayVariant, LayoutComponent> =
  {
    heroGrid: HeroGrid,
    largeWithSmallCards: LargeWithSmallCards,
    threeColumnGrid: ThreeColumnArticleGrid,
    fourColumnGrid: FourColumnArticleGrid,
    compactList: CompactArticleList,
    videoGrid: VideoGrid,
    featuredVideo: FeaturedVideo,
  };

type SectionRendererProps = {
  section: MagazineHomeSection;
  priority?: boolean;
};

export default function SectionRenderer({
  section,
  priority = false,
}: SectionRendererProps) {
  const articles = composeMagazineArticles(section.posts);
  if (!articles.length) return null;

  const variant = resolveDisplayVariant(
    section.displayVariant,
    section.sectionType,
  );
  const Layout = DISPLAY_VARIANT_REGISTRY[variant] ?? ThreeColumnArticleGrid;
  const titleId = `magazine-section-${section.key}`;
  const href = getSectionViewAllHref(section);
<<<<<<< HEAD
  const categorySlug = section.categorySlug || section.filters?.category || null;
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

  return (
    <MagazineSection
      title={section.title}
      subtitle={section.subtitle}
      titleId={titleId}
      href={href}
<<<<<<< HEAD
      sectionType={section.sectionType}
      categorySlug={categorySlug}
    >
      <Layout
        articles={articles}
        titleAs="h3"
        priority={priority}
        sectionType={section.sectionType ?? undefined}
      />
=======
    >
      <Layout articles={articles} titleAs="h3" priority={priority} />
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    </MagazineSection>
  );
}
