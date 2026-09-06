"use client";
// components/layout/Header/Top/HeaderSearch.tsx
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { apiClient } from "@/src/lib/http/api-client";
import { useIsAuthenticated } from "@/src/lib/stores/auth/auth.store";
import { getProductImage } from "@/src/utils/product-image";
import {
  getHomeLayoutSections,
  mapHomeLayoutSearchPromotion,
  type HomeSearchPromotion,
} from "@/src/services/home/search-promotion";
import Image from "next/image";
import { Search as SearchIcon, X as XIcon } from "lucide-react";

type SearchSuggestion = {
  id: string;
  title: string;
  href: string;
  price?: string;
  thumbnailUrl?: string;
  type?: string;
};

type HeaderSearchProps = {
  autoFocus?: boolean;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  placeholder?: string;
  resultsClassName?: string;
  resultsVariant?: "default" | "mobile";
  onNavigate?: () => void;
  resultsId?: string;
};

const SUGGESTION_SIZE = 8;
const DESKTOP_SEARCH_LIST_SIZE = 5;
const MOBILE_SEARCH_LIST_SIZE = 2;
const HEADER_SEARCH_RESULTS_EVENT = "header-search-results";
const GUEST_RECENT_SEARCHES_KEY = "guest_recent_searches";
const MAX_RECENT_SEARCHES = DESKTOP_SEARCH_LIST_SIZE;

type HeaderSearchResultsEventDetail = {
  query?: string;
  totalCount?: number;
};

type HeaderSearchResultCount = {
  query: string;
  totalCount: number;
};

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getSuggestionItems(payload: unknown): unknown[] {
  const root = getRecord(payload);
  const data = root.data ?? root;
  const dataRecord = getRecord(data);

  if (Array.isArray(data)) return data;
  if (Array.isArray(dataRecord.items)) return dataRecord.items;
  if (Array.isArray(dataRecord.results)) return dataRecord.results;
  if (Array.isArray(dataRecord.products)) return dataRecord.products;
  if (Array.isArray(dataRecord.suggestions)) return dataRecord.suggestions;
  if (Array.isArray(dataRecord.queries)) return dataRecord.queries;
  if (Array.isArray(dataRecord.terms)) return dataRecord.terms;
  if (Array.isArray(dataRecord.popular)) return dataRecord.popular;
  if (Array.isArray(dataRecord.popularSearches)) {
    return dataRecord.popularSearches;
  }
  if (Array.isArray(dataRecord.recentSearches)) {
    return dataRecord.recentSearches;
  }
  if (Array.isArray(dataRecord.searchTerms)) return dataRecord.searchTerms;
  if (Array.isArray(dataRecord.searches)) return dataRecord.searches;
  if (Array.isArray(dataRecord.history)) return dataRecord.history;
  if (Array.isArray(dataRecord.recent)) return dataRecord.recent;
  if (Array.isArray(root.items)) return root.items;
  if (Array.isArray(root.results)) return root.results;
  if (Array.isArray(root.products)) return root.products;
  if (Array.isArray(root.suggestions)) return root.suggestions;
  if (Array.isArray(root.queries)) return root.queries;
  if (Array.isArray(root.terms)) return root.terms;
  if (Array.isArray(root.popular)) return root.popular;
  if (Array.isArray(root.popularSearches)) return root.popularSearches;
  if (Array.isArray(root.recentSearches)) return root.recentSearches;
  if (Array.isArray(root.searchTerms)) return root.searchTerms;
  if (Array.isArray(root.searches)) return root.searches;
  if (Array.isArray(root.history)) return root.history;
  if (Array.isArray(root.recent)) return root.recent;

  return [];
}

function formatSuggestionPrice(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return new Intl.NumberFormat("fa-IR").format(value);
}

function encodePathSegment(value: string): string {
  return encodeURIComponent(value.trim());
}

function buildProductsListHref(record: Record<string, unknown>, title: string) {
  const slug =
    getString(record.slug) ||
    getString(record.categorySlug) ||
    getString(record.brandSlug) ||
    getString(record.targetSlug);
  const id =
    getString(record.id) ||
    getString(record.categoryId) ||
    getString(record.brandId) ||
    getString(record.targetId);
  const pathSegment = slug || id;

  return pathSegment
    ? `/products/${encodePathSegment(pathSegment)}`
    : `/products?search=${encodeURIComponent(title)}`;
}

function buildBrandProductsHref(
  record: Record<string, unknown>,
  title: string,
) {
  const slug =
    getString(record.slug) ||
    getString(record.brandSlug) ||
    getString(record.targetSlug) ||
    getString(record.nameInEnglish) ||
    getString(record.englishName) ||
    title;

  return slug
    ? `/products/${encodePathSegment(slug)}`
    : `/products?search=${encodeURIComponent(title)}`;
}

function buildProductSuggestionHref(
  record: Record<string, unknown>,
  slug: string,
) {
  const publicCode = getString(record.publicCode);
  const publicCodeValue = getString(record.publicCodeValue);
  const publicCodeText = getString(record.publicCodeText);
  const code = getString(record.code);
  const publicCodeIsProductCode = publicCode.toUpperCase().startsWith("CUP-");
  const codeIsProductCode = code.toUpperCase().startsWith("CUP-");
  const productPublicCode =
    getString(record.productPublicCode) ||
    getString(record.productPublicCodeValue) ||
    getString(record.productPublicCodeText) ||
    getString(record.productCode) ||
    getString(record.productCodeValue) ||
    getString(record.cup) ||
    getString(record.cupCode) ||
    (publicCodeIsProductCode ? publicCode : "") ||
    (codeIsProductCode ? code : "");
  const productId = getString(record.productId) || getString(record.id);
  const productPathId = productPublicCode || productId;
  const variantPublicCode =
    getString(record.variantPublicCode) ||
    getString(record.defaultVariantPublicCode) ||
    getString(record.selectedVariantPublicCode) ||
    getString(record.variantCode) ||
    (publicCodeIsProductCode ? "" : publicCode) ||
    publicCodeValue ||
    publicCodeText ||
    (code && !codeIsProductCode ? code : "");

  if (slug && productPathId) {
    const basePath = `/product/${encodePathSegment(
      productPathId,
    )}/${encodePathSegment(slug)}`;

    return variantPublicCode
      ? `${basePath}?public-code=${encodeURIComponent(variantPublicCode)}`
      : basePath;
  }

  if (slug) return `/product/${encodePathSegment(slug)}`;
  if (productPathId) return `/product/${encodePathSegment(productPathId)}`;

  return "";
}

function mapSuggestion(value: unknown, index: number): SearchSuggestion | null {
  const rawTitle = getString(value);
  if (rawTitle) {
    return {
      id: `${index}-${rawTitle}`,
      title: rawTitle,
      href: buildSearchHref(rawTitle),
    };
  }

  const record = getRecord(value);
  const title =
    getString(record.text) ||
    getString(record.query) ||
    getString(record.term) ||
    getString(record.keyword) ||
    getString(record.title) ||
    getString(record.name) ||
    getString(record.productTitle) ||
    getString(record.productName);

  if (!title) return null;

  const id =
    getString(record.id) ||
    getString(record.productId) ||
    getString(record.publicCode) ||
    String(index);
  const href = getString(record.href) || getString(record.url);
  const slug = getString(record.slug) || getString(record.productSlug);
  const type = getString(record.type).toLowerCase();
  const thumbnailUrl = getString(record.thumbnailUrl);
  const typedHref =
    type === "product"
      ? buildProductSuggestionHref(record, slug)
      : type === "brand"
        ? buildBrandProductsHref(record, title)
        : type === "category"
          ? buildProductsListHref(record, title)
          : "";

  return {
    id,
    title,
    href:
      (type === "brand" ? typedHref || href : href || typedHref) ||
      (slug
        ? `/products/${encodePathSegment(slug)}`
        : `/products?search=${encodeURIComponent(title)}`),
    price: formatSuggestionPrice(
      record.formattedPrice ??
        record.discountPrice ??
        record.price ??
        record.finalPrice,
    ),
    thumbnailUrl: thumbnailUrl ? getProductImage(thumbnailUrl) : undefined,
    type,
  };
}

function normalizeSuggestions(payload: unknown): SearchSuggestion[] {
  return getSuggestionItems(payload)
    .map(mapSuggestion)
    .filter((item): item is SearchSuggestion => Boolean(item));
}

function mapPopularSearch(value: unknown): string {
  const rawTitle = getString(value);
  if (rawTitle) return rawTitle;

  const record = getRecord(value);
  return (
    getString(record.query) ||
    getString(record.term) ||
    getString(record.searchTerm) ||
    getString(record.keyword) ||
    getString(record.title) ||
    getString(record.name)
  );
}

function getSearchListSize(isMobile: boolean): number {
  return isMobile ? MOBILE_SEARCH_LIST_SIZE : DESKTOP_SEARCH_LIST_SIZE;
}

function normalizePopularSearches(
  payload: unknown,
  size = DESKTOP_SEARCH_LIST_SIZE,
): string[] {
  return getSuggestionItems(payload)
    .map(mapPopularSearch)
    .filter(Boolean)
    .slice(0, size);
}

function normalizeRecentSearches(
  payload: unknown,
  size = MAX_RECENT_SEARCHES,
): string[] {
  return getSuggestionItems(payload)
    .map(mapPopularSearch)
    .map(normalizeRecentSearchTerm)
    .filter(Boolean)
    .slice(0, size);
}

function buildSearchHref(query: string): string {
  const params = new URLSearchParams();
  params.set("Q", query.trim());
  return `/search?${params.toString()}`;
}

function normalizeRecentSearchTerm(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function readRecentSearches(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(GUEST_RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => normalizeRecentSearchTerm(String(item)))
      .filter(Boolean)
      .slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

function writeRecentSearches(searches: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    GUEST_RECENT_SEARCHES_KEY,
    JSON.stringify(searches.slice(0, MAX_RECENT_SEARCHES)),
  );
}

function getNextRecentSearches(searches: string[], term: string): string[] {
  const normalized = normalizeRecentSearchTerm(term);
  if (!normalized) return searches;
  const comparable = normalized.toLocaleLowerCase("fa-IR");

  return [
    normalized,
    ...searches.filter(
      (item) => item.toLocaleLowerCase("fa-IR") !== comparable,
    ),
  ].slice(0, MAX_RECENT_SEARCHES);
}

let cachedSearchPromotions: HomeSearchPromotion[] | null = null;
let pendingSearchPromotions: Promise<HomeSearchPromotion[]> | null = null;

function normalizeSearchPromotions(payload: unknown): HomeSearchPromotion[] {
  const items = Array.isArray(payload)
    ? payload
    : payload &&
        typeof payload === "object" &&
        Array.isArray((payload as { data?: unknown }).data)
      ? ((payload as { data: unknown[] }).data)
      : [];

  return items.filter((item): item is HomeSearchPromotion => {
    if (!item || typeof item !== "object") return false;
    const promotion = item as HomeSearchPromotion;
    return Boolean(promotion.id && promotion.image && promotion.href);
  });
}

function isRemoteImageSrc(src: string) {
  return /^(https?:)?\/\//i.test(src) || src.toLowerCase().includes(".svg");
}

async function fetchSearchPromotionsFromLayout() {
  const response = await apiClient.get("/Home/layout");
  return mapHomeLayoutSearchPromotion(getHomeLayoutSections(response.data));
}

function loadSearchPromotions() {
  if (cachedSearchPromotions?.length) {
    return Promise.resolve(cachedSearchPromotions);
  }

  if (pendingSearchPromotions) return pendingSearchPromotions;

  pendingSearchPromotions = apiClient
    .get("/api/home/search-promotions")
    .then((response) => normalizeSearchPromotions(response.data))
    .catch((error) => {
      console.error("[HeaderSearch] search promotion route failed =>", error);
      return [] as HomeSearchPromotion[];
    })
    .then(async (promotions) => {
      if (promotions.length > 0) return promotions;
      return fetchSearchPromotionsFromLayout();
    })
    .then((promotions) => {
      if (promotions.length > 0) {
        cachedSearchPromotions = promotions;
      } else {
        pendingSearchPromotions = null;
      }
      return promotions;
    })
    .catch((error) => {
      pendingSearchPromotions = null;
      throw error;
    });

  return pendingSearchPromotions;
}

function getMissingRecentSearches(
  sourceSearches: string[],
  targetSearches: string[],
): string[] {
  const targetSet = new Set(
    targetSearches.map((item) =>
      normalizeRecentSearchTerm(item).toLocaleLowerCase("fa-IR"),
    ),
  );

  const missingSearches: string[] = [];

  for (const sourceSearch of sourceSearches) {
    const normalized = normalizeRecentSearchTerm(sourceSearch);
    if (!normalized) continue;

    const comparable = normalized.toLocaleLowerCase("fa-IR");
    if (targetSet.has(comparable)) continue;

    targetSet.add(comparable);
    missingSearches.push(normalized);

    if (missingSearches.length >= MAX_RECENT_SEARCHES) break;
  }

  return missingSearches;
}

export default function HeaderSearch({
  autoFocus = false,
  className = "lg:col-span-6 lg:block lg:order-2 order-4 hidden col-span-4 w-full",
  inputClassName,
  buttonClassName,
  placeholder = "جستجوی محصولات ....",
  resultsClassName,
  resultsVariant = "default",
  onNavigate,
  resultsId = "searchResults",
}: HeaderSearchProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAuthenticated = useIsAuthenticated();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState(query);
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [popularLoading, setPopularLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [searchPromotions, setSearchPromotions] = useState<
    HomeSearchPromotion[]
  >(cachedSearchPromotions ?? []);
  const [searchResultCount, setSearchResultCount] =
    useState<HeaderSearchResultCount | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const requestIdRef = useRef(0);
  const recentRequestIdRef = useRef(0);
  const popularRequestIdRef = useRef(0);
  const searchPromotionRequestIdRef = useRef(0);
  const skipNextDebounceRef = useRef(false);
  const currentSearchQuery =
    searchParams.get("Q") ?? searchParams.get("q") ?? "";
  const isSearchPage = pathname === "/search";
  const showSearchResultCount =
    isSearchPage &&
    searchResultCount !== null &&
    searchResultCount.query === currentSearchQuery.trim() &&
    query.trim() === currentSearchQuery.trim();
  const formattedSearchResultCount =
    searchResultCount === null
      ? ""
      : new Intl.NumberFormat("fa-IR").format(searchResultCount.totalCount);
  const hasQuery = query.trim().length > 0;
  const isMobileResults = resultsVariant === "mobile";
  const searchListSize = getSearchListSize(isMobileResults);
  const visibleRecentSearches = recentSearches.slice(0, searchListSize);
  const visiblePopularSearches = popularSearches.slice(0, searchListSize);
  const showRecentSearches =
    open && !hasQuery && visibleRecentSearches.length > 0;

  useEffect(() => {
    if (skipNextDebounceRef.current) {
      skipNextDebounceRef.current = false;
      return;
    }

    const timerId = window.setTimeout(() => setDebounced(query), 80);
    return () => window.clearTimeout(timerId);
  }, [query]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const nextQuery = isSearchPage ? currentSearchQuery : "";
      setQuery(nextQuery);
      setDebounced(nextQuery);
      setActiveIndex(-1);
      setSearchResultCount(null);
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [currentSearchQuery, isSearchPage]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      if (isAuthenticated) return;

      setRecentSearches(readRecentSearches());
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [isAuthenticated]);

  // جستجوی گذشته کاربر توسط سرور در جستجو می باشد.
  useEffect(() => {
    if (!isAuthenticated) {
      recentRequestIdRef.current += 1;
      return;
    }

    const requestId = recentRequestIdRef.current + 1;
    recentRequestIdRef.current = requestId;
    const guestRecentSearches = readRecentSearches();

    void apiClient
      .get("/Search/recent", {
        params: {
          Count: searchListSize,
        },
      })
      .then((response) => {
        if (recentRequestIdRef.current !== requestId) return;
        const serverRecentSearches = normalizeRecentSearches(
          response.data,
          searchListSize,
        );
        const unsyncedGuestSearches = getMissingRecentSearches(
          guestRecentSearches,
          serverRecentSearches,
        );

        setRecentSearches(serverRecentSearches);

        if (unsyncedGuestSearches.length === 0) return;

        void apiClient
          .post("/Search/history/sync", {
            queries: unsyncedGuestSearches,
          })
          .then(() => {
            if (recentRequestIdRef.current !== requestId) return;
            const nextSearches = [
              ...unsyncedGuestSearches,
              ...serverRecentSearches,
            ].slice(0, MAX_RECENT_SEARCHES);
            setRecentSearches(nextSearches);
            writeRecentSearches(nextSearches);
          })
          .catch((error) => {
            console.error("[HeaderSearch] history sync failed =>", error);
          });
      })
      .catch((error) => {
        if (recentRequestIdRef.current !== requestId) return;
        console.error("[HeaderSearch] recent failed =>", error);
        setRecentSearches([]);
      });
  }, [isAuthenticated, searchListSize]);

  useEffect(() => {
    if (!isSearchPage) return;

    function onSearchResults(event: Event) {
      const detail = (event as CustomEvent<HeaderSearchResultsEventDetail>)
        .detail;
      const eventQuery = String(detail?.query ?? "").trim();

      if (eventQuery !== currentSearchQuery.trim()) return;
      if (
        typeof detail.totalCount !== "number" ||
        !Number.isFinite(detail.totalCount)
      ) {
        setSearchResultCount(null);
        return;
      }

      setSearchResultCount({
        query: eventQuery,
        totalCount: detail.totalCount,
      });
    }

    window.addEventListener(HEADER_SEARCH_RESULTS_EVENT, onSearchResults);
    return () => {
      window.removeEventListener(HEADER_SEARCH_RESULTS_EVENT, onSearchResults);
    };
  }, [currentSearchQuery, isSearchPage]);

  useEffect(() => {
    if (!autoFocus) return;
    inputRef.current?.focus();
  }, [autoFocus]);

  // جستجوی سریع توسط سرور در صفحه جستجو می باشد.
  useEffect(() => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const term = debounced.trim();

    if (!term) {
      const timerId = window.setTimeout(() => {
        setResults([]);
        setLoading(false);
        setActiveIndex(-1);
      }, 0);

      return () => window.clearTimeout(timerId);
    }

    const timerId = window.setTimeout(() => {
      setLoading(true);
      void apiClient
        .get("/Search/suggest", {
          params: {
            Q: term,
            q: term,
            Size: SUGGESTION_SIZE,
            Count: SUGGESTION_SIZE,
          },
        })
        .then((response) => {
         
          if (requestIdRef.current !== requestId) return;
          setResults(normalizeSuggestions(response.data));
          setActiveIndex(-1);
        })
        .catch((error) => {
          if (requestIdRef.current !== requestId) return;
          console.error("[HeaderSearch] suggest failed =>", error);
          setResults([]);
        })
        .finally(() => {
          if (requestIdRef.current === requestId) {
            setLoading(false);
          }
        });
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [debounced]);

  // جستجوی پرطرفدار توسط سرور در صفحه جستجو می باشد.
  useEffect(() => {
    if (!open || query.trim().length > 0) return;

    const requestId = popularRequestIdRef.current + 1;
    popularRequestIdRef.current = requestId;
    const timerId = window.setTimeout(() => {
      setPopularLoading(true);

      void apiClient
        .get("/Search/popular", {
          params: {
            Count: searchListSize,
          },
        })
        .then((response) => {
          if (popularRequestIdRef.current !== requestId) return;
          setPopularSearches(
            normalizePopularSearches(response.data, searchListSize),
          );
        })
        .catch((error) => {
          if (popularRequestIdRef.current !== requestId) return;
          console.error("[HeaderSearch] popular failed =>", error);
          setPopularSearches([]);
        })
        .finally(() => {
          if (popularRequestIdRef.current === requestId) {
            setPopularLoading(false);
          }
        });
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [open, query, searchListSize]);

  useEffect(() => {
    if (!open || query.trim().length > 0) return;

    const requestId = searchPromotionRequestIdRef.current + 1;
    searchPromotionRequestIdRef.current = requestId;
    const timerId = window.setTimeout(() => {
      void loadSearchPromotions()
        .then((promotions) => {
          if (searchPromotionRequestIdRef.current !== requestId) return;
          setSearchPromotions(promotions);
        })
        .catch((error) => {
          if (searchPromotionRequestIdRef.current !== requestId) return;
          console.error("[HeaderSearch] search promotion failed =>", error);
          setSearchPromotions([]);
        });
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [open, query]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const showResults = open && query.trim().length > 0;
  const showEmptyAutocomplete = open && !hasQuery;
  const selectedIndex =
    activeIndex >= 0 && results.length > 0
      ? Math.min(Math.max(activeIndex, 0), results.length - 1)
      : -1;

  useEffect(() => {
    if (!showResults || selectedIndex < 0) return;
    const activeElement = document.getElementById(
      `${resultsId}-item-${results[selectedIndex]?.id}`,
    );
    activeElement?.scrollIntoView({ block: "nearest" });
  }, [results, resultsId, selectedIndex, showResults]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const currentValue = inputRef.current?.value ?? query;
    if (!currentValue.trim()) {
      e.preventDefault();
      setOpen(true);
      return;
    }

    saveRecentSearch(currentValue);
    onNavigate?.();
  }

  function saveRecentSearch(term: string) {
    const normalized = normalizeRecentSearchTerm(term);
    if (!normalized) return;

    const nextSearches = getNextRecentSearches(recentSearches, normalized);
    setRecentSearches(nextSearches);
    writeRecentSearches(nextSearches);

    if (!isAuthenticated) return;

    void apiClient
      .post("/Search/history/sync", {
        queries: [normalized],
      })
      .catch((error) => {
        console.error("[HeaderSearch] history sync failed =>", error);
      });
  }

  function navigateToSearch(term: string) {
    const normalized = term.trim();
    if (!normalized) {
      setOpen(true);
      return;
    }

    saveRecentSearch(normalized);
    onNavigate?.();
    window.location.href = buildSearchHref(normalized);
  }

  function clearQuery() {
    skipNextDebounceRef.current = true;
    setQuery("");
    setDebounced("");
    setResults([]);
    setLoading(false);
    setActiveIndex(-1);
    setOpen(true);
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      const currentValue = e.currentTarget.value;
      const term =
        showResults && activeIndex >= 0
          ? results[selectedIndex]?.title || currentValue
          : currentValue;
      navigateToSearch(term);
      return;
    }

    if (!showResults) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev + 1;
        const nextIndex = next >= results.length ? 0 : next;
        const nextSuggestion = results[nextIndex];
        if (nextSuggestion) {
          skipNextDebounceRef.current = true;
          setQuery(nextSuggestion.title);
        }
        return nextIndex;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev - 1;
        const nextIndex = next < 0 ? results.length - 1 : next;
        const nextSuggestion = results[nextIndex];
        if (nextSuggestion) {
          skipNextDebounceRef.current = true;
          setQuery(nextSuggestion.title);
        }
        return nextIndex;
      });
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center w-full justify-between">
        <form
          action="/search"
          method="get"
          className="flex w-full items-center"
          onSubmit={onSubmit}
        >
          <div ref={rootRef} className="relative flex items-center w-full">
            <input
              ref={inputRef}
              name="Q"
              type="text"
              className={[
                inputClassName ||
                  "h-14 w-full appearance-none rounded-2xl border border-transparent bg-gray-100 py-3 ps-5 placeholder-gray-400 transition-colors duration-300 focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-gray-700 dark:focus:bg-custom-dark dark:focus:ring-gray-700",
                showSearchResultCount ? "pe-32" : "pe-10",
              ].join(" ")}
              placeholder={placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(-1);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDownCapture={onKeyDown}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showResults || showEmptyAutocomplete}
              aria-controls={resultsId}
              aria-activedescendant={
                selectedIndex >= 0
                  ? `${resultsId}-item-${results[selectedIndex]?.id}`
                  : undefined
              }
            />

            {showSearchResultCount ? (
              <span className="pointer-events-none absolute end-11 top-1/2 -translate-y-1/2 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                {formattedSearchResultCount} تعداد محصول
              </span>
            ) : null}

            <button
              type={hasQuery ? "button" : "submit"}
              className={
                buttonClassName ||
                "absolute end-3 rounded-full p-2 text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
              }
              onClick={hasQuery ? clearQuery : () => setOpen(true)}
              aria-label={hasQuery ? "پاک کردن جستجو" : "جستجو"}
            >
              {hasQuery ? (
                <XIcon className="size-6" strokeWidth={2.4} />
              ) : (
                <SearchIcon className="size-6" strokeWidth={2.4} />
              )}
            </button>

            {(showResults || showEmptyAutocomplete) && (
              <div
                id={resultsId}
                className={
                  resultsClassName ||
                  "absolute end-0 start-0 top-[calc(100%+12px)] z-50 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)] transition-colors duration-300 dark:border-gray-800 dark:bg-custom-dark dark:shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
                }
                dir="rtl"
              >
                {showEmptyAutocomplete ? (
                  <div className="p-4">
                    {showRecentSearches ? (
                      <div>
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            جستجوی اخیر{" "}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {visibleRecentSearches.map((term) => (
                            <Link
                              key={term}
                              href={buildSearchHref(term)}
                              className="inline-flex max-w-full items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 transition-colors hover:border-primary-400 hover:text-primary-600 dark:border-gray-700 dark:bg-custom-dark dark:text-gray-100"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => {
                                saveRecentSearch(term);
                                setOpen(false);
                                onNavigate?.();
                              }}
                            >
                              <span
                                className="grid size-4 grid-cols-2 gap-0.5 text-gray-500"
                                aria-hidden="true"
                              >
                                <span className="rounded-[2px] border border-current" />
                                <span className="rounded-[2px] border border-current" />
                                <span className="rounded-[2px] border border-current" />
                                <span className="rounded-[2px] border border-current" />
                              </span>
                              <span className="line-clamp-1">{term}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className={showRecentSearches ? "mt-5" : ""}>
                      <div className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">
                        {
                          "\u062C\u0633\u062A\u062C\u0648\u0647\u0627\u06CC \u067E\u0631\u0637\u0631\u0641\u062F\u0627\u0631"
                        }
                      </div>
                      {popularLoading ? (
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {
                            "\u062F\u0631 \u062D\u0627\u0644 \u062F\u0631\u06CC\u0627\u0641\u062A..."
                          }
                        </div>
                      ) : popularSearches.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {visiblePopularSearches.map((term) => (
                            <Link
                              key={term}
                              href={buildSearchHref(term)}
                              className="inline-flex max-w-full items-center rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200 hover:text-primary-600 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => {
                                saveRecentSearch(term);
                                setOpen(false);
                                onNavigate?.();
                              }}
                            >
                              <span className="line-clamp-1">{term}</span>
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {searchPromotions.length > 0 ? (
                      <div className="mt-4 space-y-3">
                        {searchPromotions.map((promotion) => (
                          <Link
                            key={promotion.id}
                            href={promotion.href}
                            className="relative block aspect-2/1 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                              setOpen(false);
                              onNavigate?.();
                            }}
                          >
                            <Image
                              src={promotion.image}
                              alt={promotion.alt}
                              fill
                              sizes="(min-width: 1024px) 560px, 92vw"
                              className="object-cover"
                              unoptimized={isRemoteImageSrc(promotion.image)}
                            />
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : loading ? (
                  <div className="px-5 py-5 text-sm font-medium text-gray-600 dark:text-gray-300">
                    در حال دریافت ...
                  </div>
                ) : results.length === 0 ? (
                  <div className="px-5 py-5 text-sm font-medium text-gray-600 dark:text-gray-300">
                    موردی یافت نشد.
                  </div>
                ) : (
                  <ul
                    role="listbox"
                    className={
                      isMobileResults
                        ? "max-h-[62vh] overflow-auto"
                        : "max-h-96 overflow-auto"
                    }
                  >
                    {results.map((item, idx) => {
                      const active = idx === selectedIndex;
                      return (
                        <li key={item.id} role="option" aria-selected={active}>
                          <Link
                            id={`${resultsId}-item-${item.id}`}
                            href={item.href}
                            className={[
                              isMobileResults
                                ? "flex min-h-[70px] items-center gap-3 border-t border-gray-100 px-3 py-2 text-xs font-semibold transition-colors dark:border-gray-800"
                                : "flex min-h-16 items-center gap-4 border-t border-gray-100 px-5 text-sm font-semibold transition-colors dark:border-gray-800",
                              active
                                ? "bg-gray-50 text-primary-700 dark:bg-gray-900 dark:text-primary-400"
                                : "text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-900",
                            ].join(" ")}
                            onMouseEnter={() => setActiveIndex(idx)}
                            onClick={() => {
                              saveRecentSearch(item.title);
                              setOpen(false);
                              onNavigate?.();
                            }}
                          >
                            {item.thumbnailUrl ? (
                              <span
                                className={
                                  isMobileResults
                                    ? "relative size-10 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900"
                                    : "relative size-11 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900"
                                }
                              >
                                <Image
                                  src={item.thumbnailUrl}
                                  alt={item.title}
                                  fill
                                  sizes={isMobileResults ? "40px" : "44px"}
                                  className="object-contain p-1"
                                />
                              </span>
                            ) : (
                              <span
                                className={
                                  isMobileResults
                                    ? "grid size-3.5 shrink-0 grid-cols-2 gap-0.5 text-gray-500"
                                    : "grid size-4 shrink-0 grid-cols-2 gap-0.5 text-gray-500"
                                }
                                aria-hidden="true"
                              >
                                <span className="rounded-[2px] border border-current" />
                                <span className="rounded-[2px] border border-current" />
                                <span className="rounded-[2px] border border-current" />
                                <span className="rounded-[2px] border border-current" />
                              </span>
                            )}
                            <span
                              className={
                                isMobileResults
                                  ? "min-w-0 flex-1 truncate text-xs leading-5"
                                  : "line-clamp-1"
                              }
                            >
                              {item.title}
                            </span>
                            {item.price ? (
                              <span
                                className={
                                  isMobileResults
                                    ? "shrink-0 whitespace-nowrap text-[10px] font-medium leading-4 text-gray-500 dark:text-gray-400"
                                    : "me-auto whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-400"
                                }
                              >
                                {item.price} تومان
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
