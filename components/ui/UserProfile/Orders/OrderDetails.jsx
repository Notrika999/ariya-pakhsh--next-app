"use client";
// components/ui/UserProfile/Orders/OrderDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import { getMyOrderById } from "@/src/services/orders/orders.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { notify } from "@/src/utils/toast";

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

function addressText(snapshot) {
  const address = safeJson(snapshot);
  if (!address) return snapshot || "—";
  return [address.countryName, address.state, address.city, address.addressLine]
    .filter(Boolean)
    .join("، ");
}

function DetailRow({
  label,
  value,
  valueClassName = "text-gray-800 dark:text-gray-200",
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className={`text-left font-medium ${valueClassName}`}>
        {value || "—"}
      </span>
    </div>
  );
}

export default function OrderDetails() {
  const params = useParams();
  const orderId = String(params?.id ?? "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    async function loadOrder() {
      setLoading(true);
      try {
        const data = await getMyOrderById(orderId);

        console.log("[OrderDetails] data =>", data);
        if (!cancelled) setOrder(data);
      } catch (error) {
        if (!cancelled) {
          notify.error(getAuthErrorMessage(error));
          setOrder(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadOrder();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

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

  if (loading) {
    return (
      <div className="space-y-6 lg:col-span-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`order-detail-skeleton-${index}`}
            className="h-40 animate-pulse rounded-2xl bg-gray-100 dark:bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="lg:col-span-3 rounded-2xl bg-white p-6 text-center text-gray-600 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark dark:text-gray-300">
        جزئیات سفارش پیدا نشد.
      </div>
    );
  }

  const shippingAddress = addressText(order.shippingAddressSnapshotJson);
  const firstShipment = record(order.shipments?.[0]);
  const firstPayment = record(order.payments?.[0]);
  const firstAttempt = record(firstPayment.attempts?.[0]);

  return (
    <div className="space-y-8 lg:col-span-3">
      <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <TitleAfter
              title={`جزئیات سفارش #${order.publicOrderNumber || order.orderId}`}
            />
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              ثبت شده در {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
        <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
          <TitleAfter title={"روند سفارش"} />
          <div className="space-y-5">
            {timeline.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="flex items-start gap-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500">
                  <i className="far fa-check text-sm text-white"></i>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      {item.title}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  {item.text ? (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {item.text}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
            <TitleAfter title={"محصولات سفارش"} />
            <div className="space-y-6">
              {order.items.map((item) => (
                <div
                  key={item.orderItemId}
                  className="flex flex-col gap-4 border-b border-gray-200 pb-6 last:border-b-0 last:pb-0 dark:border-gray-700 md:flex-row md:items-center"
                >
                  <Image
                    width={80}
                    height={80}
                    src={item.imageUrl || "/images/default.png"}
                    className="size-20 rounded-lg object-cover"
                    alt={item.productName}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      {item.productTitle}
                    </h3>
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
                    {item.cancelReason ? (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        دلیل لغو: {item.cancelReason}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {formatMoney(item.lineTotal)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {new Intl.NumberFormat("fa-IR").format(item.quantity)} ×{" "}
                      {formatMoney(item.unitPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
            <TitleAfter title={"اطلاعات ارسال"} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-zinc-800">
                <h3 className="mb-3 font-medium text-gray-800 dark:text-gray-200">
                  آدرس تحویل
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {shippingAddress}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-zinc-800">
                <h3 className="mb-3 font-medium text-gray-800 dark:text-gray-200">
                  روش ارسال
                </h3>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {order.shippingMethodTitleSnapshot ||
                    firstShipment.shippingMethodTitle ||
                    "—"}
                </p>
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

          {order.shipments.length ? (
            <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
              <TitleAfter title={"مرسوله‌ها"} />
              <div className="space-y-4">
                {order.shipments.map((shipment) => {
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

        <div className="space-y-8">
          <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
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

          <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
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

          {order.discounts.length ? (
            <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
              <TitleAfter title={"تخفیف‌ها"} />
              <div className="space-y-3">
                {order.discounts.map((discount, index) => {
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

          {order.returns.length ? (
            <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
              <TitleAfter title={"مرجوعی‌ها"} />
              <div className="space-y-3">
                {order.returns.map((returnItem) => {
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
