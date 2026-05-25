// src/lib/http/api-client.ts

import axios, { AxiosError } from "axios";

/* -------------------------------------------------------------------------- */
/*                            Extended Error Class                            */
/* -------------------------------------------------------------------------- */

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
    public data?: any,
    public original?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/* -------------------------------------------------------------------------- */
/*                                Client Instance                             */
/* -------------------------------------------------------------------------- */

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* -------------------------------------------------------------------------- */
/*                            Response Interceptor                            */
/* -------------------------------------------------------------------------- */

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const errorData = error.response?.data;

    // ۱. خطاهای شبکه (Server Down / No Internet)
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
      case 401:
        // هدایت کاربر به لاگین یا اجرای Silent Refresh
        // window.location.href = '/login';
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
        // خطاهای Validation (مخصوصاً در Laravel یا Django)
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
