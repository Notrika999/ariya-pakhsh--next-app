export interface GiftCard {
  id: number;
  type: "active" | "used" | "expired";
  title: string;
  amount: string;
  code: string;
  date: string; // تاریخ انقضا یا تاریخ استفاده
}
