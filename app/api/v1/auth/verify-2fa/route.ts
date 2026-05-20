import { VerifyTwoFactorResponse } from './../../../../../types/auth'
import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend, extractSetCookieHeaders, ProxyError } from '@/lib/http/server-http'
import { setAuthIndicator } from '@/lib/auth/cookie-utils'
import { LoginResponse } from '@/types/auth'
import { AUTH_COOKIE_NAMES, BACKEND_AUTH_PATHS } from '@/lib/auth/constants'
import { ApiResponse, ApiResponseWithData } from '@/lib/projectConstant/constants'
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

    const response = await proxyToBackend<ApiResponseWithData<VerifyTwoFactorResponse>>({
      method: 'POST',
      path: BACKEND_AUTH_PATHS.VERIFY_2FA,
      body,
      headers: extraHeaders,
      withAuth: false,
      retries: 0
    })

    if (!response.ok) {
      return NextResponse.json(response.data, {
        status: response.status
      })
    }

    const responseData = response.data

    if (responseData && typeof responseData.data === 'object' && 'success' in responseData && !responseData.success) {
      return NextResponse.json(
        {
          error: responseData.data?.errorMessage || responseData.data?.errorMessage || 'کد تأیید نامعتبر است.',
          success: false,
          remainingAttempts: responseData.data?.remainingAttempts ?? undefined
        },
        { status: 401 }
      )
    }

    const headers = new Headers()
    headers.set('Content-Type', 'application/json')

    const backendCookies = extractSetCookieHeaders(response.headers)

    for (const cookie of backendCookies) {
      headers.append('Set-Cookie', cookie)
    }

    // ✅ expiresIn رو پیدا کن
    const expiresIn = responseData.data?.expiresIn

    // ✅ Response رو با headers از پیش‌ساخته بساز
    const nextResponse = new NextResponse(JSON.stringify(responseData), {
      status: response.status,
      headers
    })

    // ✅ auth_indicator رو ست کن
    if (expiresIn) {
      setAuthIndicator(nextResponse, expiresIn)
    } else {
      setAuthIndicator(nextResponse, 7 * 24 * 60 * 60)
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
