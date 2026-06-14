import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { apiClient } from "./client-http";
import { AuthService } from "@/src/services/auth/auth.service";

import {
  getIsRefreshing,
  setIsRefreshing,
  enqueueRefreshSubscriber,
  processRefreshQueue,
} from "./refresh-queue";


type RetryRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};


apiClient.interceptors.request.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (getIsRefreshing()) {
      return enqueueRefreshSubscriber().then(() => {
        return apiClient(originalRequest);
      });
    }

    setIsRefreshing(true);

    try {
      const success = await AuthService.refreshToken();

      if (!success) throw error;

      processRefreshQueue(true);

      return apiClient(originalRequest);

    } catch (err) {
      processRefreshQueue(false, err);
      await AuthService.logout();
      return Promise.reject(err);

    } finally {
      setIsRefreshing(false);
    }
  }
);