import Image from "next/image";
import Link from "next/link";
import React from "react";
import { blogPosts, getBlogHref } from "./blogData";

export default function BlogTopPosts() {
  const featuredPosts = blogPosts.slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="blog-news-item relative rounded-2xl overflow-hidden md:col-span-4">
        <Link href={getBlogHref(featuredPosts[0])}>
          <Image
            width={1048}
            height={300}
            src={featuredPosts[0].image}
            alt={featuredPosts[0].title}
            className="w-full h-72 object-cover rounded-xl shadow-box"
          />
          <div className="absolute bottom-2 start-2 end-2 bg-white/90 dark:bg-custom-dark backdrop-blur-sm rounded-xl p-4">
            <span className="text-xs font-medium text-primary">
              {featuredPosts[0].keyword}
            </span>
            <h1 className="text-lg md:text-xl font-bold mt-2 text-gray-900 dark:text-gray-100">
              {featuredPosts[0].title}
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {featuredPosts[0].description}
            </p>
          </div>
        </Link>
      </div>

      {featuredPosts.slice(1).map((post, index) => (
        <div
          key={post.id}
          className={`blog-news-item relative rounded-2xl overflow-hidden ${
            index === 1 ? "md:col-span-2" : "md:col-span-1"
          }`}
        >
          <Link href={getBlogHref(post)}>
            <Image
              width={index === 1 ? 510 : 250}
              height={300}
              src={post.image}
              alt={post.title}
              className="w-full h-72 object-cover rounded-xl shadow-box"
            />
            <div className="absolute bottom-2 start-2 end-2 bg-white/90 dark:bg-custom-dark backdrop-blur-sm rounded-xl p-3">
              <span className="text-xs font-medium text-primary">
                {post.keyword}
              </span>
              <h3 className="text-sm font-medium line-clamp-2 mt-1">
                {post.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-2">
                {post.description}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {post.date}
                </span>
                <i className="fas fa-arrow-left-long text-primary"></i>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
