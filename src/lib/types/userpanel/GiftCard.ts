export type GiftCardStatus = "active" | "used";

export interface GiftCard {
  id: string;
  type: GiftCardStatus;
  code: string;
  title: string;
  amount: number;
  remainingBalance: number;
  currency: string;
  expiresAt: string | null;
  statusKey: string;
  statusTitle: string;
}

export interface GiftCardsPage {
  items: GiftCard[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
