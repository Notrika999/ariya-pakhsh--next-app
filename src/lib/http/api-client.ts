// src/lib/http/api-client.ts
"use client";

import axios, { AxiosError } from "axios";
import { FRONT_API_PREFIX } from "@/src/lib/auth/constants";

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

  // برای FormData نباید Content-Type دستی ست شود تا boundary درست ساخته شود
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
      if (typeof value === "string" && value.trim().length > 0)
        return value.trim();
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
      if (typeof value === "string" && value.trim().length > 0)
        return value.trim();
    }
  }

  return undefined;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<unknown>) => {
    const status = error.response?.status;
    const errorData = error.response?.data;
    const backendMessage = extractApiErrorMessage(errorData);
    const backendCode = extractApiErrorCode(errorData);

    if (!error.response) {
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

    switch (status) {
      case 400:
        return Promise.reject(
          new ApiError(400, "Bad request", "BAD_REQUEST", errorData),
        );
      case 401:
        return Promise.reject(
          new ApiError(401, "Session expired", "UNAUTHORIZED", errorData),
        );
      case 403:
        return Promise.reject(
          new ApiError(403, "Access denied", "FORBIDDEN", errorData),
        );
      case 404:
        return Promise.reject(
          new ApiError(404, "Resource not found", "NOT_FOUND", errorData),
        );
      case 422:
        return Promise.reject(
          new ApiError(422, "Validation failed", "VALIDATION_ERROR", errorData),
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
