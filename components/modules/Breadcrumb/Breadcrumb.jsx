import Link from "next/link";
import React from "react";

export default function Breadcrumb({ title, active, href, items }) {
  console.log(items)
  return (
    <nav className="w-full py-3" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center text-sm font-medium text-gray-700 dark:text-gray-400">
        {/* <!-- Home --> */}
        <li>
          <Link
            href="/"
            className="flex items-center hover:text-primary transition-colors"
          >
            <i className="fas fa-house me-2 text-gray-500 dark:text-gray-400"></i>
           
            خانه
          </Link>
        </li>

        {/* <!-- Divider --> */}
        {href && (
          <>
            {/* <li className="flex items-center mx-2 text-gray-400">
             <i className="fas fa-angle-left"></i>
            </li> */}

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
        {/* <li className="flex items-center mx-2 text-gray-400">
          <i className="fas fa-angle-left"></i>
        </li> */}

        {/* <!-- Active Page --> */}
        <li
          aria-current="page"
          className="truncate max-w-[200px] sm:max-w-[300px] md:max-w-none text-gray-500 dark:text-gray-400"
        >
          {active}
        </li>

        {
          items.map((item) => (
           

            <li key={item.id}>
              <i className="fas fa-angle-left text-gray-400"></i>
              <span
                className="hover:text-primary transition-colors"
              >
                {item.name}
              </span>
            </li>
      
          ))
        }
      </ol>
    </nav>
  );
}
