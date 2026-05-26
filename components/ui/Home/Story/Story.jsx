"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import StoryItem from "./StoryItem";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

import storyStyle from "./Story.module.css";
import Image from "next/image";

export default function Story({ stories }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [seen, setSeen] = useState(new Set());
  const timerRef = useRef(null);
  const startTs = useRef(0);
  const touchStartX = useRef(0);
  const videoRef = useRef(null);

  // باز کردن استوری از روی آیتم
  const openStory = (idx) => {
    setIndex(idx);
    setOpen(true);
    setProgress(0);
  };

  const current = stories[index];
  const duration = current?.duration ?? 0;

  // تایمر و پیشرفت هر استوری
  useEffect(() => {
    if (!open) return;

    setProgress(0);
    startTs.current = performance.now();

    let rafId = null;
    const step = () => {
      if (!open) return;
      if (duration > 0) {
        const elapsed = performance.now() - startTs.current;
        const p = Math.min(1, elapsed / duration);
        setProgress(p);
        if (p >= 1) {
          // استوری فعلی دیده شد
          setSeen((prev) => {
            const s = new Set(prev);
            s.add(index);
            return s;
          });
          // برو به استوری بعدی با دور زدن (wrap)
          const next = (index + 1) % stories.length;
          setIndex(next);
          return; // توقف تا استوری بعدی با رندر جدید آغاز شود
        } else {
          RafLoop();
        }
      }
    };

    const RafLoop = () => {
      rafId = requestAnimationFrame(step);
      timerRef.current = rafId;
    };

    RafLoop();
    return () => cancelAnimationFrame(rafId);
  }, [open, index]);

  // به کار افتادن دوباره تایمر وقتی index یا open تغییر می‌کند
  useEffect(() => {
    if (!open) return;
    setProgress(0);
    startTs.current = performance.now();
  }, [index, open]);

  // ناوبري با دکمه‌ها
  const goPrev = () => {
    const prev = (index - 1 + stories.length) % stories.length;
    setIndex(prev);
    setProgress(0);
  };
  const goNext = () => {
    const next = (index + 1) % stories.length;
    setIndex(next);
    setProgress(0);
  };

  const close = () => {
    setOpen(false);
  };

  // swipe با تاچ
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

  return (
    // <!-- STORY SECTION -->
    <>
      <h2 className="sr-only">استوری های فروشگاه</h2>
      {/* <!-- for seo --> */}

      <div
        className={`${storyStyle.storiesContainer} mx-auto`}
        role="region"
        aria-labelledby="stories-title"
      >
        <h3 className="sr-only">استوری های فروشگاه</h3>
        <Swiper
          className={`my-swiper ${storyStyle.storySwiper}`}
          modules={[FreeMode]}
          freeMode={false}
          centeredSlides={false}
          slidesPerView="auto"
          allowTouchMove={true}
          spaceBetween={24}
        >
          {stories.map((story, idx) => (
            <SwiperSlide className={storyStyle.storySlide} key={idx}>
              <StoryItem
                image={story.avatar}
                title={story.user}
                onOpen={() => openStory(idx)}
                index={idx}
                viewed={seen.has(idx)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {open && (
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

            <div className={storyStyle.storyContent}>
              {/* MEDIA */}
              <div className={storyStyle.imageHolder}>
                {current.type === "video" ? (
                  <video
                    ref={videoRef}
                    src={current.url}
                    className={storyStyle.storyImage}
                    autoPlay
                    playsInline
                    onTimeUpdate={(e) => {
                      const el = e.target;
                      if (el.duration > 0) {
                        setProgress(el.currentTime / el.duration);
                      }
                    }}
                    onEnded={() => {
                      setSeen((prev) => {
                        const s = new Set(prev);
                        s.add(index);
                        return s;
                      });

                      const next = (index + 1) % stories.length;
                      setIndex(next);
                    }}
                  />
                ) : (
                  <Image
                    width={1027}
                    height={740}
                    src={current.url}
                    alt={current.user}
                    className={storyStyle.storyImage}
                  />
                )}
              </div>

              {/* TOP INFO */}
              <div className={storyStyle.topOverlay}>
                <div className={storyStyle.storyUser}>
                  <Image
                    src={current.avatar}
                    alt={current.user}
                    width={44}
                    height={44}
                    className={storyStyle.userAvatar}
                  />

                  <div>
                    <h3>{current.title}</h3>
                    <p>{current.user}</p>
                  </div>
                </div>
              </div>

              {/* CENTER TEXT */}
              <div className={storyStyle.centerCaption}>
                <h2>{current.title}</h2>
                <p>{current.description}</p>
              </div>

              {/* ACTIONS */}
              <div className={storyStyle.actions}>
                <button>
                  ❤️
                  <span>{current.likes}</span>
                </button>

                <button>
                  💬
                  <span>{current.comments}</span>
                </button>
              </div>

              {/* VIDEO TIME */}
              <div className={storyStyle.videoTime}>
                {videoRef.current
                  ? Math.floor(videoRef.current.currentTime)
                  : 0}
                s
              </div>

              {/* PRODUCT CARD */}
              {current.product && (
                <div className={storyStyle.productCard}>
                  <div className={storyStyle.productInfo}>
                    <h4>{current.product.title}</h4>
                    <span>{current.product.price}</span>
                  </div>

                  <Image
                    src={current.product.image}
                    alt={current.product.title}
                    width={80}
                    height={80}
                    className={storyStyle.productImage}
                  />
                </div>
              )}
            </div>

            {/* <div className={storyStyle.imageHolder}>
              <div className={storyStyle.imageHolder}>
                {current.type === "video" ? (
                  <video
                    ref={videoRef}
                    src={current.url}
                    className={storyStyle.storyImage}
                    autoPlay
                    playsInline
                    onTimeUpdate={(e) => {
                      const el = e.target;
                      if (el.duration > 0) {
                        setProgress(el.currentTime / el.duration);
                      }
                    }}
                    onEnded={() => {
                      // وقتی ویدیو تمام شد، برو استوری بعدی
                      setSeen((prev) => {
                        const s = new Set(prev);
                        s.add(index);
                        return s;
                      });
                      const next = (index + 1) % stories.length;
                      setIndex(next);
                    }}
                  />
                ) : (
                  <Image
                    width={1027}
                    height={740}
                    src={current.url}
                    alt={current.user}
                    className={storyStyle.storyImage ?? "/images/default.png"}
                  />
                )}
              </div>
            </div>

            <div className={storyStyle.progressBar} aria-hidden="true">
              {stories.map((s, i) => (
                <div
                  key={i}
                  className={`${storyStyle.progressItem} ${i === index ? storyStyle.active : ""} ${
                    seen.has(i) ? storyStyle.seen : ""
                  }`}
                  style={{
                    width: `${100 / stories.length}%`,
                    "--progress": i === index ? `${progress * 100}%` : "0%",
                  }}
                />
              ))}
            </div> */}
          </div>
        </div>
      )}
    </>
    // <!-- END STORY SECTION -->
  );
}
