import "server-only";

import { ProxyError, proxyToBackend } from "@/src/lib/http/server-http";

const DASHBOARD_PATH = "/api/v1/me/dashboard";

export type DashboardQueryParams = {
  recentOrdersTake?: number;
  offersTake?: number;
  activitiesTake?: number;
};

export type UserDashboard = {
  displayName: string;
  wallet: {
    walletId: string;
    balance: number;
    currency: string;
    statusKey: string;
    trendPercent: number;
  };
  orders: {
    activeCount: number;
    shippingCount: number;
  };
  favorites: {
    count: number;
    trendPercent: number;
  };
  loyalty: {
    totalPoints: number;
    usablePoints: number;
    usedPoints: number;
    statusKey: string;
    tierProgress: {
      currentTierName: string;
      nextTierName: string;
      pointsToNextTier: number;
      progressPercent: number;
    };
  };
  recentOrders: Array<Record<string, unknown>>;
  specialOffers: Array<Record<string, unknown>>;
  recentActivities: Array<Record<string, unknown>>;
};

const EMPTY_DASHBOARD: UserDashboard = {
  displayName: "",
  wallet: {
    walletId: "",
    balance: 0,
    currency: "IRT",
    statusKey: "",
    trendPercent: 0,
  },
  orders: {
    activeCount: 0,
    shippingCount: 0,
  },
  favorites: {
    count: 0,
    trendPercent: 0,
  },
  loyalty: {
    totalPoints: 0,
    usablePoints: 0,
    usedPoints: 0,
    statusKey: "",
    tierProgress: {
      currentTierName: "",
      nextTierName: "",
      pointsToNextTier: 0,
      progressPercent: 0,
    },
  },
  recentOrders: [],
  specialOffers: [],
  recentActivities: [],
};

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function toString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function cloneEmptyDashboard(): UserDashboard {
  return {
    ...EMPTY_DASHBOARD,
    wallet: { ...EMPTY_DASHBOARD.wallet },
    orders: { ...EMPTY_DASHBOARD.orders },
    favorites: { ...EMPTY_DASHBOARD.favorites },
    loyalty: {
      ...EMPTY_DASHBOARD.loyalty,
      tierProgress: { ...EMPTY_DASHBOARD.loyalty.tierProgress },
    },
    recentOrders: [],
    specialOffers: [],
    recentActivities: [],
  };
}

function cleanParams(params: DashboardQueryParams = {}) {
  return {
    recentOrdersTake: Math.max(0, toNumber(params.recentOrdersTake, 5)),
    offersTake: Math.max(0, toNumber(params.offersTake, 5)),
    activitiesTake: Math.max(0, toNumber(params.activitiesTake, 8)),
  };
}

function assertSuccess(payload: unknown) {
  const root = getRecord(payload);
  const ok = root.success ?? root.isSuccess;

  if (ok === false) {
    throw new Error(toString(root.message, "دریافت اطلاعات داشبورد ناموفق بود"));
  }
}

function mapDashboard(payload: unknown): UserDashboard {
  assertSuccess(payload);

  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);
  const wallet = getRecord(data.wallet);
  const orders = getRecord(data.orders);
  const favorites = getRecord(data.favorites);
  const loyalty = getRecord(data.loyalty);
  const tierProgress = getRecord(loyalty.tierProgress);

  return {
    displayName: toString(data.displayName),
    wallet: {
      walletId: toString(wallet.walletId),
      balance: toNumber(wallet.balance),
      currency: toString(wallet.currency, "IRT"),
      statusKey: toString(wallet.statusKey),
      trendPercent: toNumber(wallet.trendPercent),
    },
    orders: {
      activeCount: toNumber(orders.activeCount),
      shippingCount: toNumber(orders.shippingCount),
    },
    favorites: {
      count: toNumber(favorites.count),
      trendPercent: toNumber(favorites.trendPercent),
    },
    loyalty: {
      totalPoints: toNumber(loyalty.totalPoints),
      usablePoints: toNumber(loyalty.usablePoints),
      usedPoints: toNumber(loyalty.usedPoints),
      statusKey: toString(loyalty.statusKey),
      tierProgress: {
        currentTierName: toString(tierProgress.currentTierName),
        nextTierName: toString(tierProgress.nextTierName),
        pointsToNextTier: toNumber(tierProgress.pointsToNextTier),
        progressPercent: toNumber(tierProgress.progressPercent),
      },
    },
    recentOrders: Array.isArray(data.recentOrders) ? data.recentOrders : [],
    specialOffers: Array.isArray(data.specialOffers) ? data.specialOffers : [],
    recentActivities: Array.isArray(data.recentActivities)
      ? data.recentActivities
      : [],
  };
}

export function createEmptyDashboard(): UserDashboard {
  return cloneEmptyDashboard();
}

export function getDashboardErrorMessage(error: unknown): string {
  if (error instanceof ProxyError) {
    if (error.status === 401) return "برای مشاهده داشبورد وارد حساب کاربری شوید.";
    return error.message || "دریافت اطلاعات داشبورد ناموفق بود";
  }

  if (error instanceof Error && error.message) return error.message;
  return "دریافت اطلاعات داشبورد ناموفق بود";
}

export async function getMyDashboard(
  params: DashboardQueryParams = {},
): Promise<UserDashboard> {
  const response = await proxyToBackend({
    method: "GET",
    path: DASHBOARD_PATH,
    params: cleanParams(params),
    withAuth: true,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ProxyError(
      "دریافت اطلاعات داشبورد ناموفق بود",
      response.status,
      "DASHBOARD_REQUEST_FAILED",
    );
  }

  return mapDashboard(response.data);
}
