"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const READING_OFFSET = 140;

function getActiveAnchor(anchors) {
  let current = anchors[0] || "";

  for (const anchor of anchors) {
    const heading = document.getElementById(anchor);
    if (!heading) continue;
    if (heading.getBoundingClientRect().top <= READING_OFFSET) {
      current = anchor;
    }
  }

  return current;
}

export default function MagazineTableOfContents({
  items = [],
  collapsible = false,
}) {
  const anchors = useMemo(
    () => items.map((item) => item.anchor).filter(Boolean),
    [items],
  );
  const [activeAnchor, setActiveAnchor] = useState(anchors[0] || "");
  const frame = useRef(0);

  useEffect(() => {
    if (!anchors.length) return undefined;

    const update = () => {
      setActiveAnchor(getActiveAnchor(anchors));
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
  }, [anchors]);

  if (!items.length) return null;

  const list = (
<<<<<<< HEAD
    <ol className={collapsible ? "mt-3 space-y-1" : "space-y-1"}>
=======
    <ol className={collapsible ? "mt-3 space-y-1.5" : "space-y-1.5"}>
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      {items.map((item) => {
        const isActive = item.anchor === activeAnchor;

        return (
          <li key={item.anchor}>
            <a
              href={`#${item.anchor}`}
              aria-current={isActive ? "true" : undefined}
<<<<<<< HEAD
              className={`relative block rounded-lg px-3 py-2 text-sm leading-6 transition-colors ${
                item.level > 2 ? "me-3 text-[13px]" : ""
              } ${
                isActive
                  ? "bg-slate-900 font-bold text-white shadow-sm dark:bg-slate-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-gray-300 dark:hover:bg-zinc-800"
=======
              className={`block text-sm leading-6 transition-colors ${
                item.level > 2 ? "pr-3 text-[13px]" : ""
              } ${
                isActive
                  ? "font-bold text-primary"
                  : "text-gray-600 hover:text-primary dark:text-gray-300"
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
              }`}
            >
              {item.title}
            </a>
          </li>
        );
      })}
    </ol>
  );

  if (collapsible) {
    return (
<<<<<<< HEAD
      <details className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-slate-900 marker:content-none dark:text-white">
          <span className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-slate-900 text-white dark:bg-slate-700" aria-hidden="true">
              <i className="far fa-list-ul" />
            </span>
            فهرست مطالب
          </span>
          <i className="fas fa-angle-down text-slate-400 transition group-open:rotate-180" aria-hidden="true" />
=======
      <details className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-custom-dark">
        <summary className="cursor-pointer text-sm font-bold text-gray-900 dark:text-white">
          فهرست مطالب
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
        </summary>
        {list}
      </details>
    );
  }

  return (
    <nav
      aria-label="فهرست مطالب"
<<<<<<< HEAD
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_20px_55px_-42px_rgba(15,23,42,0.7)] dark:border-zinc-800 dark:bg-custom-dark"
    >
      <div className="mb-3 flex items-center gap-3 border-b border-slate-200 px-2 pb-3 dark:border-zinc-800">
        <span className="grid size-9 place-items-center rounded-xl bg-slate-900 text-white dark:bg-slate-700" aria-hidden="true">
          <i className="far fa-list-ul" />
        </span>
        <span>
          <span className="block text-sm font-bold text-slate-900 dark:text-white">فهرست مطالب</span>
          <span className="mt-0.5 block text-[10px] text-slate-400">دسترسی سریع به بخش‌ها</span>
        </span>
      </div>
      <div className="max-h-[calc(100vh-11rem)] overflow-y-auto pe-1">
        {list}
      </div>
=======
      className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-custom-dark"
    >
      <p className="mb-3 text-sm font-bold text-gray-900 dark:text-white">
        فهرست مطالب
      </p>
      {list}
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    </nav>
  );
}
