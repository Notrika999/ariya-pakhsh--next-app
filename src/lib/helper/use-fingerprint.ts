// hooks/use-fingerprint.ts
import { useState, useEffect } from 'react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

const STORAGE_KEY = 'device_fingerprint'

interface CachedFingerprint {
  visitorId: string
  confidence: number
  components: Record<string, unknown>
  createdAt: number
}

// Cache در Memory
let fpPromise: ReturnType<typeof FingerprintJS.load> | null = null

function componentValue(component: unknown): unknown {
  if (
    component &&
    typeof component === 'object' &&
    'value' in component
  ) {
    return component.value
  }

  return undefined
}

function getFingerprintFromStorage(): CachedFingerprint | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored)
  } catch (error) {
    // console.error('Error reading fingerprint:', error)
    return null
  }
}

function saveFingerprintToStorage(data: CachedFingerprint): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    // console.error('Error saving fingerprint:', error)
  }
}

async function generateFingerprint(): Promise<CachedFingerprint> {
  if (!fpPromise) {
    fpPromise = FingerprintJS.load()
  }

  const fp = await fpPromise
  const result = await fp.get()
  const components = result.components as Record<string, unknown>

  const fingerprintData: CachedFingerprint = {
    visitorId: result.visitorId,
    confidence: result.confidence.score,
    components: {
      canvas: componentValue(components.canvas),
      webgl: componentValue(components.webgl),
      audio: componentValue(components.audio)
    },
    createdAt: Date.now()
  }

  saveFingerprintToStorage(fingerprintData)
  return fingerprintData
}

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFingerprint = async () => {
      try {
        setLoading(true)

        // اول از localStorage بخون
        const cached = getFingerprintFromStorage()

        if (cached) {
          setFingerprint(cached.visitorId)
          setLoading(false)
          return
        }

        // اگه نبود، جدید بساز
        const newFingerprint = await generateFingerprint()
        setFingerprint(newFingerprint.visitorId)
        setLoading(false)
      } catch (err: unknown) {
        // console.error('Fingerprint error:', err)
        setError(err instanceof Error ? err.message : 'Fingerprint failed')
        setLoading(false)
      }
    }

    loadFingerprint()
  }, [])

  return { fingerprint, loading, error }
}
