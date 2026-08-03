export interface DiscountCode {
  id: number | string;
  code: string;
  title: string;
  description: string;
  expireDate: string;
  status: "active" | "expired" | "used" | string;
  variant?: "green" | "blue" | "purple" | "teal";
}
