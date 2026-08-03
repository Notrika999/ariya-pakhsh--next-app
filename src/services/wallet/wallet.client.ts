// src/services/wallet/wallet.client.ts
"use client";

import { apiClient, ApiError } from "@/src/lib/http/api-client";
import type {
  GetWalletTransactionsParams,
  WalletInfo,
  WalletTopUpResult,
  WalletTransaction,
  WalletTransactionsPage,
} from "@/src/lib/types/wallet/wallet.types";

const BASE = "/me/wallet";

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function assertSuccess(payload: unknown, fallback: string) {
  const root = getRecord(payload);
  const ok = root.success ?? root.isSuccess;
  if (ok === false) {
    throw new ApiError(
      400,
      typeof root.message === "string" && root.message
        ? root.message
        : fallback,
      typeof root.code === "string" ? root.code : undefined,
      payload,
    );
  }
}

function mapWallet(value: unknown): WalletInfo {
  const item = getRecord(value);
  return {
    id: String(item.id ?? ""),
    balance: Number(item.balance ?? 0) || 0,
    currency: String(item.currency ?? "IRT"),
    statusKey: String(item.statusKey ?? ""),
  };
}

function mapTransaction(value: unknown): WalletTransaction {
  const item = getRecord(value);
  return {
    id: String(item.id ?? ""),
    type: String(item.type ?? ""),
    amount: Number(item.amount ?? 0) || 0,
    balanceAfter: Number(item.balanceAfter ?? 0) || 0,
    reason: String(item.reason ?? ""),
    referenceType: String(item.referenceType ?? ""),
    referenceId: item.referenceId ? String(item.referenceId) : null,
    createdByUserId: item.createdByUserId ? String(item.createdByUserId) : null,
    createdAt: String(item.createdAt ?? ""),
  };
}

function unwrapWallet(payload: unknown): WalletInfo {
  const root = getRecord(payload);
  return mapWallet(root.data ?? root);
}

function unwrapTransactionsPage(payload: unknown): WalletTransactionsPage {
  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);
  const itemsRaw = Array.isArray(data.items)
    ? data.items
    : Array.isArray(root.items)
      ? root.items
      : [];

  const items = itemsRaw.map(mapTransaction).filter((item) => item.id);

  return {
    items,
    pageNumber: Number(
      data.page ?? data.pageNumber ?? root.page ?? root.pageNumber ?? 1,
    ),
    pageSize: Number(data.pageSize ?? root.pageSize ?? (items.length || 10)),
    totalCount: Number(data.totalCount ?? root.totalCount ?? items.length),
    totalPages: Number(data.totalPages ?? root.totalPages ?? 1),
    hasPreviousPage: Boolean(data.hasPreviousPage ?? root.hasPreviousPage),
    hasNextPage: Boolean(data.hasNextPage ?? root.hasNextPage),
  };
}

function cleanParams(
  params: GetWalletTransactionsParams,
): Record<string, string | number> {
  const query: Record<string, string | number> = {};
  const page = params.page ?? params.pageNumber;
  const transactionType = params.transactionType ?? params.type;

  if (page != null) query.page = page;
  if (params.pageSize != null) query.pageSize = params.pageSize;
  if (params.search?.trim()) query.search = params.search.trim();
  if (params.period?.trim()) query.period = params.period.trim();
  if (transactionType?.trim()) query.transactionType = transactionType.trim();
  if (params.fromDate?.trim()) query.fromDate = params.fromDate.trim();
  if (params.toDate?.trim()) query.toDate = params.toDate.trim();
  return query;
}

export async function getMyWallet(): Promise<WalletInfo> {
  const response = await apiClient.get(BASE);
  assertSuccess(response.data, "دریافت کیف پول ناموفق بود");
  return unwrapWallet(response.data);
}

export async function getMyWalletTransactions(
  params: GetWalletTransactionsParams = {},
): Promise<WalletTransactionsPage> {
  const query = cleanParams(params);

  const response = await apiClient.get(`${BASE}/transactions`, {
    params: query,
  });

  console.log("query => ", query);
  console.log("getMyWalletTransactions => ", response.data);

  assertSuccess(response.data, "دریافت تراکنش‌ها ناموفق بود");
  return unwrapTransactionsPage(response.data);
}

export async function topUpMyWallet(
  amount: number,
): Promise<WalletTopUpResult> {
  const response = await apiClient.post(`${BASE}/top-up`, { amount });

  assertSuccess(response.data, "افزایش اعتبار ناموفق بود");

  const root = getRecord(response.data);
  const data = getRecord(root.data ?? root);
  const paymentUrl =
    (typeof data.paymentUrl === "string" && data.paymentUrl) ||
    (typeof data.redirectUrl === "string" && data.redirectUrl) ||
    (typeof data.gatewayUrl === "string" && data.gatewayUrl) ||
    undefined;

  return {
    paymentUrl,
    redirectUrl: paymentUrl,
    message: typeof root.message === "string" ? root.message : undefined,
    raw: response.data,
  };
}
