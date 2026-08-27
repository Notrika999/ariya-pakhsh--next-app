"use client";
// components/ui/UserProfile/Tickets/TicketCreateForm.jsx
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import UserProfileTop from "../UserProfileTop";
import ReturnReasons from "../OrdersReturn/formContent/ReturnReasons";
import {
  DEFAULT_TICKET_CATEGORY,
  DEFAULT_TICKET_PRIORITY,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
} from "@/src/lib/tickets/ticket-labels";
import { FieldError } from "@/src/utils/form.validation";
import CustomSelect from "@/components/modules/UserProfile/CustomSelect";
import OrderAutocomplete from "@/components/modules/UserProfile/OrderAutocomplete";
import { getMyOrderById } from "@/src/services/orders/orders.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { getProductImage } from "@/src/utils/product-image";
import { notify } from "@/src/utils/toast";

const ticketFieldClass = (hasError) =>
  [
    "mt-2 w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition",
    "placeholder:text-gray-400 hover:border-gray-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10",
    "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-70",
    "dark:bg-zinc-900/70 dark:text-gray-100 dark:placeholder:text-gray-500 dark:hover:border-gray-600 dark:focus:bg-zinc-900",
    hasError
      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500 dark:bg-red-950/20"
      : "border-gray-200 dark:border-gray-700",
  ].join(" ");

const ticketSelectButtonClass = (hasError) =>
  [
    ticketFieldClass(hasError),
    "flex min-h-12 items-center justify-between gap-2 text-start",
  ].join(" ");

const ticketAttachmentKey = (file) =>
  `${file.name}-${file.size}-${file.lastModified}`;

const formatFileSize = (size) => {
  if (!Number.isFinite(size) || size <= 0) return "0 KB";
  if (size < 1024 * 1024) {
    return `${new Intl.NumberFormat("fa-IR").format(Math.ceil(size / 1024))} KB`;
  }

  return `${new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: 1,
  }).format(size / (1024 * 1024))} MB`;
};

const ORDER_REQUIRED_TICKET_CATEGORIES = [
  DEFAULT_TICKET_CATEGORY,
  "paymentIssue",
  "returnRequest",
  "cancell",
  "damageProduct",
  "shippingDelay",
  "changeAddress",
];

const ORDER_ITEM_TICKET_CATEGORIES = ["returnRequest", "cancell"];

const CANCEL_REASONS = [
  "ثبت اشتباه سفارش",
  "تغییر نظر درباره خرید",
  "زمان ارسال مناسب نیست",
  "قیمت یا شرایط خرید تغییر کرده است",
  "سایر موارد",
];

const CANCEL_REASON_OPTIONS = CANCEL_REASONS.map((reason) => ({
  value: reason,
  label: reason,
}));

const CANCEL_TICKET_PREFILL_KEY = "user-profile:cancel-ticket-prefill";

const CANCELABLE_ORDER_STATUS_KEYS = new Set([
  "order.paid",
  "order.processing",
  "order.confirmed",
]);

function canCancelOrderByStatus(order) {
  const statusKey = String(order?.statusKey ?? "").toLowerCase();
  if (statusKey === "order.expired" || statusKey === "order.cancelled") {
    return false;
  }

  return CANCELABLE_ORDER_STATUS_KEYS.has(statusKey);
}

function canCancelOrderItem(order, item) {
  if (!canCancelOrderByStatus(order)) return false;

  const statusKey = String(item?.statusKey ?? "").toLowerCase();
  if (statusKey.includes("cancel") || statusKey.includes("return")) {
    return false;
  }

  const quantity = Number(item?.quantity) || 0;
  const cancelled = Number(item?.quantityCancelled) || 0;
  return quantity > 0 && cancelled < quantity;
}

function normalizeInitialTicketCategory(category) {
  if (category === "cancel") return "cancell";
  return category;
}

function toFa(value) {
  return new Intl.NumberFormat("fa-IR").format(Number(value) || 0);
}

function getOrderItemImage(item) {
  return getProductImage(item?.imageUrl);
}

function buildTicketBody(messageBody, context) {
  if (!context?.type) return messageBody.trim();

  const lines = ["", "اطلاعات تکمیلی سفارش:"];
  lines.push(
    `نوع درخواست: ${context.type === "return" ? "مرجوعی" : "لغو سفارش"}`,
  );
  if (context.orderNumber) lines.push(`شماره سفارش: ${context.orderNumber}`);

  if (context.type === "return") {
    lines.push(`دلیل مرجوعی: ${context.returnReason || "ثبت نشده"}`);
    lines.push("محصولات انتخاب‌شده:");
    context.items.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.title} - تعداد: ${toFa(item.quantity)}`);
    });
  }

  if (context.type === "cancel") {
    lines.push("محصولات انتخاب‌شده برای لغو:");
    context.items.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.title} - تعداد لغو: ${toFa(item.quantity)} - دلیل: ${item.reason}`,
      );
    });
  }

  return `${messageBody.trim()}\n${lines.join("\n")}`;
}

export default function TicketCreateForm({
  loading = false,
  onBack,
  onSubmit,
}) {
  const searchParams = useSearchParams();
  const initialAppliedRef = useRef(false);
  const initialOrderItemIdRef = useRef("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(DEFAULT_TICKET_CATEGORY);
  const [priority, setPriority] = useState(DEFAULT_TICKET_PRIORITY);
  const [messageBody, setMessageBody] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDetail, setOrderDetail] = useState(null);
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState({});
  const [returnReason, setReturnReason] = useState("");
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const isOrderTracking = ORDER_REQUIRED_TICKET_CATEGORIES.includes(category);
  const isReturnRequest = category === "returnRequest";
  const isCancelRequest = category === "cancell";
  const needsOrderItems = ORDER_ITEM_TICKET_CATEGORIES.includes(category);
  const orderItems = useMemo(() => orderDetail?.items ?? [], [orderDetail]);
  const returnOrderBlocked =
    isReturnRequest && orderDetail?.canRequestReturn === false;
  const cancelOrderBlocked =
    isCancelRequest && Boolean(orderDetail) && !canCancelOrderByStatus(orderDetail);
  const selectedItems = useMemo(
    () =>
      orderItems
        .filter((item) => selectedOrderItems[item.orderItemId]?.checked)
        .map((item) => ({
          item,
          selection: selectedOrderItems[item.orderItemId],
        })),
    [orderItems, selectedOrderItems],
  );

  useEffect(() => {
    if (initialAppliedRef.current) return;

    if (searchParams.get("create") !== "1") return;

    let initialData = null;
    try {
      const storedValue = window.sessionStorage.getItem(
        CANCEL_TICKET_PREFILL_KEY,
      );
      initialData = storedValue ? JSON.parse(storedValue) : null;
      window.sessionStorage.removeItem(CANCEL_TICKET_PREFILL_KEY);
    } catch {
      initialData = null;
    }

    const initialCategory = normalizeInitialTicketCategory(
      initialData?.category,
    );
    const initialOrderId =
      typeof initialData?.orderId === "string" ? initialData.orderId : "";
    const initialOrderNumber =
      typeof initialData?.orderNumber === "string"
        ? initialData.orderNumber
        : "";
    const initialOrderItemId =
      typeof initialData?.orderItemId === "string"
        ? initialData.orderItemId
        : "";

    if (initialCategory !== "cancell" || !initialOrderId) {
      return;
    }

    initialAppliedRef.current = true;
    initialOrderItemIdRef.current = initialOrderItemId;

    queueMicrotask(() => {
      setCategory("cancell");
      setPriority(DEFAULT_TICKET_PRIORITY);
      setOrderId(initialOrderId);
      setOrderNumber(initialOrderNumber || initialOrderId);
      setSubject(
        `درخواست لغو سفارش #${initialOrderNumber || initialOrderId}`,
      );
      setMessageBody("درخواست لغو محصول انتخاب‌شده را دارم.");
    });
  }, [searchParams]);

  const loadOrderDetail = useCallback(async (nextOrderId) => {
    const normalizedOrderId = nextOrderId.trim();
    if (!normalizedOrderId) {
      setOrderDetail(null);
      setSelectedOrderItems({});
      return;
    }

    setLoadingOrderDetail(true);
    try {
      const detail = await getMyOrderById(normalizedOrderId);
      setOrderDetail(detail);
      const nextSelections = {};
      for (const item of detail.items ?? []) {
        const preselected =
          initialOrderItemIdRef.current &&
          item.orderItemId === initialOrderItemIdRef.current;

        nextSelections[item.orderItemId] = {
          checked:
            Boolean(preselected) && canCancelOrderItem(detail, item),
          quantity: 1,
          reason: "",
        };
      }
      initialOrderItemIdRef.current = "";
      setSelectedOrderItems(nextSelections);
    } catch (error) {
      console.error("[TicketCreateForm] load order detail failed =>", error);
      notify.error(getAuthErrorMessage(error));
      setOrderDetail(null);
      setSelectedOrderItems({});
    } finally {
      setLoadingOrderDetail(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (needsOrderItems) {
        void loadOrderDetail(orderId);
        return;
      }

      setOrderDetail(null);
      setSelectedOrderItems({});
      setReturnReason("");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [needsOrderItems, orderId, loadOrderDetail]);

  const validate = () => {
    const nextErrors = {};

    if (!subject.trim()) {
      nextErrors.subject = "موضوع الزامی است";
    }
    if (!category) {
      nextErrors.category = "دسته‌بندی الزامی است";
    }
    if (!messageBody.trim()) {
      nextErrors.messageBody = "متن پیام الزامی است";
    }
    if (isOrderTracking && !orderId.trim()) {
      nextErrors.orderId = "شناسه سفارش الزامی است";
    }
    if (returnOrderBlocked) {
      nextErrors.orderReturn =
        "سفارش انتخاب‌شده قابل مرجوعی نیست";
    }
    if (cancelOrderBlocked) {
      nextErrors.orderCancel = "سفارش انتخاب‌شده قابل لغو نیست";
    }
    if (
      needsOrderItems &&
      !returnOrderBlocked &&
      !cancelOrderBlocked &&
      selectedItems.length === 0
    ) {
      nextErrors.orderItems = "حداقل یک محصول را انتخاب کنید";
    }
    if (isReturnRequest && !returnReason) {
      nextErrors.returnReason = "دلیل مرجوعی الزامی است";
    }
    if (isReturnRequest) {
      const invalidReturnItem = selectedItems.find(
        ({ selection }) =>
          !Number.isFinite(Number(selection.quantity)) ||
          Number(selection.quantity) < 1,
      );
      if (invalidReturnItem) {
        nextErrors.returnDetails =
          "برای هر محصول، تعداد مرجوعی را وارد کنید";
      }
    }
    if (isCancelRequest && !cancelOrderBlocked) {
      const invalidCancelItem = selectedItems.find(
        ({ selection }) =>
          !selection.reason?.trim() ||
          !Number.isFinite(Number(selection.quantity)) ||
          Number(selection.quantity) < 1,
      );
      if (invalidCancelItem) {
        nextErrors.cancelDetails =
          "برای هر محصول، تعداد و دلیل لغو را وارد کنید";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const resetForm = () => {
    setSubject("");
    setCategory(DEFAULT_TICKET_CATEGORY);
    setPriority(DEFAULT_TICKET_PRIORITY);
    setMessageBody("");
    setOrderId("");
    setOrderNumber("");
    setOrderDetail(null);
    setSelectedOrderItems({});
    setReturnReason("");
    setAttachmentFiles([]);
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const context =
      needsOrderItems && selectedItems.length
        ? {
            type: isReturnRequest ? "return" : "cancel",
            orderNumber,
            returnReason,
            items: selectedItems.map(({ item, selection }) => ({
              title: item.productTitle || item.productName || "محصول",
              quantity: Math.min(
                Math.max(1, Number(selection.quantity) || 1),
                Math.max(1, Number(item.quantity) || 1),
              ),
              reason: selection.reason?.trim() || "",
            })),
          }
        : null;

    const payload = {
      subject: subject.trim(),
      category,
      priority,
      body: buildTicketBody(messageBody, context),
      orderId: orderId.trim(),
      orderNumber: orderNumber.trim(),
      attachmentFiles,
    };

    const ok = await onSubmit?.(payload);
    if (ok) {
      resetForm();
    }
  };

  const handleBack = () => {
    if (loading) return;
    onBack?.();
  };

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    clearError("category");
    clearError("orderItems");
    clearError("returnReason");
    clearError("returnDetails");
    clearError("orderReturn");
    clearError("orderCancel");
    clearError("cancelDetails");
    setReturnReason("");
    setSelectedOrderItems({});
    if (!ORDER_REQUIRED_TICKET_CATEGORIES.includes(nextCategory)) {
      clearError("orderId");
    }
  };

  const handleOrderNumberChange = (nextOrderId, nextOrderNumber = "") => {
    setOrderId(nextOrderId);
    setOrderNumber(nextOrderNumber);
    setSelectedOrderItems({});
    setReturnReason("");
    clearError("orderId");
    clearError("orderNumber");
    clearError("orderItems");
    clearError("returnReason");
    clearError("returnDetails");
    clearError("orderReturn");
    clearError("orderCancel");
    clearError("cancelDetails");
  };

  const updateOrderItemSelection = (item, patch) => {
    const maxQty = Math.max(1, Number(item.quantity) || 1);
    setSelectedOrderItems((prev) => {
      const current = prev[item.orderItemId] ?? {
        checked: false,
        quantity: 1,
        reason: "",
      };
      const next = {
        ...current,
        ...patch,
      };
      next.quantity = Math.min(Math.max(1, Number(next.quantity) || 1), maxQty);

      return {
        ...prev,
        [item.orderItemId]: next,
      };
    });
    clearError("orderItems");
    clearError("returnDetails");
    clearError("cancelDetails");
  };

  const handleAttachmentChange = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) return;

    setAttachmentFiles((prev) => {
      const existingKeys = new Set(prev.map(ticketAttachmentKey));
      const nextFiles = [...prev];

      selectedFiles.forEach((file) => {
        const key = ticketAttachmentKey(file);
        if (!existingKeys.has(key)) {
          existingKeys.add(key);
          nextFiles.push(file);
        }
      });

      return nextFiles;
    });

    event.target.value = "";
  };

  const removeAttachment = (fileKey) => {
    setAttachmentFiles((prev) =>
      prev.filter((file) => ticketAttachmentKey(file) !== fileKey),
    );
  };

  return (
    <div className="space-y-4 lg:col-span-3">
      <UserProfileTop
        title="ایجاد تیکت جدید"
        description="فرم ثبت درخواست پشتیبانی"
        aside={
          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-200"
          >
            <i className="far fa-arrow-right me-2 text-xs"></i>
            بازگشت به لیست تیکت‌ها
          </button>
        }
      />

      <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              موضوع <span className="text-red-500">*</span>
            </label>
            <input
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value);
                clearError("subject");
              }}
              disabled={loading}
              className={ticketFieldClass(errors.subject)}
              placeholder="موضوع تیکت"
            />
            <FieldError message={errors.subject} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                دسته‌بندی <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                buttonClassName={ticketSelectButtonClass(errors.category)}
                options={TICKET_CATEGORIES}
                value={category}
                onChange={handleCategoryChange}
                disabled={loading}
              />
              <FieldError message={errors.category} />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                اولویت
              </label>
              <CustomSelect
                buttonClassName={ticketSelectButtonClass(false)}
                options={TICKET_PRIORITIES}
                value={priority}
                onChange={setPriority}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isOrderTracking ? (
                <>
                  شناسه سفارش <span className="text-red-500">*</span>
                </>
              ) : (
                "شناسه سفارش (اختیاری)"
              )}
            </label>
            <OrderAutocomplete
              inputClassName={ticketFieldClass(errors.orderId)}
              value={orderId}
              displayValue={orderNumber ? `#${orderNumber}` : ""}
              onChange={handleOrderNumberChange}
              disabled={loading}
              placeholder={
                isOrderTracking
                  ? "شماره سفارش یا نام کالا را جستجو کنید"
                  : "در صورت مرتبط بودن با سفارش، جستجو کنید"
              }
            />
            <FieldError message={errors.orderId} />
          </div>

          {needsOrderItems && orderId ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-zinc-900/50">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    محصولات سفارش
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    محصول‌های مرتبط با درخواست را انتخاب کنید.
                  </p>
                </div>
                {loadingOrderDetail ? (
                  <span className="text-xs font-semibold text-primary">
                    در حال دریافت...
                  </span>
                ) : null}
              </div>

              {returnOrderBlocked ? (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-800/70 dark:bg-amber-950/30 dark:text-amber-300">
                  <i className="far fa-circle-info me-2"></i>
                  سفارش انتخاب‌شده قابل مرجوعی نیست.
                </div>
              ) : null}

              {cancelOrderBlocked ? (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-800/70 dark:bg-amber-950/30 dark:text-amber-300">
                  <i className="far fa-circle-info me-2"></i>
                  سفارش انتخاب‌شده قابل لغو نیست.
                </div>
              ) : null}

              {loadingOrderDetail ? (
                <div className="flex gap-3 overflow-hidden">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`ticket-order-product-skeleton-${index}`}
                      className="h-40 w-36 shrink-0 animate-pulse rounded-2xl bg-gray-200 dark:bg-zinc-800"
                    />
                  ))}
                </div>
              ) : orderItems.length ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {orderItems.map((item) => {
                    const selection = selectedOrderItems[item.orderItemId] ?? {
                      checked: false,
                      quantity: 1,
                      reason: "",
                    };
                    const selected = Boolean(selection.checked);
                    const itemReturnBlocked =
                      isReturnRequest &&
                      (returnOrderBlocked || item.canRequestReturn === false);
                    const itemCancelBlocked =
                      isCancelRequest &&
                      (cancelOrderBlocked ||
                        !canCancelOrderItem(orderDetail, item));
                    const itemBlocked = itemReturnBlocked || itemCancelBlocked;

                    return (
                      <button
                        key={item.orderItemId}
                        type="button"
                        onClick={() => {
                          if (itemBlocked) return;
                          updateOrderItemSelection(item, {
                            checked: !selected,
                          });
                        }}
                        disabled={loading || itemBlocked}
                        className={[
                          "w-40 shrink-0 rounded-2xl border bg-white p-3 text-right transition dark:bg-zinc-900",
                          selected
                            ? "border-red-400 ring-2 ring-primary/15"
                            : "border-gray-200 hover:border-red/50 dark:border-gray-700",
                          loading || itemBlocked
                            ? "cursor-not-allowed opacity-60"
                            : "",
                        ].join(" ")}
                      >
                        <span className="mb-3 flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-zinc-800">
                          <Image
                            width={120}
                            height={120}
                            src={getOrderItemImage(item)}
                            alt={
                              item.productTitle || item.productName || "محصول"
                            }
                            className="h-[85%] w-[85%] object-contain"
                            unoptimized
                          />
                        </span>
                        <span className="line-clamp-2 min-h-10 text-xs font-bold leading-5 text-gray-900 dark:text-gray-100">
                          {item.productTitle || item.productName || "محصول"}
                        </span>
                        <span className="mt-2 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                          تعداد: {toFa(item.quantity)}
                        </span>
                        {itemReturnBlocked ? (
                          <span className="mt-2 block text-xs font-semibold text-amber-700 dark:text-amber-300">
                            قابل مرجوعی نیست
                          </span>
                        ) : null}
                        {itemCancelBlocked ? (
                          <span className="mt-2 block text-xs font-semibold text-amber-700 dark:text-amber-300">
                            قابل لغو نیست
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  محصولی برای این سفارش یافت نشد.
                </p>
              )}
              <FieldError message={errors.orderItems} />
              <FieldError message={errors.orderReturn} />
              <FieldError message={errors.orderCancel} />
            </div>
          ) : null}

          {isReturnRequest && selectedItems.length > 0 ? (
            <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-zinc-900/50">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                تعداد محصولات مرجوعی
              </h3>
              {selectedItems.map(({ item, selection }) => {
                const maxQty = Math.max(1, Number(item.quantity) || 1);

                return (
                  <div
                    key={`return-${item.orderItemId}`}
                    className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-zinc-900"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="line-clamp-1 text-sm font-bold text-gray-900 dark:text-gray-100">
                        {item.productTitle || item.productName || "محصول"}
                      </span>
                      <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                        حداکثر {toFa(maxQty)} عدد
                      </span>
                    </div>
                    <div className="max-w-40">
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        تعداد مرجوعی
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={maxQty}
                        value={selection.quantity}
                        disabled={loading}
                        onChange={(event) =>
                          updateOrderItemSelection(item, {
                            quantity: event.target.value,
                          })
                        }
                        className={ticketFieldClass(false)}
                      />
                    </div>
                  </div>
                );
              })}
              <FieldError message={errors.returnDetails} />
            </div>
          ) : null}

          {isReturnRequest && selectedItems.length > 0 ? (
            <div>
              <ReturnReasons
                value={returnReason}
                onChange={(value) => {
                  setReturnReason(value);
                  clearError("returnReason");
                }}
                disabled={loading}
              />
              <FieldError message={errors.returnReason} />
            </div>
          ) : null}

          {isCancelRequest &&
          !cancelOrderBlocked &&
          selectedItems.length > 0 ? (
            <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-zinc-900/50">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                جزئیات لغو محصولات
              </h3>
              {selectedItems.map(({ item, selection }) => {
                const maxQty = Math.max(1, Number(item.quantity) || 1);

                return (
                  <div
                    key={`cancel-${item.orderItemId}`}
                    className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-zinc-900"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="line-clamp-1 text-sm font-bold text-gray-900 dark:text-gray-100">
                        {item.productTitle || item.productName || "محصول"}
                      </span>
                      <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                        حداکثر {toFa(maxQty)} عدد
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_minmax(0,1fr)]">
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          تعداد لغو
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={maxQty}
                          value={selection.quantity}
                          disabled={loading}
                          onChange={(event) =>
                            updateOrderItemSelection(item, {
                              quantity: event.target.value,
                            })
                          }
                          className={ticketFieldClass(false)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          دلیل لغو
                        </label>
                        <CustomSelect
                          buttonClassName={ticketSelectButtonClass(false)}
                          options={CANCEL_REASON_OPTIONS}
                          value={selection.reason}
                          disabled={loading}
                          placeholder="انتخاب دلیل"
                          onChange={(value) =>
                            updateOrderItemSelection(item, {
                              reason: value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <FieldError message={errors.cancelDetails} />
            </div>
          ) : null}

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              متن پیام <span className="text-red-500">*</span>
            </label>
            <textarea
              value={messageBody}
              onChange={(event) => {
                setMessageBody(event.target.value);
                clearError("messageBody");
              }}
              disabled={loading}
              rows={6}
              className={[
                ticketFieldClass(errors.messageBody),
                "min-h-40 resize-y leading-7",
              ].join(" ")}
              placeholder="متن تیکت را وارد کنید..."
            />
            <FieldError message={errors.messageBody} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              پیوست‌ها{" "}
              <span className="text-xs text-gray-400 dark:text-gray-500">
                (اختیاری)
              </span>
            </label>

            <label
              htmlFor="ticket-attachments"
              className={[
                "mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm transition",
                "hover:border-primary hover:bg-primary/5 dark:border-gray-700 dark:bg-zinc-900/70 dark:hover:border-primary/80",
                loading ? "cursor-not-allowed opacity-60" : "",
              ].join(" ")}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm dark:bg-zinc-800">
                <i className="far fa-paperclip"></i>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-gray-800 dark:text-gray-200">
                  انتخاب فایل
                </span>
                <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                  {attachmentFiles.length > 0
                    ? `${new Intl.NumberFormat("fa-IR").format(attachmentFiles.length)} فایل انتخاب شده`
                    : "فایلی انتخاب نشده است"}
                </span>
              </span>
              <span className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-300">
                افزودن
              </span>
            </label>

            <input
              id="ticket-attachments"
              type="file"
              multiple
              disabled={loading}
              onChange={handleAttachmentChange}
              className="sr-only"
            />

            {attachmentFiles.length > 0 && (
              <ul className="mt-3 space-y-2">
                {attachmentFiles.map((file) => {
                  const fileKey = ticketAttachmentKey(file);

                  return (
                    <li
                      key={fileKey}
                      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-zinc-900"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <i className="far fa-file"></i>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-gray-800 dark:text-gray-200">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </span>
                      </span>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => removeAttachment(fileKey)}
                        aria-label={`حذف ${file.name}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      >
                        <i className="far fa-xmark"></i>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex flex-col justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700 sm:flex-row">
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 disabled:opacity-60 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-5 py-2 text-white transition duration-200 hover:bg-primary/90 active:scale-95 disabled:opacity-60"
            >
              {loading ? "در حال ایجاد..." : "ایجاد تیکت"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
