import Link from "next/link";
import { formatPrice } from "@/src/utils/formatPrice";
import styles from "./blogArticle.module.css";

function brandLabel(product) {
  const value = String(product.primaryBrandName ?? "").trim();
  return value || "—";
}

function categoryLabel(product, fallback) {
  const value = String(product.categoryName ?? "").trim();
  return value || fallback || "—";
}

function stockLabel(product) {
  if (product.inStock === false) return "ناموجود";
  if (product.inStock === true || Number(product.quantity) > 0) return "موجود";
  return "—";
}

export default function BlogComparisonTable({
  products = [],
  keyword = "",
}) {
  if (products.length < 2) return null;

  return (
    <section className={styles.block} aria-labelledby="blog-compare-title">
      <h2 id="blog-compare-title" className={styles.blockTitle}>
        جدول مقایسه {keyword || "محصولات مرتبط"}
      </h2>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th} scope="col">
                مدل
              </th>
              <th className={styles.th} scope="col">
                برند
              </th>
              <th className={styles.th} scope="col">
                دسته
              </th>
              <th className={styles.th} scope="col">
                وضعیت
              </th>
              <th className={styles.th} scope="col">
                قیمت
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className={styles.tr}>
                <td className={styles.td}>
                  <Link href={product.href} className={styles.modelLink}>
                    {product.title}
                  </Link>
                </td>
                <td className={styles.td}>{brandLabel(product)}</td>
                <td className={styles.td}>
                  {categoryLabel(product, keyword)}
                </td>
                <td className={styles.td}>{stockLabel(product)}</td>
                <td className={styles.td}>
                  {product.price > 0 ? (
                    <>
                      {formatPrice(product.price)}
                      <span className={styles.currency}>تومان</span>
                    </>
                  ) : (
                    <span className={styles.muted}>توافقی</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
