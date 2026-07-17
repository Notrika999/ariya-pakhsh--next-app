"use client";
// components/ui/UserProfile/Orders/UserOrders.jsx
import React, { useCallback, useEffect, useState } from "react";
import UserOrdersTop from "./UserOrdersTop";
import UserOrdersFilter from "./UserOrdersFilter";
import UserOrdersList from "./UserOrdersList";
import {
  getMyOrderById,
  getMyOrderByNumber,
  getMyOrders,
  retryMyOrderPayment,
} from "@/src/services/orders/orders.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { notify } from "@/src/utils/toast";

const PAGE_SIZE = 10;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryingOrderId, setRetryingOrderId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState(false);

  const applyPage = useCallback((data, fallbackPage = 1) => {
    setOrders(data.items);
    setPage(data.pageNumber || fallbackPage);
    setTotalCount(data.totalCount);
    setTotalPages(Math.max(1, data.totalPages || 1));
    setHasPreviousPage(Boolean(data.hasPreviousPage));
    setHasNextPage(Boolean(data.hasNextPage));
  }, []);

  const loadOrders = useCallback(
    async (pageNumber = 1) => {
      setLoading(true);
      setSearchMode(false);

      try {
        const dateParams = buildDateRange(dateRange);
        const data = await getMyOrders({
          pageNumber,
          pageSize: PAGE_SIZE,
          statusKey: status || undefined,
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

  const handleRetryPayment = async (order) => {
    if (!order?.orderId) return;

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

  return (
    <div className="space-y-8 lg:col-span-3">
      <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <UserOrdersTop activeCount={totalCount} />
      </div>

      <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <UserOrdersFilter
          status={status}
          dateRange={dateRange}
          search={search}
          onStatusChange={(value) => setStatus(value)}
          onDateRangeChange={(value) => setDateRange(value)}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
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
        onBuyAgain={() => {
          notify.info("قابلیت خرید مجدد به‌زودی فعال می‌شود");
        }}
        onTrackOrder={() => {
          notify.info("قابلیت رهگیری سفارش به‌زودی فعال می‌شود");
        }}
        onCancelSuccess={() => {
          void loadOrders(page);
        }}
      />
    </div>
  );
}
