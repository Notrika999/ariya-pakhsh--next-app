import CategoriesSlider from "@/components/modules/CategoriesSlider/CategoriesSlider";
import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";

export default function CategorySlider({ categories, title }) {
  return (
    <section className="py-5">
      <h2 className="sr-only">دسته‌بندی‌های فروشگاه</h2>

      <div className="container">
        {/* Header */}
        <SectionHeader title={title} href="#" />

        {/* Categories Swiper */}
        <div className="py-5">
          {/* به جای !important در استایل، اینجا پدینگ دادیم */}
          <CategoriesSlider categories={categories} />
        </div>
      </div>
    </section>
  );
}
