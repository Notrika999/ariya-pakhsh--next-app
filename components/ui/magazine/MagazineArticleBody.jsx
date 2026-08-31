import Image from "next/image";
import Link from "next/link";
import MagazineProductCollection from "./MagazineProductCollection";
import MagazineProductEmbed from "./MagazineProductEmbed";

function isLocalOrAllowedImage(src) {
  if (!src || typeof src !== "string") return false;
  if (src.startsWith("/")) return true;
  try {
    const { hostname } = new URL(src);
    return hostname === "aryapakhsh.shop" || hostname.endsWith(".aryapakhsh.shop");
  } catch {
    return false;
  }
}

function ArticleImage({ src, alt, caption, priority = false }) {
  const image = (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800">
      {isLocalOrAllowedImage(src) ? (
        <Image
          src={src}
          alt={alt || ""}
          fill
          sizes="(max-width: 1023px) 100vw, 760px"
          priority={priority}
          className="object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || ""} className="h-full w-full object-cover" />
      )}
    </div>
  );

  if (!caption) return image;

  return (
    <figure className="my-6">
      {image}
      <figcaption className="mt-2 text-center text-xs leading-6 text-gray-500 dark:text-gray-400">
        {caption}
      </figcaption>
    </figure>
  );
}

function ArticleTable({ rows }) {
  if (!rows?.length) return null;
  const [header, ...body] = rows;
  const useHeader = header.cells.every((cell) => cell.bold);

  const renderCell = (cell, index, Tag) => (
    <Tag
      key={`${Tag}-${index}-${cell.text}`}
      colSpan={cell.colspan > 1 ? cell.colspan : undefined}
      rowSpan={cell.rowspan > 1 ? cell.rowspan : undefined}
      className={`border border-gray-200 px-3 py-2.5 text-sm leading-7 dark:border-zinc-700 ${
        cell.align === "start"
          ? "text-start"
          : cell.align === "end"
            ? "text-end"
            : "text-center"
      } ${Tag === "th" ? "bg-gray-900 font-semibold text-white dark:bg-zinc-800" : "text-gray-800 dark:text-gray-200"}`}
    >
      {cell.bold && Tag !== "th" ? <strong>{cell.text}</strong> : cell.text}
    </Tag>
  );

  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-700">
      <table className="w-full min-w-xl border-collapse">
        {useHeader ? (
          <thead>
            <tr>{header.cells.map((cell, index) => renderCell(cell, index, "th"))}</tr>
          </thead>
        ) : null}
        <tbody>
          {(useHeader ? body : rows).map((row, rowIndex) => (
            <tr
              key={`row-${rowIndex}`}
              className={rowIndex % 2 === 1 ? "bg-gray-50 dark:bg-zinc-900/50" : "bg-white dark:bg-custom-dark"}
            >
              {row.cells.map((cell, index) => renderCell(cell, index, "td"))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FaqGroup({ items }) {
  if (!items?.length) return null;

  return (
    <section className="my-8" aria-label="سؤالات متداول">
      <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
        سؤالات متداول
      </h2>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white dark:divide-zinc-700 dark:border-zinc-700 dark:bg-custom-dark">
        {items.map((item, itemIndex) => (
          <details key={`${itemIndex}-${item.question}`} className="group px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-start text-sm font-semibold text-gray-900 marker:content-none dark:text-white">
              <span>{item.question}</span>
              <i className="fas fa-angle-down text-xs text-gray-400 transition group-open:rotate-180" />
            </summary>
            <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default function MagazineArticleBody({ blocks = [], articleId = "" }) {
  return (
    <div className="magazine-article-body">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p
              key={`p-${index}`}
              className="mb-4 text-[15px] leading-8 text-gray-700 dark:text-gray-300"
            >
              {block.text}
            </p>
          );
        }

        if (block.type === "heading") {
          const Tag = block.level === 4 ? "h4" : block.level === 3 ? "h3" : "h2";
          const size =
            block.level === 4
              ? "text-base"
              : block.level === 3
                ? "text-lg"
                : "text-xl md:text-[1.35rem]";

          return (
            <Tag
              key={block.anchor || `h-${index}`}
              id={block.anchor || undefined}
              className={`mt-8 mb-3 scroll-mt-28 font-bold leading-8 text-gray-900 dark:text-white ${size}`}
            >
              {block.text}
            </Tag>
          );
        }

        if (block.type === "image") {
          return (
            <ArticleImage
              key={`img-${index}`}
              src={block.src}
              alt={block.alt}
              caption={block.caption}
            />
          );
        }

        if (block.type === "table") {
          return <ArticleTable key={`table-${index}`} rows={block.rows} />;
        }

        if (block.type === "infoBox") {
          return (
            <aside
              key={`info-${index}`}
              className="my-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-7 text-gray-800 dark:border-primary/30 dark:bg-primary/10 dark:text-gray-200"
            >
              {block.text}
            </aside>
          );
        }

        if (block.type === "list") {
          const ListTag = block.style === "number" ? "ol" : "ul";
          return (
            <ListTag
              key={`list-${index}`}
              className={`my-4 space-y-2 pr-5 text-[15px] leading-8 text-gray-700 dark:text-gray-300 ${
                block.style === "number" ? "list-decimal" : "list-disc"
              }`}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${itemIndex}-${item}`}>{item}</li>
              ))}
            </ListTag>
          );
        }

        if (block.type === "cta") {
          const className =
            "my-6 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

          if (block.external) {
            return (
              <p key={`cta-${index}`} className="my-6">
                <a
                  href={block.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {block.label}
                </a>
              </p>
            );
          }

          return (
            <p key={`cta-${index}`} className="my-6">
              <Link href={block.href} className={className}>
                {block.label}
              </Link>
            </p>
          );
        }

        if (block.type === "faqGroup") {
          return <FaqGroup key={`faq-${index}`} items={block.items} />;
        }

        if (block.type === "product") {
          return (
            <MagazineProductEmbed
              key={`product-${index}`}
              product={block.product}
              text={block.text}
              articleId={articleId}
            />
          );
        }

        if (block.type === "productCollection") {
          return (
            <MagazineProductCollection
              key={`products-${index}`}
              title={block.title}
              href={block.href}
              products={block.products}
              articleId={articleId}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
