import React from "react";

import styleTitleAftr from "./TitleAfter.module.css";
export default function TitleAfter({ title, tag }) {
  return (
    <>
      {!tag ? (
        <h3
          className={`font-black text-xl dark:text-gray-200 mb-4 ${styleTitleAftr.withHighlight}`}
        >
          <span className="relative z-2">{title}</span>
        </h3>
      ) : (
        <h1
          className={`font-black text-2xl dark:text-gray-200 mb-2  ${styleTitleAftr.withHighlight}`}
        >
          <span className="relative z-2">{title}</span>
        </h1>
      )}
    </>
  );
}
