// src/app/api/v1/auth/logout/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend, extractSetCookieHeaders, ProxyError } from '@/lib/http/server-http'
import { clearAuthIndicator } from '@/lib/auth/cookie-utils'
import { BACKEND_AUTH_PATHS, AUTH_COOKIE_NAMES } from '@/lib/auth/constants'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const headers = new Headers()
  headers.set('Content-Type', 'application/json')

  try {
    // ✅ Refresh Token رو دستی بخون و به Cookie header اضافه کن
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get(AUTH_COOKIE_NAMES.REFRESH_TOKEN)?.value

    const extraHeaders: Record<string, string> = {}
    if (refreshToken) {
      // withAuth خودش Access Token و Device ID رو میذاره
      // فقط Refresh Token رو اضافه کن
      extraHeaders['Cookie'] = `${AUTH_COOKIE_NAMES.REFRESH_TOKEN}=${refreshToken}`
    }

    const response = await proxyToBackend({
      method: 'POST',
      path: BACKEND_AUTH_PATHS.LOGOUT,
      withAuth: true,
      timeout: 5_000,
      retries: 0,
      headers: extraHeaders
    })

    for (const cookie of extractSetCookieHeaders(response.headers)) {
      headers.append('Set-Cookie', cookie)
    }
  } catch (error) {
    if (error instanceof ProxyError) {
    } else {
    }
  }

  // ✅ همیشه کوکی‌ها رو پاک کن
  clearAllAuthCookies(headers)

  const nextResponse = new NextResponse(JSON.stringify({ success: true, message: 'خروج با موفقیت انجام شد.' }), {
    status: 200,
    headers
  })

  clearAuthIndicator(nextResponse)
  return nextResponse
}

function clearAllAuthCookies(headers: Headers) {
  const cookiesToClear = [
    { name: 'CUP_Access_Token', path: '/' },
    { name: 'CUP_Auth_Indicator', path: '/' },
    // هر دو path برای Refresh Token
    { name: 'CUP_Refresh_Token', path: '/' },
    { name: 'CUP_Refresh_Token', path: '/' }
  ]

  for (const { name, path } of cookiesToClear) {
    // ✅ Expires هم اضافه کن برای مرورگرهای قدیمی
    headers.append(
      'Set-Cookie',
      [
        `${name}=`,
        `Path=${path}`,
        'Max-Age=0',
        'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'HttpOnly',
        'SameSite=Lax'
      ].join('; ')
    )
  }
}
