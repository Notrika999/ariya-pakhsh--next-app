"use client";
// components/ui/OrderAutocomplete/OrderAutocomplete.jsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getMyOrders } from "@/src/services/orders/orders.client";

function orderLabel(order) {
  const titles = (order.items || [])
    .map((item) => item.productTitle)
    .filter(Boolean)
    .join("، ");
  const number = `#${order.publicOrderNumber || order.orderId}`;
  return titles ? `${number} — ${titles}` : number;
}

/**
 * اتوکامپلت انتخاب سفارش کاربر.
 * لیست کامل سفارش‌ها یک‌بار (با اولین فوکوس) از getMyOrders() گرفته می‌شه
 * و فیلتر بر اساس متن جستجو (شماره سفارش یا عنوان محصول) داخل خود
 * کامپوننت انجام می‌شه. با انتخاب یک سفارش، onChange با orderId همون
 * سفارش صدا زده می‌شه.
 *
 * از Portal استفاده می‌کنه تا لیست باز شده زیر عناصر دیگه (مودال، جدول و...) قرار نگیره.
 */
export default function OrderAutocomplete({
  value = "",
  onChange,
  placeholder = "جستجو با شماره سفارش یا نام کالا...",
  disabled = false,
  className = "",
  inputClassName = "",
}) {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // گرفتن لیست سفارش‌ها فقط یک‌بار (lazy، با اولین فوکوس روی اینپوت)
  const ensureOrdersLoaded = async () => {
    if (fetched || loadingOrders) return;
    setLoadingOrders(true);
    try {
      const result = await getMyOrders();
      const list = Array.isArray(result)
        ? result
        : (result?.items ?? result?.orders ?? []);
      setOrders(list);
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
      setFetched(true);
    }
  };

  // هماهنگ کردن متن نمایشی با value بیرونی (مثلاً هنگام resetForm یا مقداردهی اولیه)
  useEffect(() => {
    if (!value) {
      setQuery("");
      return;
    }
    const match = orders.find((o) => o.orderId === value);
    if (match) setQuery(orderLabel(match));
  }, [value, orders]);

  const filtered = (() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => {
      const numberMatch = String(o.publicOrderNumber || "")
        .toLowerCase()
        .includes(q);
      const titleMatch = (o.items || []).some((item) =>
        String(item.productTitle || "").toLowerCase().includes(q),
      );
      return numberMatch || titleMatch;
    });
  })();

  const updateCoords = () => {
    const rect = inputRef.current?.getBoundingClientRect();
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
  }, [isOpen, filtered.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => updateCoords();
    const handleClickOutside = (e) => {
      if (
        inputRef.current?.contains(e.target) ||
        listRef.current?.contains(e.target)
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
    setActiveIndex(filtered.length ? 0 : -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, isOpen, orders]);

  const commitSelection = (order) => {
    onChange?.(order.orderId);
    setQuery(orderLabel(order));
    setIsOpen(false);
  };

  const handleFocus = () => {
    if (disabled) return;
    setIsOpen(true);
    void ensureOrdersLoaded();
  };

  const handleChange = (e) => {
    const nextValue = e.target.value;
    setQuery(nextValue);
    setIsOpen(true);
    if (!nextValue) {
      onChange?.("");
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen && e.key === "ArrowDown") {
      setIsOpen(true);
      void ensureOrdersLoaded();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) commitSelection(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        disabled={disabled}
        onFocus={handleFocus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        dir="ltr"
        className={inputClassName}
      />

      {mounted &&
        isOpen &&
        createPortal(
          <ul
            ref={listRef}
            role="listbox"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
            className="z-[1000] max-h-72 overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-zinc-800"
          >
            {loadingOrders ? (
              <li className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                در حال بارگذاری سفارش‌ها...
              </li>
            ) : filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                سفارشی یافت نشد
              </li>
            ) : (
              filtered.map((order, idx) => {
                const isActive = idx === activeIndex;
                const isSelected = order.orderId === value;
                const titles = (order.items || [])
                  .map((item) => item.productTitle)
                  .filter(Boolean);

                return (
                  <li
                    key={order.orderId}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => commitSelection(order)}
                    className={`cursor-pointer px-4 py-2 ${
                      isActive ? "bg-primary/10 dark:bg-primary/20" : ""
                    }`}
                  >
                    <div
                      className={`text-sm ${
                        isSelected
                          ? "font-bold text-primary dark:text-primary-300"
                          : "font-medium text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      #{order.publicOrderNumber || order.orderId}
                    </div>
                    {titles.length > 0 && (
                      <div className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                        {titles.join("، ")}
                      </div>
                    )}
                  </li>
                );
              })
            )}
          </ul>,
          document.body,
        )}
    </div>
  );
}