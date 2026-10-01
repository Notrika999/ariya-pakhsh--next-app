import test from "node:test";
import assert from "node:assert/strict";
import {
  createAttributionSignalSignature,
  getAttributionSignalCookieOptions,
  getAttributionCookieOptions,
  getAttributionForwardHeaders,
  getExternalReferrer,
  isAttributionRequest,
  prepareAttributionEvent,
  prepareAttributionDelivery,
  sendAttributionEvent,
  sendAttributionIdentity,
  withCheckoutAttributionCookie,
} from "./attribution";
import { createHandleProxy } from "../../../app/api/v1/[...path]/route";
import { proxy as attributionProxy } from "../../../proxy";

const VISITOR_ID = "11111111-1111-4111-8111-111111111111";
const EVENT_ID = "22222222-2222-4222-8222-222222222222";

function createUuidSequence(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? values[values.length - 1];
}

function createEventPayload() {
  return {
    eventId: EVENT_ID,
    visitorId: VISITOR_ID,
    isNewVisitor: true,
    trackingLinkCode: null,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmContent: null,
    utmTerm: null,
    referrer: null,
    landingPath: "/",
    torobClid: null,
    gclid: null,
    fbclid: null,
    occurredAt: null,
  };
}

function createSignalEventPayload(overrides = {}) {
  return {
    ...createEventPayload(),
    isNewVisitor: false,
    utmSource: "google",
    utmMedium: "cpc",
    utmCampaign: "spring",
    landingPath: "/product/example",
    ...overrides,
  };
}

test("new visitor creates a visitor id and one attribution event", () => {
  const prepared = prepareAttributionEvent({
    url: new URL("https://carup24.com/product/example"),
    randomUuid: createUuidSequence(VISITOR_ID, EVENT_ID),
    currentHost: "carup24.com",
  });

  assert.equal(prepared.visitorId, VISITOR_ID);
  assert.equal(prepared.isNewVisitor, true);
  assert.equal(prepared.shouldSendEvent, true);
  assert.equal(prepared.event?.eventId, EVENT_ID);
  assert.equal(prepared.event?.visitorId, VISITOR_ID);
  assert.equal(prepared.event?.isNewVisitor, true);
  assert.equal(prepared.event?.landingPath, "/product/example");
});

test("only real GET requests are eligible for attribution", () => {
  assert.equal(isAttributionRequest({ method: "GET", headers: {} }), true);
  assert.equal(isAttributionRequest({ method: "HEAD", headers: {} }), false);
  assert.equal(isAttributionRequest({ method: "POST", headers: {} }), false);
});

test("prefetch requests are not eligible for attribution", () => {
  assert.equal(
    isAttributionRequest({
      method: "GET",
      headers: { Purpose: "PrEfEtCh" },
    }),
    false,
  );
  assert.equal(
    isAttributionRequest({
      method: "GET",
      headers: { "Sec-Purpose": "prefetch;prerender" },
    }),
    false,
  );
  assert.equal(
    isAttributionRequest({
      method: "GET",
      headers: { "Next-Router-Prefetch": "1" },
    }),
    false,
  );
});

test("internal navigation without a tracking signal does not create a new event", () => {
  const prepared = prepareAttributionEvent({
    url: new URL("https://carup24.com/checkout"),
    referrer: "https://www.carup24.com/cart?step=shipping",
    existingVisitorId: VISITOR_ID,
    currentHost: "carup24.com",
  });

  assert.equal(prepared.isNewVisitor, false);
  assert.equal(prepared.shouldSendEvent, false);
  assert.equal(prepared.event, null);
});

test("existing visitor with a new UTM creates an event with isNewVisitor=false", () => {
  const prepared = prepareAttributionEvent({
    url: new URL("https://carup24.com/products?utm_source=google"),
    existingVisitorId: VISITOR_ID,
    randomUuid: createUuidSequence(EVENT_ID),
    currentHost: "carup24.com",
  });

  assert.equal(prepared.visitorId, VISITOR_ID);
  assert.equal(prepared.event?.isNewVisitor, false);
  assert.equal(prepared.event?.utmSource, "google");
});

test("all supported tracking fields are decoded and trimmed", () => {
  const prepared = prepareAttributionEvent({
    url: new URL(
      "https://carup24.com/product/example?utm_source=%20google%20&utm_medium=%20cpc%20&utm_campaign=spring&utm_content=banner&utm_term=oil%20filter&torob_clid=torob-1&gclid=g-1&fbclid=fb-1&cup_tl=tl-1",
    ),
    referrer: "https://example.com/path?q=private",
    existingVisitorId: VISITOR_ID,
    randomUuid: createUuidSequence(EVENT_ID),
    currentHost: "carup24.com",
  });

  assert.deepEqual(prepared.event, {
    eventId: EVENT_ID,
    visitorId: VISITOR_ID,
    isNewVisitor: false,
    trackingLinkCode: "tl-1",
    utmSource: "google",
    utmMedium: "cpc",
    utmCampaign: "spring",
    utmContent: "banner",
    utmTerm: "oil filter",
    referrer: "https://example.com/path",
    landingPath: "/product/example",
    torobClid: "torob-1",
    gclid: "g-1",
    fbclid: "fb-1",
    occurredAt: null,
  });
});

test("tracking payload values are stripped and bounded before sending", () => {
  const longValue = `${"x".repeat(300)}\u0000`;
  const longPath = `/${"p".repeat(1_200)}`;
  const prepared = prepareAttributionEvent({
    url: new URL(
      `https://carup24.com${longPath}?utm_source=${longValue}&gclid=${longValue}`,
    ),
    referrer: `https://example.com/${"r".repeat(1_200)}?secret=value`,
    existingVisitorId: VISITOR_ID,
    randomUuid: createUuidSequence(EVENT_ID),
    currentHost: "carup24.com",
  });

  assert.equal(prepared.event?.utmSource?.length, 256);
  assert.equal(prepared.event?.utmSource?.includes("\u0000"), false);
  assert.equal(prepared.event?.gclid?.length, 256);
  assert.equal(prepared.event?.landingPath.length, 1_024);
  assert.equal(prepared.event?.referrer?.length, 1_024);
  assert.equal(prepared.event?.referrer?.includes("secret=value"), false);
});

test("internal CarUp24 referrer is not treated as external", () => {
  assert.equal(
    getExternalReferrer({
      referrer: "https://www.carup24.com/product/a?utm_source=x",
      currentHost: "carup24.com",
    }),
    null,
  );
});

test("event sender accepts 202 as success", async () => {
  const calls: unknown[] = [];
  const ok = await sendAttributionEvent(
    createEventPayload(),
    {
      baseUrl: "https://backend.test/swagger-api",
      fetchImpl: (async (_url, init) => {
        calls.push(JSON.parse(String(init?.body)));
        return new Response(null, { status: 202 });
      }) as typeof fetch,
    },
  );

  assert.equal(ok, true);
  assert.equal(calls.length, 1);
});

test("event 500 fails open without retrying", async () => {
  let calls = 0;
  const ok = await sendAttributionEvent(createEventPayload(), {
    baseUrl: "https://backend.test",
    logger: { warn: () => undefined, error: () => undefined },
    fetchImpl: (async () => {
      calls++;
      return new Response(null, { status: 500 });
    }) as typeof fetch,
  });

  assert.equal(ok, false);
  assert.equal(calls, 1);
});

test("event network TypeError fails open without retrying", async () => {
  let calls = 0;
  const ok = await sendAttributionEvent(createEventPayload(), {
    baseUrl: "https://backend.test",
    logger: { warn: () => undefined, error: () => undefined },
    fetchImpl: (async () => {
      calls++;
      throw new TypeError("fetch failed");
    }) as typeof fetch,
  });

  assert.equal(ok, false);
  assert.equal(calls, 1);
});

test("event timeout aborts near the 250ms event policy and fails open once", async () => {
  let calls = 0;
  const startedAt = performance.now();
  const ok = await sendAttributionEvent(createEventPayload(), {
    baseUrl: "https://backend.test",
    logger: { warn: () => undefined, error: () => undefined },
    fetchImpl: ((_url, init) => {
      calls++;
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener(
          "abort",
          () => reject(new DOMException("aborted", "AbortError")),
          { once: true },
        );
      });
    }) as typeof fetch,
  });
  const elapsedMs = performance.now() - startedAt;

  assert.equal(ok, false);
  assert.equal(calls, 1);
  assert.ok(elapsedMs >= 200);
  assert.ok(elapsedMs < 1_000);
});

test("new UTM signal creates a signature and sends the event", async () => {
  const event = createSignalEventPayload();
  const delivery = await prepareAttributionDelivery({
    event,
    isNewVisitor: false,
    existingSignalSignature: null,
  });

  assert.equal(delivery.shouldSendEvent, true);
  assert.equal(typeof delivery.signalSignatureToSet, "string");
  assert.equal(delivery.signalSignatureToSet?.length, 32);
});

test("same UTM signal and signature does not send a duplicate event", async () => {
  const event = createSignalEventPayload();
  const signature = await createAttributionSignalSignature(event);
  const delivery = await prepareAttributionDelivery({
    event,
    isNewVisitor: false,
    existingSignalSignature: signature,
  });

  assert.equal(delivery.shouldSendEvent, false);
  assert.equal(delivery.signalSignatureToSet, null);
});

test("different UTM signal sends a new event and updates the signature", async () => {
  const firstEvent = createSignalEventPayload({ utmCampaign: "spring" });
  const nextEvent = createSignalEventPayload({ utmCampaign: "summer" });
  const firstSignature = await createAttributionSignalSignature(firstEvent);
  const delivery = await prepareAttributionDelivery({
    event: nextEvent,
    isNewVisitor: false,
    existingSignalSignature: firstSignature,
  });

  assert.equal(delivery.shouldSendEvent, true);
  assert.notEqual(delivery.signalSignatureToSet, firstSignature);
});

test("changing landingPath with the same UTM signal does not send a duplicate event", async () => {
  const firstEvent = createSignalEventPayload({
    landingPath: "/product/example",
  });
  const nextEvent = createSignalEventPayload({
    landingPath: "/checkout",
  });
  const firstSignature = await createAttributionSignalSignature(firstEvent);
  const nextSignature = await createAttributionSignalSignature(nextEvent);
  const delivery = await prepareAttributionDelivery({
    event: nextEvent,
    isNewVisitor: false,
    existingSignalSignature: firstSignature,
  });

  assert.equal(nextSignature, firstSignature);
  assert.equal(delivery.shouldSendEvent, false);
});

test("client-side navigation with a genuinely new click id sends a new event", async () => {
  const firstEvent = createSignalEventPayload({ gclid: "old-click" });
  const nextEvent = createSignalEventPayload({ gclid: "new-click" });
  const firstSignature = await createAttributionSignalSignature(firstEvent);
  const delivery = await prepareAttributionDelivery({
    event: nextEvent,
    isNewVisitor: false,
    existingSignalSignature: firstSignature,
  });

  assert.equal(delivery.shouldSendEvent, true);
  assert.notEqual(delivery.signalSignatureToSet, firstSignature);
});

test("new visitor sends the first signal event even with an old signature cookie", async () => {
  const event = createSignalEventPayload({ isNewVisitor: true });
  const signature = await createAttributionSignalSignature(event);
  const delivery = await prepareAttributionDelivery({
    event,
    isNewVisitor: true,
    existingSignalSignature: signature,
  });

  assert.equal(delivery.shouldSendEvent, true);
  assert.equal(delivery.signalSignatureToSet, signature);
});

test("direct new visitor event does not create a signal signature", async () => {
  const delivery = await prepareAttributionDelivery({
    event: createEventPayload(),
    isNewVisitor: true,
    existingSignalSignature: null,
  });

  assert.equal(delivery.shouldSendEvent, true);
  assert.equal(delivery.signalSignatureToSet, null);
});

test("signal signature has a fixed length and does not expose raw values", async () => {
  const event = createSignalEventPayload({
    utmSource: "raw-google-source",
    referrer: "https://example.com/referrer-path",
  });
  const signature = await createAttributionSignalSignature(event);

  assert.equal(signature.length, 32);
  assert.match(signature, /^[0-9a-f]{32}$/);
  assert.equal(signature.includes("raw-google-source"), false);
  assert.equal(signature.includes("example.com"), false);
});

test("expired signal cookie allows the same campaign to be sent again", async () => {
  const event = createSignalEventPayload();
  const delivery = await prepareAttributionDelivery({
    event,
    isNewVisitor: false,
    existingSignalSignature: null,
  });

  assert.equal(delivery.shouldSendEvent, true);
  assert.equal(delivery.signalSignatureToSet?.length, 32);
});

test("identity sender accepts 200 as success", async () => {
  let requestBody: unknown;
  const ok = await sendAttributionIdentity(VISITOR_ID, {
    baseUrl: "https://backend.test",
    headers: { Authorization: "Bearer token" },
    fetchImpl: (async (_url, init) => {
      requestBody = JSON.parse(String(init?.body));
      return new Response(null, { status: 200 });
    }) as typeof fetch,
  });

  assert.equal(ok, true);
  assert.deepEqual(requestBody, { visitorId: VISITOR_ID });
});

test("event forwards only the allowed browser attribution headers", async () => {
  let sentHeaders: Record<string, string> = {};
  const attributionHeaders = getAttributionForwardHeaders(
    new Headers({
      "User-Agent": "Mozilla/5.0 Test Browser",
      Accept: "text/html,application/xhtml+xml",
      "Sec-Fetch-Dest": "document",
      Cookie: "cup_vid=private",
      Authorization: "Bearer private",
      "X-Forwarded-For": "203.0.113.1",
      "CF-Connecting-IP": "203.0.113.2",
      Referer: "https://referrer.test/path",
    }),
  );

  await sendAttributionEvent(createEventPayload(), {
    baseUrl: "https://backend.test",
    headers: attributionHeaders,
    fetchImpl: (async (_url, init) => {
      sentHeaders = init?.headers as Record<string, string>;
      return new Response(null, { status: 202 });
    }) as typeof fetch,
  });

  assert.equal(sentHeaders["User-Agent"], "Mozilla/5.0 Test Browser");
  assert.equal(sentHeaders.Accept, "text/html,application/xhtml+xml");
  assert.equal(sentHeaders["Sec-Fetch-Dest"], "document");
  assert.equal(sentHeaders.Cookie, undefined);
  assert.equal(sentHeaders.Authorization, undefined);
  assert.equal(sentHeaders["X-Forwarded-For"], undefined);
  assert.equal(sentHeaders["CF-Connecting-IP"], undefined);
  assert.equal(sentHeaders.Referer, undefined);
});

test("missing Sec-Fetch-Dest does not create an empty attribution header", () => {
  const headers = getAttributionForwardHeaders({
    "User-Agent": "Mozilla/5.0 Test Browser",
    Accept: "text/html,application/xhtml+xml",
  });

  assert.deepEqual(headers, {
    "User-Agent": "Mozilla/5.0 Test Browser",
    Accept: "text/html,application/xhtml+xml",
  });
});

test("event ignores forbidden headers and keeps Content-Type as application/json", async () => {
  let sentHeaders: Record<string, string> = {};

  await sendAttributionEvent(createEventPayload(), {
    baseUrl: "https://backend.test",
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Content-Type": "text/plain",
      Cookie: "cup_vid=private",
      Authorization: "Bearer private",
      "X-Forwarded-For": "203.0.113.1",
      "CF-Connecting-IP": "203.0.113.2",
    },
    fetchImpl: (async (_url, init) => {
      sentHeaders = init?.headers as Record<string, string>;
      return new Response(null, { status: 202 });
    }) as typeof fetch,
  });

  assert.equal(sentHeaders.Accept, "text/html,application/xhtml+xml");
  assert.equal(sentHeaders["Content-Type"], "application/json");
  assert.equal(sentHeaders.Cookie, undefined);
  assert.equal(sentHeaders.Authorization, undefined);
  assert.equal(sentHeaders["X-Forwarded-For"], undefined);
  assert.equal(sentHeaders["CF-Connecting-IP"], undefined);
});

test("proxy sends landing events with only allowed browser headers", async () => {
  const originalBackendOrigin = process.env.BACKEND_ORIGIN;
  const originalFetch = globalThis.fetch;
  const waitUntilTasks: Promise<unknown>[] = [];
  let sentBody: Record<string, unknown> | undefined;
  let sentHeaders: Record<string, string> = {};

  process.env.BACKEND_ORIGIN = "https://backend.test";
  globalThis.fetch = (async (_url, init) => {
    sentBody = JSON.parse(String(init?.body));
    sentHeaders = init?.headers as Record<string, string>;
    return new Response(null, { status: 202 });
  }) as typeof fetch;

  try {
    await attributionProxy(
      {
        method: "GET",
        nextUrl: new URL(
          "https://carup24.com/product/example?utm_source=google",
        ),
        headers: new Headers({
          "User-Agent": "Mozilla/5.0 Test Browser",
          Accept: "text/html,application/xhtml+xml",
          "Sec-Fetch-Dest": "document",
          Cookie: "cup_vid=private",
          Authorization: "Bearer private",
        }),
        cookies: {
          get(name: string) {
            return name === "cup_vid" ? { value: VISITOR_ID } : undefined;
          },
        },
      } as never,
      {
        waitUntil(task: Promise<unknown>) {
          waitUntilTasks.push(task);
        },
      } as never,
    );

    await Promise.all(waitUntilTasks);

    assert.equal(sentBody?.visitorId, VISITOR_ID);
    assert.equal(sentBody?.utmSource, "google");
    assert.equal(sentHeaders["User-Agent"], "Mozilla/5.0 Test Browser");
    assert.equal(sentHeaders.Accept, "text/html,application/xhtml+xml");
    assert.equal(sentHeaders["Sec-Fetch-Dest"], "document");
    assert.equal(sentHeaders.Cookie, undefined);
    assert.equal(sentHeaders.Authorization, undefined);
    assert.equal(sentHeaders["Content-Type"], "application/json");
  } finally {
    process.env.BACKEND_ORIGIN = originalBackendOrigin;
    globalThis.fetch = originalFetch;
  }
});

test("proxy skips HEAD and prefetch attribution delivery", async () => {
  const originalBackendOrigin = process.env.BACKEND_ORIGIN;
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;

  process.env.BACKEND_ORIGIN = "https://backend.test";
  globalThis.fetch = (async () => {
    fetchCalls++;
    return new Response(null, { status: 202 });
  }) as typeof fetch;

  try {
    for (const request of [
      {
        method: "HEAD",
        headers: new Headers(),
      },
      {
        method: "GET",
        headers: new Headers({ Purpose: "prefetch" }),
      },
    ]) {
      await attributionProxy(
        {
          method: request.method,
          nextUrl: new URL("https://carup24.com/product/example?utm_source=x"),
          headers: request.headers,
          cookies: {
            get() {
              return undefined;
            },
          },
        } as never,
        {
          waitUntil() {
            throw new Error("prefetch or HEAD must not schedule attribution");
          },
        } as never,
      );
    }

    assert.equal(fetchCalls, 0);
  } finally {
    process.env.BACKEND_ORIGIN = originalBackendOrigin;
    globalThis.fetch = originalFetch;
  }
});

test("429 fails open without an immediate retry", async () => {
  const bodies: Array<{ eventId: string }> = [];
  const ok = await sendAttributionEvent(
    createEventPayload(),
    {
      baseUrl: "https://backend.test",
      logger: { warn: () => undefined, error: () => undefined },
      fetchImpl: (async (_url, init) => {
        bodies.push(JSON.parse(String(init?.body)));
        return new Response(null, { status: 429 });
      }) as typeof fetch,
    },
  );

  assert.equal(ok, false);
  assert.equal(bodies.length, 1);
  assert.equal(bodies[0].eventId, EVENT_ID);
});

test("identity retries exactly once on the first 500 response", async () => {
  let calls = 0;
  const ok = await sendAttributionIdentity(VISITOR_ID, {
    baseUrl: "https://backend.test",
    retries: 1,
    fetchImpl: (async () => {
      calls++;
      return new Response(null, { status: calls === 1 ? 500 : 200 });
    }) as typeof fetch,
  });

  assert.equal(ok, true);
  assert.equal(calls, 2);
});

test("identity 429 fails open without retrying", async () => {
  let calls = 0;
  const ok = await sendAttributionIdentity(VISITOR_ID, {
    baseUrl: "https://backend.test",
    logger: { warn: () => undefined, error: () => undefined },
    fetchImpl: (async () => {
      calls++;
      return new Response(null, { status: 429 });
    }) as typeof fetch,
  });

  assert.equal(ok, false);
  assert.equal(calls, 1);
});

test("identity retries exactly once on timeout and TypeError", async () => {
  let timeoutCalls = 0;
  const timeoutOk = await sendAttributionIdentity(VISITOR_ID, {
    baseUrl: "https://backend.test",
    retries: 1,
    fetchImpl: (async () => {
      timeoutCalls++;
      if (timeoutCalls === 1) {
        throw new DOMException("aborted", "AbortError");
      }
      return new Response(null, { status: 200 });
    }) as typeof fetch,
  });

  let networkCalls = 0;
  const networkOk = await sendAttributionIdentity(VISITOR_ID, {
    baseUrl: "https://backend.test",
    retries: 1,
    fetchImpl: (async () => {
      networkCalls++;
      if (networkCalls === 1) {
        throw new TypeError("fetch failed");
      }
      return new Response(null, { status: 200 });
    }) as typeof fetch,
  });

  assert.equal(timeoutOk, true);
  assert.equal(timeoutCalls, 2);
  assert.equal(networkOk, true);
  assert.equal(networkCalls, 2);
});

test("identity does not retry deterministic 4xx responses", async () => {
  for (const status of [400, 401, 403]) {
    let calls = 0;
    const ok = await sendAttributionIdentity(VISITOR_ID, {
      baseUrl: "https://backend.test",
      retries: 1,
      logger: { warn: () => undefined, error: () => undefined },
      fetchImpl: (async () => {
        calls++;
        return new Response(null, { status });
      }) as typeof fetch,
    });

    assert.equal(ok, false);
    assert.equal(calls, 1);
  }
});

test("timeout and backend errors fail open", async () => {
  const timeoutOk = await sendAttributionEvent(
    createEventPayload(),
    {
      baseUrl: "https://backend.test",
      logger: { warn: () => undefined, error: () => undefined },
      retries: 0,
      fetchImpl: (async () => {
        throw new DOMException("aborted", "AbortError");
      }) as typeof fetch,
    },
  );

  const serverErrorOk = await sendAttributionIdentity(VISITOR_ID, {
    baseUrl: "https://backend.test",
    logger: { warn: () => undefined, error: () => undefined },
    fetchImpl: (async () => new Response(null, { status: 500 })) as typeof fetch,
  });

  assert.equal(timeoutOk, false);
  assert.equal(serverErrorOk, false);
});

test("identity sends only visitorId in the JSON body", async () => {
  let requestBody: unknown;
  const ok = await sendAttributionIdentity(VISITOR_ID, {
    baseUrl: "https://backend.test",
    headers: { Authorization: "Bearer token" },
    fetchImpl: (async (_url, init) => {
      requestBody = JSON.parse(String(init?.body));
      assert.equal((init?.headers as Record<string, string>).Authorization, "Bearer token");
      return new Response(null, { status: 200 });
    }) as typeof fetch,
  });

  assert.equal(ok, true);
  assert.deepEqual(requestBody, { visitorId: VISITOR_ID });
});

test("POST Checkout/place-order forwards a valid cup_vid in the Cookie header", () => {
  const headers = withCheckoutAttributionCookie({
    method: "POST",
    pathKey: "Checkout/place-order",
    visitorId: VISITOR_ID,
  });

  assert.equal(headers.Cookie, `cup_vid=${VISITOR_ID}`);
});

test("POST Checkout/place-order without cup_vid does not create a synthetic Cookie header", () => {
  const headers = withCheckoutAttributionCookie({
    method: "POST",
    pathKey: "Checkout/place-order",
    visitorId: null,
  });

  assert.equal(headers.Cookie, undefined);
});

test("POST Checkout/place-order with invalid cup_vid does not forward it", () => {
  const headers = withCheckoutAttributionCookie({
    method: "POST",
    pathKey: "Checkout/place-order",
    visitorId: "not-a-uuid",
  });

  assert.equal(headers.Cookie, undefined);
});

test("requests to other endpoints do not receive cup_vid from this change", () => {
  const headers = withCheckoutAttributionCookie({
    method: "POST",
    pathKey: "Checkout/preview-discount",
    visitorId: VISITOR_ID,
  });

  assert.equal(headers.Cookie, undefined);
});

test("checkout attribution preserves existing Cookie header values", () => {
  const headers = withCheckoutAttributionCookie({
    method: "POST",
    pathKey: "Checkout/place-order",
    visitorId: VISITOR_ID,
    headers: {
      Cookie:
        "CUP_Customer_Access_Token=access-token; CUP_Customer_Device_Id=device-id",
    },
  });

  assert.equal(
    headers.Cookie,
    `CUP_Customer_Access_Token=access-token; CUP_Customer_Device_Id=device-id; cup_vid=${VISITOR_ID}`,
  );
});

test("API proxy route adds cup_vid only for POST Checkout/place-order", async () => {
  const capturedRequests: Array<{
    path: string;
    body: unknown;
    headers?: Record<string, string>;
  }> = [];
  const handleProxy = createHandleProxy({
    proxyToBackend: (async (input: {
      path: string;
      body?: unknown;
      headers?: Record<string, string>;
    }) => {
      capturedRequests.push({
        path: input.path,
        body: input.body,
        headers: input.headers,
      });
      return {
        ok: true,
        status: 200,
        data: { success: true },
        headers: new Headers(),
      };
    }) as never,
  });
  const createRequest = (path: string[]) =>
    ({
      method: "POST",
      nextUrl: new URL(`https://carup24.com/api/v1/${path.join("/")}`),
      headers: new Headers({ "content-type": "application/json" }),
      cookies: {
        get(name: string) {
          return name === "cup_vid" ? { value: VISITOR_ID } : undefined;
        },
      },
      json: async () => ({ cartId: 10 }),
    }) as never;

  await handleProxy(createRequest(["Checkout", "place-order"]), {
    params: Promise.resolve({ path: ["Checkout", "place-order"] }),
  });
  await handleProxy(createRequest(["Checkout", "preview-discount"]), {
    params: Promise.resolve({ path: ["Checkout", "preview-discount"] }),
  });

  assert.equal(capturedRequests[0].path, "/api/v1/Checkout/place-order");
  assert.equal(capturedRequests[0].headers?.Cookie, `cup_vid=${VISITOR_ID}`);
  assert.deepEqual(capturedRequests[0].body, { cartId: 10 });
  assert.equal(
    Object.prototype.hasOwnProperty.call(
      capturedRequests[0].body as Record<string, unknown>,
      "visitorId",
    ),
    false,
  );
  assert.equal(capturedRequests[1].headers?.Cookie, undefined);
});

test("visitor cookie security options match the requirement", () => {
  assert.deepEqual(getAttributionCookieOptions("development"), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: false,
    maxAge: 31_536_000,
  });

  assert.equal(getAttributionCookieOptions("production").secure, true);
});

test("signal dedup cookie security options match the requirement", () => {
  assert.deepEqual(getAttributionSignalCookieOptions("development"), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: false,
    maxAge: 300,
  });

  assert.equal(getAttributionSignalCookieOptions("production").secure, true);
});
