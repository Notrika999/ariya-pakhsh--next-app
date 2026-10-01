import Link from "next/link";
import { getBlogHomeHref } from "@/components/ui/magazine/magazineHomeUtils";

function getPaginationItems(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push("start-ellipsis");
  for (let target = start; target <= end; target += 1) items.push(target);
  if (end < totalPages - 1) items.push("end-ellipsis");
  items.push(totalPages);

  return items;
}

export default function MagazinePagination({
  page = 1,
  totalPages = 1,
  hrefParams = {},
}) {
  if (totalPages <= 1) return null;

  const items = getPaginationItems(page, totalPages);
  const pageHref = (target) =>
    getBlogHomeHref({ ...hrefParams, page: target });
  const itemClassName =
    "grid h-10 min-w-10 place-items-center rounded-xl border px-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <nav
      aria-label="صفحه‌بندی"
      className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-black/5 pt-6 dark:border-white/10"
    >
      {page > 1 ? (
        <Link
          href={pageHref(page - 1)}
          aria-label="صفحه قبل"
          className={`${itemClassName} border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300`}
        >
          <i className="far fa-arrow-right" aria-hidden="true" />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className={`${itemClassName} cursor-not-allowed border-slate-200/70 bg-white/45 text-slate-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-700`}
        >
          <i className="far fa-arrow-right" />
        </span>
      )}

      {items.map((item) => {
        if (typeof item !== "number") {
          return (
            <span key={item} className="grid h-10 min-w-8 place-items-center text-slate-400" aria-hidden="true">
              …
            </span>
          );
        }

        const target = item;
        const href = pageHref(target);
        const isCurrent = page === target;

        return (
          <Link
            key={target}
            href={href}
            aria-current={isCurrent ? "page" : undefined}
            className={`${itemClassName} ${
              isCurrent
                ? "border-slate-900 bg-slate-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-slate-950"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300 dark:hover:border-zinc-600 dark:hover:text-white"
            }`}
          >
            {new Intl.NumberFormat("fa-IR").format(target)}
          </Link>
        );
      })}

      {page < totalPages ? (
        <Link
          href={pageHref(page + 1)}
          aria-label="صفحه بعد"
          className={`${itemClassName} border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300`}
        >
          <i className="far fa-arrow-left" aria-hidden="true" />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className={`${itemClassName} cursor-not-allowed border-slate-200/70 bg-white/45 text-slate-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-700`}
        >
          <i className="far fa-arrow-left" />
        </span>
      )}
    </nav>
  );
}
