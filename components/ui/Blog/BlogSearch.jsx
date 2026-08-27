import styles from "./blogHome.module.css";

export default function BlogSearch({ query = "", category = "all" }) {
  return (
    <div className={styles.searchBlock}>
      <form
        className={styles.searchForm}
        action="/blog"
        method="get"
        role="search"
      >
        {category !== "all" ? (
          <input type="hidden" name="category" value={category} />
        ) : null}

        <span className={styles.searchIcon} aria-hidden="true">
          <i className="far fa-magnifying-glass" />
        </span>

        <label htmlFor="blog-search" className="sr-only">
          جستجوی مقاله
        </label>
        <input
          id="blog-search"
          className={styles.searchInput}
          type="search"
          name="q"
          defaultValue={query}
          placeholder="جستجوی مقاله، راهنمای خرید و مطالب خودرو..."
          autoComplete="off"
        />

        <button
          className={styles.searchSubmit}
          type="submit"
          aria-label="جستجو"
        >
          <i className="far fa-magnifying-glass" />
        </button>
      </form>
    </div>
  );
}
