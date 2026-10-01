"use client";

import { useEffect, useRef, useState } from "react";
<<<<<<< HEAD
import { createPortal } from "react-dom";
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
import { trackMagazineArticleEvent } from "@/src/services/magazine/magazine.client";

const READ_THRESHOLDS = [
  { min: 0.25, eventType: "article25PercentRead" },
  { min: 0.5, eventType: "article50PercentRead" },
  { min: 0.75, eventType: "article75PercentRead" },
  { min: 0.98, eventType: "articleCompleted" },
];

function clamp(value) {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function getContentProgress(element) {
<<<<<<< HEAD
  const contentTop = element.getBoundingClientRect().top + window.scrollY;
  const contentHeight = element.offsetHeight;
  const startOffset = 112;
  const endOffset = Math.max(96, window.innerHeight - 96);
  const start = contentTop - startOffset;
  const end = contentTop + contentHeight - endOffset;
  const range = Math.max(1, end - start);
  const progress = clamp((window.scrollY - start) / range);

  return {
    progress,
    active: window.scrollY >= start && window.scrollY <= end + 2,
  };
=======
  const rect = element.getBoundingClientRect();
  const height = rect.height;
  if (!height) return 0;

  const readingLine = window.innerHeight - 48;
  return clamp((readingLine - rect.top) / height);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
}

export default function MagazineReadingProgress({
  articleId,
  contentId = "magazine-article-content",
}) {
  const [progress, setProgress] = useState(0);
<<<<<<< HEAD
  const [isActive, setIsActive] = useState(false);
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  const sentEvents = useRef(new Set());
  const frame = useRef(0);

  useEffect(() => {
    if (!articleId || sentEvents.current.has("articleViewed")) return;
    sentEvents.current.add("articleViewed");
    trackMagazineArticleEvent({
      articleId,
      eventType: "articleViewed",
    });
  }, [articleId]);

  useEffect(() => {
    const content = document.getElementById(contentId);
    if (!content) return undefined;

    const update = () => {
<<<<<<< HEAD
      const { progress: next, active } = getContentProgress(content);
      setProgress(next);
      setIsActive(active);
=======
      const next = getContentProgress(content);
      setProgress(next);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

      if (!articleId) return;
      for (const threshold of READ_THRESHOLDS) {
        if (next < threshold.min) continue;
        if (sentEvents.current.has(threshold.eventType)) continue;
        sentEvents.current.add(threshold.eventType);
        trackMagazineArticleEvent({
          articleId,
          eventType: threshold.eventType,
        });
      }
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(() => {
        frame.current = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
<<<<<<< HEAD
    const resizeObserver = new ResizeObserver(onScroll);
    resizeObserver.observe(content);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      resizeObserver.disconnect();
=======
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, [articleId, contentId]);

  const percent = Math.round(progress * 100);
  const percentLabel = new Intl.NumberFormat("fa-IR").format(percent);

<<<<<<< HEAD
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`pointer-events-none fixed inset-x-4 bottom-20 z-[70] transition duration-300 lg:inset-x-auto lg:bottom-5 lg:left-1/2 lg:w-[42rem] lg:-translate-x-1/2 ${
        isActive
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
=======
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-2 backdrop-blur-sm dark:border-zinc-700 dark:bg-[#0d1117]/95"
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      role="progressbar"
      aria-label="میزان مطالعه مقاله"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
<<<<<<< HEAD
      aria-hidden={!isActive}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/95 px-4 py-3 text-white shadow-[0_18px_45px_-20px_rgba(15,23,42,0.85)] backdrop-blur-md">
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/10 text-sm text-orange-300" aria-hidden="true">
          <i className="fas fa-book-open-reader" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <p className="text-[11px] font-medium text-slate-300">
              پیشرفت مطالعه
            </p>
            <p className="text-xs font-bold tabular-nums text-white">
              {percentLabel}٪
            </p>
          </div>
          <div className="flex h-1.5 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-150 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <div className="hidden size-10 shrink-0 place-items-center rounded-full border border-white/15 text-xs font-bold tabular-nums sm:grid">
          {percentLabel}
        </div>
      </div>
    </div>,
    document.body,
=======
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <p className="shrink-0 text-[11px] font-medium text-gray-500 dark:text-gray-400">
          پیشرفت مطالعه
        </p>
        <div className="flex h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-700">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-150 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="w-12 shrink-0 text-end text-xs font-semibold tabular-nums text-gray-700 dark:text-gray-200">
          {percentLabel}٪
        </p>
      </div>
    </div>
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  );
}
