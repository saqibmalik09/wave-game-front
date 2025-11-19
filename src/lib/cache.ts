const cacheStore = new Map<string, any>();

// Get from RAM first, fallback to localStorage
export function getCache<T = any>(key: string): T | null {
  if (cacheStore.has(key)) return cacheStore.get(key);

  try {
    const ls = localStorage.getItem(key);
    if (ls) {
      const parsed = JSON.parse(ls) as T;
      cacheStore.set(key, parsed); // populate RAM for future
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse localStorage cache', e);
    localStorage.removeItem(key);
  }

  return null;
}

// Set both RAM and localStorage
export function setCache<T = any>(key: string, value: T): void {
  cacheStore.set(key, value);
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }
}

// Check only RAM
export function hasCache(key: string): boolean {
  return cacheStore.has(key);
}
