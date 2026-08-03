import Link from "next/link";
import React from "react";
import { blogPosts, getBlogHref } from "./blogData";

export default function BlogSidebar() {
  return (
    <div className="bg-white dark:bg-custom-dark dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 dark:border-gray-700 p-4 rounded-2xl flex flex-col">
      <form className="relative flex items-center w-full">
        <input
          type="text"
          id="searchInputBlog"
          className="w-full bg-gray-100 appearance-none rounded-full border border-gray-300 dark:border-gray-700 py-3 ps-4 pe-10 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent dark:bg-zinc-800 text-gray-900 dark:text-gray-100 transition-colors duration-300"
          placeholder="جستجوی راهنمای محصولات خودرو..."
        />

        <button className="p-2 w-8 h-8 flex items-center bg-primary text-white rounded-3xl absolute end-1 hover:opacity-90 transition-opacity">
          <i className="far fa-magnifying-glass"></i>
        </button>
      </form>

      <nav>
        <ul className="space-y-2">
          {blogPosts.map((post) => (
            <li key={post.id}>
              <Link
                href={getBlogHref(post)}
                className="gap-3 px-2 py-3 hover:bg-primary-50 dark:hover:bg-zinc-800 transition duration-300 rounded flex items-start"
              >
                <i className="far fa-file-lines text-lg text-primary mt-1"></i>
                <span>
                  <span className="block text-base font-medium">
                    {post.keyword}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                    {post.description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
