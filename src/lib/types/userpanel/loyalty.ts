export type LoyaltyPointsSummary = {
  totalPoints: number;
  usablePoints: number;
  usedPoints: number;
  statusKey: string;
};

export type LoyaltyPointsHistoryItem = {
  id: string;
  type: string;
  status: string;
  amount: number;
  balanceAfter: number;
  reason: string;
  referenceType: string;
  referenceId: string;
  createdAt: string;
};

export type LoyaltyPointsHistoryPage = {
  items: LoyaltyPointsHistoryItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type LoyaltyPointsRule = {
  id: string;
  key: string;
  side: string;
  actionType: string;
  title: string;
  description: string;
  points: number;
};

export type LoyaltyPointsRules = {
  enabled: boolean;
  earnRules: LoyaltyPointsRule[];
  spendRules: LoyaltyPointsRule[];
  rules: LoyaltyPointsRule[];
};

export type LoyaltyHistoryParams = {
  page?: number;
  pageSize?: number;
};
