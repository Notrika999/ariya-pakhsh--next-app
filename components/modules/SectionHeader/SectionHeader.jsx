import Link from "next/link";
import React from "react";
import SectionTitle from "../SectionTitle/SectionTitle";

export default function SectionHeader({ title, href }) {
  return (
    <header className="flex flex-wrap  justify-between items-center">
      {/* <!-- title --> */}
      <SectionTitle title={title} />

      {/* <!-- link --> */}
      {href && (
        <Link
          href={href}
          className="text-xs font-medium bg-primary text-white py-1.5 px-4 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white"
        >
          مشاهده همه
        </Link>
      )}
    </header>
  );
}
