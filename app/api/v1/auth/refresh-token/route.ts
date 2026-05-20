// src/app/api/v1/auth/refresh/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAMES, BACKEND_AUTH_PATHS } from '@/lib/auth/constants'
import { setAuthIndicator, clearAuthIndicator } from '@/lib/auth/cookie-utils'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(AUTH_COOKIE_NAMES.ACCESS_TOKEN)?.value
    const refreshToken = cookieStore.get(AUTH_COOKIE_NAMES.REFRESH_TOKEN)?.value
    const deviceId = cookieStore.get(AUTH_COOKIE_NAMES.DEVICE_ID)?.value

    if (!refreshToken) {
      const res = NextResponse.json({ error: 'هیچ رفرش توکنی پیدا نشد.', success: false }, { status: 401 })
      clearAuthIndicator(res)
      return res
    }

    // ✅ کوکی‌ها رو دستی بساز (مثل logout، چون refresh token path محدود داره)
    const cookieParts: string[] = []
    if (accessToken) cookieParts.push(`${AUTH_COOKIE_NAMES.ACCESS_TOKEN}=${accessToken}`)
    if (refreshToken) cookieParts.push(`${AUTH_COOKIE_NAMES.REFRESH_TOKEN}=${refreshToken}`)
    if (deviceId) cookieParts.push(`${AUTH_COOKIE_NAMES.DEVICE_ID}=${deviceId}`)

    const backendUrl = `${process.env.API_URL}${BACKEND_AUTH_PATHS.REFRESH}`

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieParts.join('; '),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
      },
      signal: AbortSignal.timeout(15_000)
    })

    // ✅ کوکی‌های Backend رو بخون
    const setCookies = backendResponse.headers.getSetCookie?.() ?? []

    if (!backendResponse.ok) {
      const res = NextResponse.json({ error: 'عملیات نوسازی توکن با شکست مواجه شد.', success: false }, { status: 401 })

      // فوروارد کوکی‌های Backend (ممکنه کوکی‌ها رو حذف کرده باشه)
      for (const cookie of setCookies) {
        res.headers.append('Set-Cookie', cookie)
      }

      clearAuthIndicator(res)
      return res
    }

    // ✅ Response موفق
    const responseData = await backendResponse.json().catch(() => ({}))

    const headers = new Headers()
    headers.set('Content-Type', 'application/json')

    // فوروارد کوکی‌های Backend (Access Token جدید)
    for (const cookie of setCookies) {
      headers.append('Set-Cookie', cookie)
    }

    const nextResponse = new NextResponse(JSON.stringify({ success: true, ...responseData }), {
      status: 200,
      headers
    })

    // ✅ Auth indicator رو تمدید کن
    const expiresIn =
      responseData?.expiresIn ??
      responseData?.data?.expiresIn ??
      responseData?.ExpiresIn ??
      responseData?.data?.ExpiresIn

    if (expiresIn) {
      setAuthIndicator(nextResponse, expiresIn)
    } else {
      setAuthIndicator(nextResponse, 7 * 24 * 60 * 60)
    }

    return nextResponse
  } catch (error) {
    const res = NextResponse.json(
      { error: 'عملیات نوسازی رفرش توکن با شکست مواجه شد.', success: false },
      { status: 500 }
    )
    clearAuthIndicator(res)
    return res
  }
}
