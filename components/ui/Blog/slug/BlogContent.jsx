// components/ui/Blog/slug/BlogContent.jsx
import Image from "next/image";
import Link from "next/link";
import React from "react";
import BlogVideoSidebar from "../BlogVideoSidebar";
import BlogSidebar from "../BlogSidebar";
import { blogPosts, getBlogHref } from "../blogData";
import BlogComparisonTable from "./BlogComparisonTable";
import BlogProductShowcase from "./BlogProductShowcase";
import BlogRelatedReads from "./BlogRelatedReads";
import BlogProsCons from "./BlogProsCons";

function getBrandGroups(products = []) {
  const groups = [];
  const index = new Map();

  for (const product of products) {
    const brand = String(product.primaryBrandName ?? "").trim() || "__all__";
    if (!index.has(brand)) {
      const group = {
        brand: brand === "__all__" ? "" : brand,
        products: [],
      };
      index.set(brand, group);
      groups.push(group);
    }
    index.get(brand).products.push(product);
  }

  return groups.slice(0, 2);
}

export default function BlogContent({
  post,
  relatedProducts = { products: [], totalCount: 0, searchHref: "/search" },
}) {
  const relatedPosts = blogPosts
    .filter((item) => item.id !== post.id)
    .slice(0, 2);
  const products = relatedProducts.products ?? [];
  const brandGroups = getBrandGroups(products);
  const compareProducts = products.slice(0, 8);

  return (
    <div className="grid grid-cols-4 gap-4">
      <article className="xl:col-span-3 col-span-4 bg-white dark:bg-custom-dark rounded-xl shadow-md overflow-hidden">
        <Image
          width={1052}
          height={384}
          src={post.image}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover"
        />

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {post.keyword}
            </span>
            <span className="text-sm text-gray-500">{post.date}</span>
            <span className="text-sm text-gray-500">{post.readTime}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-gray-800 mb-6 dark:text-white">
            {post.title}
          </h1>

          <div className="article-content text-gray-700 dark:text-gray-300 space-y-5 leading-8">
            <p>{post.description}</p>

            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              معیارهای اصلی انتخاب {post.keyword}
            </h2>
            <p>
              برای خرید {post.keyword} باید ابتدا سازگاری با خودرو، کیفیت ساخت،
              دوام در استفاده روزمره و ارزش خرید را بررسی کنید. انتخاب دقیق در
              این دسته باعث کاهش هزینه‌های تکراری و افزایش ایمنی یا راحتی
              رانندگی می‌شود.
            </p>

            <BlogComparisonTable
              products={compareProducts}
              keyword={post.keyword}
            />

            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              نکات کاربردی قبل از خرید
            </h2>
            <ul className="list-disc space-y-2 pe-5">
              <li>مدل خودرو و ابعاد قطعه یا اکسسوری را با محصول تطبیق دهید.</li>
              <li>به جنس، مقاومت، ضمانت و کیفیت نصب توجه کنید.</li>
              <li>
                محصولی را انتخاب کنید که نگهداری و نظافت آسان‌تری داشته باشد.
              </li>
              <li>
                برای قطعات نوری، استاندارد نوردهی و هماهنگی برقی مهم است.
              </li>
            </ul>

            {brandGroups.map((group) => (
              <BlogProductShowcase
                key={group.brand || post.keyword}
                products={group.products}
                keyword={post.keyword}
                searchHref={relatedProducts.searchHref}
              />
            ))}

            {products.length ? <BlogProsCons keyword={post.keyword} /> : null}

            <Image
              width={760}
              height={360}
              src="/images/default.png"
              alt={`نمونه ${post.keyword}`}
              className="w-full h-72 object-cover rounded-xl"
            />

            <BlogRelatedReads posts={relatedPosts} />

            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              جمع‌بندی
            </h2>
            <p>
              اگر هدف شما خرید مطمئن {post.keyword} است، فقط به ظاهر محصول
              اکتفا نکنید. سازگاری، کیفیت متریال و کارکرد واقعی محصول در خودرو
              باید مبنای تصمیم‌گیری باشد.
            </p>
          </div>

          <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              مقاله‌های مرتبط
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPosts.map((item) => (
                <Link
                  key={item.id}
                  href={getBlogHref(item)}
                  className="flex gap-3 border border-gray-200 dark:border-gray-700 rounded-xl p-3 hover:border-primary transition"
                >
                  <Image
                    width={96}
                    height={80}
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-20 object-cover rounded"
                  />
                  <span>
                    <span className="block text-xs text-primary">
                      {item.keyword}
                    </span>
                    <span className="block text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 mt-1">
                      {item.title}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                      {item.description}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>

      <aside className="xl:col-span-1 col-span-4">
        <div className="sticky top-0 space-y-4">
          <BlogSidebar />
          <BlogVideoSidebar />
        </div>
      </aside>
    </div>
  );
}
