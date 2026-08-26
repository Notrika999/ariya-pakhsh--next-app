# مستند فنی: لایه `src` و پراکسی API

یادداشت داخلی برای خودت — فقط تنظیمات و معماری شبکه/داده، بدون UI.

---

## ۱. مدل کلی ارتباط

```
Browser (client)
  │
  ├─ /api/auth/*          →  BFF اختصاصی Auth (کوکی‌گذاری روی دامنه فرانت)
  ├─ /api/v1/*            →  Catch-all proxy (با Bearer از کوکی)
  └─ /api/products        →  Route مخصوص لیست محصول (server service)

Next.js Server (RSC / route handlers)
  │
  └─ proxyToBackend()     →  BACKEND_ORIGIN + path
                              پیش‌فرض: https://aryapakhsh.shop/swagger-api
```

**قانون مهم:** مرورگر هرگز مستقیم به swagger نمی‌زند. همه چیز از دامنه Next می‌گذرد تا کوکی same-origin بماند.

---

## ۲. متغیرهای محیطی

| متغیر | نقش | پیش‌فرض در کد |
|--------|-----|----------------|
| `BACKEND_ORIGIN` | پایه API بک‌اند (با path مثل `/swagger-api`) | `https://aryapakhsh.shop/swagger-api` |
| `NEXT_PUBLIC_SITE_URL` | دامنه عمومی سایت (SEO، canonical) — **نه** API | `https://aryapakhsh.shop` |

تعریف پایه بک‌اند:

- `src/lib/api/backend-base.ts` → `getBackendBaseUrl()`, `buildBackendApiUrl()`
- `src/lib/http/server-http.ts` → `joinBackendUrl()` تا **pathname** پایه (`/swagger-api`) حفظ شود و با `.origin` قطع نشود

---

## ۳. ساختار `src/`

```
src/
├── context/           # CartContext — سبد محلی (localStorage)، بدون API
├── services/          # لایه فراخوانی API (client / server)
├── lib/
│   ├── api/           # پایه URL، چند helper قدیمی/mock
│   ├── auth/          # ثابت‌ها، کوکی، BFF helpers
│   ├── http/          # apiClient (مرورگر) + proxyToBackend (سرور)
│   ├── stores/        # Zustand (auth، theme، چند store بلااستفاده)
│   ├── types/         # DTO و تایپ‌ها
│   ├── mappers/       # تبدیل پاسخ API به مدل UI
│   ├── helper/        # fingerprint، product list params، …
│   ├── data/          # داده استاتیک (استان/شهر ایران)
│   └── seo/           # SITE_URL، SITE_NAME
└── utils/             # formatPrice، toast، cartStorage، …
```

### ۳.۱ Services (زنده)

| فایل | سمت | کار |
|------|-----|-----|
| `services/auth/auth.client.ts` | Client | ورود، OTP، 2FA، register، me، profile، email verify، toggle 2FA |
| `services/address/address.client.ts` | Client | CRUD آدرس `/CustomerAddress` |
| `services/category/category.client.ts` | Client | mega-menu |
| `services/product/product.server.ts` | Server | index، filter، detail |
| `services/category/category.server.ts` | Server | mega-menu، promoted، breadcrumb، slug |
| `services/brand/brand.server.ts` | Server | لیست برند |
| `services/promotion/promotion.server.ts` | Server | amazing / special |

Clientها از `apiClient` استفاده می‌کنند.  
Serverها از `proxyToBackend` (بدون عبور از مرورگر).

### ۳.۲ HTTP — مرورگر

**فایل:** `src/lib/http/api-client.ts`

- Axios با `withCredentials: true`
- اگر URL با `/api/` شروع نشود → خودکار می‌شود `/api/v1/{path}`
- مسیرهای `/api/auth/*` دست‌نخورده می‌مانند (BFF جدا)
- خطاها به `ApiError` با `code`/`status` تبدیل می‌شوند

**فایل:** `src/lib/http/interceptors.ts` + `refresh-queue.ts`

- روی `401` برای درخواست‌های غیر-auth: یک‌بار `POST /api/auth/refresh-token`
- صف درخواست‌های همزمان تا refresh تمام شود
- اگر refresh شکست بخورد: `clearUser` در auth store

راه‌اندازی interceptor: از `AuthInitializer` (کامپوننت کلاینت در layout).

### ۳.۳ HTTP — سرور (پراکسی واقعی به بک‌اند)

**فایل:** `src/lib/http/server-http.ts`

- `proxyToBackend({ method, path, body, params, withAuth, … })`
- timeout پیش‌فرض ۲۰s، retry برای متدهای idempotent
- `withAuth: true`:
  - خواندن کوکی‌های `CUP_Customer_Access_Token`، `CUP_Customer_Refresh_Token`، `CUP_Customer_Device_Id`
  - فوروارد Cookie به بک‌اند
  - هدر `Authorization: Bearer {accessToken}`

### ۳.۴ Auth constants و کوکی‌ها

**فایل:** `src/lib/auth/constants.ts`

| نام کوکی | کاربرد |
|----------|--------|
| `CUP_Customer_Access_Token` | Access JWT |
| `CUP_Customer_Refresh_Token` | Refresh |
| `CUP_Customer_Device_Id` | Device / fingerprint سمت سرور |
| `CUP_Auth_Indicator` | فلگ غیر-httpOnly برای UI (نشست فعال) |

سه لایه path:

| ثابت | جهت |
|------|-----|
| `FRONT_AUTH_PATHS` | Browser → `/api/auth/*` |
| `CUSTOMER_BACKEND_AUTH_PATHS` | BFF → `/api/v1/CustomerAuth/*` روی بک‌اند |
| `CUSTOMER_AUTH_CLIENT_PATHS` | Browser → `/api/v1/CustomerAuth/...` (از طریق catch-all) |
| `FRONT_API_PREFIX` | `/api/v1` |
| `BACKEND_AUTH_PATHS` | ManagementAuth — **تعریف شده، BFF مدیریتی پیاده نشده** |

**فایل:** `src/lib/auth/cookie-utils.ts`

- `rehostBackendCookies`: `Set-Cookie` بک‌اند را روی دامنه فرانت می‌نشاند (Domain بک‌اند حذف می‌شود)
- استخراج `device_id` از JWT برای 2FA در صورت نیاز
- `setAuthIndicator` / clear

**فایل:** `src/lib/auth/auth-route-utils.ts`

- helper مشترک routeهای `app/api/auth/*` (`handleCustomerAuthPost` و مشابه)

### ۳.۵ Auth store

**فایل:** `src/lib/stores/auth/auth.store.ts`

- state جریان OTP / login-2FA (`flowToken`, `loginTwoFactorToken`, `deviceFingerPrint`, …)
- `user` + `isAuthenticated`
- persist کاربر در `localStorage` با کلید `CUP_User` (جدا از کوکی httpOnly)

### ۳.۶ Theme store (غیرشبکه)

**فایل:** `src/lib/stores/theme/theme.store.ts` + `src/lib/themes/palettes.ts`

- پالت رنگی + dark mode در `localStorage` (`app-theme`)
- اعمال با `data-palette` روی `<html>`

### ۳.۷ Types / mappers

- تایپ‌های auth، address، product، category، brand، cart، userpanel
- mapperهای محصول و پرفروش‌ها برای نرمال‌سازی envelope بک‌اند (`data` / `items`)

### ۳.۸ چیزهای legacy / بلااستفاده در `src`

| مورد | توضیح |
|------|--------|
| `lib/api/megaMenuApi.ts` | mock؛ منوی زنده از `category.client` است |
| `lib/api/product/getProductById.ts` | mock؛ PDP از `product.server` است |
| `lib/stores/store/cartStore.ts` | zustand سبد؛ اپ از `CartContext` استفاده می‌کند |
| `services/brand/brand.client.ts` | تعریف شده، home از server service می‌گیرد |
| `BACKEND_AUTH_PATHS` | برای پنل مدیریت؛ route ندارد |

---

## ۴. Routeهای پراکسی در `app/api`

### ۴.۱ Catch-all داده

**فایل:** `app/api/v1/[...path]/route.ts`

| | |
|--|--|
| متدها | GET, POST, PUT, PATCH, DELETE |
| مسیر فرانت | `/api/v1/{segments}` |
| مسیر بک‌اند | `/api/v1/{segments}` روی `BACKEND_ORIGIN` |
| Auth | همیشه `withAuth: true` |
| Cache | `force-dynamic`, `no-store` |

مثال:

```
Browser:  GET /api/v1/CustomerAddress
Proxy:    GET {BACKEND_ORIGIN}/api/v1/CustomerAddress
          + Cookie + Authorization Bearer
```

### ۴.۲ Auth BFF (کوکی‌دار)

| Route فرانت | بک‌اند |
|-------------|--------|
| `POST /api/auth/phone/start` | `/api/v1/CustomerAuth/phone/start` |
| `POST /api/auth/phone/verify` | `/api/v1/CustomerAuth/phone/verify` |
| `POST /api/auth/verify-2fa` | alias همان phone verify |
| `POST /api/auth/login` | `/api/v1/CustomerAuth/login` |
| `POST /api/auth/login/verify-2fa` | `/api/v1/CustomerAuth/login/verify-2fa` |
| `POST /api/v1/CustomerAuth/login/verify-2fa` | همان (route اختصاصی cookie-aware) |
| `POST /api/auth/register` | `/api/v1/CustomerAuth/register` |
| `POST /api/auth/resend-otp` | `/api/v1/CustomerAuth/otp/resend` |
| `GET /api/auth/me` | `/api/v1/CustomerAuth/me` |
| `POST /api/auth/logout` | `/api/v1/CustomerAuth/logout` |
| `POST /api/auth/refresh-token` | `/api/v1/CustomerAuth/refresh-token` |
| `GET /api/auth/security-stamp` | `/api/v1/CustomerAuth/me` |

این routeها `Set-Cookie` بک‌اند را rehost می‌کنند.

### ۴.۳ Products listing

**فایل:** `app/api/products/route.ts`

- برای infinite scroll لیست محصول
- داخلش `getProductList` از `product.server` → `POST /api/v1/Products/filter`

---

## ۵. الگوی فراخوانی (چطور از کجا بزنی)

### از Client Component

```ts
// مسیر نسبی بدون /api → می‌رود به /api/v1/...
apiClient.get("/CustomerAddress");

// Auth همیشه از FRONT_AUTH_PATHS
apiClient.post("/api/auth/login", body);
```

### از Server Component / Server Service

```ts
import { proxyToBackend } from "@/src/lib/http/server-http";

await proxyToBackend({
  method: "GET",
  path: "/api/v1/Products/index",
  withAuth: false, // یا true اگر نیاز به توکن کاربر باشد
});
```

### از Route Handler جدید Auth

```ts
// الگوی موجود:
return handleCustomerAuthPost(request, CUSTOMER_BACKEND_AUTH_PATHS.LOGIN, {
  setAuthIndicator: true,
});
```

---

## ۶. جریان‌های مهم Auth (بدنه درخواست)

| جریان | Body کلیدی |
|-------|------------|
| Login password | `username`, `password`, `rememberMe`, `deviceFingerPrint` |
| Login 2FA verify | `twoFactorToken`, `code`, `deviceFingerPrint` |
| Phone start | شماره + fingerprint |
| Phone verify OTP | token جریان + code |
| Resend OTP (2FA) | `{ token }` (نه `twoFactorToken`) |
| Profile update | فیلدهای پروفایل از `UpdateProfileRequest` |
| Address | payload `CustomerAddress` |

Store فقط state نگه می‌دارد؛ ارسال واقعی از `auth.client` / `StepOtp` است.

---

## ۷. چک‌لیست وقتی endpoint جدید می‌خواهی

1. **عمومی / کاتالوگ (SSR):** تابع در `*.server.ts` با `proxyToBackend`، path کامل `/api/v1/...`
2. **نیاز به کوکی کاربر از مرورگر:** یا از `apiClient` با path نسبی (`/Resource`) یا route BFF اگر باید `Set-Cookie` ست شود
3. **Auth که کوکی می‌سازد:** حتماً `app/api/auth/...` + `auth-route-utils` / `rehostBackendCookies`
4. ثابت path را در `constants.ts` اضافه کن تا پراکنده نشود
5. تایپ در `src/lib/types/` و در صورت نیاز mapper

---

## ۸. فایل‌های مرجع سریع

| موضوع | مسیر |
|--------|------|
| Base URL بک‌اند | `src/lib/api/backend-base.ts` |
| پراکسی سرور | `src/lib/http/server-http.ts` |
| کلاینت مرورگر | `src/lib/http/api-client.ts` |
| Refresh روی 401 | `src/lib/http/interceptors.ts` |
| ثابت‌ها و کوکی‌ها | `src/lib/auth/constants.ts` |
| Rehost کوکی | `src/lib/auth/cookie-utils.ts` |
| Catch-all | `app/api/v1/[...path]/route.ts` |
| Auth BFF | `app/api/auth/**/route.ts` |
| SEO site URL | `src/lib/seo/site.ts` |

---

*آخرین به‌روزرسانی: بر اساس وضعیت فعلی ریپو (لایه src + BFF/proxy).*
