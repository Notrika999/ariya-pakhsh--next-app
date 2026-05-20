// // src/lib/http/client-htt
// import axios from "axios";
// console.log("env:", process.env.NEXT_PUBLIC_API_BASE_URL);

// const apiClient = axios.create({
//   // baseURL: "https://aryapakhsh.shop/api/v1",
//   // baseURL: API_URL,
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   withCredentials: true,
//   timeout: 30000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// export default apiClient;

// src/lib/http/api-client.ts
import axios from "axios";

export const apiClient = axios.create({
  // این URL باید به بک‌اند واقعی اشاره کند
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // با توجه به استفاده از کوکی‌ها برای احراز هویت
  withCredentials: true,
  timeout: 30000, // Timeout 30 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// این قسمت به خاطر استفاده مستقیم از NEXT_PUBLIC_API_BASE_URL و حذف proxy،
// دیگر نیازی به کد server-side URL resolution ندارد.
// اگرچه، برای اطمینان بیشتر در محیط server-side Next.js (مثل Server Components یا API Routes)،
// ممکن است بخواهیم از یک متغیر محیطی دیگر برای base URL کامل استفاده کنیم،
// اما فعلاً فرض می‌کنیم NEXT_PUBLIC_API_BASE_URL هم در client و هم server کار می‌کند.
