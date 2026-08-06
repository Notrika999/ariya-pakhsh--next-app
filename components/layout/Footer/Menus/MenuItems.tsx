import Link from "next/link";
import React from "react";

export default function MenuItems({ parentTitle, subMenus = [] }: { parentTitle: string, subMenus: { id: number, title: string, link: string, new: boolean }[] }) {
  return (
    <div className="w-12/12 sm:w-6/12 md:w-3/12">
      <div className="mb-2">
        <span 
          className="mb-2 text-gray-900 dark:text-gray-200 text-nowrap text-sm md:text-md"
          dangerouslySetInnerHTML={{ __html: parentTitle }}
        ></span>

        <nav className="flex flex-col space-y-2">
          <nav className="flex flex-col space-y-2">
            {subMenus.map((subMenu) => (
              <Link
                key={subMenu.id}
                href={subMenu.link}
                className="py-1 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 text-xs md:text-sm flex items-center"
              >
                {subMenu.title}

                {/* فقط اگر new = true بود، بجاش این span رو نشون بده */}
                {subMenu.new && (
                  <span className="bg-secondary-500 text-white text-xs rounded-full px-2 py-1 ms-2">
                    جدید
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </nav>
      </div>
    </div>
  );
}
