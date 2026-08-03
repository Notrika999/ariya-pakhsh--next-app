// types/activity-history.ts

export interface TabItem {
  id: string;
  title: string;
  icon: string;
}

export interface ActivityStats {
  productVisits: number;
  purchases: number;
  comments: number;
  tickets: number;
}

export interface ActivitySummary {
  totalVisitCount: number;
  stats: ActivityStats;
}

export interface ActivityVisitItem {
  visitId: string;
  productId: string;
  slug: string;
  productCode: string;
  title: string;
  imageUrl: string;
  price: number;
  visitCount: number;
  lastViewedAt: string;
  lastDurationSeconds: number;
}

export interface ActivityVisitGroup {
  dateLabel: string;
  date: string;
  items: ActivityVisitItem[];
}

export interface ActivityVisitsPage {
  totalVisitCount: number;
  groups: ActivityVisitGroup[];
  page: number;
  pageSize: number;
  totalProducts: number;
}

export interface ActivityFeedItem {
  id: string;
  kind: string;
  kindTitleFa: string;
  iconKey: string;
  occurredAt: string;
  statusKey: string;
  statusTitleFa: string;
  productId: string;
  productSlug: string;
  productTitle: string;
  referenceCode: string;
  amount: number;
  subject: string;
  durationSeconds: number;
}

export interface ActivityFeedPage extends ActivitySummary {
  items: ActivityFeedItem[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export type RecentViewItem = ActivityVisitItem & {
  id: string;
  imgSrc: string;
  productHref: string;
  formattedPrice: string;
  formattedVisitCount: string;
  formattedLastViewedAt: string;
  formattedDuration: string;
};
