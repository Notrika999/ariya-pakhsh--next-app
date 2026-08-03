export type MyCouponStatus = "active" | "expired" | "used";

export type MyCouponDiscountType =
  | "freeShipping"
  | "percentage"
  | "fixedAmount"
  | "fixedShippingAmount"
  | string;

export type MyCouponItem = {
  couponId: string;
  couponCodeId: string;
  code: string;
  name: string;
  description: string;
  discountType: MyCouponDiscountType;
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountAmount: number;
  validFrom: string;
  validTo: string;
  status: string;
  usedAt: string;
};

export type MyCouponsPage = {
  items: MyCouponItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type CouponPageParams = {
  page?: number;
  pageSize?: number;
};

export type MyCouponsApiError = {
  field: string;
  message: string;
  code: string;
};

export type MyCouponsApiResponse = {
  success: boolean;
  message: string;
  code: string;
  errors: MyCouponsApiError[];
  timestamp: string;
  traceId: string;
  data: MyCouponsPage;
};
