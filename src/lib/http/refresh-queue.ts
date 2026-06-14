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

export function enqueueRefreshSubscriber(): Promise<void> {
  return new Promise((resolve, reject) => {
    refreshSubscribers.push({
      resolve: () => resolve(),
      reject,
    });
  });
}

export function processRefreshQueue(success: boolean, error?: unknown): void {
  const queue = [...refreshSubscribers];
  refreshSubscribers = [];

  queue.forEach((subscriber) => {
    if (success) {
      subscriber.resolve();
    } else {
      subscriber.reject(error);
    }
  });
}

export function clearRefreshQueue(): void {
  refreshSubscribers.forEach(subscriber => {
    subscriber.reject(new Error('Queue cleared'))
  })
  refreshSubscribers = []
}
