import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import {
  ATTRIBUTION_SIGNAL_COOKIE_NAME,
  ATTRIBUTION_VISITOR_COOKIE_NAME,
  getAttributionForwardHeaders,
  getAttributionCookieOptions,
  getAttributionSignalCookieOptions,
  isAttributionRequest,
  prepareAttributionDelivery,
  prepareAttributionEvent,
  sendAttributionEvent,
} from "@/src/lib/attribution/attribution";

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-search", request.nextUrl.search);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (
    !isAttributionRequest({
      method: request.method,
      headers: request.headers,
    })
  ) {
    return response;
  }

  const prepared = prepareAttributionEvent({
    url: request.nextUrl,
    referrer: request.headers.get("referer"),
    existingVisitorId: request.cookies.get(ATTRIBUTION_VISITOR_COOKIE_NAME)
      ?.value,
    currentHost: request.nextUrl.hostname,
  });

  if (prepared.isNewVisitor) {
    response.cookies.set(
      ATTRIBUTION_VISITOR_COOKIE_NAME,
      prepared.visitorId,
      getAttributionCookieOptions(),
    );
  }

  if (prepared.event) {
    const delivery = await prepareAttributionDelivery({
      event: prepared.event,
      isNewVisitor: prepared.isNewVisitor,
      existingSignalSignature: request.cookies.get(ATTRIBUTION_SIGNAL_COOKIE_NAME)
        ?.value,
    });

    if (delivery.signalSignatureToSet) {
      response.cookies.set(
        ATTRIBUTION_SIGNAL_COOKIE_NAME,
        delivery.signalSignatureToSet,
        getAttributionSignalCookieOptions(),
      );
    }

    if (!delivery.shouldSendEvent) {
      return response;
    }

    const attributionHeaders = getAttributionForwardHeaders(request.headers);
    event.waitUntil(
      sendAttributionEvent(prepared.event, {
        headers: attributionHeaders,
      }),
    );
  }

  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|manifest.webmanifest|sw.js|.*\\..*).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
