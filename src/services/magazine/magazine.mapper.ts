import {
  layoutFromDisplayVariant,
  normalizeSectionSource,
  normalizeSectionType,
  resolveDisplayVariant,
} from "@/src/lib/magazine/section-config";
import { SITE_URL } from "@/src/lib/seo/site";
import { getProductImage } from "@/src/utils/product-image";
import type {
  MagazineArticleDetail,
  MagazineArticleSeo,
  MagazineArticlesPage,
  MagazineAuthor,
  MagazineCategory,
  MagazineContentBlock,
  MagazineHomeData,
  MagazineHomeSection,
  MagazineInlineNode,
  MagazineInlineStyle,
  MagazinePost,
  MagazineRelatedProduct,
  MagazineSectionFilters,
  MagazineTableCell,
  MagazineTableRow,
  MagazineTag,
  MagazineTocItem,
} from "@/src/lib/types/magazine/magazine.types";
import { MAGAZINE_ARTICLE_TYPE_LABELS } from "@/src/lib/types/magazine/magazine.types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** CMS sometimes stores the same heading twice: "عنوان عنوان". */
function collapseRepeatedTitle(title: string): string {
  const value = title.replace(/\s+/g, " ").trim();
  if (!value) return "";

  const spaced = value.match(/^(.+?)\s+\1$/u);
  if (spaced?.[1]) return spaced[1].trim();

  if (value.length >= 4 && value.length % 2 === 0) {
    const half = value.slice(0, value.length / 2);
    if (half && half === value.slice(value.length / 2)) return half.trim();
  }

  return value;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function asBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") return true;
    if (normalized === "false" || normalized === "0") return false;
  }
  return null;
}

function formatArticleDate(value: unknown): string {
  const raw = asString(value);
  if (!raw) return "";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatReadTime(value: unknown): string {
  const minutes = asNumber(value);
  if (!minutes || minutes <= 0) return "";
  return `${new Intl.NumberFormat("fa-IR").format(minutes)} دقیقه مطالعه`;
}

function resolveImage(
  value: unknown,
  prefer: "url" | "thumbnail" = "url",
): string {
  if (typeof value === "string") {
    return getProductImage(value);
  }

  if (!isRecord(value)) {
    return getProductImage();
  }

  const url = asString(value.url) || asString(value.path);
  const thumbnail =
    asString(value.thumbnailUrl) ||
    asString(value.cardUrl) ||
    asString(value.thumbUrl);

  if (prefer === "thumbnail") {
    return getProductImage(thumbnail || url || null);
  }

  return getProductImage(url || thumbnail || null);
}

function unwrapArticle(value: unknown): Record<string, unknown> | null {
  if (!isRecord(value)) return null;

  if (asString(value.slug) && asString(value.title)) {
    return value;
  }

  if (isRecord(value.article)) {
    return unwrapArticle(value.article);
  }

  if (isRecord(value.item)) {
    return unwrapArticle(value.item);
  }

  return null;
}

export function mapMagazineCategory(value: unknown): MagazineCategory | null {
  if (!isRecord(value)) return null;

  const slug = asString(value.slug);
  const title = asString(value.title) || asString(value.name);

  if (!slug || !title) return null;

  const id = asString(value.id);

  return id ? { id, slug, title } : { slug, title };
}

export function mapMagazinePost(value: unknown): MagazinePost | null {
  const article = unwrapArticle(value);
  if (!article) return null;

  const slug = asString(article.slug);
  const title = asString(article.title);
  if (!slug || !title) return null;

  const category = isRecord(article.category) ? article.category : null;
  const categoryTitle =
    asString(category?.title) ||
    asString(category?.name) ||
    asString(article.keyword);
  const categorySlug = asString(category?.slug);
  const featuredImage =
    article.featuredImage ?? article.image ?? article.coverImage;
  const imageAlt = isRecord(featuredImage) ? asString(featuredImage.alt) : "";
  const author = isRecord(article.author) ? article.author : null;
  const excerpt = asString(article.excerpt) || asString(article.description);
  const image = resolveImage(featuredImage, "url");
  const thumbnail = resolveImage(featuredImage, "thumbnail");
  const authorName =
    asString(article.authorName) ||
    (author ? asString(author.displayName) : "");
  const date = formatArticleDate(article.publishedAt ?? article.date);
  const readTime = formatReadTime(
    article.readingTimeMinutes ?? article.readTimeMinutes,
  );
  const articleId = asString(article.id);

  return {
    ...(articleId ? { id: articleId } : {}),
    slug,
    title,
    description: excerpt,
    excerpt,
    keyword: categoryTitle,
    category: categoryTitle,
    categorySlug,
    image,
    thumbnail,
    imageAlt: imageAlt || title,
    authorName,
    author: authorName,
    date,
    publishedAt: date,
    readTime,
    readingTime: readTime,
    href: `/mag/${encodeURIComponent(slug)}`,
    articleType: asString(article.articleType) || null,
  };
}

function readActiveFlag(section: Record<string, unknown>): boolean | null {
  if ("isActive" in section) return asBoolean(section.isActive);
  if ("active" in section) return asBoolean(section.active);
  if ("isEnabled" in section) return asBoolean(section.isEnabled);
  if ("enabled" in section) return asBoolean(section.enabled);
  return null;
}

function mapSectionFilters(
  section: Record<string, unknown>,
): MagazineSectionFilters {
  const filters = isRecord(section.filters) ? section.filters : {};
  const category =
    asString(filters.category) ||
    asString(section.categorySlug) ||
    asString(isRecord(section.category) ? section.category.slug : "");
  const articleType =
    asString(filters.articleType) || asString(section.articleType);
  const tag = asString(filters.tag) || asString(section.tag);
  const car =
    asString(filters.car) ||
    asString(filters.vehicle) ||
    asString(section.vehicle) ||
    asString(section.car);
  const startAt =
    asString(filters.startAt) ||
    asString(section.startAt) ||
    asString(section.startDate);
  const endAt =
    asString(filters.endAt) ||
    asString(section.endAt) ||
    asString(section.endDate);

  return {
    ...(category ? { category } : {}),
    ...(articleType ? { articleType } : {}),
    ...(tag ? { tag } : {}),
    ...(car ? { car } : {}),
    ...(startAt ? { startAt } : {}),
    ...(endAt ? { endAt } : {}),
  };
}

function getSectionArticles(section: Record<string, unknown>): MagazinePost[] {
  const candidates = [
    section.articles,
    section.items,
    section.posts,
    isRecord(section.data) ? section.data.articles : undefined,
    isRecord(section.data) ? section.data.items : undefined,
  ];

  for (const candidate of candidates) {
    if (!Array.isArray(candidate) || candidate.length === 0) continue;

    const posts = candidate
      .map(mapMagazinePost)
      .filter((post): post is MagazinePost => Boolean(post));

    if (posts.length) return posts;
  }

  return [];
}

export function mapMagazineHomeSection(
  value: unknown,
  index: number,
): MagazineHomeSection | null {
  if (!isRecord(value)) return null;

  const active = readActiveFlag(value);
  if (active === false) return null;

  const rawSectionType = asString(value.sectionType) || asString(value.type);
  const sectionType = normalizeSectionType(rawSectionType);
  const displayVariant = resolveDisplayVariant(
    asString(value.displayVariant) || asString(value.layout),
    rawSectionType,
  );
  const posts = getSectionArticles(value);

  if (!posts.length) return null;

  const maxArticles =
    asNumber(value.maxArticles) ??
    asNumber(value.maxCount) ??
    asNumber(value.limit);
  const limitedPosts =
    maxArticles && maxArticles > 0 ? posts.slice(0, maxArticles) : posts;

  if (!limitedPosts.length) return null;

  const title = asString(value.title) || asString(value.name);
  const category = mapMagazineCategory(
    value.category ??
      (asString(value.categorySlug)
        ? { slug: value.categorySlug, title: value.categoryTitle }
        : null),
  );
  const sectionId = asString(value.id);
  const order =
    asNumber(value.order) ?? asNumber(value.sortOrder) ?? asNumber(value.sort);
  const viewAllHref =
    asString(value.viewAllHref) ||
    asString(value.viewAllUrl) ||
    asString(value.seeAllUrl);

  return {
    ...(sectionId ? { id: sectionId } : {}),
    key: sectionId || `${sectionType || "section"}-${index}`,
    title,
    subtitle: asString(value.subtitle) || asString(value.description),
    sectionType,
    displayVariant,
    layout: layoutFromDisplayVariant(displayVariant),
    source: normalizeSectionSource(
      asString(value.source) || asString(value.contentSource),
    ),
    categorySlug:
      category?.slug ||
      asString(value.categorySlug) ||
      null,
    viewAllHref: viewAllHref || null,
    maxArticles,
    order,
    isActive: active ?? true,
    filters: mapSectionFilters(value),
    posts: limitedPosts,
  };
}

export function mapMagazineHome(value: unknown): MagazineHomeData {
  const data = isRecord(value) ? value : {};
  const mappedSections = Array.isArray(data.sections)
    ? data.sections
        .map(mapMagazineHomeSection)
        .filter((item): item is MagazineHomeSection => Boolean(item))
    : [];

  const hasExplicitOrder = mappedSections.some((section) => section.order != null);
  const sections = hasExplicitOrder
    ? [...mappedSections].sort(
        (left, right) => (left.order ?? Number.MAX_SAFE_INTEGER) -
          (right.order ?? Number.MAX_SAFE_INTEGER),
      )
    : mappedSections;

  return {
    categories: Array.isArray(data.categories)
      ? data.categories
          .map(mapMagazineCategory)
          .filter((item): item is MagazineCategory => Boolean(item))
      : [],
    sections,
  };
}

export function mapMagazineArticlesPage(value: unknown): MagazineArticlesPage {
  const data = isRecord(value) ? value : {};
  const items = Array.isArray(data.items) ? data.items : [];

  return {
    items: items
      .map(mapMagazinePost)
      .filter((item): item is MagazinePost => Boolean(item)),
    totalCount: asNumber(data.totalCount) ?? items.length,
    pageNumber: asNumber(data.pageNumber) ?? 1,
    pageSize: asNumber(data.pageSize) ?? items.length,
    totalPages: asNumber(data.totalPages) ?? 1,
    hasPreviousPage: Boolean(data.hasPreviousPage),
    hasNextPage: Boolean(data.hasNextPage),
  };
}

function asIsoDate(value: unknown): string {
  const raw = asString(value);
  if (!raw) return "";
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function parseRobots(value: unknown): { index: boolean; follow: boolean } {
  const raw = asString(value).toLowerCase();
  if (!raw) return { index: true, follow: true };

  const tokens = raw.split(/[,\s]+/).filter(Boolean);
  return {
    index: !tokens.includes("noindex"),
    follow: !tokens.includes("nofollow"),
  };
}

function isSameSiteHost(hostname: string): boolean {
  const siteHost = SITE_URL.replace(/^https?:\/\//, "")
    .split("/")[0]
    ?.toLowerCase();
  const host = hostname.toLowerCase().replace(/^www\./, "");
  const site = (siteHost || "carup24.com").replace(/^www\./, "");
  return host === site || host === "carup24.com" || host === "localhost";
}

function resolveCtaHref(href: string): { href: string; external: boolean } {
  if (!href) return { href: "/mag", external: false };
  if (href.startsWith("/")) return { href, external: false };

  try {
    const url = new URL(href);
    if (isSameSiteHost(url.hostname)) {
      return {
        href: `${url.pathname}${url.search}${url.hash}` || "/",
        external: false,
      };
    }
    return { href, external: true };
  } catch {
    return { href, external: true };
  }
}

function isSafeHref(href: string): boolean {
  const value = href.trim();
  if (!value) return false;
  if (value.startsWith("/")) return !value.startsWith("//");
  if (value.startsWith("#")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function mapInlineStyles(value: unknown): MagazineInlineStyle {
  const styles = isRecord(value) ? value : {};
  return {
    bold: Boolean(styles.bold),
    italic: Boolean(styles.italic),
    underline: Boolean(styles.underline),
    strike: Boolean(styles.strike) || Boolean(styles.strikethrough),
    code: Boolean(styles.code),
  };
}

function flattenInlineText(nodes: MagazineInlineNode[]): string {
  return nodes
    .map((node) =>
      node.type === "text" ? node.text : flattenInlineText(node.children),
    )
    .join("");
}

function mapInlineNodes(value: unknown): MagazineInlineNode[] {
  if (!Array.isArray(value)) return [];

  const nodes: MagazineInlineNode[] = [];
  for (const item of value) {
    if (!isRecord(item)) continue;
    const type = asString(item.type);

    if (type === "text") {
      const text = asString(item.text);
      if (text) {
        const previous = nodes[nodes.length - 1];
        if (previous?.type === "text" && previous.text === text) {
          continue;
        }
        nodes.push({
          type: "text",
          text,
          styles: mapInlineStyles(item.styles),
        });
      }
      continue;
    }

    if (type === "link") {
      const rawHref = asString(item.href) || asString(item.url);
      if (!isSafeHref(rawHref)) continue;
      const resolved = resolveCtaHref(rawHref);
      const children = mapInlineNodes(item.content ?? item.children);
      if (!children.length) continue;
      nodes.push({
        type: "link",
        href: resolved.href,
        external: resolved.external,
        children,
      });
    }
  }

  return nodes;
}

function mapRichText(data: Record<string, unknown>): {
  text: string;
  inline: MagazineInlineNode[];
} {
  const inline = mapInlineNodes(data.inlineContent ?? data.content);
  const text =
    collapseRepeatedTitle(asString(data.text)) ||
    collapseRepeatedTitle(flattenInlineText(inline));
  if (!inline.length && text) {
    return {
      text,
      inline: [
        {
          type: "text",
          text,
          styles: {
            bold: false,
            italic: false,
            underline: false,
            strike: false,
            code: false,
          },
        },
      ],
    };
  }
  return { text, inline };
}

function mapAuthor(value: unknown): MagazineAuthor | null {
  if (!isRecord(value)) return null;
  const displayName = asString(value.displayName) || asString(value.name);
  if (!displayName) return null;

  const avatarValue = value.avatar ?? value.image;
  const avatar = isRecord(avatarValue)
    ? resolveImage(avatarValue)
    : asString(avatarValue)
      ? getProductImage(asString(avatarValue))
      : "";

  return {
    displayName,
    slug: asString(value.slug),
    jobTitle: asString(value.jobTitle),
    avatar,
  };
}

function mapTag(value: unknown): MagazineTag | null {
  if (!isRecord(value)) return null;
  const name = asString(value.name) || asString(value.title);
  const slug = asString(value.slug);
  if (!name || !slug) return null;
  return { name, slug };
}

function mapTocItem(value: unknown): MagazineTocItem | null {
  if (!isRecord(value)) return null;
  const title = collapseRepeatedTitle(asString(value.title));
  const anchor = asString(value.anchor);
  if (!title || !anchor) return null;
  return {
    title,
    anchor,
    level: asNumber(value.level) ?? 2,
  };
}

function dedupeTocItems(items: MagazineTocItem[]): MagazineTocItem[] {
  const seenAnchors = new Set<string>();
  const result: MagazineTocItem[] = [];

  for (const item of items) {
    if (seenAnchors.has(item.anchor)) continue;
    seenAnchors.add(item.anchor);
    result.push(item);
  }

  return result;
}

function extractCellText(value: unknown): { text: string; bold: boolean } {
  if (typeof value === "string") {
    return { text: value.trim(), bold: false };
  }

  if (!Array.isArray(value)) {
    return { text: "", bold: false };
  }

  let text = "";
  let bold = false;

  for (const node of value) {
    if (!isRecord(node)) continue;
    const nodeText = asString(node.text);
    if (nodeText) {
      text += nodeText;
      if (isRecord(node.styles) && Boolean(node.styles.bold)) {
        bold = true;
      }
    }
    if (Array.isArray(node.content)) {
      const nested = extractCellText(node.content);
      text += nested.text;
      bold = bold || nested.bold;
    }
  }

  return { text: text.trim(), bold };
}

function mapTableAlign(value: unknown): MagazineTableCell["align"] {
  const align = asString(value).toLowerCase();
  if (align === "left" || align === "start") return "start";
  if (align === "right" || align === "end") return "end";
  return "center";
}

function mapTableCell(value: unknown): MagazineTableCell | null {
  if (!isRecord(value)) return null;
  const props = isRecord(value.props) ? value.props : {};
  const extracted = extractCellText(value.content ?? value.text);
  return {
    text: extracted.text,
    bold: extracted.bold,
    colspan: Math.max(1, asNumber(props.colspan) ?? 1),
    rowspan: Math.max(1, asNumber(props.rowspan) ?? 1),
    align: mapTableAlign(props.textAlignment),
  };
}

function mapTableRows(value: unknown): MagazineTableRow[] {
  if (!isRecord(value) || !Array.isArray(value.rows)) return [];

  return value.rows
    .map((row): MagazineTableRow | null => {
      if (!isRecord(row) || !Array.isArray(row.cells)) return null;
      const cells = row.cells
        .map(mapTableCell)
        .filter((cell): cell is MagazineTableCell => Boolean(cell));
      if (!cells.length) return null;
      return { cells };
    })
    .filter((row): row is MagazineTableRow => Boolean(row));
}

function headingLevel(value: unknown): 2 | 3 | 4 {
  const level = asNumber(value) ?? 2;
  if (level >= 4) return 4;
  if (level === 3) return 3;
  return 2;
}

function headingAnchor(
  blockId: string,
  text: string,
  toc: MagazineTocItem[],
): string {
  const sectionId = blockId ? `section-${blockId}` : "";
  const match = toc.find(
    (item) =>
      item.anchor === sectionId ||
      item.anchor === blockId ||
      item.title === text,
  );
  return match?.anchor || sectionId || "";
}

function mapContentBlocks(
  value: unknown,
  toc: MagazineTocItem[],
  catalog: MagazineRelatedProduct[] = [],
  categoryLinks: MagazineCategoryLink[] = [],
): MagazineContentBlock[] {
  if (!Array.isArray(value)) return [];

  const blocks: MagazineContentBlock[] = [];
  let index = 0;

  while (index < value.length) {
    const item = value[index];
    if (!isRecord(item)) {
      index += 1;
      continue;
    }

    const type = asString(item.type);
    const data = isRecord(item.data) ? item.data : {};
    const blockId = asString(item.id);

    if (type === "paragraph") {
      const rich = mapRichText(data);
      if (rich.text) blocks.push({ type: "paragraph", ...rich });
      index += 1;
      continue;
    }

    if (type === "heading") {
      const rich = mapRichText(data);
      if (rich.text) {
        blocks.push({
          type: "heading",
          ...rich,
          level: headingLevel(data.level),
          anchor: headingAnchor(blockId, rich.text, toc),
        });
      }
      index += 1;
      continue;
    }

    if (type === "image") {
      const src = resolveImage(data.url || data.src || data);
      const alt = asString(data.alt);
      const caption = asString(data.caption);
      if (src && src !== getProductImage()) {
        blocks.push({ type: "image", src, alt, caption });
      }
      index += 1;
      continue;
    }

    if (type === "table") {
      const rows = mapTableRows(data);
      if (rows.length) blocks.push({ type: "table", rows });
      index += 1;
      continue;
    }

    if (type === "infoBox" || type === "callout" || type === "note") {
      const rich = mapRichText(data);
      if (rich.text) blocks.push({ type: "infoBox", ...rich });
      index += 1;
      continue;
    }

    if (
      type === "bulletListItem" ||
      type === "numberedListItem" ||
      type === "orderedListItem"
    ) {
      const style = type === "bulletListItem" ? "bullet" : "number";
      const items: { text: string; inline: MagazineInlineNode[] }[] = [];
      while (index < value.length) {
        const current = value[index];
        if (!isRecord(current) || asString(current.type) !== type) break;
        const currentData = isRecord(current.data) ? current.data : {};
        const rich = mapRichText(currentData);
        if (rich.text) items.push(rich);
        index += 1;
      }
      if (items.length) blocks.push({ type: "list", style, items });
      continue;
    }

    if (type === "faq") {
      const items: { question: string; answer: string }[] = [];
      while (index < value.length) {
        const current = value[index];
        if (!isRecord(current) || asString(current.type) !== "faq") break;
        const currentData = isRecord(current.data) ? current.data : {};
        const question = asString(currentData.question);
        const answer = asString(currentData.answer);
        if (question && answer) items.push({ question, answer });
        index += 1;
      }
      if (items.length) blocks.push({ type: "faqGroup", items });
      continue;
    }

    if (type === "cta") {
      const label = asString(data.label) || asString(data.text);
      const href = asString(data.href) || asString(data.url);
      if (label && href) {
        blocks.push({ type: "cta", label, ...resolveCtaHref(href) });
      }
      index += 1;
      continue;
    }

    if (type === "product") {
      const product = resolveContentProduct(data, catalog);
      if (product) {
        blocks.push({
          type: "product",
          product,
          text:
            asString(data.text) ||
            asString(data.description) ||
            asString(data.caption) ||
            asString(data.title),
        });
      }
      index += 1;
      continue;
    }

    if (type === "productCollection" || type === "products") {
      const collection = mapProductCollection(data, catalog);
      if (collection) blocks.push(collection);
      index += 1;
      continue;
    }

    if (type === "productCategory") {
      const cta = mapProductCategory(data, categoryLinks);
      if (cta) blocks.push(cta);
      index += 1;
      continue;
    }

    index += 1;
  }

  return blocks;
}

function readProductId(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (!isRecord(value)) return "";
  return asString(value.productId) || asString(value.id);
}

function resolveContentProduct(
  data: Record<string, unknown>,
  catalog: MagazineRelatedProduct[],
): MagazineRelatedProduct | null {
  const nested = isRecord(data.product) ? data.product : data;
  const embedded = mapRelatedProduct(nested);
  if (embedded) return embedded;

  const id = readProductId(data) || readProductId(nested);
  if (!id) return null;
  return catalog.find((product) => product.productId === id) || null;
}

function collectProductIds(data: Record<string, unknown>): string[] {
  const ids: string[] = [];
  const push = (value: unknown) => {
    const id = readProductId(value);
    if (id) ids.push(id);
  };

  push(data.productId);
  push(data.product);
  if (Array.isArray(data.productIds)) data.productIds.forEach(push);
  if (Array.isArray(data.products)) data.products.forEach(push);
  return [...new Set(ids)];
}

function mapProductCollection(
  data: Record<string, unknown>,
  catalog: MagazineRelatedProduct[],
): Extract<MagazineContentBlock, { type: "productCollection" }> | null {
  const title = asString(data.title) || asString(data.name);
  const rawHref = asString(data.href) || asString(data.url);
  const href = rawHref
    ? resolveCtaHref(rawHref).href
    : `/search?q=${encodeURIComponent(title || "محصولات")}`;
  const rawProducts = [
    ...(Array.isArray(data.products) ? data.products : []),
    ...(isRecord(data.product) ? [data.product] : []),
  ];
  const embedded = rawProducts
    .map(mapRelatedProduct)
    .filter((item): item is MagazineRelatedProduct => Boolean(item));
  const ids = collectProductIds(data);
  const byId = new Map(
    catalog.map((product) => [product.productId, product] as const),
  );
  const fromIds = ids
    .map((id) => byId.get(id))
    .filter((item): item is MagazineRelatedProduct => Boolean(item));

  const products: MagazineRelatedProduct[] = [];
  const seen = new Set<string>();
  for (const product of [...embedded, ...fromIds]) {
    if (!product.productId || seen.has(product.productId)) continue;
    seen.add(product.productId);
    products.push(product);
  }
  if (!products.length) return null;

  return {
    type: "productCollection",
    title: title || "محصولات",
    href,
    products,
  };
}

export interface MagazineCategoryLink {
  categoryId: string;
  title: string;
  href: string;
}

function mapProductCategory(
  data: Record<string, unknown>,
  categoryLinks: MagazineCategoryLink[],
): Extract<MagazineContentBlock, { type: "cta" }> | null {
  const nested = isRecord(data.category) ? data.category : data;
  const categoryId =
    asString(data.categoryId) ||
    asString(nested.categoryId) ||
    asString(nested.id);
  const fromCatalog = categoryLinks.find(
    (item) => item.categoryId === categoryId,
  );
  const title =
    asString(data.title) ||
    asString(data.name) ||
    asString(data.label) ||
    asString(nested.title) ||
    asString(nested.name) ||
    fromCatalog?.title;
  const rawHref =
    asString(data.href) ||
    asString(data.url) ||
    fromCatalog?.href ||
    (categoryId
      ? `/products?categoryId=${encodeURIComponent(categoryId)}`
      : "");
  if (!rawHref) return null;

  const resolved = resolveCtaHref(rawHref);
  return {
    type: "cta",
    label: title ? `مشاهده محصولات ${title}` : "مشاهده محصولات این دسته",
    href: resolved.href,
    external: resolved.external,
  };
}

function mapRelatedProduct(value: unknown): MagazineRelatedProduct | null {
  if (!isRecord(value)) return null;
  const title = asString(value.title) || asString(value.name);
  const slug = asString(value.slug);
  const publicCode = asString(value.publicCode);
  if (!title || !slug || !publicCode) return null;

  const compareAt = asNumber(value.compareAtPrice);
  const productId = asString(value.productId) || asString(value.id);
  if (!productId) return null;

  return {
    productId,
    title,
    slug,
    publicCode,
    href: `/product/${encodeURIComponent(publicCode)}/${encodeURIComponent(slug)}`,
    price: asNumber(value.price) ?? 0,
    compareAtPrice: compareAt && compareAt > 0 ? compareAt : null,
    isInStock: Boolean(value.isInStock ?? value.inStock),
    image: resolveImage(
      value.imageUrl ??
        value.image ??
        value.thumbnailUrl ??
        value.thumbnailPath ??
        value.mediumPath,
    ),
  };
}

export function mapMagazineRelatedCatalog(
  value: unknown,
): MagazineRelatedProduct[] {
  const article = unwrapArticle(value);
  if (!article || !Array.isArray(article.relatedProducts)) return [];
  return article.relatedProducts
    .map(mapRelatedProduct)
    .filter((item): item is MagazineRelatedProduct => Boolean(item));
}

export function collectMagazineContentProductIds(value: unknown): string[] {
  const article = unwrapArticle(value);
  const content = Array.isArray(article?.content)
    ? article.content
    : Array.isArray(value)
      ? value
      : [];
  const ids: string[] = [];

  for (const item of content) {
    if (!isRecord(item)) continue;
    const type = asString(item.type);
    const data = isRecord(item.data) ? item.data : {};
    if (type === "product") {
      const nested = isRecord(data.product) ? data.product : data;
      const id = readProductId(data) || readProductId(nested);
      if (id) ids.push(id);
      continue;
    }
    if (type === "productCollection" || type === "products") {
      ids.push(...collectProductIds(data));
    }
  }

  return [...new Set(ids)];
}

export function collectMagazineContentCategoryIds(value: unknown): string[] {
  const article = unwrapArticle(value);
  const content = Array.isArray(article?.content)
    ? article.content
    : Array.isArray(value)
      ? value
      : [];
  const ids: string[] = [];

  for (const item of content) {
    if (!isRecord(item)) continue;
    if (asString(item.type) !== "productCategory") continue;
    const data = isRecord(item.data) ? item.data : {};
    const nested = isRecord(data.category) ? data.category : data;
    const id =
      asString(data.categoryId) ||
      asString(nested.categoryId) ||
      asString(nested.id);
    if (id) ids.push(id);
  }

  return [...new Set(ids)];
}

export function summarizeMagazineContentTypes(
  value: unknown,
): Record<string, number> {
  const article = unwrapArticle(value);
  const content = Array.isArray(article?.content) ? article.content : [];
  const counts: Record<string, number> = {};
  for (const item of content) {
    if (!isRecord(item)) continue;
    const type = asString(item.type) || "unknown";
    counts[type] = (counts[type] || 0) + 1;
  }
  return counts;
}

export function mapProductDetailToMagazineRelated(
  value: unknown,
): MagazineRelatedProduct | null {
  if (!isRecord(value)) return null;
  const variants = Array.isArray(value.variants) ? value.variants : [];
  const variant =
    variants.find((item) => isRecord(item) && item.isDefault) ||
    variants.find((item) => isRecord(item)) ||
    null;
  const images =
    isRecord(variant) && Array.isArray(variant.images) ? variant.images : [];
  const image =
    images.find((item) => isRecord(item) && item.isPrimary) ||
    images.find((item) => isRecord(item)) ||
    null;

  return mapRelatedProduct({
    id: asString(value.productId) || asString(value.id),
    productId: asString(value.productId) || asString(value.id),
    title: asString(value.name) || asString(value.title),
    slug: asString(value.slug),
    publicCode:
      asString(value.publicCode) ||
      (isRecord(variant) ? asString(variant.publicCode) : ""),
    price: isRecord(variant)
      ? (asNumber(variant.finalPrice) ??
        asNumber(variant.salePrice) ??
        asNumber(variant.price))
      : asNumber(value.price),
    compareAtPrice: isRecord(variant)
      ? (asNumber(variant.compareAtPrice) ?? asNumber(variant.originalPrice))
      : asNumber(value.compareAtPrice),
    isInStock: isRecord(variant)
      ? Boolean(variant.inStock)
      : Boolean(value.isInStock ?? value.inStock),
    imageUrl:
      (isRecord(image)
        ? asString(image.mediumPath) || asString(image.thumbnailPath)
        : "") ||
      asString(value.imageUrl) ||
      asString(value.thumbnailPath) ||
      asString(value.mediumPath),
  });
}

function mergeProductCatalog(
  primary: MagazineRelatedProduct[],
  extra: MagazineRelatedProduct[],
): MagazineRelatedProduct[] {
  const map = new Map(
    primary.map((product) => [product.productId, product] as const),
  );
  for (const product of extra) {
    if (!product.productId || map.has(product.productId)) continue;
    map.set(product.productId, product);
  }
  return [...map.values()];
}

function mapFaqItem(
  value: unknown,
): { question: string; answer: string } | null {
  if (!isRecord(value)) return null;
  const question = asString(value.question) || asString(value.title);
  const answer = asString(value.answer) || asString(value.body);
  if (!question || !answer) return null;
  return { question, answer };
}

function toJsonLd(
  item: unknown,
  article: {
    slug: string;
    title: string;
    category: MagazineCategory | null;
  },
): Record<string, unknown> | null {
  if (!isRecord(item)) return null;
  const type = asString(item.type) || asString(item["@type"]);
  if (!type) return null;

  if (type === "BreadcrumbList") {
    const crumbs = Array.isArray(item.data) ? item.data : [];
    const magUrl = `${SITE_URL}/mag`;
    const articleUrl = `${SITE_URL}/mag/${encodeURIComponent(article.slug)}`;
    const categoryUrl = article.category
      ? `${SITE_URL}/mag?category=${encodeURIComponent(article.category.slug)}`
      : magUrl;

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs
        .map((crumb, index) => {
          if (!isRecord(crumb)) return null;
          const name = asString(crumb.name);
          if (!name) return null;
          const position = asNumber(crumb.position) ?? index + 1;
          const itemUrl =
            position === 1
              ? magUrl
              : position === 2 && article.category
                ? categoryUrl
                : articleUrl;
          return {
            "@type": "ListItem",
            position,
            name,
            item: itemUrl,
          };
        })
        .filter(Boolean),
    };
  }

  const data = isRecord(item.data) ? item.data : item;
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
  };

  for (const [key, value] of Object.entries(data)) {
    if (key === "type" || key === "@type" || key === "@context") continue;
    if (isRecord(value) && asString(value.type)) {
      jsonLd[key] = {
        "@type": asString(value.type),
        name: asString(value.name),
      };
      continue;
    }
    jsonLd[key] = value;
  }

  return jsonLd;
}

function mapSeo(
  value: unknown,
  fallback: {
    title: string;
    excerpt: string;
    slug: string;
    image: string;
  },
): MagazineArticleSeo {
  const seo = isRecord(value) ? value : {};
  const canonical =
    asString(seo.canonicalUrl) ||
    `${SITE_URL}/mag/${encodeURIComponent(fallback.slug)}`;

  return {
    title: asString(seo.title) || fallback.title,
    description: asString(seo.description) || fallback.excerpt,
    canonicalUrl: canonical,
    robots: parseRobots(seo.robots),
    ogTitle: asString(seo.ogTitle) || asString(seo.title) || fallback.title,
    ogDescription:
      asString(seo.ogDescription) ||
      asString(seo.description) ||
      fallback.excerpt,
    ogImage: resolveImage(seo.ogImage) || fallback.image,
  };
}

export function mapMagazineArticleDetail(
  value: unknown,
  extraCatalog: MagazineRelatedProduct[] = [],
  categoryLinks: MagazineCategoryLink[] = [],
): MagazineArticleDetail | null {
  const article = unwrapArticle(value);
  if (!article) return null;

  const slug = asString(article.slug);
  const title = asString(article.title);
  if (!slug || !title) return null;

  const category = mapMagazineCategory(article.category);
  const excerpt = asString(article.excerpt) || asString(article.description);
  const featuredImage = resolveImage(
    article.featuredImage ?? article.image ?? article.coverImage,
  );
  const featuredAlt = isRecord(article.featuredImage)
    ? asString(article.featuredImage.alt)
    : "";
  const articleType = asString(article.articleType) || null;
  const toc = dedupeTocItems(
    Array.isArray(article.tableOfContents)
      ? article.tableOfContents
          .map(mapTocItem)
          .filter((item): item is MagazineTocItem => Boolean(item))
      : [],
  );
  const relatedProducts = Array.isArray(article.relatedProducts)
    ? article.relatedProducts
        .map(mapRelatedProduct)
        .filter((item): item is MagazineRelatedProduct => Boolean(item))
    : [];
  const catalog = mergeProductCatalog(relatedProducts, extraCatalog);

  return {
    articleId: asString(article.id),
    slug,
    title,
    excerpt,
    articleType,
    articleTypeLabel: articleType
      ? MAGAZINE_ARTICLE_TYPE_LABELS[articleType] || ""
      : "",
    featuredImage,
    featuredImageAlt: featuredAlt || title,
    category,
    author: mapAuthor(article.author),
    publishedAt: formatArticleDate(article.publishedAt),
    publishedAtIso: asIsoDate(article.publishedAt),
    updatedAt: formatArticleDate(article.updatedAt),
    updatedAtIso: asIsoDate(article.updatedAt),
    readingTime: formatReadTime(article.readingTimeMinutes),
    tableOfContents: toc,
    content: mapContentBlocks(article.content, toc, catalog, categoryLinks),
    tags: Array.isArray(article.tags)
      ? article.tags
          .map(mapTag)
          .filter((item): item is MagazineTag => Boolean(item))
      : [],
    relatedProducts,
    relatedArticles: Array.isArray(article.relatedArticles)
      ? article.relatedArticles
          .map(mapMagazinePost)
          .filter((item): item is MagazinePost => Boolean(item))
      : [],
    faqs: Array.isArray(article.faqs)
      ? article.faqs
          .map(mapFaqItem)
          .filter((item): item is { question: string; answer: string } =>
            Boolean(item),
          )
      : [],
    seo: mapSeo(article.seo, {
      title,
      excerpt,
      slug,
      image: featuredImage,
    }),
    structuredData: Array.isArray(article.structuredData)
      ? article.structuredData
          .map((item) => toJsonLd(item, { slug, title, category }))
          .filter((item): item is Record<string, unknown> => Boolean(item))
      : [],
  };
}
