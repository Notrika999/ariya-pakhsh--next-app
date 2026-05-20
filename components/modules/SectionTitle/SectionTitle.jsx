import React from "react";

export default function SectionTitle({ title }) {
  return (
    <div className="py-5">
      <h2
        className="font-bold text-lg mb-4 relative pb-4 text-gray-900 dark:text-gray-200
                before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary
                after:absolute after:w-40 after:h-2 after:bottom-0 after:inset-s-4 after:bg-primary after:rounded-lg"
      >
        {title}
      </h2>
    </div>
  );
}
