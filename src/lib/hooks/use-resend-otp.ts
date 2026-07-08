// hooks/auth/use-resend-otp.ts

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import apiClient from "@/src/lib/http/api-client";
import { CUSTOMER_AUTH_CLIENT_PATHS } from '@/src/lib/auth/constants'
import { ApiResponseWithData } from '@/src/lib/projectConstant/constants'
import { ResendOtpResponse } from '@/src/lib/types/auth'
import { AxiosError } from 'axios'

// ─── اینترفیس‌ها ───

interface UseResendOtpOptions {
  twoFactorToken: string | null
  initialCooldown?: number
  onRedirectToLogin?: (message: string, delaySeconds: number) => void
  onTokenExpired?: () => void
}

interface UseResendOtpReturn {
  countdown: number
  isResending: boolean
  canResend: boolean
  remainingAttempts: number | null
  maxAttempts: number | null
  maskedDestination: string | null
  deliveryMethod: string | null
  error: string | null
  successMessage: string | null
  resend: () => Promise<void>
  clearError: () => void
  clearSuccess: () => void
}

// ─── هوک اصلی ───

export function useResendOtp({
  twoFactorToken,
  initialCooldown = 120,
  onRedirectToLogin,
  onTokenExpired
}: UseResendOtpOptions): UseResendOtpReturn {
  // ─── State ───
  const [countdown, setCountdown] = useState<number>(initialCooldown)
  const [isResending, setIsResending] = useState(false)
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)
  const [maxAttempts, setMaxAttempts] = useState<number | null>(null)
  const [maskedDestination, setMaskedDestination] = useState<string | null>(null)
  const [deliveryMethod, setDeliveryMethod] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // ─── Refs ───
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mountedRef = useRef(true)

  // ─── Cleanup ───
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  // ─── تابع شروع تایمر ───
  const startTimer = useCallback((seconds: number) => {
    // پاک کردن تایمر قبلی
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (seconds <= 0) {
      setCountdown(0)
      return
    }

    setCountdown(seconds)

    timerRef.current = setInterval(() => {
      if (!mountedRef.current) {
        if (timerRef.current) clearInterval(timerRef.current)
        return
      }

      setCountdown(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  // ─── شروع تایمر اولیه ───
  useEffect(() => {
    startTimer(initialCooldown)
  }, [initialCooldown, startTimer])

  // ─── canResend ───
  const canResend = countdown === 0 && !isResending

  // ─── تابع ارسال مجدد ───
  const resend = useCallback(async () => {
    // ─── Guard: بدون توکن ───
    if (!twoFactorToken) {
      onTokenExpired?.()
      return
    }

    // ─── Guard: هنوز cooldown داره ───
    if (!canResend) return

    setIsResending(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const { data: response } = await apiClient.post<ApiResponseWithData<ResendOtpResponse>>(
        CUSTOMER_AUTH_CLIENT_PATHS.OTP_RESEND,
        { twoFactorToken }
      )

      if (!mountedRef.current) return

      const resendData = response.data

      if (!resendData) {
        setError('پاسخ نامعتبر از سرور')
        startTimer(15)
        return
      }

      // ─── ریدایرکت به لاگین ───
      if (resendData.shouldRedirectToLogin) {
        onRedirectToLogin?.(resendData.message, resendData.redirectAfterSeconds ?? 3)
        return
      }

      // ─── موفقیت ───
      if (resendData.success) {
        setSuccessMessage(resendData.message)
        setRemainingAttempts(resendData.remainingAttempts)
        setMaxAttempts(resendData.maxAttempts)
        setMaskedDestination(resendData.maskedDestination)
        setDeliveryMethod(resendData.deliveryMethod)
        startTimer(resendData.cooldownSeconds || initialCooldown)
        return
      }

      // ─── مدیریت خطاهای مختلف ───
      switch (resendData.errorCode) {
        case 'COOLDOWN_ACTIVE':
          startTimer(resendData.cooldownSeconds)
          setRemainingAttempts(resendData.remainingAttempts)
          setMaxAttempts(resendData.maxAttempts)
          setError(resendData.message)
          break

        case 'MAX_ATTEMPTS_REACHED':
          setRemainingAttempts(0)
          setMaxAttempts(resendData.maxAttempts)
          setError(resendData.message)
          onRedirectToLogin?.(resendData.message, resendData.redirectAfterSeconds ?? 5)
          break

        case 'TOKEN_INVALID':
          onTokenExpired?.()
          break

        case 'RATE_LIMITED':
          startTimer(resendData.cooldownSeconds)
          setError(resendData.message)
          break

        case 'SEND_FAILED':
          startTimer(resendData.cooldownSeconds || 30)
          setRemainingAttempts(resendData.remainingAttempts)
          setMaxAttempts(resendData.maxAttempts)
          setError(resendData.message)
          break

        default:
          setError(resendData.message || 'خطا در ارسال مجدد کد')
          startTimer(30)
      }
    } catch (err) {
      if (!mountedRef.current) return

      if (err instanceof AxiosError) {
        const status = err.response?.status
        const data = err.response?.data

        // ─── توکن نامعتبر ───
        if (status === 401) {
          const resendData = data?.data as ResendOtpResponse | undefined

          if (resendData?.shouldRedirectToLogin) {
            onRedirectToLogin?.(resendData.message || 'نشست شما منقضی شده است.', resendData.redirectAfterSeconds ?? 3)
          } else {
            onTokenExpired?.()
          }
          return
        }

        // ─── Rate limit ───
        if (status === 429) {
          const retryAfter = parseInt(err.response?.headers?.['retry-after'] || '60', 10)
          startTimer(retryAfter)
          setError('تعداد درخواست‌ها بیش از حد مجاز است. لطفاً صبر کنید.')
          return
        }

        // ─── 502: خطای ارسال SMS/Email ───
        if (status === 502) {
          const resendData = data?.data as ResendOtpResponse | undefined
          startTimer(resendData?.cooldownSeconds || 30)
          setRemainingAttempts(resendData?.remainingAttempts ?? null)
          setError(resendData?.message || 'خطا در ارسال کد تأیید')
          return
        }

        setError(data?.message || data?.error || 'خطا در ارسال مجدد کد تأیید')
      } else {
        setError('خطای غیرمنتظره‌ای رخ داد')
      }

      startTimer(15)
    } finally {
      if (mountedRef.current) {
        setIsResending(false)
      }
    }
  }, [twoFactorToken, canResend, startTimer, initialCooldown, onRedirectToLogin, onTokenExpired])

  // ─── Clear helpers ───
  const clearError = useCallback(() => setError(null), [])
  const clearSuccess = useCallback(() => setSuccessMessage(null), [])

  return {
    countdown,
    isResending,
    canResend,
    remainingAttempts,
    maxAttempts,
    maskedDestination,
    deliveryMethod,
    error,
    successMessage,
    resend,
    clearError,
    clearSuccess
  }
}
