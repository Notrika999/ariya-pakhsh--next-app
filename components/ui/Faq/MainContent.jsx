"use client";
import React, { useState } from "react";

export default function MainContent({ content }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="faq-item bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700"
      data-category="shipping"
    >
      <button
        onClick={() => setOpen(!open)}
        className="faq-question w-full flex justify-between items-center text-right"
      >
        <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
          {content.title}
        </span>

        <svg
          className={`w-6 h-6 text-blue-600 dark:text-blue-400 transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`faq-answer mt-4 text-gray-600 dark:text-gray-400 ${
          open ? "block" : "hidden"
        }`}
      >
        <p>{content.subTitle}</p>

        <ul className="list-disc list-inside mt-2 space-y-2">
          {content?.items?.map((i) => (
            <li key={i.id}>{i.content}</li>
          ))}
        </ul>

        <p className="mt-3">{content?.details}</p>
      </div>
    </div>
  );
}
