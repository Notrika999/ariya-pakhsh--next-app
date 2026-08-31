"use client";
// components/ui/UserProfile/Orders/OrderDetails.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import {
  getMyOrderById,
  getMyOrderByNumber,
} from "@/src/services/orders/orders.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { getProductImage } from "@/src/utils/product-image";
import { notify } from "@/src/utils/toast";
import { OrderDetailsSkeleton } from "../skeletons/UserProfileSkeletons";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CANCEL_TICKET_PREFILL_KEY = "user-profile:cancel-ticket-prefill";

function formatMoney(value) {
  return `${new Intl.NumberFormat("fa-IR").format(
    Math.max(0, Math.round(Number(value) || 0)),
  )} تومان`;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function statusBadgeClass(statusKey = "") {
  const key = String(statusKey).toLowerCase();
  if (
    key.includes("deliver") ||
    key.includes("paid") ||
    key.includes("success")
  ) {
    return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
  }
  if (
    key.includes("cancel") ||
    key.includes("fail") ||
    key.includes("expire")
  ) {
    return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
  }
  if (key.includes("pending") || key.includes("wait")) {
    return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300";
  }
  return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
}

function timelineStepMeta(title = "") {
  if (title.includes("پرداخت")) {
    return {
      icon: "far fa-credit-card",
      iconClassName:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
      lineClassName: "bg-emerald-200 dark:bg-emerald-900/60",
    };
  }

  if (title.includes("ارسال")) {
    return {
      icon: "far fa-truck-fast",
      iconClassName:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      lineClassName: "bg-blue-200 dark:bg-blue-900/60",
    };
  }

  if (title.includes("تحویل")) {
    return {
      icon: "far fa-box-check",
      iconClassName:
        "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      lineClassName: "bg-green-200 dark:bg-green-900/60",
    };
  }

  if (title.includes("لغو")) {
    return {
      icon: "far fa-ban",
      iconClassName:
        "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
      lineClassName: "bg-red-200 dark:bg-red-900/60",
    };
  }

  return {
    icon: "far fa-receipt",
    iconClassName:
      "bg-blue-100 text-primary dark:bg-primary/20 dark:text-primary ",
    lineClassName: "bg-primary/20 dark:bg-primary/30 ",
  };
}

function isClosedOrder(order) {
  const statusKey = String(order?.statusKey ?? "").toLowerCase();
  return statusKey === "order.expired" || statusKey === "order.cancelled";
}

const CANCELABLE_ORDER_STATUS_KEYS = new Set([
  "order.paid",
  "order.processing",
  "order.confirmed",
]);

function canCancelOrder(order) {
  if (isClosedOrder(order)) return false;

  const statusKey = String(order?.statusKey ?? "").toLowerCase();
  return CANCELABLE_ORDER_STATUS_KEYS.has(statusKey);
}

function canCancelOrderItem(order, item) {
  if (!canCancelOrder(order)) return false;

  const statusKey = String(item?.statusKey ?? "").toLowerCase();
  if (statusKey.includes("cancel") || statusKey.includes("return")) {
    return false;
  }

  const quantity = Number(item?.quantity) || 0;
  const cancelled = Number(item?.quantityCancelled) || 0;
  return quantity > 0 && cancelled < quantity;
}

function getOrderItemImage(item) {
  return getProductImage(item?.imageUrl);
}

function getOrderItemProductHref(item) {
  return `/product/${item?.productPublicCode ?? ""}/${item?.productSlug ?? ""}`;
}

function safeJson(value) {
  if (!value || typeof value !== "string") return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function record(value) {
  return value && typeof value === "object" ? value : {};
}

function getField(source, ...keys) {
  const item = record(source);
  for (const key of keys) {
    const value = item[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }
  return "";
}

function getShippingSnapshot(snapshot) {
  return safeJson(snapshot) ?? {};
}

function getSnapshotAddress(snapshot) {
  const root = getShippingSnapshot(snapshot);
  const nestedAddress = record(root.address);
  const address = Object.keys(nestedAddress).length ? nestedAddress : root;

  return [
    getField(address, "CountryName", "countryName"),
    getField(address, "State", "state"),
    getField(address, "City", "city"),
    getField(address, "AddressLine", "addressLine"),
    getField(address, "PostalCode", "postalCode"),
  ]
    .filter(Boolean)
    .join("، ");
}

function getSnapshotShippingSelections(snapshot) {
  const root = getShippingSnapshot(snapshot);
  return Array.isArray(root.shippingSelections) ? root.shippingSelections : [];
}

function getShippingSelectionTitle(selection) {
  const methodName = getField(selection, "methodName", "methodTitle");
  const className = getField(selection, "shippingClassName", "className");
  return [className, methodName].filter(Boolean).join(" - ");
}

function DetailRow({
  label,
  value,
  valueClassName = "text-gray-800 dark:text-gray-200",
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-600 dark:text-gray-400 text-sm">{label}</span>
      <span className={`text-left text-xs font-semibold ${valueClassName}`}>
        {value || "—"}
      </span>
    </div>
  );
}

export default function OrderDetails() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderLookup = String(params?.id ?? "");
  const selectedItemId = searchParams.get("itemId") ?? "";
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = useCallback(async () => {
    if (!orderLookup) return;
    setLoading(true);
    try {
      const data = UUID_RE.test(orderLookup)
        ? await getMyOrderById(orderLookup)
        : await getMyOrderByNumber(orderLookup);
      setOrder(data);
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderLookup]);

  useEffect(() => {
    if (!orderLookup) return undefined;

    const timer = window.setTimeout(() => {
      void loadOrder();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadOrder, orderLookup]);

  const timeline = useMemo(() => {
    if (!order) return [];
    return [
      { title: "ثبت سفارش", date: order.createdAt, text: order.statusTitleFa },
      { title: "پرداخت", date: order.paidAt, text: order.paymentStatusTitleFa },
      {
        title: "ارسال",
        date: record(order.shipments?.[0]).shippedAt,
        text: order.fulfillmentStatusTitleFa,
      },
      {
        title: "تحویل",
        date: record(order.shipments?.[0]).deliveredAt,
        text: record(order.shipments?.[0]).statusTitleFa,
      },
      {
        title: "لغو سفارش",
        date: order.cancelledAt,
        text: order.statusTitleFa,
      },
    ].filter((item) => item.date || item.text);
  }, [order]);

  const selectedItem = useMemo(() => {
    if (!order?.items?.length || !selectedItemId) return null;

    return (
      order.items.find(
        (item) =>
          item.orderItemId === selectedItemId ||
          item.productId === selectedItemId ||
          item.id === selectedItemId,
      ) ?? null
    );
  }, [order, selectedItemId]);

  const openCancelTicketForm = (item) => {
    if (!order?.orderId || !item?.orderItemId) return;

    try {
      window.sessionStorage.setItem(
        CANCEL_TICKET_PREFILL_KEY,
        JSON.stringify({
          category: "cancelRequest",
          orderId: order.orderId,
          orderNumber: order.publicOrderNumber || order.orderId,
          orderItemId: item.orderItemId,
        }),
      );
      router.push("/user-profile/tickets?create=1");
    } catch {
      notify.error("امکان انتقال اطلاعات سفارش به فرم تیکت وجود ندارد.");
    }
  };

  if (loading) {
    return <OrderDetailsSkeleton />;
  }

  if (!order) {
    return (
      <div className="lg:col-span-3 rounded-2xl bg-white p-6 text-center text-gray-600 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark dark:text-gray-300">
        جزئیات سفارش پیدا نشد.
      </div>
    );
  }

  const shippingAddress =
    getSnapshotAddress(order.shippingAddressSnapshotJson) || "—";
  const shippingSelections = getSnapshotShippingSelections(
    order.shippingAddressSnapshotJson,
  );
  const shipments = Array.isArray(order.shipments) ? order.shipments : [];
  const discounts = Array.isArray(order.discounts) ? order.discounts : [];
  const returns = Array.isArray(order.returns) ? order.returns : [];
  const firstShipment = record(shipments[0]);
  const firstPayment = record(order.payments?.[0]);
  const firstAttempt = record(firstPayment.attempts?.[0]);
  const selectedItemHref = selectedItem ? getOrderItemProductHref(selectedItem) : "";

  return (
    <div className="space-y-2 lg:col-span-3">
      <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <TitleAfter
              title={`جزئیات سفارش #${order.publicOrderNumber || order.orderId}`}
            />
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              ثبت شده در {formatDate(order.createdAt)}
            </p>
          </div>
          {/* show status and payment status */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/user-profile/orders"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-200 dark:hover:border-primary dark:hover:text-primary"
            >
              <i className="far fa-arrow-right text-xs"></i>
              بازگشت
            </Link>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(order.statusKey)}`}
            >
              {order.statusTitleFa || order.statusKey || "—"}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(order.paymentStatusKey)}`}
            >
              {order.paymentStatusTitleFa || order.paymentStatusKey || "—"}
            </span>
          </div>
        </div>
      </div>

      {timeline.length ? (
        <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
          <TitleAfter title={"روند سفارش"} />
          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max items-start gap-3 pt-2 sm:min-w-0 sm:gap-0">
              {timeline.map((item, index) => {
                const meta = timelineStepMeta(item.title);
                const isLast = index === timeline.length - 1;

                return (
                  <div
                    key={`${item.title}-${index}`}
                    className="relative flex w-36 shrink-0 flex-col items-center text-center sm:w-auto sm:flex-1"
                  >
                    {!isLast ? (
                      <div
                        className={`absolute right-1/2 top-6 hidden h-0.5 w-full translate-x-6 sm:block ${meta.lineClassName}`}
                      />
                    ) : null}

                    <div
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full ${meta.iconClassName}`}
                    >
                      <i className={`${meta.icon} text-lg`}></i>
                    </div>

                    <h3 className="mt-3 text-sm font-bold text-gray-800 dark:text-gray-200">
                      {item.title}
                    </h3>
                    <span className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                      {formatDate(item.date)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-2">
          <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
            <TitleAfter title={"محصولات سفارش"} />
            {selectedItem ? (
              <>
                <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4 dark:border-primary/30 dark:bg-primary/10">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-zinc-900">
                      <Image
                        width={96}
                        height={96}
                        src={getOrderItemImage(selectedItem)}
                        className="h-[85%] w-[85%] object-contain"
                        alt={
                          selectedItem.productTitle ||
                          selectedItem.productName ||
                          "محصول"
                        }
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-xs font-semibold text-primary">
                        محصول انتخاب‌شده
                      </p>
                      <Link
                        href={selectedItemHref}
                        className="line-clamp-2 font-semibold text-gray-900 transition hover:text-primary dark:text-gray-100"
                      >
                        {selectedItem.productTitle ||
                          selectedItem.productName ||
                          "محصول"}
                      </Link>
                      <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
                        <span>
                          تعداد:{" "}
                          {new Intl.NumberFormat("fa-IR").format(
                            selectedItem.quantity,
                          )}
                        </span>
                        <span>مبلغ: {formatMoney(selectedItem.lineTotal)}</span>
                        {selectedItem.variantName ? (
                          <span>تنوع: {selectedItem.variantName}</span>
                        ) : null}
                        {selectedItem.statusTitleFa ? (
                          <span>وضعیت: {selectedItem.statusTitleFa}</span>
                        ) : null}
                      </div>
                    </div>
                    {canCancelOrderItem(order, selectedItem) ? (
                      <button
                        type="button"
                        onClick={() => openCancelTicketForm(selectedItem)}
                        className="inline-flex items-center justify-center rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:border-red-500 hover:text-red-500 dark:border-red-900/60 dark:text-red-400"
                      >
                        لغو آیتم
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="mb-6 border-b border-gray-200 dark:border-gray-700" />
              </>
            ) : null}

            <div className="space-y-6">
              {order.items.map((item) => {
                const isSelected =
                  selectedItemId &&
                  (item.orderItemId === selectedItemId ||
                    item.productId === selectedItemId ||
                    item.id === selectedItemId);
                const productHref = getOrderItemProductHref(item);

                return (
                  <div
                    key={item.orderItemId}
                    className={`flex flex-col gap-4 border-b border-gray-200 pb-6 last:border-b-0 last:pb-0 dark:border-gray-700 md:flex-row md:items-center ${
                      isSelected
                        ? "rounded-xl border border-primary/20 bg-primary/5 p-4 last:pb-4 dark:border-primary/30 dark:bg-primary/10"
                        : ""
                    }`}
                  >
                    <Image
                      width={80}
                      height={80}
                      src={getOrderItemImage(item)}
                      className="size-20 rounded-lg object-contain"
                      alt={item.productName || item.productTitle || "محصول"}
                      unoptimized
                    />
                    <div className="flex-1">
                      <Link
                        href={productHref}
                        className="font-medium text-gray-800 transition hover:text-primary dark:text-gray-200"
                      >
                        {item.productTitle || item.productName || "محصول"}
                      </Link>
                      {/* <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {[item.variantName, item.sku ? `کد: ${item.sku}` : null]
                        .filter(Boolean)
                        .join(" • ")}
                    </p> */}
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        تعداد:{" "}
                        {new Intl.NumberFormat("fa-IR").format(item.quantity)}
                        {item.statusTitleFa ? ` • ${item.statusTitleFa}` : ""}
                      </p>
                      {item.variantName ? (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          تنوع: {item.variantName}
                        </p>
                      ) : null}
                      {item.cancelReason ? (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          دلیل لغو: {item.cancelReason}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-col items-start gap-3 text-right md:items-end md:text-left">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {formatMoney(item.lineTotal)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {new Intl.NumberFormat("fa-IR").format(item.quantity)}{" "}
                          × {formatMoney(item.unitPrice)}
                        </p>
                      </div>
                      {canCancelOrderItem(order, item) ? (
                        <button
                          type="button"
                          onClick={() => openCancelTicketForm(item)}
                          className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-500 hover:text-red-500 dark:border-red-900/60 dark:text-red-400"
                        >
                          لغو آیتم
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
            <TitleAfter title={"اطلاعات ارسال"} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-2 dark:bg-zinc-800">
                <h3 className="mb-3 font-medium text-gray-800 dark:text-gray-200">
                آدرس تحویل
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {shippingAddress}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2 dark:bg-zinc-800">
                <h3 className="mb-3 font-medium text-gray-800 dark:text-gray-200">
                  روش ارسال
                </h3>
                {shippingSelections.length ? (
                  <div className="space-y-2">
                    {shippingSelections.map((selection, index) => (
                      <div
                        key={`${getField(
                          selection,
                          "shippingClassId",
                          "methodId",
                        )}-${index}`}
                        className="rounded-md border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-custom-dark"
                      >
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {getShippingSelectionTitle(selection) || "—"}
                        </p>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          هزینه: {formatMoney(selection.cost)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {order.shippingMethodTitleSnapshot ||
                      firstShipment.shippingMethodTitle ||
                      "—"}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  زمان تقریبی تحویل:{" "}
                  {order.estimatedDeliveryDays
                    ? `${new Intl.NumberFormat("fa-IR").format(
                        order.estimatedDeliveryDays,
                      )} روز`
                    : "—"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  کد رهگیری: {firstShipment.trackingCode || "—"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  شرکت ارسال: {firstShipment.courierName || "—"}
                </p>
              </div>
            </div>
          </div>

          {shipments.length ? (
            <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
              <TitleAfter title={"مرسوله‌ها"} />
              <div className="space-y-4">
                {shipments.map((shipment) => {
                  const item = record(shipment);
                  return (
                    <div
                      key={item.id || item.shipmentNumber}
                      className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <DetailRow
                          label="شماره مرسوله"
                          value={item.shipmentNumber}
                        />
                        <DetailRow
                          label="وضعیت"
                          value={item.statusTitleFa || item.statusKey}
                        />
                        <DetailRow
                          label="هزینه ارسال"
                          value={formatMoney(item.shipmentFee)}
                        />
                        <DetailRow
                          label="تاریخ ارسال"
                          value={formatDate(item.shippedAt)}
                        />
                        <DetailRow
                          label="تاریخ تحویل"
                          value={formatDate(item.deliveredAt)}
                        />
                        <DetailRow label="گیرنده" value={item.receiverName} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
            <TitleAfter title={"خلاصه سفارش"} />
            <div className="space-y-4">
              <DetailRow
                label="قیمت کالاها"
                value={formatMoney(order.subtotalAmount)}
              />
              <DetailRow
                label="تخفیف کمپین"
                value={formatMoney(order.campaignDiscountAmount)}
              />
              <DetailRow
                label="تخفیف کوپن"
                value={formatMoney(order.couponDiscountAmount)}
              />
              <DetailRow
                label="تخفیف دستی"
                value={formatMoney(order.manualDiscountAmount)}
              />
              <DetailRow
                label="تخفیف اعمال شده"
                value={formatMoney(order.appliedDiscountAmount)}
              />
              <DetailRow
                label="هزینه ارسال"
                value={formatMoney(order.shippingFee)}
              />
              <DetailRow
                label="تخفیف ارسال"
                value={formatMoney(order.shippingDiscountAmount)}
              />
              <DetailRow label="مالیات" value={formatMoney(order.taxAmount)} />
              <DetailRow
                label="پرداخت شده"
                value={formatMoney(order.paidAmount)}
              />
              <DetailRow
                label="مسترد شده"
                value={formatMoney(order.refundedAmount)}
              />
              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <DetailRow
                  label="مبلغ قابل پرداخت"
                  value={formatMoney(order.payableAmount)}
                  valueClassName="text-primary"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
            <TitleAfter title={"اطلاعات پرداخت"} />
            <div className="space-y-4">
              <DetailRow
                label="روش پرداخت"
                value={firstPayment.methodTitleFa || firstPayment.method}
              />
              <DetailRow
                label="وضعیت پرداخت"
                value={
                  firstPayment.statusTitleFa ||
                  firstPayment.statusKey ||
                  order.paymentStatusTitleFa
                }
              />
              <DetailRow
                label="مبلغ"
                value={formatMoney(firstPayment.amount)}
              />
              <DetailRow label="درگاه" value={firstPayment.providerCode} />
              <DetailRow
                label="شناسه پرداخت"
                value={firstAttempt.refIdMasked}
              />
              <DetailRow
                label="تاریخ پرداخت"
                value={formatDate(firstAttempt.settledAt || order.paidAt)}
              />
              <DetailRow
                label="دلیل خطا"
                value={firstAttempt.failureReasonFa}
              />
            </div>
          </div>

          {discounts.length ? (
            <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
              <TitleAfter title={"تخفیف‌ها"} />
              <div className="space-y-3">
                {discounts.map((discount, index) => {
                  const item = record(discount);
                  return (
                    <div
                      key={`${item.discountSource}-${index}`}
                      className="rounded-lg bg-gray-50 p-3 dark:bg-zinc-800"
                    >
                      <DetailRow
                        label={
                          item.sourceLabel || item.discountSource || "تخفیف"
                        }
                        value={formatMoney(item.discountAmount)}
                      />
                      {!item.isApplied && item.rejectionReason ? (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          {item.rejectionReason}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {order.customerNote ? (
            <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
              <TitleAfter title={"یادداشت مشتری"} />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.customerNote}
              </p>
            </div>
          ) : null}

          {returns.length ? (
            <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
              <TitleAfter title={"مرجوعی‌ها"} />
              <div className="space-y-3">
                {returns.map((returnItem) => {
                  const item = record(returnItem);
                  return (
                    <div
                      key={item.id}
                      className="rounded-lg bg-gray-50 p-3 dark:bg-zinc-800"
                    >
                      <DetailRow
                        label="وضعیت"
                        value={item.statusTitleFa || item.statusKey}
                      />
                      <DetailRow
                        label="مبلغ بازگشت"
                        value={formatMoney(item.totalRefundAmount)}
                      />
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {item.reason || item.adminNote || ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
