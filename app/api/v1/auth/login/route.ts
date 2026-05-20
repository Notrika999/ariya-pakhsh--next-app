import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend, extractSetCookieHeaders, ProxyError } from '@/lib/http/server-http'
import type { LoginResponse } from '@/types/auth'
import { setAuthIndicator } from '@/lib/auth/cookie-utils'
import { BACKEND_AUTH_PATHS, AUTH_COOKIE_NAMES } from '@/lib/auth/constants'
import { ApiResponseWithData } from '@/lib/projectConstant/constants'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const cookieStore = await cookies()
    const deviceId = cookieStore.get(AUTH_COOKIE_NAMES.DEVICE_ID)?.value

    const extraHeaders: Record<string, string> = {}

    if (deviceId) {
      extraHeaders['Cookie'] = `${AUTH_COOKIE_NAMES.DEVICE_ID}=${deviceId}`
    }

    const response = await proxyToBackend<ApiResponseWithData<LoginResponse>>({
      method: 'POST',
      path: BACKEND_AUTH_PATHS.LOGIN,
      body,
      headers: extraHeaders, // ✅ Device Id فوروارد میشه
      withAuth: false,
      retries: 0
    })

    if (!response.ok) {
      return NextResponse.json(response.data, {
        status: response.status
      })
    }

    const nextResponse = NextResponse.json(response.data, {
      status: response.status
    })

    // 🟢 راه حل جدید: پارس کردن و دستی ست کردن کوکی‌ها
    const setCookies = extractSetCookieHeaders(response.headers)
    for (const cookieHeader of setCookies) {
      // پارس کردن کوکی
      const [cookiePart, ...attributes] = cookieHeader.split(';')
      const [name, value] = cookiePart.split('=')

      if (!name || !value) continue

      // استخراج attributes
      const attrs: Record<string, string> = {}
      for (const attr of attributes) {
        const [key, val] = attr.trim().split('=')
        attrs[key.toLowerCase()] = val || 'true'
      }

      // ست کردن کوکی با Next.js
      nextResponse.cookies.set(name.trim(), value.trim(), {
        httpOnly: attrs['httponly'] === 'true',
        secure: attrs['secure'] === 'true',
        sameSite: (attrs['samesite'] as 'strict' | 'lax' | 'none') || 'lax',
        path: attrs['path'] || '/',
        maxAge: attrs['max-age'] ? parseInt(attrs['max-age']) : undefined,
        expires: attrs['expires'] ? new Date(attrs['expires']) : undefined
      })
    }

    // اگه 2FA لازم نیست → auth_indicator ست کن
    const loginData = response.data.data
    if (!loginData?.requiresTwoFactor) {
      const expiresIn = loginData?.expiresIn ?? undefined
      setAuthIndicator(nextResponse, expiresIn)
    }

    return nextResponse
  } catch (error) {
    if (error instanceof ProxyError) {
      return NextResponse.json(
        { error: error.code === 'TIMEOUT' ? 'زمان درخواست به پایان رسید.' : 'سرویس در دسترس نیست.' },
        { status: error.code === 'TIMEOUT' ? 504 : 502 }
      )
    }

    return NextResponse.json({ error: 'خطای داخلی سرور' }, { status: 500 })
  }
}
