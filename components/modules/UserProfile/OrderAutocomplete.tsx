"use client";

import type { ChangeEvent, KeyboardEvent } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MyOrderListItem } from "@/src/lib/types/orders/order.types";
import { getMyOrders } from "@/src/services/orders/orders.client";

type OrderAutocompleteProps = {
  value?: string;
  onChange?: (orderId: string, orderNumber?: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
};

function orderLabel(order: MyOrderListItem): string {
  return `#${order.publicOrderNumber || order.orderId}`;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(Math.max(0, value || 0));
}

function statusClass(statusKey: string): string {
  const normalized = statusKey.toLowerCase();

  if (
    normalized.includes("paid") ||
    normalized.includes("success") ||
    normalized.includes("deliver")
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/35 dark:text-emerald-300";
  }

  if (
    normalized.includes("cancel") ||
    normalized.includes("fail") ||
    normalized.includes("expire")
  ) {
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-800/70 dark:bg-red-950/35 dark:text-red-300";
  }

  if (normalized.includes("pending") || normalized.includes("wait")) {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/70 dark:bg-amber-950/35 dark:text-amber-300";
  }

  return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/70 dark:bg-blue-950/35 dark:text-blue-300";
}

function OrderOptionCard({
  order,
  isActive,
  isSelected,
}: {
  order: MyOrderListItem;
  isActive: boolean;
  isSelected: boolean;
}) {
  const statusTitle = order.statusTitleFa || order.statusKey || "—";

  return (
    <div
      className={[
        "rounded-xl border p-3 transition",
        "bg-white text-gray-800 shadow-sm dark:bg-zinc-900 dark:text-gray-100",
        isActive
          ? "border-primary/60 ring-2 ring-primary/15 dark:border-primary-300/70"
          : "border-gray-200 dark:border-gray-700",
        isSelected ? "bg-primary/5 dark:bg-primary/10" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            شماره سفارش
          </p>
          <p className="mt-1 break-all text-base font-bold text-gray-900 dark:text-white">
            #{order.publicOrderNumber || order.orderId}
          </p>
        </div>
        <span
          className={[
            "shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold",
            statusClass(order.statusKey),
          ].join(" ")}
        >
          {statusTitle}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
        <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-zinc-800">
          <span className="block text-gray-500 dark:text-gray-400">
            تعداد کالا
          </span>
          <span className="mt-1 block font-semibold text-gray-900 dark:text-white">
            {formatCount(order.itemCount)} عدد
          </span>
        </div>
        <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-zinc-800">
          <span className="block text-gray-500 dark:text-gray-400">
            تاریخ ثبت
          </span>
          <span className="mt-1 block font-semibold text-gray-900 dark:text-white">
            {formatDate(order.createdAt)}
          </span>
        </div>
        <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-zinc-800">
          <span className="block text-gray-500 dark:text-gray-400">
            مبلغ کل
          </span>
          <span className="mt-1 block truncate font-semibold text-gray-900 dark:text-white">
            {formatCount(order.payableAmount)} تومان
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OrderAutocomplete({
  value = "",
  onChange,
  placeholder = "شماره سفارش را جستجو کنید",
  disabled = false,
  className = "",
  inputClassName = "",
}: OrderAutocompleteProps) {
  const [orders, setOrders] = useState<MyOrderListItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => setMounted(true), []);

  const ensureOrdersLoaded = async () => {
    if (fetched || loadingOrders) return;
    setLoadingOrders(true);

    try {
      const result = await getMyOrders();
      setOrders(result.items ?? result.orders ?? []);
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
      setFetched(true);
    }
  };

  useEffect(() => {
    if (!value) {
      setQuery("");
      return;
    }

    const match = orders.find((order) => order.orderId === value);
    if (match) setQuery(orderLabel(match));
  }, [value, orders]);

  const filtered = (() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return orders;

    return orders.filter((order) => {
      const publicNumberMatch = String(order.publicOrderNumber || "")
        .toLowerCase()
        .includes(normalizedQuery);
      const orderIdMatch = String(order.orderId || "")
        .toLowerCase()
        .includes(normalizedQuery);
      const statusMatch = String(order.statusTitleFa || order.statusKey || "")
        .toLowerCase()
        .includes(normalizedQuery);
      const titleMatch = (order.items || []).some((item) =>
        String(item.productTitle || "")
          .toLowerCase()
          .includes(normalizedQuery),
      );

      return publicNumberMatch || orderIdMatch || statusMatch || titleMatch;
    });
  })();

  const updateCoords = () => {
    const rect = inputRef.current?.getBoundingClientRect();
    if (!rect) return;

    const listHeight = listRef.current?.offsetHeight ?? 320;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpwards = spaceBelow < listHeight && rect.top > listHeight;

    setCoords({
      top: openUpwards ? rect.top - listHeight - 6 : rect.bottom + 6,
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
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (
        inputRef.current?.contains(target) ||
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
    setActiveIndex(filtered.length ? 0 : -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, isOpen, orders]);

  const commitSelection = (order: MyOrderListItem) => {
    onChange?.(order.orderId, order.publicOrderNumber || "");
    setQuery(orderLabel(order));
    setIsOpen(false);
  };

  const handleFocus = () => {
    if (disabled) return;
    setIsOpen(true);
    void ensureOrdersLoaded();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setQuery(nextValue);
    setIsOpen(true);

    if (!nextValue) {
      onChange?.("", "");
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && event.key === "ArrowDown") {
      setIsOpen(true);
      void ensureOrdersLoaded();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (filtered[activeIndex]) commitSelection(filtered[activeIndex]);
    } else if (event.key === "Escape") {
      event.preventDefault();
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
        dir="rtl"
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
            className="z-[1000] max-h-96 overflow-auto rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-2xl shadow-black/10 dark:border-gray-700 dark:bg-zinc-950 dark:shadow-black/40"
          >
            {loadingOrders ? (
              <li className="rounded-xl px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                در حال بارگذاری سفارش‌ها...
              </li>
            ) : filtered.length === 0 ? (
              <li className="rounded-xl px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                سفارشی یافت نشد
              </li>
            ) : (
              filtered.map((order, index) => {
                const isActive = index === activeIndex;
                const isSelected = order.orderId === value;

                return (
                  <li
                    key={order.orderId}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => commitSelection(order)}
                    className="cursor-pointer rounded-xl p-1 outline-none"
                  >
                    <OrderOptionCard
                      order={order}
                      isActive={isActive}
                      isSelected={isSelected}
                    />
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
