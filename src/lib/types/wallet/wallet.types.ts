// src/lib/types/wallet/wallet.types.ts

export type WalletInfo = {
  id: string;
  balance: number;
  currency: string;
  statusKey: string;
};

export type WalletTransaction = {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  reason: string;
  referenceType: string;
  referenceId: string | null;
  createdByUserId: string | null;
  createdAt: string;
};

export type WalletTransactionsPage = {
  items: WalletTransaction[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type GetWalletTransactionsParams = {
  page?: number;
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  period?: string;
  transactionType?: string;
  type?: string;
  fromDate?: string;
  toDate?: string;
};

export type WalletTopUpResult = {
  paymentUrl?: string;
  redirectUrl?: string;
  message?: string;
  raw: unknown;
};
