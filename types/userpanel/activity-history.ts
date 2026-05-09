// types/activity-history.ts

export interface RecentViewItem {
  id: number;
  imgSrc: string;
  title: string;
  productCode: string;
  price: string;
  date: "today" | "yesterday"; // اگر آینده نیاز شد گسترش می‌دیم
}

export interface TabItem {
  id: string;
  title: string;
  icon: string;
}
