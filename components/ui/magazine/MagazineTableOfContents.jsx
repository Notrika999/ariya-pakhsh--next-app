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
    <ol className={collapsible ? "mt-3 space-y-1.5" : "space-y-1.5"}>
      {items.map((item) => {
        const isActive = item.anchor === activeAnchor;

        return (
          <li key={item.anchor}>
            <a
              href={`#${item.anchor}`}
              aria-current={isActive ? "true" : undefined}
              className={`block text-sm leading-6 transition-colors ${
                item.level > 2 ? "pr-3 text-[13px]" : ""
              } ${
                isActive
                  ? "font-bold text-primary"
                  : "text-gray-600 hover:text-primary dark:text-gray-300"
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
      <details className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-custom-dark">
        <summary className="cursor-pointer text-sm font-bold text-gray-900 dark:text-white">
          فهرست مطالب
        </summary>
        {list}
      </details>
    );
  }

  return (
    <nav
      aria-label="فهرست مطالب"
      className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-custom-dark"
    >
      <p className="mb-3 text-sm font-bold text-gray-900 dark:text-white">
        فهرست مطالب
      </p>
      {list}
    </nav>
  );
}
