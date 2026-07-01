import { NextRequest } from "next/server";
import { handleCustomerAuthPost } from "@/src/lib/auth/auth-route-utils";
import { CUSTOMER_BACKEND_AUTH_PATHS } from "@/src/lib/auth/constants";

export async function POST(request: NextRequest) {
  return handleCustomerAuthPost(request, CUSTOMER_BACKEND_AUTH_PATHS.RESEND_OTP);
}
