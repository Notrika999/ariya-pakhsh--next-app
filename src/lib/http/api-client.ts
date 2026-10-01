// src/lib/http/api-client.ts
"use client";

import axios, { AxiosError } from "axios";
import { FRONT_API_PREFIX } from "@/src/lib/auth/constants";
import {
  assertSafeInput,
  UnsafeInputError,
} from "@/src/utils/input-security";

const UNSAFE_INPUT_MESSAGE =
  "\u0644\u0637\u0641\u0627 \u0645\u062a\u0646 \u0631\u0627 \u0628\u062f\u0631\u0633\u062a\u06cc \u0627\u0631\u0633\u0627\u0644 \u06a9\u0646\u06cc\u062f";

let sessionInvalidRedirectInFlight: Promise<void> | null = null;

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
    public data?: unknown,
    public original?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiClient = axios.create({
  baseURL: "",
  withCredentials: true,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function isAuthUrl(url: string): boolean {
  return url.includes("/api/auth/");
}

function toApiPath(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/api/")) return path;
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${FRONT_API_PREFIX}/${normalized}`;
}

apiClient.interceptors.request.use((config) => {
  if (config.url && !isAuthUrl(config.url)) {
    config.url = toApiPath(config.url);
  }

  try {
    const method = String(config.method ?? "").toLowerCase();
    if (config.params) {
      assertSafeInput(config.params);
    }

    if (config.data && ["post", "put", "patch", "delete"].includes(method)) {
      assertSafeInput(config.data);
    }
  } catch (error) {
    if (error instanceof UnsafeInputError) {
      throw new ApiError(
        400,
        UNSAFE_INPUT_MESSAGE,
        "UNSAFE_INPUT",
        { violations: error.violations },
        error,
      );
    }

    throw error;
  }

  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    const headers = config.headers;
    if (headers && typeof headers === "object") {
      if (
        typeof (headers as { delete?: (key: string) => void }).delete ===
        "function"
      ) {
        (headers as { delete: (key: string) => void }).delete("Content-Type");
      } else {
        delete (headers as Record<string, unknown>)["Content-Type"];
        delete (headers as Record<string, unknown>)["content-type"];
      }
    }
  }

  return config;
});

function extractApiErrorMessage(errorData: unknown): string | undefined {
  if (!errorData || typeof errorData !== "object") return undefined;
  const record = errorData as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : undefined;

  for (const source of [record, nested]) {
    if (!source) continue;
    for (const key of ["message", "errorMessage", "error", "title"]) {
      const value = source[key];
      if (typeof value === "string" && value.trim().length > 0) {
        return value.trim();
      }
    }
  }

  return undefined;
}

function extractApiErrorCode(errorData: unknown): string | undefined {
  if (!errorData || typeof errorData !== "object") return undefined;
  const record = errorData as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : undefined;

  for (const source of [record, nested]) {
    if (!source) continue;
    for (const key of ["code", "errorCode"]) {
      const value = source[key];
      if (typeof value === "string" && value.trim().length > 0) {
        return value.trim();
      }
    }
  }

  return undefined;
}

function readHeader(headers: unknown, name: string): string | undefined {
  if (!headers || typeof headers !== "object") return undefined;

  const maybeGetter = headers as { get?: (key: string) => unknown };
  if (typeof maybeGetter.get === "function") {
    const value = maybeGetter.get(name);
    return typeof value === "string" ? value : undefined;
  }

  const record = headers as Record<string, unknown>;
  const direct = record[name] ?? record[name.toLowerCase()];
  return typeof direct === "string" ? direct : undefined;
}

function hasSessionInvalidHeader(headers: unknown): boolean {
  return (
    readHeader(headers, "x-session-invalid")?.trim().toLowerCase() === "true"
  );
}

async function enforceSessionInvalidHeader(headers: unknown): Promise<void> {
  if (!hasSessionInvalidHeader(headers) || typeof window === "undefined") {
    return;
  }

  const { handleSessionInvalidHeader, isProtectedRoute } = await import(
    "@/src/lib/auth/session-client"
  );

  if (!isProtectedRoute(window.location.pathname)) return;

  if (!sessionInvalidRedirectInFlight) {
    sessionInvalidRedirectInFlight = handleSessionInvalidHeader().finally(() => {
      sessionInvalidRedirectInFlight = null;
    });
  }

  await sessionInvalidRedirectInFlight;
}

apiClient.interceptors.response.use(
  async (response) => {
    await enforceSessionInvalidHeader(response.headers);
    return response;
  },
  async (error: AxiosError<unknown> | ApiError) => {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    }

    await enforceSessionInvalidHeader(error.response?.headers);

    const status = error.response?.status;
    const errorData = error.response?.data;
    const backendMessage = extractApiErrorMessage(errorData);
    const backendCode = extractApiErrorCode(errorData);

    if (!error.response) {
      // console.error("[api-client] network/no-response error", {
      //   url: error.config?.url,
      //   method: error.config?.method,
      //   baseURL: error.config?.baseURL,
      //   code: error.code,
      //   message: error.message,
      //   name: error.name,
      // });
      return Promise.reject(
        new ApiError(
          0,
          "Network failure or Server unreachable",
          "NETWORK_ERROR",
          null,
          error,
        ),
      );
    }

    // console.error("[api-client] http error", {
    //   url: error.config?.url,
    //   method: error.config?.method,
    //   status: error.response?.status,
    //   statusText: error.response?.statusText,
    //   responseData: error.response?.data,
    //   responseHeaders: error.response?.headers,
    //   requestData: error.config?.data,
    //   params: error.config?.params,
    //   message: error.message,
    // });

    switch (status) {
      case 400:
        return Promise.reject(
          new ApiError(
            400,
            backendMessage || "Bad request",
            backendCode || "BAD_REQUEST",
            errorData,
            error,
          ),
        );
      case 401:
        return Promise.reject(
          new ApiError(
            401,
            backendMessage || "Session expired",
            backendCode || "UNAUTHORIZED",
            errorData,
            error,
          ),
        );
      case 403:
        return Promise.reject(
          new ApiError(
            403,
            backendMessage || "Access denied",
            backendCode || "FORBIDDEN",
            errorData,
            error,
          ),
        );
      case 404:
        return Promise.reject(
          new ApiError(
            404,
            backendMessage || "Resource not found",
            backendCode || "NOT_FOUND",
            errorData,
            error,
          ),
        );
      case 422:
        return Promise.reject(
          new ApiError(
            422,
            backendMessage || "Validation failed",
            backendCode || "VALIDATION_ERROR",
            errorData,
            error,
          ),
        );
      case 429:
        return Promise.reject(
          new ApiError(
            429,
            backendMessage || "Too many requests. Slow down.",
            backendCode || "RATE_LIMIT",
            errorData,
            error,
          ),
        );
      case 500:
      case 502:
      case 503:
        return Promise.reject(
          new ApiError(
            status,
            "Server-side crash",
            "SERVER_ERROR",
            errorData,
            error,
          ),
        );
      default:
        return Promise.reject(
          new ApiError(
            status || 500,
            "An unexpected error occurred",
            "UNKNOWN",
            errorData,
            error,
          ),
        );
    }
  },
);

export default apiClient;
