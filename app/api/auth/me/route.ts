// app/api/auth/me/route.ts
import { handleCustomerAuthGet } from "@/src/lib/auth/auth-route-utils";
import { CUSTOMER_BACKEND_AUTH_PATHS } from "@/src/lib/auth/constants";

export async function GET() {
  return handleCustomerAuthGet(CUSTOMER_BACKEND_AUTH_PATHS.ME, true);
}
