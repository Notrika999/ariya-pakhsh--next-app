// components/modules/TabBar/TabBar.jsx
"use client";
 
import React, { useRef, useEffect } from "react";
 
/**
 * @typedef {{ id: string, label: string }} TabItem
 *
 * @param {{ navRef?: React.Ref, tabs: TabItem[] }} props
 */
export default function TabBar({ navRef: externalRef, tabs }) {
  const internalRef = useRef(null);
  const navRef = externalRef ?? internalRef;
 
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
 
    const getHeaderHeight = () =>
      document.querySelector("body > header")?.getBoundingClientRect().height ?? 0;
 
    const updateTop = () => {
      nav.style.top = `${getHeaderHeight() + 8}px`;
    };
 
    updateTop();
 
    const header = document.querySelector("body > header");
    const ro = header ? new ResizeObserver(updateTop) : null;
    ro?.observe(header);
    window.addEventListener("resize", updateTop);
 
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", updateTop);
    };
  }, [navRef]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const tabContainer = nav.querySelector("#tabContainer");
    const tabButtons = Array.from(nav.querySelectorAll(".tab-btn"));
    if (!tabContainer) return;
    if (!tabButtons.length) return;

    const scrollActiveTabIntoView = () => {
      const activeButton = nav.querySelector(
        ".tab-btn.bg-primary, .tab-btn[aria-selected='true']",
      );
      if (!activeButton) return;

      const containerRect = tabContainer.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const buttonCenter = buttonRect.left + buttonRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;

      tabContainer.scrollBy({
        left: buttonCenter - containerCenter,
        behavior: "smooth",
      });
    };

    const observer = new MutationObserver((mutations) => {
      const hasActiveChange = mutations.some(
        (mutation) =>
          mutation.type === "attributes" &&
          (mutation.attributeName === "class" ||
            mutation.attributeName === "aria-selected"),
      );

      if (hasActiveChange) scrollActiveTabIntoView();
    });

    tabButtons.forEach((button) => {
      observer.observe(button, {
        attributes: true,
        attributeFilter: ["class", "aria-selected"],
      });
    });

    const frameId = window.requestAnimationFrame(scrollActiveTabIntoView);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [navRef, tabs]);
 
  return (
    <nav
      ref={navRef}
      id="topBar"
      className="sticky border border-gray-200 shadow-sm dark:border-gray-700 px-2 md:px-5 bg-white dark:bg-zinc-800 rounded-xl md:rounded-2xl mb-4 md:mb-6"
      style={{ zIndex: "39" }}
    >
      <ul
        role="tablist"
        className="flex min-w-0 snap-x snap-mandatory gap-1 overflow-x-auto scroll-smooth py-2 md:py-4 hide-scrollbar"
        id="tabContainer"
      >
        {tabs.map((tab, index) => (
          <li key={tab.id} className="snap-center">
            <button
              role="tab"
              aria-selected={index === 0}
              className={`tab-btn whitespace-nowrap px-3 py-2 text-xs font-semibold rounded-lg transition-all md:px-6 md:py-3 md:text-sm md:rounded-xl dark:bg-blue-800/30 dark:text-gray-200 ${
                index === 0
                  ? "bg-primary text-white"
                  : "bg-blue-100 text-primary-800"
              }`}
              data-tab={tab.id}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
