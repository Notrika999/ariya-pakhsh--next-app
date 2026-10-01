export const ATTRIBUTION_VISITOR_COOKIE_NAME = "cup_vid";
export const ATTRIBUTION_VISITOR_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;
export const ATTRIBUTION_SIGNAL_COOKIE_NAME = "cup_attr_sig";
export const ATTRIBUTION_SIGNAL_MAX_AGE_SECONDS = 5 * 60;

const ATTRIBUTION_EVENTS_PATH = "/api/v1/Attribution/events";
const ATTRIBUTION_IDENTITY_PATH = "/api/v1/Attribution/identity";
export const ATTRIBUTION_EVENT_TIMEOUT_MS = 250;
export const ATTRIBUTION_EVENT_RETRIES = 0;
export const ATTRIBUTION_IDENTITY_TIMEOUT_MS = 2_000;
export const ATTRIBUTION_IDENTITY_RETRIES = 1;
const ATTRIBUTION_TRACKING_VALUE_MAX_LENGTH = 256;
const ATTRIBUTION_REFERRER_MAX_LENGTH = 1_024;
const ATTRIBUTION_LANDING_PATH_MAX_LENGTH = 1_024;
const TRACKING_QUERY_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "torob_clid",
  "gclid",
  "fbclid",
  "cup_tl",
] as const;

const ATTRIBUTION_FORWARD_HEADERS = [
  { source: "user-agent", target: "User-Agent" },
  { source: "accept", target: "Accept" },
  { source: "sec-fetch-dest", target: "Sec-Fetch-Dest" },
] as const;

type TrackingQueryKey = (typeof TRACKING_QUERY_KEYS)[number];
type HeadersLike =
  | Pick<Headers, "get">
  | Record<string, string | null | undefined>;

export type AttributionEventPayload = {
  eventId: string;
  visitorId: string;
  isNewVisitor: boolean;
  trackingLinkCode: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  referrer: string | null;
  landingPath: string;
  torobClid: string | null;
  gclid: string | null;
  fbclid: string | null;
  occurredAt: null;
};

export type AttributionPrepareInput = {
  url: URL;
  referrer?: string | null;
  existingVisitorId?: string | null;
  currentHost?: string | null;
  siteUrl?: string | null;
  randomUuid?: () => string;
};

export type PreparedAttribution = {
  visitorId: string;
  isNewVisitor: boolean;
  shouldSendEvent: boolean;
  event: AttributionEventPayload | null;
};

export type AttributionDeliveryDecision = {
  shouldSendEvent: boolean;
  signalSignatureToSet: string | null;
};

type Logger = Pick<Console, "warn" | "error">;

type SendOptions = {
  baseUrl?: string | null;
  fetchImpl?: typeof fetch;
  logger?: Logger;
  timeoutMs?: number;
  retries?: number;
  headers?: Record<string, string>;
};

type ResolvedSendOptions = SendOptions & {
  timeoutMs: number;
  retries: number;
};

type CookieOptions = {
  httpOnly: true;
  sameSite: "lax";
  path: "/";
  secure: boolean;
  maxAge: number;
};

function createUuid(randomUuid?: () => string): string {
  if (randomUuid) return randomUuid();
  return crypto.randomUUID();
}

export function getAttributionCookieOptions(
  nodeEnv = process.env.NODE_ENV,
): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: nodeEnv === "production",
    maxAge: ATTRIBUTION_VISITOR_MAX_AGE_SECONDS,
  };
}

export function getAttributionSignalCookieOptions(
  nodeEnv = process.env.NODE_ENV,
): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: nodeEnv === "production",
    maxAge: ATTRIBUTION_SIGNAL_MAX_AGE_SECONDS,
  };
}

export function isValidVisitorId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value.trim(),
    )
  );
}

function cleanValue(
  value: string | null,
  maxLength = ATTRIBUTION_TRACKING_VALUE_MAX_LENGTH,
): string | null {
  if (value === null) return null;
  const normalized = cleanRawValue(value)?.slice(0, maxLength) ?? null;
  if (normalized === null) return null;
  return normalized.length > 0 ? normalized : null;
}

function cleanRawValue(value: string | null): string | null {
  if (value === null) return null;
  const normalized = value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  return normalized.length > 0 ? normalized : null;
}

function cleanBoundedValue(
  value: string | null,
  maxLength: number,
): string | null {
  const cleaned = cleanValue(value, maxLength);
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

function readHeader(headers: HeadersLike, name: string): string | null {
  if (typeof (headers as Pick<Headers, "get">).get === "function") {
    return (headers as Pick<Headers, "get">).get(name);
  }

  const record = headers as Record<string, string | null | undefined>;
  const direct = record[name] ?? record[name.toLowerCase()];
  if (typeof direct === "string") return direct;

  const lowerName = name.toLowerCase();
  for (const [key, value] of Object.entries(record)) {
    if (key.toLowerCase() === lowerName && typeof value === "string") {
      return value;
    }
  }

  return null;
}

function hasHeader(headers: HeadersLike, name: string): boolean {
  if (typeof (headers as Pick<Headers, "get">).get === "function") {
    return (headers as Pick<Headers, "get">).get(name) !== null;
  }

  const record = headers as Record<string, string | null | undefined>;
  const lowerName = name.toLowerCase();
  return Object.keys(record).some((key) => key.toLowerCase() === lowerName);
}

export function getAttributionForwardHeaders(
  headers: HeadersLike,
): Record<string, string> {
  const forwardedHeaders: Record<string, string> = {};

  for (const { source, target } of ATTRIBUTION_FORWARD_HEADERS) {
    const value = readHeader(headers, source);
    if (value && value.trim()) {
      forwardedHeaders[target] = value;
    }
  }

  return forwardedHeaders;
}

export function isAttributionRequest(input: {
  method: string;
  headers: HeadersLike;
}): boolean {
  if (input.method.toUpperCase() !== "GET") return false;

  const purpose = readHeader(input.headers, "purpose");
  if (purpose?.trim().toLowerCase() === "prefetch") return false;

  const secPurpose = readHeader(input.headers, "sec-purpose");
  if (
    secPurpose
      ?.toLowerCase()
      .split(/[,\s;]+/)
      .some((part) => part.trim() === "prefetch")
  ) {
    return false;
  }

  if (hasHeader(input.headers, "next-router-prefetch")) return false;

  return true;
}

function getTrackingParams(searchParams: URLSearchParams) {
  const params: Record<TrackingQueryKey, string | null> = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
    torob_clid: null,
    gclid: null,
    fbclid: null,
    cup_tl: null,
  };

  for (const key of TRACKING_QUERY_KEYS) {
    params[key] = cleanValue(searchParams.get(key));
  }

  return params;
}

function normalizeHost(host: string | null | undefined): string | null {
  if (!host) return null;
  return host.trim().toLowerCase().replace(/^www\./, "") || null;
}

function addUrlHost(hosts: Set<string>, value: string | null | undefined) {
  if (!value) return;

  try {
    const url = new URL(value);
    const host = normalizeHost(url.hostname);
    if (host) hosts.add(host);
  } catch {
    const host = normalizeHost(value);
    if (host) hosts.add(host);
  }
}

function getInternalHosts(input: {
  currentHost?: string | null;
  siteUrl?: string | null;
}): Set<string> {
  const hosts = new Set<string>();
  const currentHost = normalizeHost(input.currentHost);
  if (currentHost) hosts.add(currentHost);
  addUrlHost(hosts, input.siteUrl);
  addUrlHost(hosts, process.env.NEXT_PUBLIC_SITE_URL);
  return hosts;
}

export function getExternalReferrer(input: {
  referrer?: string | null;
  currentHost?: string | null;
  siteUrl?: string | null;
}): string | null {
  const raw = cleanRawValue(input.referrer ?? null);
  if (!raw) return null;

  try {
    const referrerUrl = new URL(raw);
    if (!["http:", "https:"].includes(referrerUrl.protocol)) return null;

    const referrerHost = normalizeHost(referrerUrl.hostname);
    if (!referrerHost) return null;

    const internalHosts = getInternalHosts(input);
    if (internalHosts.has(referrerHost)) return null;

    return cleanBoundedValue(
      `${referrerUrl.origin}${referrerUrl.pathname}`,
      ATTRIBUTION_REFERRER_MAX_LENGTH,
    );
  } catch {
    return null;
  }
}

function getLandingPath(url: URL): string {
  return (
    cleanBoundedValue(url.pathname || "/", ATTRIBUTION_LANDING_PATH_MAX_LENGTH) ??
    "/"
  );
}

export function prepareAttributionEvent(
  input: AttributionPrepareInput,
): PreparedAttribution {
  const existingVisitorId = cleanValue(input.existingVisitorId ?? null);
  const isNewVisitor = !isValidVisitorId(existingVisitorId);
  const visitorId = isNewVisitor ? createUuid(input.randomUuid) : existingVisitorId;
  const trackingParams = getTrackingParams(input.url.searchParams);
  const externalReferrer = getExternalReferrer({
    referrer: input.referrer,
    currentHost: input.currentHost ?? input.url.hostname,
    siteUrl: input.siteUrl,
  });
  const hasTrackingSignal =
    TRACKING_QUERY_KEYS.some((key) => trackingParams[key] !== null) ||
    externalReferrer !== null;
  const shouldSendEvent = isNewVisitor || hasTrackingSignal;

  if (!shouldSendEvent) {
    return {
      visitorId,
      isNewVisitor,
      shouldSendEvent,
      event: null,
    };
  }

  return {
    visitorId,
    isNewVisitor,
    shouldSendEvent,
    event: {
      eventId: createUuid(input.randomUuid),
      visitorId,
      isNewVisitor,
      trackingLinkCode: trackingParams.cup_tl,
      utmSource: trackingParams.utm_source,
      utmMedium: trackingParams.utm_medium,
      utmCampaign: trackingParams.utm_campaign,
      utmContent: trackingParams.utm_content,
      utmTerm: trackingParams.utm_term,
      referrer: externalReferrer,
      landingPath: getLandingPath(input.url),
      torobClid: trackingParams.torob_clid,
      gclid: trackingParams.gclid,
      fbclid: trackingParams.fbclid,
      occurredAt: null,
    },
  };
}

export function hasAttributionSignal(event: AttributionEventPayload): boolean {
  return [
    event.trackingLinkCode,
    event.utmSource,
    event.utmMedium,
    event.utmCampaign,
    event.utmContent,
    event.utmTerm,
    event.torobClid,
    event.gclid,
    event.fbclid,
    event.referrer,
  ].some((value) => value !== null);
}

function buildSignalSignatureInput(event: AttributionEventPayload): string {
  return JSON.stringify([
    event.trackingLinkCode,
    event.utmSource,
    event.utmMedium,
    event.utmCampaign,
    event.utmContent,
    event.utmTerm,
    event.torobClid,
    event.gclid,
    event.fbclid,
    event.referrer,
  ]);
}

export async function createAttributionSignalSignature(
  event: AttributionEventPayload,
): Promise<string> {
  const input = new TextEncoder().encode(buildSignalSignatureInput(event));
  const digest = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

export async function prepareAttributionDelivery(input: {
  event: AttributionEventPayload;
  isNewVisitor: boolean;
  existingSignalSignature?: string | null;
}): Promise<AttributionDeliveryDecision> {
  const hasSignal = hasAttributionSignal(input.event);

  if (!hasSignal) {
    return {
      shouldSendEvent: true,
      signalSignatureToSet: null,
    };
  }

  const signalSignature = await createAttributionSignalSignature(input.event);

  if (
    !input.isNewVisitor &&
    cleanValue(input.existingSignalSignature ?? null) === signalSignature
  ) {
    return {
      shouldSendEvent: false,
      signalSignatureToSet: null,
    };
  }

  return {
    shouldSendEvent: true,
    signalSignatureToSet: signalSignature,
  };
}

export function getAttributionBackendBaseUrl(): string | null {
  const backendOrigin = process.env.BACKEND_ORIGIN?.trim();
  if (backendOrigin) return backendOrigin.replace(/\/$/, "");

  const apiUrl = process.env.API_URL?.trim();
  if (apiUrl?.startsWith("http://") || apiUrl?.startsWith("https://")) {
    return apiUrl.replace(/\/$/, "");
  }

  return null;
}

function buildAttributionUrl(path: string, baseUrl?: string | null): string | null {
  const base = baseUrl?.trim() || getAttributionBackendBaseUrl();
  if (!base) return null;

  try {
    const baseUrlObject = new URL(`${base.replace(/\/$/, "")}/`);
    const basePath = baseUrlObject.pathname.replace(/\/$/, "");
    return new URL(`${baseUrlObject.origin}${basePath}${path}`).toString();
  } catch {
    return null;
  }
}

function isRetryableStatus(status: number): boolean {
  return status >= 500 && status < 600;
}

function isAbortLikeError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function isRetryableFetchError(error: unknown): boolean {
  return isAbortLikeError(error) || error instanceof TypeError;
}

async function postJsonFailOpen(
  path: string,
  body: unknown,
  options: ResolvedSendOptions,
): Promise<boolean> {
  const logger = options.logger ?? console;
  const fetcher = options.fetchImpl ?? fetch;
  const url = buildAttributionUrl(path, options.baseUrl);

  if (!url) {
    logger.warn("[attribution] backend base URL is not configured");
    return false;
  }

  const maxRetries = Math.max(0, options.retries);
  let attempt = 0;

  while (true) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs);

    try {
      const response = await fetcher(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(options.headers ?? {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
        credentials: "omit",
        signal: controller.signal,
      });

      if (response.ok) return true;

      if (attempt < maxRetries && isRetryableStatus(response.status)) {
        attempt++;
        continue;
      }

      logger.warn(`[attribution] POST ${path} returned ${response.status}`);
      return false;
    } catch (error) {
      if (attempt < maxRetries && isRetryableFetchError(error)) {
        attempt++;
        continue;
      }

      logger.warn(`[attribution] POST ${path} failed`);
      return false;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export function sendAttributionEvent(
  payload: AttributionEventPayload,
  options: SendOptions = {},
): Promise<boolean> {
  return postJsonFailOpen(ATTRIBUTION_EVENTS_PATH, payload, {
    ...options,
    timeoutMs: options.timeoutMs ?? ATTRIBUTION_EVENT_TIMEOUT_MS,
    retries: options.retries ?? ATTRIBUTION_EVENT_RETRIES,
    headers: getAttributionForwardHeaders(options.headers ?? {}),
  });
}

export function sendAttributionIdentity(
  visitorId: string | null | undefined,
  options: SendOptions = {},
): Promise<boolean> {
  if (!isValidVisitorId(visitorId)) {
    return Promise.resolve(false);
  }

  return postJsonFailOpen(
    ATTRIBUTION_IDENTITY_PATH,
    { visitorId },
    {
      ...options,
      timeoutMs: options.timeoutMs ?? ATTRIBUTION_IDENTITY_TIMEOUT_MS,
      retries: options.retries ?? ATTRIBUTION_IDENTITY_RETRIES,
    },
  );
}

export function withCheckoutAttributionCookie(input: {
  method: string;
  pathKey: string;
  visitorId?: string | null;
  headers?: Record<string, string>;
}): Record<string, string> {
  const headers = { ...(input.headers ?? {}) };

  if (
    input.method !== "POST" ||
    input.pathKey !== "Checkout/place-order" ||
    !isValidVisitorId(input.visitorId)
  ) {
    return headers;
  }

  const visitorCookie = `${ATTRIBUTION_VISITOR_COOKIE_NAME}=${input.visitorId.trim()}`;
  headers.Cookie = headers.Cookie
    ? `${headers.Cookie}; ${visitorCookie}`
    : visitorCookie;

  return headers;
}
