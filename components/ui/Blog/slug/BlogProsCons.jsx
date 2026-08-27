import styles from "./blogArticle.module.css";

export default function BlogProsCons({ keyword = "محصول" }) {
  return (
    <section className={styles.block} aria-label={`نکات مثبت و منفی ${keyword}`}>
      <div className={styles.prosCons}>
        <div className={styles.prosCard}>
          <h3 className={styles.prosTitle}>نکات مثبت</h3>
          <ul className={styles.list}>
            <li>انتخاب مدل سازگار با خودرو، نصب دقیق‌تری دارد.</li>
            <li>کیفیت ساخت مناسب، دوام {keyword} را در استفاده روزمره بالاتر می‌برد.</li>
            <li>نگهداری و نظافت آسان، هزینه استفاده را کمتر می‌کند.</li>
          </ul>
        </div>

        <div className={styles.consCard}>
          <h3 className={styles.consTitle}>نکات منفی</h3>
          <ul className={styles.list}>
            <li>عدم تطبیق سایز یا مدل می‌تواند کارایی محصول را کم کند.</li>
            <li>بی‌توجهی به جنس و استاندارد، هزینه تعویض را بالا می‌برد.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
