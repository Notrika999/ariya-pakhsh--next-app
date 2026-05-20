import axios from "axios";


export const AuthService = {
  // تابع برای گرفتن Access Token از کوکی (یا state)
  getAccessToken: async (): Promise<string | null> => {
    // ابتدا از Zustand store چک کن، اگر بود برگردان
    const token = authStore.getState().accessToken;
    if (token) return token;

    // اگر نبود، از کوکی بخوان
    const cookieToken = cookieUtils.getCookie('ACCESS_TOKEN');
    if (cookieToken) {
      // state را هم آپدیت کن
      authStore.setState({ accessToken: cookieToken });
      return cookieToken;
    }
    return null;
  },

  // تابع برای refresh token
  // این تابع باید یک درخواست POST به endpoint refresh token بک‌اند بزند
  // و اگر موفق بود، کوکی‌های جدید را ست کند و true برگرداند.
  refreshToken: async (): Promise<boolean> => {
    try {
      // این URL باید مستقیماً به refresh endpoint بک‌اند شما بزند، نه proxy
      // چون refresh endpoint خودش کوکی ست می‌کند.
      const response = await axios.post('/api/v1/auth/refresh', {}, {
        withCredentials: true, // این برای ارسال کوکی لازم است
        // اگر NEXT_PUBLIC_API_BASE_URL شامل http:// یا https:// باشد، نیازی به baseURL نیست.
        // اما اگر فقط path است، باید baseURL را اینجا ست کنید یا از یک axios instance دیگر استفاده کنید.
        // برای سادگی، فرض می‌کنیم این request مستقیماً از مرورگر به /api/v1/auth/refresh می‌رود.
        // اگر در Server Component هستید، ممکن است نیاز باشد از next/http یا fetch با cookie header استفاده کنید.
      });

      // فرض می‌کنیم response.data حاوی اطلاعاتی است یا حداقل status code موفقیت است
      if (response.status === 200 || response.status === 201) {
        // اینجا باید دسترسی به token جدید را فراهم کنید.
        // بهترین حالت این است که بک‌اند کوکی‌های جدید (ACCESS_TOKEN, REFRESH_TOKEN) را ست کند.
        // اگر بک‌اند token جدید را در response.data برمی‌گرداند:
        // const newAccessToken = response.data.accessToken;
        // cookieUtils.setCookie('ACCESS_TOKEN', newAccessToken, 1); // expiration in days
        // authStore.setState({ accessToken: newAccessToken });

        // مهم: بعد از موفقیت refresh، باید state auth را آپدیت کرد
        // و کوکی‌های جدید را در مرورگر ست کرد.
        // این کار بستگی به این دارد که بک‌اند چگونه refresh token را پیاده کرده.
        // اگر بک‌اند خودش کوکی ست می‌کند، شاید نیازی به کار اضافی اینجا نباشد.
        // برای اطمینان، بهتر است بعد از refresh، access token را دوباره از کوکی بخوانیم.
        const newAccessToken = await AuthService.getAccessToken();
        if (newAccessToken) {
          authStore.setState({ accessToken: newAccessToken });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  },

  // تابع برای logout
  logout: () => {
    cookieUtils.deleteCookie('ACCESS_TOKEN');
    cookieUtils.deleteCookie('REFRESH_TOKEN');
    cookieUtils.deleteCookie('DEVICE_ID'); // اگر استفاده می‌کنید
    cookieUtils.deleteCookie('AUTH_INDICATOR'); // اگر استفاده می‌کنید
    authStore.setState({ accessToken: null, isAuthenticated: false }); // آپدیت state
    // redirect to login page
    // window.location.href = FRONT_AUTH_PATHS.LOGIN; // در محیط مرورگر
    // یا با استفاده از router.push('/login') در Next.js
  },

  // تابع برای login (مثال)
  login: async (credentials: any) => {
    try {
      const response = await apiClient.post('/auth/login', credentials); // به login endpoint بک‌اند بزن
      if (response.status === 200) {
        const accessToken = response.data.accessToken; // فرض می‌کنیم بک‌اند access token را برمی‌گرداند
        const refreshToken = response.data.refreshToken; // و refresh token را هم
        cookieUtils.setCookie('ACCESS_TOKEN', accessToken, 1); // expiration in days
        cookieUtils.setCookie('REFRESH_TOKEN', refreshToken, 7); // expiration in days
        authStore.setState({ accessToken, isAuthenticated: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  },

  // تابع برای بررسی وضعیت احراز هویت (می‌تواند در app startup صدا زده شود)
  checkAuthStatus: async () => {
    const token = await AuthService.getAccessToken();
    if (token) {
      // اگر توکن وجود دارد، وضعیت را authenticated کن
      authStore.setState({ accessToken: token, isAuthenticated: true });
      return true;
    } else {
      // اگر توکن نیست، وضعیت را unauthenticated کن
      authStore.setState({ accessToken: null, isAuthenticated: false });
      return false;
    }
  }
};
