import { LRUCache } from 'lru-cache'

type MemoryCache = LRUCache<string, any>

class Cache {
  private static instance: MemoryCache

  static getInstance(): MemoryCache {
    if (!Cache.instance) {
      Cache.instance = new LRUCache<string, any>({
        max: 100,
        ttl: 1000 * 60 * 5,
      })
    }
    return Cache.instance
  }
}

export async function getCache(key: string) {
  const cache = Cache.getInstance()
  return cache.get(key)
}

export async function setCache(key: string, value: any) {
  const cache = Cache.getInstance()
  return cache.set(key, value)
}