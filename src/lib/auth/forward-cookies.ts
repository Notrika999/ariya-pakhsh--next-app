// src/lib/auth/forward-cookies.ts

import { NextResponse } from "next/server";

export function forwardSetCookies(
  response: NextResponse,
  setCookies?: string | string[],
): void {
  if (!setCookies) return;

  if (Array.isArray(setCookies)) {
    for (const cookie of setCookies) {
      response.headers.append("Set-Cookie", cookie);
    }

    return;
  }

  response.headers.append("Set-Cookie", setCookies);
}