"use client";

import { useEffect, useRef, useState } from "react";
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
  const rect = element.getBoundingClientRect();
  const height = rect.height;
  if (!height) return 0;

  const readingLine = window.innerHeight - 48;
  return clamp((readingLine - rect.top) / height);
}

export default function MagazineReadingProgress({
  articleId,
  contentId = "magazine-article-content",
}) {
  const [progress, setProgress] = useState(0);
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
      const next = getContentProgress(content);
      setProgress(next);

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
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, [articleId, contentId]);

  const percent = Math.round(progress * 100);
  const percentLabel = new Intl.NumberFormat("fa-IR").format(percent);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-2 backdrop-blur-sm dark:border-zinc-700 dark:bg-[#0d1117]/95"
      role="progressbar"
      aria-label="میزان مطالعه مقاله"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
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
  );
}
