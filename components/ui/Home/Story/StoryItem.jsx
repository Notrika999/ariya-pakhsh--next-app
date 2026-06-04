import React from "react";

import storyStyle from "./Story.module.css";
import Image from "next/image";
export default function StoryItem({ image, title, onOpen, index, viewed }) {
  return (
    <div
      className={`${storyStyle.story}`}
      data-index={index}
      onClick={onOpen}
      role="button"
      aria-label={`باز کردن استوری ${title}`}
    >
      <div
        className={`${storyStyle.storyAvatar} ${viewed ? storyStyle.viewed : ""}`}
      >
        <Image
          width={100}
          height={100}
          src={image ?? "/images/default.png"}
          alt={title}
          onError={(e) => {
            e.target.src = "https://picsum.photos/70";
          }}
        />
      </div>
      <div className={`dark:text-white! ${storyStyle.storyUsername}`}>
        {title}
      </div>
    </div>
  );
}
