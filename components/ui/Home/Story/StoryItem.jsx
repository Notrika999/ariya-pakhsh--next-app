import React from "react";

import storyStyle from "./Story.module.css";
import Image from "next/image";
import { Play } from "lucide-react";

export default function StoryItem({
  image,
  title,
  onOpen,
  index,
  viewed,
  hasVideo,
}) {
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
        {hasVideo ? (
          <span className={storyStyle.storyPlayBadge} aria-hidden="true">
            <Play size={18} fill="currentColor" strokeWidth={2.4} />
          </span>
        ) : null}
      </div>
      <div className={`dark:text-white! ${storyStyle.storyUsername}`}>
        {title}
      </div>
    </div>
  );
}
