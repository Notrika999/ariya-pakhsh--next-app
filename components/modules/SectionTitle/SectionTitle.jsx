// components/modules/SectionTitle/SectionTitle.jsx
import React from "react";

const titleBaseClasses =
  "font-bold text-lg md:mb-4 relative text-gray-900 dark:text-gray-200";

const titleAfterClasses =
  "md:pb-4 pb-2 before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary after:absolute after:w-40 md:after:h-2 after:h-1.5 after:bottom-0 after:inset-s-4 after:bg-primary after:rounded-lg";

export default function SectionTitle({ title, noAfter = false }) {
  return (
    <div className="md:pt-5 pt-2">
      <h2 className={[titleBaseClasses, noAfter ? "" : titleAfterClasses].join(" ")}>
        {title}
      </h2>
    </div>
  );
}
