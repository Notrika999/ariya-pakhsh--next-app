import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend, ProxyError } from '@/lib/http/server-http'
import { AUTH_COOKIE_NAMES, BACKEND_AUTH_PATHS } from '@/lib/auth/constants'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  // 🟢 چک کردن کوکی‌ها
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  try {
    const response = await proxyToBackend({
      method: 'GET',
      path: BACKEND_AUTH_PATHS.ME,
      withAuth: true
    })
    return NextResponse.json(response.data, {
      status: response.status
    })
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
