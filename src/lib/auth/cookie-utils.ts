// src/lib/auth/cookie-utils.ts

import { NextResponse } from 'next/server'
import { AUTH_COOKIE_NAMES, AUTH_INDICATOR_BUFFER, AUTH_INDICATOR_DEFAULT_MAX_AGE } from './constants'

/**
 * auth_indicator ست میکنه
 *
 * @param response - NextResponse
 * @param expiresIn - عمر session از بک‌اند (ثانیه)
 *                    + 1 روز buffer اضافه میشه
 *
 * Remember Me OFF: expiresIn = 604800 (7d)  → indicator = 8d
 * Remember Me ON:  expiresIn = 2592000 (30d) → indicator = 31d
 */
export function setAuthIndicator(response: NextResponse, expiresIn?: number): void {
  const maxAge = expiresIn ? expiresIn + AUTH_INDICATOR_BUFFER : AUTH_INDICATOR_DEFAULT_MAX_AGE

  response.cookies.set(AUTH_COOKIE_NAMES.AUTH_INDICATOR, '1', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge
  })
}

export function clearAuthIndicator(response: NextResponse): void {
  response.cookies.delete(AUTH_COOKIE_NAMES.AUTH_INDICATOR)
}
