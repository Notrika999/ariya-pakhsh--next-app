// app/api/v1/auth/resend-otp/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend, ProxyError } from '@/lib/http/server-http'
import { ApiResponseWithData } from '@/lib/projectConstant/constants'
import { ResendOtpResponse } from '@/types/auth'
import { AUTH_COOKIE_NAMES, BACKEND_AUTH_PATHS } from '@/lib/auth/constants'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // ─── اعتبارسنجی اولیه ───
    if (!body.twoFactorToken || typeof body.twoFactorToken !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'توکن احراز هویت دومرحله‌ای الزامی است.',
          errorCode: 'MISSING_TOKEN'
        },
        { status: 400 }
      )
    }

    // ─── خواندن DeviceId از کوکی ───
    const cookieStore = await cookies()
    const deviceId = cookieStore.get(AUTH_COOKIE_NAMES.DEVICE_ID)?.value

    const extraHeaders: Record<string, string> = {}

    if (deviceId) {
      extraHeaders['Cookie'] = `${AUTH_COOKIE_NAMES.DEVICE_ID}=${deviceId}`
    }

    // ─── ارسال به بکند ───
    const response = await proxyToBackend<ApiResponseWithData<ResendOtpResponse>>({
      method: 'POST',
      path: BACKEND_AUTH_PATHS.RESEND_OTP,
      body,
      headers: extraHeaders,
      withAuth: false,
      retries: 0
    })

    if (response.status === 401) {
      return NextResponse.json(
        response.data ?? {
          success: false,
          data: {
            success: false,
            message: 'نشست شما منقضی شده است.',
            shouldRedirectToLogin: true,
            redirectAfterSeconds: 3,
            errorCode: 'TOKEN_INVALID',
            cooldownSeconds: 0,
            isResendAllowed: false,
            remainingAttempts: 0,
            maxAttempts: 0
          }
        },
        { status: 401 }
      )
    }

    // ─── خطای HTTP ───
    if (!response.ok) {
      return NextResponse.json(response.data, {
        status: response.status
      })
    }

    const responseData = response.data

    // ─── بررسی shouldRedirectToLogin ───
    if (responseData?.data?.shouldRedirectToLogin) {
      return NextResponse.json(
        {
          success: false,
          data: responseData.data,
          message: responseData.data.message
        },
        { status: 401 }
      )
    }

    // ─── پاسخ عادی ───
    return NextResponse.json(responseData, {
      status: response.status
    })
  } catch (error) {
    if (error instanceof ProxyError) {
      const status = error.code === 'TIMEOUT' ? 504 : 502
      const message = error.code === 'TIMEOUT' ? 'زمان درخواست به پایان رسید.' : 'سرویس در دسترس نیست.'

      return NextResponse.json(
        {
          success: false,
          message,
          errorCode: error.code
        },
        { status }
      )
    }

    console.error('[ResendOtp Route Error]', error)

    return NextResponse.json(
      {
        success: false,
        message: 'خطای داخلی سرور',
        errorCode: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }
}
