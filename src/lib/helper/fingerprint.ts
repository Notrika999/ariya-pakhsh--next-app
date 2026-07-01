// lib/helper/fingerprint.ts
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { json } from 'stream/consumers'

// Cache در Memory
let fpPromise: Promise<any> | null = null

// کلید LocalStorage
const STORAGE_KEY = 'device_fingerprint'

interface CachedFingerprint {
  visitorId: string
  confidence: number
  components: any
  createdAt: number // فقط برای اطلاعات - نه برای انقضا
}

/**
 * خواندن fingerprint از LocalStorage
 */
function getFingerprintFromStorage(): CachedFingerprint | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) return null

    return JSON.parse(stored)
  } catch (error) {
    console.error('Error reading fingerprint from storage:', error)
    clearFingerprintFromStorage()
    return null
  }
}

/**
 * ذخیره fingerprint در LocalStorage
 */
function saveFingerprintToStorage(data: CachedFingerprint): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving fingerprint to storage:', error)
  }
}

/**
 * پاک کردن fingerprint از LocalStorage
 */
function clearFingerprintFromStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * تولید fingerprint جدید
 */
async function generateNewFingerprint(): Promise<CachedFingerprint> {
  if (!fpPromise) {
    fpPromise = FingerprintJS.load()
  }

  const fp = await fpPromise
  const result = await fp.get()

  const fingerprintData: CachedFingerprint = {
    visitorId: result.visitorId,
    confidence: result.confidence.score,
    components: {
      canvas: result.components.canvas?.value,
      webgl: result.components.webgl?.value,
      audio: result.components.audio?.value,
      fonts: result.components.fonts?.value,
      platform: result.components.platform?.value,
      screen: result.components.screenResolution?.value
    },
    createdAt: Date.now()
  }

  // ذخیره در LocalStorage - مادام‌العمر
  saveFingerprintToStorage(fingerprintData)

  return fingerprintData
}

/**
 * گرفتن Browser Fingerprint (با Cache + LocalStorage)
 */
export async function getBrowserFingerprint() {
  try {
    // اول چک کن توی LocalStorage هست؟
    const cachedFingerprint = getFingerprintFromStorage()

    if (cachedFingerprint) {
      // console.log('✅ Fingerprint loaded from LocalStorage (permanent)')/
      return cachedFingerprint
    }

    // اگه نبود، تولید کن
    // console.log('🔄 Generating new fingerprint...')
    const newFingerprint = await generateNewFingerprint()
    // console.log('✅ New fingerprint generated and saved permanently')

    return newFingerprint
  } catch (error) {
    console.error('Error generating fingerprint:', error)
    return null
  }
}

/**
 * Force Refresh - فقط برای موارد خاص (مثلاً تعویض سخت‌افزار)
 */
export async function refreshFingerprint(): Promise<CachedFingerprint | null> {
  try {
    // console.log('🔄 Force refreshing fingerprint...')
    clearFingerprintFromStorage()
    fpPromise = null

    return await generateNewFingerprint()
  } catch (error) {
    console.error('Error refreshing fingerprint:', error)
    return null
  }
}

/**
 * گرفتن اطلاعات اضافی دستگاه
 */
export function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset()
  }
}

/**
 * ترکیب Fingerprint + Device Info
 */
export async function generateDeviceFingerprint() {
  const fingerprint = await getBrowserFingerprint()
  const deviceInfo = getDeviceInfo()

  return {
    fingerprint,
    deviceInfo,
    timestamp: new Date().toISOString()
  }
}

/**
 * چک کردن اینکه fingerprint ذخیره شده داریم
 */
export function hasSavedFingerprint(): boolean {
  return getFingerprintFromStorage() !== null
}

/**
 * گرفتن تاریخ ایجاد fingerprint
 */
export function getFingerprintCreationDate(): Date | null {
  const stored = getFingerprintFromStorage()

  if (!stored || !stored.createdAt) return null

  return new Date(stored.createdAt)
}

/**
 * پاک کردن fingerprint - فقط برای logout کامل
 */
export function clearFingerprint(): void {
  clearFingerprintFromStorage()
  fpPromise = null
}
