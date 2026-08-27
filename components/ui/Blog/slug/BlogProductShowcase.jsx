import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/src/utils/formatPrice";
import styles from "./blogArticle.module.css";

function brandName(product) {
  return String(product.primaryBrandName ?? "").trim();
}

export default function BlogProductShowcase({
  products = [],
  keyword = "",
  searchHref = "/search",
}) {
  const items = products.slice(0, 2);
  if (!items.length) return null;

  const brand = brandName(items[0]);
  const ctaLabel = brand
    ? `${keyword} ${brand}`
    : `محصولات ${keyword}`;

  return (
    <section className={styles.block} aria-label={`محصولات مرتبط ${keyword}`}>
      <div className={styles.showcase}>
        {items.map((product) => (
          <Link
            key={product.id}
            href={product.href}
            className={styles.productCard}
          >
            <div className={styles.productImage}>
              <Image
                src={product.image || "/images/default.png"}
                alt={product.title}
                fill
                sizes="(max-width: 767px) 60vw, 220px"
                className={styles.image}
              />
            </div>
            <div className="flex flex-col
            ">
              <h3 className={styles.productTitle}>{product.title}</h3>
            <p className={styles.productPrice}>
              {product.isOnSale && product.oldPrice > product.price ? (
                <span className={styles.oldPrice}>
                  {formatPrice(product.oldPrice)}
                </span>
              ) : null}
              {product.price > 0 ? formatPrice(product.price) : "توافقی"}
              {product.price > 0 ? (
                <span className={styles.currency}>تومان</span>
              ) : null}
            </p>
            </div>
          </Link>
        ))}

        <div className={styles.showcaseCta}>
          <p className={styles.ctaLabel}>{ctaLabel}</p>
          <Link href={searchHref} className={styles.viewAll}>
            مشاهده همه
          </Link>
        </div>
      </div>
    </section>
  );
}
