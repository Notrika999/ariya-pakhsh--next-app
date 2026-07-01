// app/api/auth/security-stamp/route.ts
import { handleCustomerAuthGet } from "@/src/lib/auth/auth-route-utils";

export async function GET() {
  // Customer storefront does not expose security-stamp; keep endpoint for legacy hooks.
  return handleCustomerAuthGet("/api/v1/CustomerAuth/me", true);
}
