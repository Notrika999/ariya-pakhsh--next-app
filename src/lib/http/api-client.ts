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

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<unknown> | ApiError) => {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const errorData = error.response?.data;
    const backendMessage = extractApiErrorMessage(errorData);
    const backendCode = extractApiErrorCode(errorData);

    if (!error.response) {
      console.error("[api-client] network/no-response error", {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        code: error.code,
        message: error.message,
        name: error.name,
      });
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

    console.error("[api-client] http error", {
      url: error.config?.url,
      method: error.config?.method,
      status,
      backendCode,
      backendMessage,
      errorData,
    });

    switch (status) {
      case 400:
        return Promise.reject(
          new ApiError(
            400,
            backendMessage || "Bad request",
            backendCode || "BAD_REQUEST",
            errorData,
          ),
        );
      case 401:
        return Promise.reject(
          new ApiError(
            401,
            backendMessage || "Session expired",
            backendCode || "UNAUTHORIZED",
            errorData,
          ),
        );
      case 403:
        return Promise.reject(
          new ApiError(
            403,
            backendMessage || "Access denied",
            backendCode || "FORBIDDEN",
            errorData,
          ),
        );
      case 404:
        return Promise.reject(
          new ApiError(
            404,
            backendMessage || "Resource not found",
            backendCode || "NOT_FOUND",
            errorData,
          ),
        );
      case 422:
        return Promise.reject(
          new ApiError(
            422,
            backendMessage || "Validation failed",
            backendCode || "VALIDATION_ERROR",
            errorData,
          ),
        );
      case 429:
        return Promise.reject(
          new ApiError(429, "Too many requests. Slow down.", "RATE_LIMIT"),
        );
      case 500:
      case 502:
      case 503:
        return Promise.reject(
          new ApiError(status, "Server-side crash", "SERVER_ERROR", errorData),
        );
      default:
        return Promise.reject(
          new ApiError(
            status || 500,
            "An unexpected error occurred",
            "UNKNOWN",
            errorData,
          ),
        );
    }
  },
);

export default apiClient;
