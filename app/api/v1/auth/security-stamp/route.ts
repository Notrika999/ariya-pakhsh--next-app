import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend, ProxyError } from '@/lib/http/server-http'
import { BACKEND_AUTH_PATHS } from '@/lib/auth/constants'

export async function GET(request: NextRequest) {
  try {
    const response = await proxyToBackend<{ stamp: string }>({
      method: 'GET',
      path: BACKEND_AUTH_PATHS.SECURITY_STAMP,
      withAuth: true,
      timeout: 5_000 // سبک‌ترین endpoint — timeout کوتاه
    })

    return NextResponse.json(response.data, {
      status: response.status
    })
  } catch (error) {
    if (error instanceof ProxyError) {
      console.error(`[Security Stamp] ${error.code}: ${error.message}`)
      return NextResponse.json({ error: 'سرویس در دسترس نیست.' }, { status: 502 })
    }

    console.error('[Security Stamp] Unexpected:', error)
    return NextResponse.json({ error: 'خطای داخلی سرور' }, { status: 500 })
  }
}
