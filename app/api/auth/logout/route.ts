// app/api/auth/logout/route.ts
import { handleCustomerAuthLogout } from "@/src/lib/auth/auth-route-utils";
import { CUSTOMER_BACKEND_AUTH_PATHS } from "@/src/lib/auth/constants";

export async function POST() {
  return handleCustomerAuthLogout(CUSTOMER_BACKEND_AUTH_PATHS.LOGOUT);
}
