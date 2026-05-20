import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiClient } from './client-http';
import { AuthService } from '@/src/services/auth/auth.service';


let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: AxiosResponse) => void; reject: (reason: AxiosError) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      return prom.reject(error);
    }
    prom.resolve(token!); // token is guaranteed to be non-null here
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _isRetry?: boolean };

    // اگر خطا 401 بود و این request قبلاً retry نشده بود
    if (error.response?.status === 401 && originalRequest && !originalRequest._isRetry) {
      if (isRefreshing) {
        // اگر در حال refresh هستیم، request فعلی را در صف قرار بده
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers!['Authorization'] = 'Bearer ' + token;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        // فراخوانی refresh token endpoint
        // این قسمت نیاز به یک تابع در AuthService دارد که refresh token را صدا بزند
        // و کوکی‌های جدید را set کند (یا حداقل token جدید را برگرداند)
        const refreshed = await AuthService.refreshToken(); // فرض می‌کنیم این تابع کوکی‌ها را آپدیت می‌کند

        if (refreshed) {
          // اگر refresh موفق بود، کوکی‌ها آپدیت شده‌اند، حالا token جدید را در header قرار بده
          // و request اصلی را دوباره اجرا کن
          const newAccessToken = await AuthService.getAccessToken(); // فرض می‌کنیم این تابع access token جدید را از کوکی می‌خواند
          if (newAccessToken) {
            originalRequest.headers!['Authorization'] = 'Bearer ' + newAccessToken;
            originalRequest._isRetry = true; // علامت بزن که این request retry شده
            processQueue(null, newAccessToken); // صف را پردازش کن
            return apiClient(originalRequest);
          }
        }
      } catch (err) {
        // اگر refresh ناموفق بود، کاربر را logout کن
        console.error("Refresh token failed. Logging out.", err);
        AuthService.logout(); // فرض می‌کنیم تابع logout داریم
        processQueue(error, null); // صف خطا را پردازش کن
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // برای خطاهای دیگر، خطا را برگردان
    return Promise.reject(error);
  }
);
