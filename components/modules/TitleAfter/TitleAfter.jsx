import React from "react";

import styleTitleAftr from "./TitleAfter.module.css";
export default function TitleAfter({ title, tag }) {
  return (
    <>
      {!tag ? (
        <h3
          className={`font-black text-2xl dark:text-gray-200 mb-6 ${styleTitleAftr.withHighlight}`}
        >
          <span className="relative z-2">{title}</span>
        </h3>
      ) : (
        <h1
          className={`font-black text-4xl dark:text-gray-200  ${styleTitleAftr.withHighlight}`}
        >
          <span className="relative z-2">{title}</span>
        </h1>
      )}
    </>
  );
}
