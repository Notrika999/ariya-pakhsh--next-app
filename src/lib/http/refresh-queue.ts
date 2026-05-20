// src/lib/http/refresh-queue.ts

type Subscriber = {
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}

let isRefreshing = false
let refreshSubscribers: Subscriber[] = []

export function getIsRefreshing(): boolean {
  return isRefreshing
}

export function setIsRefreshing(value: boolean): void {
  isRefreshing = value
}

export function enqueueRefreshSubscriber(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    refreshSubscribers.push({ resolve, reject })
  })
}

export function processRefreshQueue(success: boolean, error?: unknown): void {
  refreshSubscribers.forEach(subscriber => {
    if (success) {
      subscriber.resolve()
    } else {
      subscriber.reject(error)
    }
  })
  refreshSubscribers = []
}

export function clearRefreshQueue(): void {
  refreshSubscribers.forEach(subscriber => {
    subscriber.reject(new Error('Queue cleared'))
  })
  refreshSubscribers = []
}
