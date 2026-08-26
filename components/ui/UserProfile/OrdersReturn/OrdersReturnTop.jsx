"use client";
// components/ui/UserProfile/OrdersReturn/OrdersReturnTop.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import UserProfileTop from "../UserProfileTop";

const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toFaDigits(value) {
  return String(value ?? "").replace(/\d/g, (digit) => persianDigits[Number(digit)]);
}

function toEnDigits(value) {
  return String(value ?? "")
    .replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function cleanOrderCode(value) {
  return toEnDigits(value).replace(/^#+/, "").trim();
}

function getOrderCode(order) {
  return String(order?.publicOrderNumber || order?.orderId || "").trim();
}

function getOrderLabel(order) {
  const code = getOrderCode(order);
  return code ? `#${toFaDigits(code)}` : "";
}

export default function OrdersReturnTop({
  orderNumber,
  orderOptions = [],
  selectedOrderId = "",
  selectedOrderNumber = "",
  onSelectOrder,
  loading = false,
}) {
  const wrapperRef = useRef(null);
  const [draftQuery, setDraftQuery] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedOrder = useMemo(
    () => orderOptions.find((order) => order.orderId === selectedOrderId),
    [orderOptions, selectedOrderId],
  );
  const selectedOrderLabel = selectedOrder
    ? getOrderLabel(selectedOrder)
    : selectedOrderNumber
      ? `#${toFaDigits(selectedOrderNumber)}`
      : "";
  const orderListId = "orders-return-order-options";
  const query = draftQuery ?? selectedOrderLabel;

  const title = orderNumber
    ? `درخواست مرجوعی سفارش #${toFaDigits(orderNumber)}`
    : "درخواست مرجوعی سفارش";

  const filteredOrders = useMemo(() => {
    const normalizedQuery = cleanOrderCode(query).toLowerCase();
    if (!normalizedQuery) return orderOptions;

    return orderOptions.filter((order) => {
      const publicNumber = String(order.publicOrderNumber || "").toLowerCase();
      const orderId = String(order.orderId || "").toLowerCase();
      return (
        publicNumber.includes(normalizedQuery) ||
        orderId.includes(normalizedQuery)
      );
    });
  }, [orderOptions, query]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const findExactOrder = (value) => {
    const normalizedValue = cleanOrderCode(value).toLowerCase();
    if (!normalizedValue) return null;

    return (
      orderOptions.find((order) => {
        const publicNumber = String(order.publicOrderNumber || "").toLowerCase();
        const orderId = String(order.orderId || "").toLowerCase();
        return publicNumber === normalizedValue || orderId === normalizedValue;
      }) ?? null
    );
  };

  const commitOrder = (order) => {
    onSelectOrder?.(order.orderId, order.publicOrderNumber || "");
    setDraftQuery(getOrderLabel(order));
    setIsOpen(false);
  };

  const commitTypedCode = () => {
    const normalizedCode = cleanOrderCode(query);
    if (!normalizedCode) {
      onSelectOrder?.("", "");
      setDraftQuery("");
      setIsOpen(false);
      return;
    }

    const exactOrder = findExactOrder(normalizedCode);
    if (exactOrder) {
      commitOrder(exactOrder);
      return;
    }

    const isNumericCode = /^\d+$/.test(normalizedCode);
    onSelectOrder?.(
      isNumericCode ? "" : normalizedCode,
      isNumericCode ? normalizedCode : "",
    );
    setDraftQuery(`#${toFaDigits(normalizedCode)}`);
    setIsOpen(false);
  };

  const handleInputChange = (event) => {
    setDraftQuery(toFaDigits(toEnDigits(event.target.value)));
    setIsOpen(true);
  };

  const orderSelector = (
    <div className="flex items-center space-x-3">
      <div ref={wrapperRef} className="relative space-y-1 text-right">
        <p className="text-sm text-gray-500 dark:text-gray-400">انتخاب سفارش</p>
        <input
          type="text"
          value={query}
          disabled={loading}
          onFocus={() => setIsOpen(true)}
          onChange={handleInputChange}
          onBlur={commitTypedCode}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitTypedCode();
            }

            if (event.key === "Escape") {
              setIsOpen(false);
            }
          }}
          placeholder={loading ? "در حال بارگذاری..." : "شماره سفارش را وارد کنید"}
          inputMode="numeric"
          autoComplete="off"
          className="min-w-56 rounded-lg border px-3 py-2 text-right text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
          role="combobox"
          aria-controls={orderListId}
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />
        {isOpen && !loading && orderOptions.length > 0 ? (
          <div
            id={orderListId}
            role="listbox"
            className="absolute end-0 top-full z-50 mt-2 max-h-72 min-w-full overflow-auto rounded-xl border border-gray-200 bg-white p-1 shadow-xl dark:border-gray-700 dark:bg-zinc-900"
          >
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <button
                  key={order.orderId}
                  type="button"
                  role="option"
                  aria-selected={order.orderId === selectedOrderId}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    commitOrder(order);
                  }}
                  className="flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2 text-right text-sm transition hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getOrderLabel(order)}
                  </span>
                  {order.statusTitleFa ? (
                    <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                      {order.statusTitleFa}
                    </span>
                  ) : null}
                </button>
              ))
            ) : (
              <div className="px-3 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                سفارشی یافت نشد؛ کد واردشده قابل ثبت است
              </div>
            )}
          </div>
        ) : null}
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
        <i className="far fa-square-arrow-up-left text-xl text-orange-600 dark:text-orange-400"></i>
      </div>
    </div>
  );

  return (
    <UserProfileTop
      title={title}
      description="ثبت درخواست بازگشت کالا و استرداد وجه"
      aside={orderSelector}
      className="relative z-40"
    />
  );
}
