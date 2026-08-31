/// <reference lib="esnext" />
/// <reference lib="webworker" />
// app/sw.ts
import { defaultCache } from "@serwist/turbopack/worker";
import type {
  PrecacheEntry,
  RuntimeCaching,
  SerwistGlobalConfig,
} from "serwist";
import { NetworkOnly, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const NETWORK_ONLY_PATHS = [
  "/api",
  "/products/api",
  "/search/api",
  "/incredible-offers/api",
  "/user-profile",
  "/cart",
  "/checkout",
  "/compare",
  "/payment-result",
  "/success-payment",
  "/fail-payment",
  "/accept",
  "/mellat",
] as const;

const networkOnlyForSensitiveRoutes: RuntimeCaching = {
  matcher: ({ sameOrigin, url }) =>
    sameOrigin &&
    NETWORK_ONLY_PATHS.some(
      (path) =>
        url.pathname === path || url.pathname.startsWith(`${path}/`),
    ),
  handler: new NetworkOnly(),
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [networkOnlyForSensitiveRoutes, ...defaultCache],
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

const LEGACY_SENSITIVE_CACHE_NAMES = [
  "apis",
  "pages",
  "pages-rsc",
  "pages-rsc-prefetch",
];

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all(
      LEGACY_SENSITIVE_CACHE_NAMES.map((cacheName) =>
        caches.delete(cacheName),
      ),
    ),
  );
});

serwist.addEventListeners();
