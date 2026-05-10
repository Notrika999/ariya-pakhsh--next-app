export interface DiscountCode {
  id: number;
  code: string;
  title: string;
  description: string;
  expireDate: string;
  status: "active" | "expired";
  variant?: "green" | "blue" | "purple";
}
