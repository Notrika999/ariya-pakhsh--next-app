"use client";
// components/ui/UserProfile/CreditHistory/CreditHistory.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CreditHistoryTop from "./CreditHistoryTop";
import CreditHistorySummary from "./CreditHistorySummary";
import FilterBar from "../../../modules/FilterBar/FilterBar";
import TransactionCard from "../../../modules/Transactions/TransactionCard";
import GatewayRedirectConfirmation from "@/components/modules/GatewayRedirectConfirmation/GatewayRedirectConfirmation";
import {
  getMyWallet,
  getMyWalletTransactions,
  topUpMyWallet,
} from "@/src/services/wallet/wallet.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { notify } from "@/src/utils/toast";

const PAGE_SIZE = 20;
const QUICK_AMOUNTS = [50000, 100000, 200000];

const formatMoney = (value) =>
  `${new Intl.NumberFormat("fa-IR").format(Math.max(0, Math.round(Number(value) || 0)))} تومان`;

const formatAmountInput = (value) =>
  value ? new Intl.NumberFormat("en-US").format(Number(value)) : "";

const normalizeAmountInput = (value) => {
  const normalizedDigits = String(value)
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/\D/g, "")
    .replace(/^0+(?=\d)/, "");

  return normalizedDigits;
};

const parseAmountInput = (value) => Number(normalizeAmountInput(value));

const INCOME_TYPES = new Set([
  "income",
  "credit",
  "topup",
  "top-up",
  "top_up",
  "deposit",
  "refund",
  "bonus",
  "reward",
]);

function buildDateRange(daysValue) {
  if (!daysValue || daysValue === "all") return {};
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

function toApiDateTime(dateValue, endOfDay = false) {
  if (!dateValue) return undefined;
  const time = endOfDay ? "23:59:59.999" : "00:00:00.000";
  const date = new Date(`${dateValue}T${time}`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function buildManualDateRange(fromDate, toDate) {
  const params = {};
  const normalizedFromDate = toApiDateTime(fromDate);
  const normalizedToDate = toApiDateTime(toDate, true);

  if (normalizedFromDate) params.fromDate = normalizedFromDate;
  if (normalizedToDate) params.toDate = normalizedToDate;

  return params;
}

function isIncomeType(type = "", amount = 0) {
  const key = String(type).toLowerCase();
  if (INCOME_TYPES.has(key)) return true;
  if (
    key.includes("credit") ||
    key.includes("deposit") ||
    key.includes("refund")
  ) {
    return true;
  }
  if (
    key.includes("debit") ||
    key.includes("purchase") ||
    key.includes("withdraw")
  ) {
    return false;
  }
  return amount >= 0;
}

function mapTransactionForCard(tx) {
  const income = isIncomeType(tx.type, tx.amount);
  const createdAt = tx.createdAt ? new Date(tx.createdAt) : null;
  const validDate = createdAt && !Number.isNaN(createdAt.getTime());

  return {
    id: tx.id,
    type: income ? "income" : "expense",
    icon: income ? "fa-check-circle" : "fa-arrow-down",
    title: tx.reason || tx.type || "تراکنش",
    transactionId: tx.id,
    orderId:
      tx.referenceType?.toLowerCase().includes("order") && tx.referenceId
        ? tx.referenceId
        : undefined,
    amount: Math.abs(Number(tx.amount) || 0),
    date: validDate
      ? new Intl.DateTimeFormat("fa-IR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(createdAt)
      : "—",
    time: validDate
      ? new Intl.DateTimeFormat("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(createdAt)
      : "",
    status: "success",
    rawType: tx.type,
  };
}

export default function CreditHistory() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [pendingTopUpGateway, setPendingTopUpGateway] = useState(null);

  const [type, setType] = useState("all");
  const [period, setPeriod] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const loadWallet = useCallback(async () => {
    try {
      const wallet = await getMyWallet();
      setBalance(wallet.balance);
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
      setBalance(0);
    }
  }, []);

  const loadTransactions = useCallback(
    async (pageNumber = 1) => {
      setLoading(true);
      try {
        const manualDateParams = buildManualDateRange(fromDate, toDate);
        const hasManualDate = Boolean(
          manualDateParams.fromDate || manualDateParams.toDate,
        );
        const dateParams = hasManualDate
          ? manualDateParams
          : buildDateRange(period);

        const data = await getMyWalletTransactions({
          page: pageNumber,
          pageSize: PAGE_SIZE,
          search: debouncedSearch || undefined,
          period: !hasManualDate && period !== "all" ? period : undefined,
          transactionType: type !== "all" ? type : undefined,
          ...dateParams,
        });

        setTransactions(data.items);
        setPage(data.pageNumber || pageNumber);
        setTotalCount(data.totalCount);
        setTotalPages(Math.max(1, data.totalPages || 1));
        setHasPreviousPage(Boolean(data.hasPreviousPage));
        setHasNextPage(Boolean(data.hasNextPage));
      } catch (error) {
        notify.error(getAuthErrorMessage(error));
        setTransactions([]);
        setTotalCount(0);
        setTotalPages(1);
        setHasPreviousPage(false);
        setHasNextPage(false);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, fromDate, period, toDate, type],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadWallet();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadWallet]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTransactions(1);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadTransactions]);

  const handlePeriodChange = useCallback((value) => {
    setPeriod(value);
    setFromDate("");
    setToDate("");
  }, []);

  const handleFromDateChange = useCallback((value) => {
    setFromDate(value);
    if (value) setPeriod("all");
  }, []);

  const handleToDateChange = useCallback((value) => {
    setToDate(value);
    if (value) setPeriod("all");
  }, []);

  const cardItems = useMemo(
    () => transactions.map(mapTransactionForCard),
    [transactions],
  );

  const filteredTransactions = cardItems;

  const summary = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    for (const item of cardItems) {
      if (item.type === "income" || item.type === "bonus") {
        totalIncome += item.amount;
      } else {
        totalExpense += item.amount;
      }
    }

    return {
      totalIncome,
      totalExpense,
      lastTransactionAmount: cardItems[0]?.amount ?? 0,
    };
  }, [cardItems]);

  const handleTopUp = async (amountValue) => {
    const amount = parseAmountInput(amountValue);
    if (!Number.isFinite(amount) || amount <= 0) {
      notify.error("مبلغ افزایش اعتبار معتبر نیست");
      return;
    }

    setTopUpLoading(true);
    try {
      const result = await topUpMyWallet(amount);
      if (result.paymentUrl) {
        setPendingTopUpGateway({
          amount,
          paymentUrl: result.paymentUrl,
        });
        setTopUpLoading(false);
        return;
      }

      notify.success(result.message || "درخواست افزایش اعتبار ثبت شد");
      await Promise.all([loadWallet(), loadTransactions(1)]);
      setCustomAmount("");
      setSelectedQuickAmount(null);
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleCancelTopUpGateway = useCallback(() => {
    setPendingTopUpGateway(null);
    setTopUpLoading(false);
  }, []);

  const handleProceedTopUpGateway = useCallback(() => {
    if (!pendingTopUpGateway?.paymentUrl || topUpLoading) return;

    setTopUpLoading(true);
    window.location.href = pendingTopUpGateway.paymentUrl;
  }, [pendingTopUpGateway, topUpLoading]);

  const from = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, totalCount);

  if (pendingTopUpGateway) {
    const topUpAmount = Number(pendingTopUpGateway.amount) || 0;

    return (
      <GatewayRedirectConfirmation
        title="تایید افزایش اعتبار"
        description="قبل از انتقال به درگاه، جزئیات افزایش اعتبار کیف پول را بررسی کنید."
        iconClassName="far fa-wallet text-lg"
        details={[
          {
            label: "نوع عملیات",
            value: "افزایش اعتبار کیف پول",
            tone: "primary",
          },
          {
            label: "موجودی فعلی",
            value: formatMoney(balance),
          },
          {
            label: "مبلغ افزایش اعتبار",
            value: formatMoney(topUpAmount),
            tone: "success",
          },
          {
            label: "موجودی پس از پرداخت",
            value: formatMoney(balance + topUpAmount),
          },
        ]}
        amountLabel="مبلغ قابل پرداخت"
        amountValue={formatMoney(topUpAmount)}
        starting={topUpLoading}
        onCancel={handleCancelTopUpGateway}
        onProceed={handleProceedTopUpGateway}
      />
    );
  }

  return (
    <div className="space-y-4 lg:col-span-3">
      <CreditHistoryTop balance={balance} />

      <CreditHistorySummary
        totalIncome={summary.totalIncome}
        totalExpense={summary.totalExpense}
        lastTransactionAmount={summary.lastTransactionAmount}
      />

      <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <FilterBar
          selects={[
            {
              key: "type",
              value: type,
              onChange: setType,
              options: [
                { value: "", label: "همه نوع تراکنش" },
                { value: "deposit", label: "واریز" },
                { value: "withdrawal", label: "برداشت" },
                { value: "refund", label: "عودت" },
                { value: "reward", label: "پاداش" },
              ],
            },
            {
              key: "period",
              value: period,
              onChange: handlePeriodChange,
              options: [
                { value: "", label: "همه زمان‌ها" },
                { value: "today", label: "امروز" },
                { value: "last7days", label: "۷ روز گذشته" },
                { value: "last30days", label: "۳۰ روز گذشته" },
                { value: "thismonth", label: "ماه جاری" },
              ],
            },
          ]}
          dateRange={{
            fromDate,
            toDate,
            fromLabel: "از تاریخ",
            toLabel: "تا تاریخ",
            placeholder: "بازه تاریخ",
            clearLabel: "پاک کردن بازه تاریخ",
            onFromDateChange: handleFromDateChange,
            onToDateChange: handleToDateChange,
          }}
          search={{
            value: search,
            onChange: setSearch,
            placeholder: "جستجوی شماره تراکنش...",
          }}
        />
      </div>

      <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <h2 className="with-highlight mb-6 text-xl font-bold dark:text-gray-200">
          لیست تراکنش‌ها
        </h2>

        <div className="space-y-4">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`tx-skeleton-${index}`}
                  className="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-zinc-800"
                />
              ))
            : filteredTransactions.length > 0
              ? filteredTransactions.map((item) => (
                  <TransactionCard key={item.id} item={item} />
                ))
              : null}
        </div>

        <div className="mt-8 flex flex-col border-t border-gray-200 pt-6 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <p className="mb-4 text-sm text-gray-700 dark:text-gray-300 sm:mb-0">
            نمایش {new Intl.NumberFormat("fa-IR").format(from)} تا{" "}
            {new Intl.NumberFormat("fa-IR").format(to)} از{" "}
            {new Intl.NumberFormat("fa-IR").format(totalCount)} تراکنش
          </p>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={!hasPreviousPage || loading}
              onClick={() => void loadTransactions(page - 1)}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              قبلی
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
              const pageNumber = index + 1;
              const isActive = pageNumber === page;
              return (
                <button
                  key={`wallet-page-${pageNumber}`}
                  type="button"
                  disabled={loading}
                  onClick={() => void loadTransactions(pageNumber)}
                  className={[
                    "inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium",
                    isActive
                      ? "border-primary bg-primary text-white hover:bg-primary/90 dark:bg-primary/80"
                      : "border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
                  ].join(" ")}
                >
                  {new Intl.NumberFormat("fa-IR").format(pageNumber)}
                </button>
              );
            })}
            <button
              type="button"
              disabled={!hasNextPage || loading}
              onClick={() => void loadTransactions(page + 1)}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              بعدی
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <h2 className="with-highlight mb-6 text-xl font-bold dark:text-gray-200">
          افزایش اعتبار
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              مبلغ سریع
            </p>
            <div className="grid grid-cols-3 gap-3">
              {QUICK_AMOUNTS.map((amount) => {
                const isActive = selectedQuickAmount === amount;
                return (
                  <button
                    key={amount}
                    type="button"
                    disabled={topUpLoading}
                    onClick={() => {
                      setSelectedQuickAmount(amount);
                      setCustomAmount(formatAmountInput(amount));
                    }}
                    className={[
                      "rounded-lg py-3 text-center transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "bg-gray-100 hover:bg-primary hover:text-white dark:bg-zinc-800",
                    ].join(" ")}
                  >
                    {new Intl.NumberFormat("fa-IR").format(amount)} تومان
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              مبلغ دلخواه
            </p>
            <div className="flex space-x-3">
              <input
                id="custom-amount"
                type="text"
                inputMode="numeric"
                pattern="[0-9,]*"
                dir="ltr"
                autoComplete="off"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(
                    formatAmountInput(normalizeAmountInput(e.target.value)),
                  );
                  setSelectedQuickAmount(null);
                }}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
                placeholder="مبلغ به تومان"
              />
              <button
                id="payment-btn"
                type="button"
                disabled={topUpLoading}
                onClick={() => void handleTopUp(customAmount)}
                className="rounded-lg bg-primary px-6 py-2 font-medium text-white transition duration-200 hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {topUpLoading ? "در حال پرداخت..." : "پرداخت"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
