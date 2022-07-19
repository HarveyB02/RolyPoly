import cache from 'memory-cache'

export const getCachedValue = (key: string) => {
	let cached = cache.get(key)
	if (cached) return cached
	return false
}

export const cacheValue = (body: any, key: string, duration: number) => {
	cache.put(key, body, duration)
}