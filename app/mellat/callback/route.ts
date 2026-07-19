import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RESULT_PATH = "/checkout/payment-result";

function getFirstValue(
  params: URLSearchParams,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = params.get(key);
    if (value && value.trim()) return value.trim();
  }

  return null;
}

function classifyMellatResult(params: URLSearchParams) {
  const resCode = getFirstValue(params, ["ResCode", "resCode", "code"]);

  if (resCode === "0") {
    return {
      status: "success",
      message: "پرداخت با موفقیت انجام شد.",
    };
  }

  if (resCode === "17") {
    return {
      status: "cancelled",
      message: "پرداخت توسط کاربر لغو شد.",
    };
  }

  return {
    status: "failed",
    message: resCode
      ? `پرداخت ناموفق بود. کد نتیجه: ${resCode}`
      : "پرداخت ناموفق بود یا پاسخ معتبری از درگاه دریافت نشد.",
  };
}

async function collectParams(request: NextRequest): Promise<URLSearchParams> {
  const params = new URLSearchParams(request.nextUrl.searchParams);

  if (request.method === "POST") {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formParams = new URLSearchParams(await request.text());
      formParams.forEach((value, key) => params.set(key, value));
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        if (typeof value === "string") params.set(key, value);
      });
    } else if (contentType.includes("application/json")) {
      const body = (await request.json().catch(() => null)) as Record<
        string,
        unknown
      > | null;
      if (body && typeof body === "object") {
        Object.entries(body).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.set(key, String(value));
          }
        });
      }
    }
  }

  return params;
}

async function handleCallback(request: NextRequest) {
  const params = await collectParams(request);
  const result = classifyMellatResult(params);
  const redirectUrl = new URL(RESULT_PATH, request.url);

  console.log("[mellat/callback route] incoming callback", {
    method: request.method,
    pathname: request.nextUrl.pathname,
    params: Object.fromEntries(params.entries()),
    expectedBackendApi: "/api/v1/Payments/mellat/callback",
  });

  redirectUrl.searchParams.set("status", result.status);
  redirectUrl.searchParams.set("message", result.message);

  const passthrough: Record<string, string[]> = {
    code: ["ResCode", "resCode", "code"],
    orderId: ["SaleOrderId", "saleOrderId", "orderId", "OrderId"],
    transactionId: [
      "SaleReferenceId",
      "saleReferenceId",
      "RefId",
      "refId",
      "TraceNo",
      "traceNo",
    ],
  };

  Object.entries(passthrough).forEach(([targetKey, sourceKeys]) => {
    const value = getFirstValue(params, sourceKeys);
    if (value) redirectUrl.searchParams.set(targetKey, value);
  });

  console.log("[mellat/callback route] redirecting to result page", {
    status: result.status,
    redirectTo: redirectUrl.toString(),
  });

  return NextResponse.redirect(redirectUrl, 303);
}

export const GET = handleCallback;
export const POST = handleCallback;
