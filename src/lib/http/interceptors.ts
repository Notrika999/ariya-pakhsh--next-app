// src/lib/http/interceptors.ts
"use client";

import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { FRONT_AUTH_PATHS } from "@/src/lib/auth/constants";
import { apiClient } from "./api-client";
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

function isAuthRequest(url: string): boolean {
  return url.includes("/api/auth/");
}

function isRefreshRequest(url: string): boolean {
  return url.includes(FRONT_AUTH_PATHS.REFRESH);
}

async function clearClientAuthState(): Promise<void> {
  clearRefreshQueue();
  const { useAuthStore } = await import("@/src/lib/stores/auth/auth.store");
  useAuthStore.getState().clearUser();
}

export function setupApiInterceptors(): void {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryRequest | undefined;
      if (!originalRequest) return Promise.reject(error);

      if (error.response?.status !== 401) {
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
          FRONT_AUTH_PATHS.REFRESH,
          {},
          { timeout: 15_000 },
        );

        if (refreshResponse.status !== 200) {
          throw error;
        }

        processRefreshQueue(true);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processRefreshQueue(false, refreshError);
        try {
          await apiClient.post(FRONT_AUTH_PATHS.LOGOUT, {});
        } catch {
          // ignore logout errors during forced session clear
        }
        await clearClientAuthState();
        return Promise.reject(refreshError);
      } finally {
        setIsRefreshing(false);
      }
    },
  );
}
