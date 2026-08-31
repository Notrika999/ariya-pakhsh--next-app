"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Maximize2 } from "lucide-react";
import storyStyle from "./Story.module.css";
import {
  disableNativePictureInPicture,
  getStoryActionLink,
  getStoryActionText,
  resolveStoryHref,
} from "./story-links";

const STORY_MINIMIZE_EVENT = "home-story:minimize";

export default function StoryMiniPlayer() {
  const [player, setPlayer] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  useEffect(() => {
    const handleMinimize = (event) => {
      setPlayer(event.detail ?? null);
      setExpanded(false);
      setVideoLoading(true);
    };

    window.addEventListener(STORY_MINIMIZE_EVENT, handleMinimize);
    return () => {
      window.removeEventListener(STORY_MINIMIZE_EVENT, handleMinimize);
    };
  }, []);

  if (!player?.story || !player?.frame) return null;

  const { story, frame, link } = player;
  const isVideo = frame.mediaType === "Video";
  const href =
    resolveStoryHref(getStoryActionLink(frame, story) ?? link) ||
    story.href ||
    null;

  if (expanded) {
    return (
      <div
        className={storyStyle.overlay}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setExpanded(false);
        }}
        role="dialog"
        aria-label="Story viewer"
      >
        <div className={storyStyle.viewport}>
          <button
            type="button"
            className={storyStyle.closeBtn}
            onClick={() => setPlayer(null)}
            aria-label="بستن"
          >
            ×
          </button>
          <button
            type="button"
            className={storyStyle.minimizeBtn}
            onClick={() => setExpanded(false)}
            aria-label="کوچک کردن"
          >
            −
          </button>

          <div className={storyStyle.storyContent}>
            <div className={storyStyle.imageHolder}>
              {isVideo ? (
                <video
                  ref={disableNativePictureInPicture}
                  src={frame.videoUrl}
                  poster={frame.posterUrl ?? story.thumbnailUrl}
                  className={storyStyle.storyImage}
                  autoPlay
                  playsInline
                  controls
                  disablePictureInPicture
                  disableRemotePlayback
                  controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                  onLoadStart={() => setVideoLoading(true)}
                  onWaiting={() => setVideoLoading(true)}
                  onCanPlay={() => setVideoLoading(false)}
                  onPlaying={() => setVideoLoading(false)}
                />
              ) : (
                <Image
                  width={1027}
                  height={740}
                  src={frame.imageUrl}
                  alt={story.title}
                  className={storyStyle.storyImage}
                />
              )}
              {isVideo && videoLoading ? (
                <div className={storyStyle.videoLoadingOverlay}>
                  <span className={storyStyle.pauseLoader} aria-hidden="true">
                    <i />
                    <i />
                  </span>
                </div>
              ) : null}
            </div>

            <div className={storyStyle.centerCaption}>
              <h2>{story.title}</h2>
              {story.subtitle ? <p>{story.subtitle}</p> : null}
            </div>

            {href ? (
              <Link href={href} className={storyStyle.productCard}>
                <div className={storyStyle.productInfo}>
                  <h4>{story.title}</h4>
                  <span>{getStoryActionText(story, link)}</span>
                </div>

                <Image
                  src={story.thumbnailUrl}
                  alt={story.title}
                  width={80}
                  height={80}
                  className={storyStyle.productImage}
                />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside className={storyStyle.miniPlayer} aria-label="استوری کوچک‌شده">
      <button
        type="button"
        className={storyStyle.miniCloseBtn}
        onClick={() => setPlayer(null)}
        aria-label="بستن استوری کوچک‌شده"
      >
        ×
      </button>
      <button
        type="button"
        className={storyStyle.miniExpandBtn}
        onClick={() => setExpanded(true)}
        aria-label="بازگشت به حالت استوری"
      >
        <Maximize2 size={16} strokeWidth={2.4} />
      </button>

      <div className={storyStyle.miniMedia}>
        {isVideo ? (
          <video
            ref={disableNativePictureInPicture}
            src={frame.videoUrl}
            poster={frame.posterUrl ?? story.thumbnailUrl}
            className={storyStyle.miniMediaElement}
            autoPlay
            playsInline
            controls
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            onLoadStart={() => setVideoLoading(true)}
            onWaiting={() => setVideoLoading(true)}
            onCanPlay={() => setVideoLoading(false)}
            onPlaying={() => setVideoLoading(false)}
          />
        ) : (
          <Image
            src={frame.imageUrl}
            alt={story.title}
            width={168}
            height={224}
            className={storyStyle.miniMediaElement}
          />
        )}
        {isVideo && videoLoading ? (
          <div className={storyStyle.miniLoadingOverlay}>
            <span className={storyStyle.pauseLoader} aria-hidden="true">
              <i />
              <i />
            </span>
          </div>
        ) : null}
      </div>

      {href ? (
        <Link href={href} className={storyStyle.miniLink}>
          <span>{story.title}</span>
          <small>{getStoryActionText(story, link)}</small>
        </Link>
      ) : (
        <div className={storyStyle.miniLink}>
          <span>{story.title}</span>
        </div>
      )}
    </aside>
  );
}
