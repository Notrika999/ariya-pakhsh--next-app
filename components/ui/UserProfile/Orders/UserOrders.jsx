"use client";
// components/ui/UserProfile/Orders/UserOrders.jsx
import React, { useCallback, useEffect, useState } from "react";
import UserOrdersTop from "./UserOrdersTop";
import UserOrdersFilter, { ORDER_STATUS_TABS } from "./UserOrdersFilter";
import UserOrdersList from "./UserOrdersList";
import GatewayRedirectConfirmation from "@/components/modules/GatewayRedirectConfirmation/GatewayRedirectConfirmation";
import {
<<<<<<< HEAD
=======
  downloadMyOrderInvoice,
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  getMyOrderById,
  getMyOrderByNumber,
  getMyOrders,
  retryMyOrderPayment,
} from "@/src/services/orders/orders.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { notify } from "@/src/utils/toast";
import { rememberPendingPaymentOrder } from "@/src/utils/paymentRetryStorage";

const PAGE_SIZE = 10;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
<<<<<<< HEAD
const PENDING_PAYMENT_FILTERS = [
  { statusKey: "order.pending_payment" },
  { statusKey: "order.pending" },
  { paymentStatusKey: "pending" },
  { paymentStatusKey: "payment.pending" },
  { paymentStatusKey: "payment.awaiting_payment" },
];
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

const formatMoney = (value) =>
  `${new Intl.NumberFormat("fa-IR").format(Math.max(0, Math.round(Number(value) || 0)))} تومان`;

function buildDateRange(daysValue) {
  if (!daysValue) return {};

  const days = Number(daysValue);
  if (!Number.isFinite(days) || days <= 0) return {};

  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  return {
    fromDate: fromDate.toISOString(),
    toDate: toDate.toISOString(),
  };
}
<<<<<<< HEAD

function getStatusFilterParams(statusValue) {
  if (!statusValue) return [{}];

  if (statusValue === "pending") {
    return PENDING_PAYMENT_FILTERS;
  }

  return [{ statusKey: statusValue }];
}

async function getMyOrdersByStatusFilter({ statusValue, ...params }) {
  const statusFilters = getStatusFilterParams(statusValue);
  let emptyResult = null;

  for (const statusFilter of statusFilters) {
    const data = await getMyOrders({
      ...params,
      ...statusFilter,
    });

    if (data.totalCount > 0 || statusFilters.length === 1) {
      return data;
    }

    emptyResult = data;
  }

  return emptyResult;
}
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryingOrderId, setRetryingOrderId] = useState(null);
<<<<<<< HEAD
=======
  const [downloadingInvoiceOrderId, setDownloadingInvoiceOrderId] =
    useState(null);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  const [pendingRetryOrder, setPendingRetryOrder] = useState(null);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [status, setStatus] = useState("");
  const [statusCounts, setStatusCounts] = useState({});
  const [dateRange, setDateRange] = useState("");
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState(false);

  const applyPage = useCallback((data, fallbackPage = 1) => {
<<<<<<< HEAD
    const resolvedTotalCount = Math.max(0, Number(data.totalCount) || 0);
    const resolvedPageSize = Math.max(1, Number(data.pageSize) || PAGE_SIZE);
    const resolvedTotalPages = Math.max(
      1,
      Number(data.totalPages) ||
        Math.ceil(resolvedTotalCount / resolvedPageSize) ||
        1,
    );
    const resolvedPage = Math.min(
      resolvedTotalPages,
      Math.max(1, Number(data.pageNumber) || fallbackPage),
    );

    setOrders(data.items);
    setPage(resolvedPage);
    setTotalCount(resolvedTotalCount);
    setTotalPages(resolvedTotalPages);
    setHasPreviousPage(resolvedPage > 1);
    setHasNextPage(resolvedPage < resolvedTotalPages);
=======
    setOrders(data.items);
    setPage(data.pageNumber || fallbackPage);
    setTotalCount(data.totalCount);
    setTotalPages(Math.max(1, data.totalPages || 1));
    setHasPreviousPage(Boolean(data.hasPreviousPage));
    setHasNextPage(Boolean(data.hasNextPage));
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  }, []);

  const loadOrders = useCallback(
    async (pageNumber = 1) => {
      setLoading(true);
      setSearchMode(false);

      try {
        const dateParams = buildDateRange(dateRange);
<<<<<<< HEAD
        const data = await getMyOrdersByStatusFilter({
          pageNumber,
          pageSize: PAGE_SIZE,
          statusValue: status,
=======
        const data = await getMyOrders({
          pageNumber,
          pageSize: PAGE_SIZE,
          statusKey: status || undefined,
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
          ...dateParams,
        });
        applyPage(data, pageNumber);
      } catch (error) {
        notify.error(getAuthErrorMessage(error));
        setOrders([]);
        setTotalCount(0);
        setTotalPages(1);
        setHasPreviousPage(false);
        setHasNextPage(false);
      } finally {
        setLoading(false);
      }
    },
    [applyPage, dateRange, status],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOrders(1);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadOrders]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      const dateParams = buildDateRange(dateRange);
      void Promise.all(
        ORDER_STATUS_TABS.filter((tab) => tab.value).map(async (tab) => {
          try {
<<<<<<< HEAD
            const data = await getMyOrdersByStatusFilter({
              pageNumber: 1,
              pageSize: 1,
              statusValue: tab.value,
=======
            const data = await getMyOrders({
              pageNumber: 1,
              pageSize: 1,
              statusKey: tab.value,
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
              ...dateParams,
            });
            return [tab.value, data.totalCount];
          } catch {
            return [tab.value, 0];
          }
        }),
      ).then((entries) => {
        if (cancelled) return;
        setStatusCounts(Object.fromEntries(entries));
      });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [dateRange]);

  const handleSearchSubmit = async () => {
    const term = search.trim();
    if (!term) {
      void loadOrders(1);
      return;
    }

    setLoading(true);
    setSearchMode(true);

    try {
      const order = UUID_RE.test(term)
        ? await getMyOrderById(term)
        : await getMyOrderByNumber(term);

      setOrders(order ? [order] : []);
      setPage(1);
      setTotalCount(order ? 1 : 0);
      setTotalPages(1);
      setHasPreviousPage(false);
      setHasNextPage(false);
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
      setOrders([]);
      setTotalCount(0);
      setTotalPages(1);
      setHasPreviousPage(false);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = (order) => {
    if (!order?.orderId) return;
    setPendingRetryOrder(order);
    /*

    setRetryingOrderId(order.orderId);
    try {
      const result = await retryMyOrderPayment(order.orderId);
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }
      notify.success(result.message || "درخواست پرداخت مجدد ثبت شد");
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
    } finally {
      setRetryingOrderId(null);
    }
  };

  */
  };

  const handleCancelRetryGateway = useCallback(() => {
    setPendingRetryOrder(null);
    setRetryingOrderId(null);
  }, []);

  const handleProceedRetryGateway = useCallback(async () => {
    if (!pendingRetryOrder?.orderId || retryingOrderId) return;

    setRetryingOrderId(pendingRetryOrder.orderId);
    try {
      const result = await retryMyOrderPayment(pendingRetryOrder.orderId);
      if (result.paymentUrl) {
        rememberPendingPaymentOrder(
          pendingRetryOrder.orderId,
          pendingRetryOrder.publicOrderNumber,
        );
        window.location.href = result.paymentUrl;
        return;
      }
      notify.success(result.message || "درخواست پرداخت مجدد ثبت شد");
      setPendingRetryOrder(null);
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
    } finally {
      setRetryingOrderId(null);
    }
  }, [pendingRetryOrder, retryingOrderId]);

<<<<<<< HEAD
  const handleDownloadInvoice = useCallback((order) => {
    const orderId = String(order?.orderId ?? "").trim();
    if (!orderId) return;

    const invoiceUrl = `/api/v1/me/orders/${encodeURIComponent(orderId)}/invoice`;
    const link = document.createElement("a");
    link.href = invoiceUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, []);
=======
  const handleDownloadInvoice = useCallback(
    async (order) => {
      if (!order?.orderId || downloadingInvoiceOrderId) return;

      setDownloadingInvoiceOrderId(order.orderId);
      try {
        const { blob, fileName } = await downloadMyOrderInvoice(order.orderId);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download =
          fileName || `invoice-${order.publicOrderNumber || order.orderId}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        notify.success("فاکتور سفارش دانلود شد");
      } catch (error) {
        notify.error(getAuthErrorMessage(error));
      } finally {
        setDownloadingInvoiceOrderId(null);
      }
    },
    [downloadingInvoiceOrderId],
  );
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

  if (pendingRetryOrder) {
    return (
      <GatewayRedirectConfirmation
        title="تایید پرداخت مجدد"
        description="قبل از انتقال به درگاه، جزئیات سفارش را بررسی کنید."
        details={[
          {
            label: "شماره سفارش",
            value:
              pendingRetryOrder.publicOrderNumber || pendingRetryOrder.orderId,
          },
          {
            label: "تعداد کالا",
            value: new Intl.NumberFormat("fa-IR").format(
              Number(pendingRetryOrder.itemCount) || 0,
            ),
          },
          {
            label: "وضعیت سفارش",
            value:
              pendingRetryOrder.statusTitleFa || pendingRetryOrder.statusKey,
            tone: "warning",
          },
          {
            label: "وضعیت پرداخت",
            value:
              pendingRetryOrder.paymentStatusTitleFa ||
              pendingRetryOrder.paymentStatusKey,
          },
        ]}
        amountLabel="مبلغ قابل پرداخت"
        amountValue={formatMoney(pendingRetryOrder.payableAmount)}
        starting={retryingOrderId === pendingRetryOrder.orderId}
        onCancel={handleCancelRetryGateway}
        onProceed={() => void handleProceedRetryGateway()}
      />
    );
  }

  return (
    <div className="space-y-4 lg:col-span-3">
      <UserOrdersTop activeCount={totalCount} />

      <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <UserOrdersFilter
          status={status}
          dateRange={dateRange}
          search={search}
          onStatusChange={(value) => setStatus(value)}
          onDateRangeChange={(value) => setDateRange(value)}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
          statusCounts={statusCounts}
        />
      </div>

      <UserOrdersList
        orders={orders}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        retryingOrderId={retryingOrderId}
<<<<<<< HEAD
=======
        downloadingInvoiceOrderId={downloadingInvoiceOrderId}
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
        onPrevPage={() => {
          if (searchMode || !hasPreviousPage) return;
          void loadOrders(page - 1);
        }}
        onNextPage={() => {
          if (searchMode || !hasNextPage) return;
          void loadOrders(page + 1);
        }}
        onGoToPage={(pageNumber) => {
          if (searchMode) return;
          void loadOrders(pageNumber);
        }}
        onRetryPayment={handleRetryPayment}
        onDownloadInvoice={handleDownloadInvoice}
        onBuyAgain={() => {
          notify.info("قابلیت خرید مجدد به‌زودی فعال می‌شود");
        }}
        onTrackOrder={() => {
          notify.info("قابلیت پیگیری سفارش به‌زودی فعال می‌شود");
        }}
        onCancelSuccess={() => {
          void loadOrders(page);
        }}
      />
    </div>
  );
}
