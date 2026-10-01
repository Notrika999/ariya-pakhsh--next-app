import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import MagazineProductCollection from "./MagazineProductCollection";
import MagazineProductComparison from "./MagazineProductComparison";
import MagazineProductEmbed from "./MagazineProductEmbed";

const LINK_CLASS =
  "font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition hover:decoration-primary";

function splitEdgeWhitespace(text) {
  if (typeof text !== "string" || !text) {
    return { leading: "", core: "", trailing: "" };
  }

  const leadingLength = text.match(/^\s*/u)?.[0].length ?? 0;
  if (leadingLength === text.length) {
    return { leading: text, core: "", trailing: "" };
  }

  const trailingLength = text.match(/\s*$/u)?.[0].length ?? 0;
  return {
    leading: text.slice(0, leadingLength),
    core: text.slice(leadingLength, text.length - trailingLength),
    trailing: trailingLength ? text.slice(text.length - trailingLength) : "",
  };
}

function hasTextMark(styles) {
  return Boolean(
    styles?.bold ||
      styles?.italic ||
      styles?.underline ||
      styles?.strike ||
      styles?.code,
  );
}

function hoistLinkEdgeSpaces(children = []) {
  if (!children.length) {
    return { leading: "", trailing: "", children };
  }

  const next = children.map((child) =>
    child.type === "text" ? { ...child, styles: { ...child.styles } } : child,
  );
  let leading = "";
  let trailing = "";

  const first = next[0];
  if (first?.type === "text") {
    const parts = splitEdgeWhitespace(first.text);
    leading = parts.leading;
    first.text = next.length === 1 ? parts.core : `${parts.core}${parts.trailing}`;
    if (next.length === 1) trailing = parts.trailing;
  }

  if (next.length > 1) {
    const last = next[next.length - 1];
    if (last?.type === "text") {
      const parts = splitEdgeWhitespace(last.text);
      trailing = parts.trailing;
      last.text = `${parts.leading}${parts.core}`;
    }
  }

  return {
    leading,
    trailing,
    children: next.filter((child) => child.type !== "text" || child.text),
  };
}

function StyledText({ text, styles }) {
  if (!hasTextMark(styles)) return text;

  const { leading, core, trailing } = splitEdgeWhitespace(text);
  if (!core) return text;

  let node = core;
  if (styles?.code) {
    node = (
      <code className="rounded bg-gray-100 px-1 py-0.5 text-[0.9em] dark:bg-zinc-800">
        {node}
      </code>
    );
  }
  if (styles?.strike) node = <s>{node}</s>;
  if (styles?.underline) node = <u>{node}</u>;
  if (styles?.italic) node = <em>{node}</em>;
  if (styles?.bold) node = <strong>{node}</strong>;

  return (
    <>
      {leading}
      {node}
      {trailing}
    </>
  );
}

function RichText({ nodes, fallback = "" }) {
  if (!nodes?.length) return fallback || null;

  return nodes.map((node, index) => {
    if (node.type === "link") {
      const hoisted = hoistLinkEdgeSpaces(node.children);
      const label = <RichText nodes={hoisted.children} fallback="" />;

      const anchor = node.external ? (
        <a
          href={node.href}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          {label}
        </a>
      ) : (
        <Link href={node.href} className={LINK_CLASS}>
          {label}
        </Link>
      );

      return (
        <Fragment key={`link-${index}`}>
          {hoisted.leading}
          {anchor}
          {hoisted.trailing}
        </Fragment>
      );
    }

    return (
      <StyledText
        key={`text-${index}`}
        text={node.text}
        styles={node.styles}
      />
    );
  });
}

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
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-1.5 shadow-[0_18px_45px_-36px_rgba(15,23,42,0.7)] dark:border-zinc-700 dark:bg-zinc-900">
        {isLocalOrAllowedImage(src) ? (
          <Image
            src={src}
            alt={alt || ""}
            width={1600}
            height={900}
            sizes="(max-width: 1023px) 100vw, 760px"
            priority={priority}
            quality={84}
            className="h-auto w-full rounded-xl"
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || ""}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="h-auto w-full rounded-xl"
          />
        )}
      </div>
      {caption ? (
        <figcaption className="mx-auto mt-3 max-w-2xl text-center text-xs leading-6 text-slate-500 dark:text-slate-400">
          {caption}
        </figcaption>
      ) : null}
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
    <div className="my-8 overflow-x-auto rounded-xl border border-slate-200 shadow-[0_16px_40px_-36px_rgba(15,23,42,0.7)] dark:border-zinc-700">
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
      <h2 className="mb-4 border-s-4 border-slate-800 ps-3 text-xl font-black text-slate-900 dark:border-slate-500 dark:text-white">
        سؤالات متداول
      </h2>
      <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 dark:divide-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/40">
        {items.map((item, itemIndex) => (
          <details key={`${itemIndex}-${item.question}`} className="group px-4 py-4 open:bg-white md:px-5 dark:open:bg-zinc-900">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-start text-sm font-bold text-slate-900 marker:content-none dark:text-white">
              <span>{item.question}</span>
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200 transition group-open:rotate-180 dark:bg-zinc-800 dark:ring-zinc-700" aria-hidden="true">
                <i className="fas fa-angle-down text-xs" />
              </span>
            </summary>
            <p className="mt-3 text-sm leading-8 text-slate-600 dark:text-gray-300">
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
              className="mb-5 text-justify text-base leading-9 text-slate-700 md:text-[17px] md:leading-10 dark:text-slate-300"
            >
              <RichText nodes={block.inline} fallback={block.text} />
            </p>
          );
        }

        if (block.type === "heading") {
          const Tag = block.level === 4 ? "h4" : block.level === 3 ? "h3" : "h2";
          const size =
            block.level === 4
              ? "border-s-2 border-slate-300 ps-3 text-base"
              : block.level === 3
                ? "border-s-2 border-slate-500 ps-3 text-lg"
                : "border-s-4 border-slate-900 ps-4 text-xl md:text-[1.4rem] dark:border-slate-500";

          return (
            <Tag
              key={block.anchor || `h-${index}`}
              id={block.anchor || undefined}
              className={`mt-10 mb-4 scroll-mt-28 font-black leading-9 text-slate-950 dark:text-white ${size}`}
            >
              <RichText nodes={block.inline} fallback={block.text} />
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
              className="my-7 flex gap-3 rounded-2xl border border-sky-200 bg-sky-50/75 px-4 py-4 text-sm leading-8 text-slate-700 md:px-5 dark:border-sky-900/60 dark:bg-sky-950/20 dark:text-gray-200"
            >
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-sky-900 text-white dark:bg-sky-800" aria-hidden="true">
                <i className="far fa-lightbulb" />
              </span>
              <span><RichText nodes={block.inline} fallback={block.text} /></span>
            </aside>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={`quote-${index}`}
              className="relative my-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 text-[15px] leading-9 whitespace-pre-line text-slate-700 shadow-[0_16px_40px_-38px_rgba(15,23,42,0.7)] before:absolute before:inset-y-0 before:start-0 before:w-1 before:bg-amber-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-gray-300"
            >
              <i className="fas fa-quote-right mb-2 block text-xl text-amber-500/70" aria-hidden="true" />
              <RichText nodes={block.inline} fallback={block.text} />
              {block.citation ? (
                <footer className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {block.citation}
                </footer>
              ) : null}
            </blockquote>
          );
        }

        if (block.type === "list") {
          const ListTag = block.style === "number" ? "ol" : "ul";
          return (
            <ListTag
              key={`list-${index}`}
              className={`my-6 space-y-2.5 rounded-2xl bg-slate-50 px-6 py-5 pr-10 text-[15px] leading-8 text-slate-700 marker:font-bold marker:text-amber-600 dark:bg-zinc-900/50 dark:text-gray-300 ${
                block.style === "number" ? "list-decimal" : "list-disc"
              }`}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${itemIndex}-${item.text}`}>
                  <RichText nodes={item.inline} fallback={item.text} />
                </li>
              ))}
            </ListTag>
          );
        }

        if (block.type === "cta") {
          const className =
            "my-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:bg-slate-700 dark:hover:bg-slate-600";

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

        if (block.type === "productComparison") {
          return (
            <MagazineProductComparison
              key={`product-comparison-${index}`}
              title={block.title}
              products={block.products}
              attributes={block.attributes}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
