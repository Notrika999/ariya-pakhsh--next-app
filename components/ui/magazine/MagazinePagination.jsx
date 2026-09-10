import Link from "next/link";
import { getBlogHomeHref } from "@/components/ui/magazine/magazineHomeUtils";

export default function MagazinePagination({
  page = 1,
  totalPages = 1,
  hrefParams = {},
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="صفحه‌بندی"
      className="mt-10 flex justify-center gap-2"
    >
      {Array.from({ length: totalPages }, (_, index) => {
        const target = index + 1;
        const href = getBlogHomeHref({ ...hrefParams, page: target });
        const isCurrent = page === target;

        return (
          <Link
            key={target}
            href={href}
            aria-current={isCurrent ? "page" : undefined}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
              isCurrent ? "bg-primary text-white" : ""
            }`}
          >
            {target}
          </Link>
        );
      })}
    </nav>
  );
}
