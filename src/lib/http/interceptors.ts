// src/lib/http/interceptors.ts
"use client";

import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { CUSTOMER_AUTH_CLIENT_PATHS } from "@/src/lib/auth/constants";
import { handleSessionExpired } from "@/src/lib/auth/session-client";
<<<<<<< HEAD
import { ApiError, apiClient } from "./api-client";
=======
import { apiClient } from "./api-client";
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
import {
  getIsRefreshing,
  setIsRefreshing,
  enqueueRefreshSubscriber,
  processRefreshQueue,
  clearRefreshQueue,
} from "./refresh-queue";

type RetryRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

<<<<<<< HEAD
function getAxiosError(error: unknown): AxiosError | null {
  if (error && typeof error === "object" && "isAxiosError" in error) {
    return error as AxiosError;
  }

  if (error instanceof ApiError) {
    const original = error.original;
    if (original && typeof original === "object" && "isAxiosError" in original) {
      return original as AxiosError;
    }
  }

  return null;
}

function isAuthRequest(url: string): boolean {
  return url.includes("/api/auth/") || url.includes("/CustomerAuth/");
}

=======
function isAuthRequest(url: string): boolean {
  return url.includes("/api/auth/") || url.includes("/CustomerAuth/");
}

>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
function isRefreshRequest(url: string): boolean {
  return url.includes(CUSTOMER_AUTH_CLIENT_PATHS.REFRESH);
}

async function clearClientAuthState(): Promise<void> {
  clearRefreshQueue();
  await handleSessionExpired();
}

export function setupApiInterceptors(): void {
  apiClient.interceptors.response.use(
    (response) => response,
<<<<<<< HEAD
    async (error: AxiosError | ApiError) => {
      const axiosError = getAxiosError(error);
      const originalRequest = axiosError?.config as RetryRequest | undefined;
      if (!originalRequest) return Promise.reject(error);

      const status =
        axiosError?.response?.status ??
        (error instanceof ApiError ? error.status : undefined);

      if (status !== 401) {
=======
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryRequest | undefined;
      if (!originalRequest) return Promise.reject(error);

      if (error.response?.status !== 401) {
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
        return Promise.reject(error);
      }

      const url = originalRequest.url ?? "";
      if (isAuthRequest(url) && isRefreshRequest(url)) {
        await clearClientAuthState();
        return Promise.reject(error);
      }

      if (isAuthRequest(url)) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        await clearClientAuthState();
        return Promise.reject(error);
      }

      if (getIsRefreshing()) {
        try {
          await enqueueRefreshSubscriber();
          originalRequest._retry = true;
          return apiClient(originalRequest);
        } catch {
          return Promise.reject(error);
        }
      }

      originalRequest._retry = true;
      setIsRefreshing(true);

      try {
        const refreshResponse = await apiClient.post(
          CUSTOMER_AUTH_CLIENT_PATHS.REFRESH,
          {},
          { timeout: 15_000 },
        );

        if (refreshResponse.status !== 200) {
          throw error;
        }

        processRefreshQueue(true);
        const { markAccessTokenRefreshed } = await import(
          "@/src/lib/auth/token-refresh-scheduler"
        );
        markAccessTokenRefreshed();
        return apiClient(originalRequest);
      } catch (refreshError) {
        processRefreshQueue(false, refreshError);
        await clearClientAuthState();
        return Promise.reject(refreshError);
      } finally {
        setIsRefreshing(false);
      }
    },
  );
}
