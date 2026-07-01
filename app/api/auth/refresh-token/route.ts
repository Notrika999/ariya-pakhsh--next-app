// app/api/auth/refresh-token/route.ts
import { handleCustomerAuthRefresh } from "@/src/lib/auth/auth-route-utils";
import { CUSTOMER_BACKEND_AUTH_PATHS } from "@/src/lib/auth/constants";

export async function POST() {
  return handleCustomerAuthRefresh(CUSTOMER_BACKEND_AUTH_PATHS.REFRESH);
}
