import Image from "next/image";
import Link from "next/link";
import React from "react";
import { blogPosts, getBlogHref } from "./blogData";

export default function BlogOriginalVideo() {
  const posts = blogPosts.slice(7, 12);

  return (
    <div className="lg:col-span-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`tv-blog-item group relative rounded-xl overflow-hidden ${
              index === 1 ? "md:col-span-2" : "md:col-span-1"
            }`}
          >
            <Link href={getBlogHref(post)}>
              <Image
                width={index === 1 ? 700 : 340}
                height={320}
                src={post.image}
                alt={post.title}
                className="w-full group-hover:scale-105 transition duration-500 h-80 object-cover rounded-xl grayscale"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="far fa-circle-play text-6xl text-secondary-600"></i>
              </div>
              <div className="absolute bottom-0 start-0 end-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-xl">
                <span className="text-xs text-primary-100">{post.keyword}</span>
                <h3 className="text-sm font-medium text-white line-clamp-2 mt-1 mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-200 line-clamp-2 mb-2">
                  {post.description}
                </p>
                <div className="flex items-center text-white">
                  <span className="text-xs">{post.date}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
