import Link from "next/link";
import React from "react";

export default function Breadcrumb({ title, active, href }) {
  return (
    <nav className="w-full py-3" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center text-sm font-medium text-gray-700 dark:text-gray-400">
        {/* <!-- Home --> */}
        <li>
          <Link
            href="/"
            className="flex items-center hover:text-primary transition-colors"
          >
            <svg
              className="w-4 h-4 ms-1 me-2 text-gray-500 dark:text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
            </svg>
            خانه
          </Link>
        </li>

        {/* <!-- Divider --> */}
        {href && (
          <>
            <li className="flex items-center mx-2 text-gray-400">
              <svg
                className="w-3 h-3 rtl:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </li>

            <li>
              <Link
                href={href}
                className="hover:text-primary transition-colors"
              >
                {title}
              </Link>
            </li>
          </>
        )}

        {/* <!-- Divider --> */}
        <li className="flex items-center mx-2 text-gray-400">
          <svg
            className="w-3 h-3 rtl:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
        </li>

        {/* <!-- Active Page --> */}
        <li
          aria-current="page"
          className="truncate max-w-[200px] sm:max-w-[300px] md:max-w-none text-gray-500 dark:text-gray-400"
        >
          {active}
        </li>
      </ol>
    </nav>
  );
}
