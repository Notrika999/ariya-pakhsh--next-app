"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type SelectOption = {
  label: string;
  value: string;
};

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  listClassName?: string;
}

/**
 * سلکت سفارشی و قابل استفاده مجدد در کل پروژه.
 *
 * چرا Portal؟
 * لیست باز شده به‌جای رندر داخل همون کامپوننت (position: absolute)،
 * مستقیماً به document.body منتقل می‌شه و موقعیتش با position: fixed
 * و مختصات واقعی دکمه محاسبه می‌شه. این‌طوری هیچ والدی (جدول، کارت،
 * بخش‌هایی با overflow/z-index خودشون) نمی‌تونه دراپ‌داون رو زیر خودش
 * ببره یا برش بزنه.
 */
export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "انتخاب کنید",
  disabled = false,
  className = "",
  buttonClassName = "",
  listClassName = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => setMounted(true), []);

  const updateCoords = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const listHeight = listRef.current?.offsetHeight ?? 256;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpwards = spaceBelow < listHeight && rect.top > listHeight;

    setCoords({
      top: openUpwards ? rect.top - listHeight - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    updateCoords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => updateCoords();
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        listRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const idx = options.findIndex((o) => o.value === value);
      setActiveIndex(idx >= 0 ? idx : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeIndex >= 0 && listRef.current) {
      listRef.current.children[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, isOpen]);

  const commitSelection = (opt: SelectOption) => {
    onChange(opt.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (options[activeIndex]) commitSelection(options[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={
          buttonClassName ||
          `w-full flex items-center justify-between gap-2 border rounded-lg px-4 py-2 text-start text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white bg-white border-gray-300 text-gray-900 ${
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          }`
        }
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <i
          className={`far fa-angle-down text-gray-700 dark:text-gray-300 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        ></i>
      </button>

      {mounted &&
        isOpen &&
        createPortal(
          <ul
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
            className={
              listClassName ||
              "z-[1000] max-h-64 overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg outline-none dark:border-gray-600 dark:bg-zinc-800"
            }
          >
            {options.length === 0 && (
              <li className="px-4 py-2 text-sm text-gray-400 dark:text-gray-500">
                موردی یافت نشد
              </li>
            )}
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isActive = idx === activeIndex;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => commitSelection(opt)}
                  className={`cursor-pointer px-4 py-2 text-sm ${
                    isActive ? "bg-primary/10 dark:bg-primary/20" : ""
                  } ${
                    isSelected
                      ? "font-bold text-primary dark:text-primary-300"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
}