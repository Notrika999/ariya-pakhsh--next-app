import Link from "next/link";
import Image from "next/image";
import { getBlogHomeHref } from "@/components/ui/magazine/magazineHomeUtils";

const STORE_LINKS = [
  { href: "/", label: "فروشگاه کارآپ۲۴" },
  { href: "/products", label: "دسته‌بندی کالاها" },
  { href: "/incredible-offers", label: "پیشنهادهای ویژه" },
  { href: "/about", label: "درباره ما" },
];

const GUIDE_LINKS = [
  { href: getBlogHomeHref({ category: "buying-guide" }), label: "راهنمای خرید" },
  { href: getBlogHomeHref({ category: "reviews-comparisons" }), label: "مقایسه محصولات" },
  { href: getBlogHomeHref({ category: "how-to" }), label: "آموزش و نگهداری" },
];

const CONTACT_LINKS = [
  { href: "/contact", label: "تماس با ما" },
  { href: "/faq", label: "سؤالات متداول" },
  { href: "https://www.instagram.com/carup24.ir", label: "اینستاگرام", external: true },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold text-gray-900 dark:text-white">{title}</p>
      <ul className="space-y-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              {...(item.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="text-sm text-gray-500 transition hover:text-primary dark:text-gray-400"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MagazineFooter({ categories = [] }) {
  const categoryLinks = categories.slice(0, 7).map((item) => ({
    href: getBlogHomeHref({ category: item.slug }),
    label: item.title,
  }));

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-zinc-800 dark:bg-custom-dark">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 md:px-6 lg:grid-cols-5 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/mag" className="inline-flex items-center gap-2">
            <Image
              src="/images/logo/carup24-logo.png"
              alt="کارآپ ۲۴"
              width={40}
              height={40}
              className="dark:invert dark:hue-rotate-180"
            />
            <span className="font-bold">
              مجله خودرو کارآپ<span className="text-primary">۲۴</span>
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-7 text-gray-500 dark:text-gray-400">
            راهنمای انتخاب، نگهداری و استفاده از لوازم جانبی خودرو برای خرید مطمئن‌تر.
          </p>
        </div>
        <FooterColumn title="دسته‌بندی‌ها" links={categoryLinks} />
        <FooterColumn title="راهنمای خرید" links={GUIDE_LINKS} />
        <FooterColumn title="کارآپ۲۴" links={STORE_LINKS} />
        <FooterColumn title="ارتباط با ما" links={CONTACT_LINKS} />
      </div>
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500 dark:border-zinc-800 dark:text-gray-400">
        © {new Date().getFullYear()} کارآپ۲۴ — مجله خودرو
      </div>
    </footer>
  );
}
