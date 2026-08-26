import Link from "next/link";
import React from "react";
import SectionTitle from "../SectionTitle/SectionTitle";

/**
 * @param {{ title: React.ReactNode; href?: string | false }} props
 */
export default function SectionHeader({ title, href = false }) {
  return (
    <header className="flex flex-wrap justify-between items-center">
      <SectionTitle title={title} />

      {href && (
        <Link
          href={href}
          className="text-xs font-medium bg-primary text-white py-1 px-4 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white"
        >
          مشاهده همه
        </Link>
      )}
    </header>
  );
}
