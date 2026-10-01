// hooks/use-fingerprint.ts
import { useState, useEffect } from 'react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

const STORAGE_KEY = 'device_fingerprint'

interface CachedFingerprint {
  visitorId: string
  confidence: number
<<<<<<< HEAD
  components: Record<string, unknown>
=======
  components: any
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  createdAt: number
}

// Cache در Memory
<<<<<<< HEAD
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
=======
let fpPromise: Promise<any> | null = null
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

function getFingerprintFromStorage(): CachedFingerprint | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored)
  } catch (error) {
<<<<<<< HEAD
    // console.error('Error reading fingerprint:', error)
=======
    console.error('Error reading fingerprint:', error)
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    return null
  }
}

function saveFingerprintToStorage(data: CachedFingerprint): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
<<<<<<< HEAD
    // console.error('Error saving fingerprint:', error)
=======
    console.error('Error saving fingerprint:', error)
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  }
}

async function generateFingerprint(): Promise<CachedFingerprint> {
  if (!fpPromise) {
    fpPromise = FingerprintJS.load()
  }

  const fp = await fpPromise
  const result = await fp.get()
<<<<<<< HEAD
  const components = result.components as Record<string, unknown>
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

  const fingerprintData: CachedFingerprint = {
    visitorId: result.visitorId,
    confidence: result.confidence.score,
    components: {
<<<<<<< HEAD
      canvas: componentValue(components.canvas),
      webgl: componentValue(components.webgl),
      audio: componentValue(components.audio)
=======
      canvas: result.components.canvas?.value,
      webgl: result.components.webgl?.value,
      audio: result.components.audio?.value
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
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
<<<<<<< HEAD
      } catch (err: unknown) {
        // console.error('Fingerprint error:', err)
        setError(err instanceof Error ? err.message : 'Fingerprint failed')
=======
      } catch (err: any) {
        console.error('Fingerprint error:', err)
        setError(err.message)
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
        setLoading(false)
      }
    }

    loadFingerprint()
  }, [])

  return { fingerprint, loading, error }
}
