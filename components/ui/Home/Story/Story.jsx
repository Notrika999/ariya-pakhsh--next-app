"use client";
// components/ui/Home/Story/Story.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import StoryItem from "./StoryItem";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

import storyStyle from "./Story.module.css";
import Image from "next/image";
import Link from "next/link";
import {
  disableNativePictureInPicture,
  getStoryActionText,
  resolveStoryHref,
} from "./story-links";
import { Pause, Play } from "lucide-react";
import { trackHomeLayoutItemView } from "@/src/services/home/home-layout.client";

const STORY_MINIMIZE_EVENT = "home-story:minimize";
const VIDEO_CONTROLS_VISIBLE_MS = 2200;

export default function Story({ stories }) {
  const [open, setOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [videoControlsVisible, setVideoControlsVisible] = useState(true);
  const [seen, setSeen] = useState(new Set());
  const [storyMotion, setStoryMotion] = useState(null);

  const startTs = useRef(0);
  const touchStartX = useRef(0);
  const videoRef = useRef(null);
  const advancingRef = useRef(false);

  const storyList = useMemo(
    () => (Array.isArray(stories) ? stories : []),
    [stories],
  );
  const storyCount = storyList.length;
  const currentStory = storyList[storyIndex] ?? null;
  const frames = currentStory?.frames ?? [];
  const currentFrame = frames[frameIndex] ?? null;
  const isVideo = currentFrame?.mediaType === "Video";
  const duration = currentFrame?.durationMs ?? 5000;
  const actionLink = currentFrame?.link ?? currentStory?.link;
  const actionHref = resolveStoryHref(actionLink);

  const resetFrameState = useCallback(() => {
    setProgress(0);
    setVideoCurrentTime(0);
    setVideoLoading(true);
    setVideoPaused(false);
    setVideoControlsVisible(true);
  }, []);

  const openStory = useCallback(
    (idx) => {
      const story = storyList[idx];
      if (story?.id) {
        trackHomeLayoutItemView(story.id);
      }

      setStoryIndex(idx);
      setFrameIndex(0);
      setStoryMotion(null);
      setOpen(true);
      advancingRef.current = false;
      resetFrameState();
    },
    [resetFrameState, storyList],
  );

  const goPrev = useCallback(() => {
    if (storyCount === 0) return;

    advancingRef.current = false;

    if (frameIndex > 0) {
      setStoryMotion(null);
      setFrameIndex((prev) => prev - 1);
      resetFrameState();
      return;
    }

    const prevStoryIndex = (storyIndex - 1 + storyCount) % storyCount;
    const prevFramesCount = storyList[prevStoryIndex]?.frames?.length ?? 1;
    setStoryMotion("prev");
    setStoryIndex(prevStoryIndex);
    setFrameIndex(Math.max(prevFramesCount - 1, 0));
    resetFrameState();
  }, [frameIndex, resetFrameState, storyCount, storyIndex, storyList]);

  const goNext = useCallback(() => {
    if (storyCount === 0 || advancingRef.current) return;

    advancingRef.current = true;

    if (frameIndex < frames.length - 1) {
      setStoryMotion(null);
      setFrameIndex((prev) => prev + 1);
      resetFrameState();
      return;
    }

    if (currentStory?.id) {
      setSeen((prev) => new Set(prev).add(currentStory.id));
    }

    const nextStoryIndex = (storyIndex + 1) % storyCount;
    setStoryMotion("next");
    setStoryIndex(nextStoryIndex);
    setFrameIndex(0);
    resetFrameState();
  }, [
    currentStory,
    frameIndex,
    frames.length,
    resetFrameState,
    storyCount,
    storyIndex,
  ]);

  const close = useCallback(() => {
    setOpen(false);
    resetFrameState();
  }, [resetFrameState]);

  const minimize = useCallback(() => {
    if (!currentStory || !currentFrame) return;

    window.dispatchEvent(
      new CustomEvent(STORY_MINIMIZE_EVENT, {
        detail: {
          story: currentStory,
          frame: currentFrame,
          link: actionLink,
        },
      }),
    );
    setOpen(false);
  }, [actionLink, currentFrame, currentStory]);

  useEffect(() => {
    advancingRef.current = false;
  }, [currentFrame?.id, storyIndex]);

  useEffect(() => {
    if (!open || !currentFrame || isVideo) return;

    startTs.current = performance.now();

    let rafId = null;
    const step = () => {
      const elapsed = performance.now() - startTs.current;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);

      if (p >= 1) {
        goNext();
      } else {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [currentFrame, duration, goNext, isVideo, open]);

  useEffect(() => {
    if (!open || !isVideo) return;

    if (videoLoading || videoPaused || !videoControlsVisible) return;

    const timer = window.setTimeout(() => {
      setVideoControlsVisible(false);
    }, VIDEO_CONTROLS_VISIBLE_MS);

    return () => window.clearTimeout(timer);
  }, [isVideo, open, videoControlsVisible, videoLoading, videoPaused]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  const setVideoNode = useCallback((node) => {
    videoRef.current = node;
    disableNativePictureInPicture(node);
  }, []);

  const showVideoControls = useCallback(() => {
    if (!isVideo) return;
    setVideoControlsVisible(true);
  }, [isVideo]);

  const toggleVideoPlayback = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    setVideoControlsVisible(true);

    if (video.paused) {
      try {
        await video.play();
        setVideoPaused(false);
      } catch {
        setVideoPaused(true);
      }
      return;
    }

    video.pause();
    setVideoPaused(true);
  }, [isVideo]);

  if (storyCount === 0) return null;

  return (
    <>
      <h2 className="sr-only">استوری‌های فروشگاه</h2>

      <div
        className={`${storyStyle.storiesContainer} mx-auto`}
        role="region"
        aria-labelledby="stories-title"
      >
        <h3 className="sr-only">استوری‌های فروشگاه</h3>
        <Swiper
          className={`my-swiper ${storyStyle.storySwiper}`}
          modules={[FreeMode]}
          freeMode={false}
          centeredSlides={false}
          slidesPerView="auto"
          allowTouchMove={true}
          spaceBetween={2}
        >
          {storyList.map((story, idx) => (
            <SwiperSlide className={storyStyle.storySlide} key={story.id}>
              <StoryItem
                image={story.thumbnailUrl}
                title={story.title}
                onOpen={() => openStory(idx)}
                index={idx}
                viewed={seen.has(story.id)}
                hasVideo={story.frames?.some(
                  (frame) => frame.mediaType === "Video",
                )}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {open && currentStory && currentFrame ? (
        <div
          className={storyStyle.overlay}
          onMouseDown={(e) => e.target === e.currentTarget && close()}
          role="dialog"
          aria-label="Story viewer"
        >
          <div
            className={storyStyle.viewport}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <button
              className={storyStyle.closeBtn}
              onClick={close}
              aria-label="بستن"
            >
              ×
            </button>
            <button
              className={storyStyle.minimizeBtn}
              onClick={minimize}
              aria-label="کوچک کردن"
            >
              −
            </button>
            <button
              className={storyStyle.prevBtn}
              onClick={goPrev}
              aria-label="قبلی"
            >
              ‹
            </button>
            <button
              className={storyStyle.nextBtn}
              onClick={goNext}
              aria-label="بعدی"
            >
              ›
            </button>

            <div className={storyStyle.progressBar} aria-hidden="true">
              {frames.map((frame, idx) => {
                const fill =
                  idx < frameIndex ? 1 : idx === frameIndex ? progress : 0;

                return (
                  <div key={frame.id} className={storyStyle.progressItem}>
                    <span
                      className={storyStyle.progressFill}
                      style={{ transform: `scaleX(${fill})` }}
                    />
                  </div>
                );
              })}
            </div>

            <div
              key={currentStory.id}
              className={`${storyStyle.storyContent} ${
                storyMotion === "next"
                  ? storyStyle.storyEnterNext
                  : storyMotion === "prev"
                    ? storyStyle.storyEnterPrev
                    : ""
              }`}
            >
              <div
                key={currentFrame.id}
                className={`${storyStyle.imageHolder} ${storyStyle.frameEnter}`}
                onClick={showVideoControls}
              >
                {isVideo ? (
                  <video
                    ref={setVideoNode}
                    src={currentFrame.videoUrl}
                    poster={currentFrame.posterUrl ?? currentStory.thumbnailUrl}
                    className={storyStyle.storyImage}
                    autoPlay
                    playsInline
                    disablePictureInPicture
                    disableRemotePlayback
                    controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                    onLoadStart={() => setVideoLoading(true)}
                    onWaiting={() => setVideoLoading(true)}
                    onCanPlay={() => setVideoLoading(false)}
                    onPlaying={() => {
                      setVideoLoading(false);
                      setVideoPaused(false);
                    }}
                    onPause={() => setVideoPaused(true)}
                    onTimeUpdate={(e) => {
                      const el = e.target;
                      const fallbackSeconds = duration / 1000;
                      const total =
                        Number.isFinite(el.duration) && el.duration > 0
                          ? el.duration
                          : fallbackSeconds;
                      if (total > 0) {
                        setVideoCurrentTime(el.currentTime);
                        setProgress(Math.min(1, el.currentTime / total));
                      }
                    }}
                    onEnded={goNext}
                  />
                ) : (
                  <Image
                    width={1027}
                    height={740}
                    src={currentFrame.imageUrl}
                    alt={currentStory.title}
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
                {isVideo &&
                !videoLoading &&
                (videoPaused || videoControlsVisible) ? (
                  <button
                    type="button"
                    className={storyStyle.videoToggleBtn}
                    onClick={(event) => {
                      event.stopPropagation();
                      void toggleVideoPlayback();
                    }}
                    aria-label={videoPaused ? "پخش ویدیو" : "توقف ویدیو"}
                  >
                    {videoPaused ? (
                      <Play size={34} fill="currentColor" strokeWidth={2.4} />
                    ) : (
                      <Pause size={34} fill="currentColor" strokeWidth={2.4} />
                    )}
                  </button>
                ) : null}
              </div>

              {/* <div className={storyStyle.centerCaption}>
                <h2>{currentStory.title}</h2>
                {currentStory.subtitle ? <p>{currentStory.subtitle}</p> : null}
              </div>

              {isVideo ? (
                <div className={storyStyle.videoTime}>
                  {Math.floor(videoCurrentTime)}s
                </div>
              ) : null} */}

              {actionHref ? (
                <Link href={actionHref} className={storyStyle.productCard}>
                  <div className={storyStyle.productInfo}>
                    <h4>{currentStory.title}</h4>
                    <span>{getStoryActionText(currentStory, actionLink)}</span>
                  </div>

                  <Image
                    src={currentStory.thumbnailUrl}
                    alt={currentStory.title}
                    width={80}
                    height={80}
                    className={storyStyle.productImage}
                  />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
